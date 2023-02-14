import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guards/github-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GithubAuthGuard)
  @Get('github')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  authGoogle(@Request() req) {}

  @UseGuards(GithubAuthGuard)
  @Get('github/callback')
  authGoogleCallBack(@Request() req) {
    return this.authService.authGithubCallBack(req.user);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.create(user);
  }

  @Post('login')
  login(@Body() user: LoginDto) {
    return this.authService.findOne(user);
  }
}
