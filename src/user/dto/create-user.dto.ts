import { MinLength } from 'class-validator';
export class CreateUserDto {
  @MinLength(5, { message: 'Слишком котроткий' })
  fullName?: string;

  avatarUrl?: string;

  userName: string;
  @MinLength(6, { message: 'Слишком котроткий' })
  password?: string;
}
