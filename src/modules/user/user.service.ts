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


@Injectable()
export class UserService {
  private readonly usersRepository: Repository<User>

  constructor(@InjectRepository(User) usersRepository: Repository<User>) {
    this.usersRepository = usersRepository
  }

  async createUser(createUserDto: CreateUserDto): Promise<Result<UserResponseDto | null>> {

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
  }

  async getUserById(id: number): Promise<Result<UserResponseDto | null>> {
    const user = await this.usersRepository.findOneBy({ id });
    if(!user){
      return new Result<null>(false, null, "no user found", HttpStatus.BAD_REQUEST)
    }
    return new Result<UserResponseDto>(true, new UserResponseDto(user), null, HttpStatus.OK)
  }

  async updateUserInfo(updateUserDto: UpdateUserDto, id: number): Promise<Result<UserResponseDto | null>> {

    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return new Result<null>(false, null, "User not found", HttpStatus.NOT_FOUND);
    }

    Object.assign(user, updateUserDto);

    await this.usersRepository.save(user);

    return await this.getUserById(id);
  }

  async updateEmail(updateEmailDto: UpdateEmailDto, id: number): Promise<Result<boolean | null>>{
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return new Result<null>(false, null, "User not found", HttpStatus.NOT_FOUND);
    }

    Object.assign(user, {verified: false, email: updateEmailDto.email})

    await this.usersRepository.save(user)

    //TODO: send verification email

    return new Result<boolean>(true, true, null, HttpStatus.OK)
  }

  async removeUser(id: number): Promise<Result<UserResponseDto | null>>{
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      return new Result<UserResponseDto | null>(false, null, "User not found", HttpStatus.NOT_FOUND);
    }
    await this.usersRepository.delete({id})
    return new Result<UserResponseDto>(true, user, null, HttpStatus.OK)
  }
}
