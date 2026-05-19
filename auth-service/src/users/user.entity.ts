import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}

registerEnumType(Role, { name: 'Role' });

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => Role)
  @Column({ type: 'varchar', default: Role.OPERATOR })
  role: Role;

  @Field()
  @CreateDateColumn()
  created_at: Date;
}