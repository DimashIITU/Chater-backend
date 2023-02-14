import { ChatEntity } from 'src/chats/entities/chat.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  fullName?: string;
  @Column({ nullable: true })
  avatarUrl: string;
  @Column({ unique: true })
  userName: string;
  @Column({ nullable: false, unique: true })
  access_token: string;
  @ManyToMany(() => ChatEntity, (chat) => chat.user)
  chats: ChatEntity[];
  @Column({ type: 'jsonb', nullable: true })
  subscriptions: string;
}
