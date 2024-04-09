import { Body, Controller, Post, HttpCode, HttpStatus, Get, Param, Delete, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { handleResult } from '../../utils/helper';
import { UserResponseDto } from './dto/user_response.dto';
import { UpdateUserDto } from './dto/update_user.dto';
import { UpdateEmailDto } from './dto/update_email.dto';
import { PasswordResetDto } from './dto/password_reset.dto';
import { UpdatePasswordDto } from './dto/update_password.dto';
import { SwitchAccountDto } from './dto/switch_account.dto';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }
  @Patch("/info/:id")
  async updateUserInfo(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number): Promise<UserResponseDto>{
    const result = await this.userService.updateUserInfo(updateUserDto, id)
    return handleResult<UserResponseDto>(result)
  }

  @Patch("/email/:id")
  async updateUserEmail(@Body() updateEmailDto: UpdateEmailDto, @Param("id") id: number): Promise<boolean>{
    const result = await this.userService.updateEmail(updateEmailDto, id)
    return handleResult<boolean>(result)
  }

  @Patch("/switch_account_type/:id")
  async switchAccountType(@Body() switchAccountDto: SwitchAccountDto, @Param("id") id: number): Promise<boolean>{
    const result = await this.userService.switchAccountType(switchAccountDto, id)
    return handleResult<boolean>(result)
  }

  @Get("/verify_email")
  async verifyEmail(@Query("token") token: string): Promise<boolean>{
    const result = await this.userService.verifyEmail(token)
    return handleResult<boolean>(result)
  }

  @Post("/password_reset_request")
  async passwordResetRequest(@Body() passwordResetDto: PasswordResetDto): Promise<boolean>{
    const result = await this.userService.passwordResetRequest(passwordResetDto)
    return handleResult<boolean>(result)
  }

  @Post("/update_password")
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @Query("token") token: string): Promise<boolean>{
    const result = await this.userService.updatePassword(updatePasswordDto, token)
    return handleResult<boolean>(result)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) // Specifies that a successful response should have the status code 201 (Created)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const result = await this.userService.createUser(createUserDto)
    return handleResult<UserResponseDto>(result)
  }

  @Get(":id")
  async getUserById(@Param('id') id: number): Promise<UserResponseDto>{
    const result = await this.userService.getUserById(id)
    return handleResult<UserResponseDto>(result)
  }

  @Delete(":id")
  async deleteUser(@Param("id") id: number): Promise<UserResponseDto>{
    const result = await this.userService.removeUser(id)
    return handleResult<UserResponseDto>(result)
  }
}
