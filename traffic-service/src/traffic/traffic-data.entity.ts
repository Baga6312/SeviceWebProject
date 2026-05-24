import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class TrafficData {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  zoneId: number;

  @Field(() => Float)
  @Column('float')
  density: number;

  @Field()
  @Column({ default: 'LOW' })
  level: string;

  @Field()
  @CreateDateColumn()
  timestamp: Date;
}
