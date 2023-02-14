import { RoomsModule } from './../rooms/rooms.module';
import { Module } from '@nestjs/common';
import { VoiceChatService } from './voice-chat.service';
import { VoiceChatGateway } from './voice-chat.gateway';

@Module({
  imports: [RoomsModule],
  providers: [VoiceChatGateway, VoiceChatService],
})
export class VoiceChatModule {}
