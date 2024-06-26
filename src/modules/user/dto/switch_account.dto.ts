import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { IsValidPassword } from '../../../decorator/valid_password';

export class SwitchAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsValidPassword()
  @IsOptional()
  password?: string;
}
