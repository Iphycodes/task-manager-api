import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register' })
  @ApiBody({
    type: CreateUserDto,
    schema: {
      example: {
        email: 'user@example.com', // Default email value
        password: 'StrongPassword123@', // Default password value
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: '123',
        email: 'user@example.com',
        token: 'jwt_token_here',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation Failed',
    schema: {
      example: {
        statusCode: 400,
        message: ['Validation failed', 'Email already exists'],
      },
    },
  })
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<any> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: LoginUserDto,
    schema: {
      example: {
        email: 'user@example.com', // Default email value
        password: 'StrongPassword123@', // Default password value
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'jwt_token_here',
        user: {
          id: '123',
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
      },
    },
  })
  async login(
    @Body(new ValidationPipe()) loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string }> {
    return this.authService.login(loginUserDto);
  }
}
