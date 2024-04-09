import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsValidPassword } from '../../../decorator/valid_password';

export class UpdatePasswordDto {
  @IsString()
  @IsValidPassword()
  password: string;
}
