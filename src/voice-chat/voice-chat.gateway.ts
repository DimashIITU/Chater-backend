import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { VoiceChatService } from './voice-chat.service';
import { CreateVoiceChatDto } from './dto/create-voice-chat.dto';
import { VoiceChatDto } from './dto/voice-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VoiceChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly voiceChatService: VoiceChatService) {}

  handleConnection(client: Socket) {
    console.log('CONNECTED', client.id);
    return client.id;
  }

  handleDisconnect(client: Socket) {
    console.log('DISCONNECTED', client.id);
    return this.voiceChatService.leave(client, this.server);
  }

  @SubscribeMessage('CLIENT/joinToVoiceChat')
  create(
    @MessageBody() dto: CreateVoiceChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.voiceChatService.enter(dto, client, this.server);
  }

  @SubscribeMessage('findAllIntoVoiceChat')
  findAll() {
    return this.voiceChatService.findAll();
  }

  @SubscribeMessage('CLIENT/outgoingCallForOut')
  outgoingCall(
    @MessageBody() dto: VoiceChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.voiceChatService.outgoingCallForOut(dto, client, this.server);
  }

  @SubscribeMessage('CLIENT/outgoingCallForOne')
  outgoingCallForOne(
    @MessageBody() dto: VoiceChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    return this.voiceChatService.outgoingCallForOne(dto, client, this.server);
  }
}
