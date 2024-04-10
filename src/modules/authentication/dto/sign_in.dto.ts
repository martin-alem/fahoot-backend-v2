import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsValidPassword } from '../../../decorator/valid_password';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsValidPassword()
  @IsOptional()
  password?: string | null;
}