import { UserEntity } from './../../user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ default: 0 })
  listenersCount: number;

  @Column({ type: 'jsonb', nullable: true })
  speakers: string;

  @Column()
  type: string;
}

// {
//     name: 'speakers__rooms',
//     joinColumn: {
//       name: 'rooms',
//       referencedColumnName: 'id',
//     },
//     inverseJoinColumn: {
//       name: 'users',
//       referencedColumnName: 'userName',
//     },
//     synchronize: false,
//   }
