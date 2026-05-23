import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  userId: number;

  @Field()
  @Column()
  message: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column({ default: false })
  isRead: boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;
}