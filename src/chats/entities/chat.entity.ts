import { MessageEntity } from 'src/messages/entities/message.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  Entity,
  JoinTable,
} from 'typeorm';
@Entity('chats')
export class ChatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @OneToOne(() => MessageEntity, (messages) => messages.chat, { eager: true })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity, (user) => user.chats)
  @JoinTable()
  user: UserEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
