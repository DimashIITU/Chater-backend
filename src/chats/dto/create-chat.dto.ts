import { UserEntity } from 'src/user/entities/user.entity';
export class CreateChatDto {
  follower: UserEntity;
  initiator: UserEntity;
}
