import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Zone {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Float)
  @Column('float')
  lat: number;

  @Field(() => Float)
  @Column('float')
  lng: number;

  @Field(() => Float)
  @Column('float')
  radius: number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
