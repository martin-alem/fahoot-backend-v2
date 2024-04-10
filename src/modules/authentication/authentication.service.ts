import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SharedService } from '../shared/shared.service';
import { UserService } from '../user/user.service';
import { EmailNotificationService } from '../notification/email_notification.service';
import { SignUpDto } from './dto/sign_up.dto';
import Result from '../../utils/result';
import { UserResponseDto } from '../user/dto/user_response.dto';
import { EmailNotificationRequest } from '../../utils/interfaces';
import { capitalizeFirstLetter } from '../../utils/helper';
import { SignInDto } from './dto/sign_in.dto';
import { AuthenticationType } from '../../utils/constant';

@Injectable()
export class AuthenticationService {
  private readonly configService:  ConfigService
  private readonly sharedService: SharedService
  private readonly userService: UserService
  private readonly emailNotificationService: EmailNotificationService

  constructor(configService: ConfigService, sharedService: SharedService, userService: UserService, emailNotificationService: EmailNotificationService) {
    this.configService = configService;
    this.sharedService = sharedService;
    this.userService = userService;
    this.emailNotificationService = emailNotificationService
  }

  async signUp(signUpDto:  SignUpDto): Promise<Result<UserResponseDto | null>>{
    try {
      const user = await this.userService.createUser(signUpDto)
      if (!user.isSuccess()){
        return new Result<UserResponseDto | null>(false, null, user.getError(), user.getErrorCode())
      }

      const userData = user.getData()

      const request: EmailNotificationRequest = {
        subject: 'Welcome To Fahoot',
        templateId: this.configService.get<string>('WELCOME_EMAIL_TEMPLATE_ID'),
        recipients: [userData.email],
        templateData: [
          {
            email: userData.email,
            data: {
              name: `${capitalizeFirstLetter(userData.firstName)} ${capitalizeFirstLetter(userData.lastName)}`,
              account: {
                name: 'Fahoot',
              },
              support_email: 'alemajohmartin@gmail.com',
            },
          },
        ],
      };
      this.emailNotificationService.send(request).catch();

      return new Result<UserResponseDto | null>(true, userData, null, HttpStatus.CREATED)
    }catch (error){
      return new Result<UserResponseDto | null>(false, null, "error while trying to sign up", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async signIn(signInDto: SignInDto): Promise<Result<UserResponseDto | null>> {
    try {
      const userResult = await this.userService.getUserByEmail(signInDto.email);
      if (!userResult.isSuccess()) {
        return new Result<UserResponseDto | null>(false, null, "Invalid email or password.", HttpStatus.UNAUTHORIZED);
      }

      const userData = userResult.getData();

      if (userData.authenticationType === AuthenticationType.Email) {
        if (!signInDto.password) {
          return new Result<UserResponseDto | null>(false, null, "Password is required for email sign-in.", HttpStatus.BAD_REQUEST);
        }

        const passwordMatch = await this.sharedService.compare(signInDto.password, userData.password);
        if (!passwordMatch.getData()) {
          return new Result<UserResponseDto | null>(false, null, "Invalid email or password.", HttpStatus.UNAUTHORIZED);
        }
      }

      return new Result<UserResponseDto | null>(true, new UserResponseDto(userData), null, HttpStatus.OK);
    } catch (error) {
      return new Result<UserResponseDto | null>(false, null, "Error while trying to sign in.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
