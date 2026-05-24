import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { GpsPosition } from './gps-position.entity';

@ObjectType()
@Entity()
export class Vehicle {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  plate: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  ownerId: number;

  @Field()
  @Column({ default: 'ACTIVE' })
  status: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GpsPosition, (pos) => pos.vehicle)
  positions: GpsPosition[];
}
