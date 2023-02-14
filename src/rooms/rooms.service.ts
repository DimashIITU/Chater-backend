import { VoiceChatEntity } from './../voice-chat/entities/voice-chat.entity';
import { UserEntity } from './../user/entities/user.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomEntity } from './entities/room.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(RoomEntity)
    private repository: Repository<RoomEntity>,
    private userService: UserService,
  ) {}
  async create(dto: CreateRoomDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  parseJSON(str: string): VoiceChatEntity[] {
    return JSON.parse(str) as unknown as VoiceChatEntity[];
  }

  stringifyJSON(arr: VoiceChatEntity[]): string {
    return JSON.stringify(arr) as unknown as string;
  }

  async updateCountOnJoin(data: VoiceChatEntity) {
    const roomInfo = await this.repository.findOneBy({ id: data.roomId });
    const speakers = this.parseJSON(roomInfo.speakers);
    speakers.push(data);
    const speakersStr = this.stringifyJSON(speakers);
    return this.repository.update(
      { id: data.roomId },
      { speakers: speakersStr },
    );
  }

  async updateCountOnLeave(data: VoiceChatEntity) {
    const roomInfo = await this.repository.findOneBy({ id: data.roomId });
    const speakers = this.parseJSON(roomInfo.speakers);
    const updatedSpeakers = speakers.filter(
      (item) => item.userName !== data.userName,
    );
    const speakerStr = this.stringifyJSON(updatedSpeakers);
    return this.repository.update(
      { id: data.roomId },
      { speakers: speakerStr },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
