import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@ObjectType()
@Entity()
export class GpsPosition {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  vehicleId: number;

  @Field(() => Float)
  @Column('float')
  lat: number;

  @Field(() => Float)
  @Column('float')
  lng: number;

  @Field()
  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.positions)
  vehicle: Vehicle;
}