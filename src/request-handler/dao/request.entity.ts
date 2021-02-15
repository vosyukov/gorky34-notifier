import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { RequestStatus } from '../request-status.enum';

@Entity('request')
export class RequestEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ nullable: false })
  apartmentNumber: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  userId: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @Column({ nullable: true })
  topicId: number;

  @Column({
    enum: RequestStatus,
    default: RequestStatus.PENDING,
    nullable: false,
  })
  status: RequestStatus;
}
