import { UserEntity } from 'src/user/entities/user.entity';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('upload')
  async uploadImage(@Body() base64, @User() userName: string) {
    const imagePath = await this.userService.uploadImage(base64);
    return this.userService.updateImg(userName, imagePath);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('follow')
  async follow(@Body() user: UserEntity, @User() userName: string) {
    return this.userService.follow(userName, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@User() name: string) {
    return this.userService.findOneByCond(name);
  }

  @Get()
  findAll(@Query() search: { userName: string }) {
    return this.userService.findAll(search.userName);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@User() userName: string, @Body() user: UpdateUserDto) {
    return this.userService.update(userName, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
