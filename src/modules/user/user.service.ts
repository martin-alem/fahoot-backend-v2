import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create_user.dto';
import Result from '../../utils/result';
import { AuthenticationType } from '../../utils/constant';
import { UserResponseDto } from './dto/user_response.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateEmailDto } from './dto/update_email.dto';
import { SharedService } from '../shared/shared.service';
import { PasswordResetDto } from './dto/password_reset.dto';
import { UpdatePasswordDto } from './dto/update_password.dto';
import { JWTUser } from '../../utils/interfaces';
import { SwitchAccountDto } from './dto/switch_account.dto';


@Injectable()
export class UserService {
  private readonly usersRepository: Repository<User>
  private readonly sharedService: SharedService

  constructor(@InjectRepository(User) usersRepository: Repository<User>, sharedService: SharedService) {
    this.usersRepository = usersRepository
    this.sharedService = sharedService
  }

  async createUser(createUserDto: CreateUserDto): Promise<Result<UserResponseDto | null>> {

    try{
      const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
      if (existingUser) {
        return new Result<null>(false, null, "user already exist", HttpStatus.BAD_REQUEST)
      }

      if (createUserDto.authenticationType === AuthenticationType.Email && !createUserDto.password){
        return new Result<null>(false, null, "you must provide a password", HttpStatus.BAD_REQUEST)
      }

      const newUser = this.usersRepository.create(createUserDto);

      if (createUserDto.authenticationType === AuthenticationType.Email && newUser.password) {
        newUser.password = await bcrypt.hash(newUser.password, 10); // Salt rounds = 10
      }else{
        newUser.password = null
      }

      await this.usersRepository.save(newUser);

      return new Result<UserResponseDto>(true, new UserResponseDto(newUser), null, HttpStatus.CREATED);
    }catch (error){
      return new Result<UserResponseDto | null>(false, null, "error while creating user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getUserById(id: number): Promise<Result<UserResponseDto | null>> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if(!user){
        return new Result<null>(false, null, "no user found", HttpStatus.BAD_REQUEST)
      }
      return new Result<UserResponseDto>(true, new UserResponseDto(user), null, HttpStatus.OK)
    }catch (error){
      return new Result<UserResponseDto | null>(false, null, "error while getting user by id", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateUserInfo(updateUserDto: UpdateUserDto, id: number): Promise<Result<UserResponseDto | null>> {

    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return new Result<null>(false, null, "User not found", HttpStatus.NOT_FOUND);
      }

      Object.assign(user, updateUserDto);

      await this.usersRepository.save(user);

      return await this.getUserById(id);
    }catch (error){
      return new Result<UserResponseDto | null>(false, null, "error while trying to update user basic info", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateEmail(updateEmailDto: UpdateEmailDto, id: number): Promise<Result<boolean | null>>{

    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return new Result<null>(false, null, "User not found", HttpStatus.NOT_FOUND);
      }

      Object.assign(user, {verified: false, email: updateEmailDto.email})

      await this.usersRepository.save(user)

      const token = await this.sharedService.generateToken<JWTUser>({id: user.id, email: user.email, verified: user.verified})
      //TODO: send verification email

      return new Result<boolean>(true, true, null, HttpStatus.OK)
    }catch (error){
      return new Result<boolean | null>(false, null, "error while trying to update user email", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async verifyEmail(token: string): Promise<Result<boolean | null>>{
    try{
      const result = await this.sharedService.validateToken<JWTUser>(token)
      if (!result.isSuccess()){
        return new Result<boolean | null>(false, null, result.getError(), result.getErrorCode())
      }

      return new Result<boolean | null>(true, true, null, HttpStatus.OK)
    }catch (error){
      return new Result<boolean | null>(false, null, "unable to verify email", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async passwordResetRequest(passwordResetDto: PasswordResetDto): Promise<Result<boolean | null>>{
    try {
      const user = await this.usersRepository.findOneBy({email: passwordResetDto.email})

      if (!user){
        return new Result<boolean | null>(false, null, "unable to find user with provided email", HttpStatus.BAD_REQUEST)
      }

      if (user.authenticationType !== AuthenticationType.Email){
        return new Result<boolean | null>(false, null, "you have a google account type with no password", HttpStatus.BAD_REQUEST)
      }

      const token = await this.sharedService.generateToken<JWTUser>({id: user.id, email: user.email, verified: user.verified})
      //TODO: send email


      return new Result<boolean | null>(true, true, null, HttpStatus.OK)

    }catch (error){
      return new Result<boolean | null>(false, null, "error while requesting password reset", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto, token: string): Promise<Result<boolean | null>>{
    try {
      const result = await this.sharedService.validateToken<JWTUser>(token)
      if (!result.isSuccess()){
        return new Result<boolean | null>(false, null, result.getError(), result.getErrorCode())
      }

      const hashedPassword = await this.sharedService.hash(updatePasswordDto.password)

      const user = await this.usersRepository.findOneBy({email: result.getData().email})

      if (!user){
        return new Result<boolean | null>(false, null, "unable to find user with provided email", HttpStatus.BAD_REQUEST)
      }

      Object.assign(user, {password: hashedPassword})

      await this.usersRepository.save(user)

      return new Result<boolean | null>(true, true, null, HttpStatus.OK)

    }catch (error){
      return new Result<boolean | null>(false, null, "error while trying to update password", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async switchAccountType(switchAccountDto: SwitchAccountDto, id: number): Promise<Result<boolean | null>>{
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return new Result<null>(false, null, "User not found", HttpStatus.NOT_FOUND);
      }

      const newAccountType: AuthenticationType = user.authenticationType === AuthenticationType.Email ? AuthenticationType.Social : AuthenticationType.Email

      if(newAccountType === AuthenticationType.Social){
        await this.usersRepository.update(id, {authenticationType: newAccountType, password: null, email: switchAccountDto.email.toLowerCase(), verified: true})
      }

      if(newAccountType === AuthenticationType.Email){
        if (!switchAccountDto.password){
          return new Result<boolean | null>(false, null, "a password is required for this account type", HttpStatus.BAD_REQUEST)
        }
        const hashedPassword = await this.sharedService.hash(switchAccountDto.password)
        await this.usersRepository.update(id, {authenticationType: newAccountType, password: hashedPassword.getData(), email: switchAccountDto.email.toLowerCase(), verified: false})
        //TODO: send verification email
      }

      return new Result<boolean | null>(true, true, null, HttpStatus.OK)
    }catch (error){
      return new Result<boolean | null>(false, null, "error while trying to switch account type", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeUser(id: number): Promise<Result<UserResponseDto | null>>{
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        return new Result<UserResponseDto | null>(false, null, "User not found", HttpStatus.NOT_FOUND);
      }
      await this.usersRepository.delete({id})
      return new Result<UserResponseDto>(true, user, null, HttpStatus.OK)
    }catch (error){
      return new Result<UserResponseDto | null>(false, null, "error while trying to remove user", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
