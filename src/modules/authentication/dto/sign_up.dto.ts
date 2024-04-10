import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AuthenticationType } from '../../../utils/constant';
import { IsValidPassword } from '../../../decorator/valid_password';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsValidPassword()
  @IsOptional()
  password?: string | null;

  @IsEnum(AuthenticationType)
  authenticationType: AuthenticationType;
}
