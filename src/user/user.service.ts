import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { v2 as cloudinary } from 'cloudinary';
import { AuthService } from 'src/auth/auth.service';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto, token: string) {
    const user = {
      ...createUserDto,
      access_token: token,
    };
    return this.usersRepository.save(user);
  }

  async findAll(userName: string) {
    const qb = this.usersRepository.createQueryBuilder('p');
    qb.limit(5);
    qb.where(`p.userName ILIKE :userName`);
    qb.setParameters({
      userName: `%${userName}%`,
    });
    const users = await qb.getMany();
    return users;
  }

  async uploadImage(base64: any) {
    cloudinary.config({
      cloud_name: 'dscwrhsg8',
      api_key: '726871671292633',
      api_secret: 'nO2HZeEDUOcjiwML1-gP27npoKs',
    });
    let url;
    await cloudinary.uploader.upload(
      base64.img,
      { upload_preset: 'my_preset' },
      (error, result) => {
        console.log(error);
        url = result.url;
      },
    );
    return url;
  }

  findOneByCond(userName: string) {
    return this.usersRepository.findOneBy({ userName });
  }

  findOne(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateImg(name, file): Promise<typeof file> {
    const res = await this.usersRepository.update(
      { userName: name },
      { avatarUrl: file },
    );
    return { ...res, file };
  }

  async update(userName: string, user: UpdateUserDto) {
    const access_token = this.authService.generateJwtTokenP(
      user.userName,
      user.password,
    );
    delete user.password;
    const res = await this.usersRepository
      .createQueryBuilder()
      .update('users')
      .set({ ...user, access_token })
      .execute();
    if (res.affected === 0) {
      throw new ForbiddenException('Failed to update user');
    }
    return { access_token, res };
  }

  async follow(userName: string, user: UserEntity) {
    const data = await this.usersRepository.findOneBy({ userName });
    const arr = JSON.parse(data.subscriptions);
    if (!arr) {
      return this.usersRepository.update(
        { userName },
        {
          subscriptions: JSON.stringify([user]),
        },
      );
    } else {
      return this.usersRepository.update(
        { userName },
        {
          subscriptions: JSON.stringify(arr.push(user)),
        },
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
