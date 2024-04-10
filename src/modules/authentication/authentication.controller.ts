import { Body, Controller, Post, Res } from '@nestjs/common';
import { SharedService } from '../shared/shared.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthenticationService } from './authentication.service';
import { Throttle } from '@nestjs/throttler';
import { SignUpDto } from './dto/sign_up.dto';
import { UserResponseDto } from '../user/dto/user_response.dto';
import { handleResult, setCookie } from '../../utils/helper';
import { ACCESS_TOKEN_NAME, DEFAULT_SIGN_TOKEN_TTL } from '../../utils/constant';
import { SignInDto } from './dto/sign_in.dto';

@Controller('authentication')
export class AuthenticationController {

  private readonly sharedService: SharedService;
  private readonly configService: ConfigService;
  private readonly authenticationService: AuthenticationService;

  constructor(sharedService: SharedService, configService: ConfigService, authenticationService: AuthenticationService) {
    this.sharedService = sharedService;
    this.configService = configService;
    this.authenticationService = authenticationService;
  }

  @Throttle({ default: { limit: 10, ttl: 300000 } })
  @Post('/sign_up')
  async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) response: Response): Promise<UserResponseDto> {
    const result = await this.authenticationService.signUp(signUpDto);
    if (!result.isSuccess()) {
      return handleResult(result);
    }

    const accessToken = await this.sharedService.signToken({
      id: result.getData().id,
      email: result.getData().email,
      verified: result.getData().verified,
    });
    setCookie(response, ACCESS_TOKEN_NAME, accessToken.getData(), DEFAULT_SIGN_TOKEN_TTL);

    return handleResult(result);
  }


  @Throttle({ default: { limit: 5, ttl: 100000 } })
  @Post('/sign_in')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response): Promise<UserResponseDto> {
    const result = await this.authenticationService.signIn(signInDto);

    if (!result.isSuccess()) {
      return handleResult(result);
    }

    const accessToken = await this.sharedService.signToken({
      id: result.getData().id,
      email: result.getData().email,
      verified: result.getData().verified,
    });
    setCookie(response, ACCESS_TOKEN_NAME, accessToken.getData(), DEFAULT_SIGN_TOKEN_TTL);

    return handleResult(result);
  }

}
