import { MessageEntity } from 'src/messages/entities/message.entity';
import { ChatEntity } from 'src/chats/entities/chat.entity';
import { RoomEntity } from './rooms/entities/room.entity';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { VoiceChatModule } from './voice-chat/voice-chat.module';
import { ChatsModule } from './chats/chats.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '12021978',
      database: 'clubhouse',
      entities: [UserEntity, RoomEntity, ChatEntity, MessageEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    RoomsModule,
    VoiceChatModule,
    ChatsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
