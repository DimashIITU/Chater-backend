import { LoginDto } from './dto/login.dto';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  generateJwtToken(data: CreateUserDto) {
    const payload = { email: data.userName, sub: data.userName };
    return this.JwtService.sign(payload);
  }

  generateJwtTokenP(userName: string, password: string) {
    const payload = { email: userName, sub: password };
    return this.JwtService.sign(payload);
  }

  authGithubCallBack(req) {
    return `<script>window.opener.postMessage('${JSON.stringify(
      req,
    )}','*'); window.close()</script>`;
  }

  async create(createUserDto: CreateUserDto) {
    const res = await this.userService.findOneByCond(createUserDto.userName);
    if (res) {
      throw new ForbiddenException('Такой пользователь существует');
    } else {
      const access_token = this.generateJwtTokenP(
        createUserDto.userName,
        createUserDto.password,
      );
      const data = await this.userService.create(createUserDto, access_token);

      return {
        ...data,
        access_token,
      };
    }
  }
  async createOAuth(createUserDto: CreateUserDto) {
    const res = await this.userService.findOneByCond(createUserDto.userName);
    if (res) {
      return res;
    } else {
      const access_token = this.generateJwtToken(createUserDto);
      const data = await this.userService.create(createUserDto, access_token);

      return {
        ...data,
        access_token,
      };
    }
  }

  async findOne(obj: LoginDto) {
    const user = await this.userService.findOneByCond(obj.userName);
    const dataToken: { email: string; sub: string } = jwtDecode(
      user.access_token,
    );
    if (dataToken.sub === obj.password && dataToken.email === obj.userName) {
      return user;
    } else {
      throw new NotFoundException('Такого пользователья не существует');
    }
  }
}
