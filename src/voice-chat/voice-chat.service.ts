import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CreateVoiceChatDto } from './dto/create-voice-chat.dto';
import { RoomsService } from 'src/rooms/rooms.service';
import { VoiceChatDto } from './dto/voice-chat.dto';

@Injectable()
export class VoiceChatService {
  constructor(private roomsService: RoomsService) {}
  rooms: Record<string, CreateVoiceChatDto> = {};
  async enter(userData: CreateVoiceChatDto, client: Socket, server: Server) {
    await client.join(`room/${userData.roomId}`);
    await client.join(userData.userName);

    this.rooms[client.id] = userData;
    server.in(`room/${userData.roomId}`).emit(
      'SERVER/joinToVoiceChat',
      Object.values(this.rooms).filter(
        (value) => value.roomId === userData.roomId,
      ),
    );
    this.roomsService.updateCountOnJoin(userData);
    server.emit(
      'SERVER/roomChanged',
      Object.values(this.rooms).filter(
        (item) => item.roomId === userData.roomId,
      ),
    );
    return userData;
  }

  findAll() {
    return 'OK';
  }

  leave(client: Socket, server: Server) {
    const userData = Object.assign({}, this.rooms[client.id]);
    delete this.rooms[client.id];
    client.broadcast.emit('SERVER/leaveFromVoiceChat', userData);
    this.roomsService.updateCountOnLeave(userData);
    server.emit(
      'SERVER/roomChanged',
      Object.values(this.rooms).filter(
        (item) => item.roomId === userData.roomId,
      ),
      userData.roomId,
    );
    client.broadcast
      .to(`rooms/${userData.roomId}`)
      .emit('SERVER/DisconnectCall');
    return userData;
  }
  outgoingCallForOut(
    { targetUserName, userName, data, roomId }: VoiceChatDto,
    client: Socket,
    server: Server,
  ) {
    client.broadcast.to(`room/${roomId}`).emit('SERVER/incomingCallForOut', {
      targetUserName,
      userName,
      data,
    });
  }
  outgoingCallForOne(data: VoiceChatDto, client: Socket, server: Server) {
    server.to(data.targetUserName).emit('SERVER/incomingCallForOne', data);
  }
}
