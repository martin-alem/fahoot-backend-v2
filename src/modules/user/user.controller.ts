import { Body, Controller, Post, HttpCode, HttpStatus, Get, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create_user.dto';
import { handleResult } from '../../utils/helper';
import { UserResponseDto } from './dto/user_response.dto';

@Controller('user')
export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
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
