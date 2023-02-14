export class VoiceChatDto {
  roomId: number;
  targetUserName: string;
  userName: string;
  data: {
    data: any;
    roomId: number;
    userName: string;
  };
}
