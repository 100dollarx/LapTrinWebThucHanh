import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Class } from '../../classes/entities/class.entity';
import { User } from '../../auth/entities/user.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true, length: 20 })
  @ApiProperty({ example: '52400001' })
  student_code: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Nguyễn Văn An' })
  full_name: string;

  @Column({ type: 'date', nullable: true })
  @ApiProperty({ example: '2004-01-15', required: false })
  date_of_birth: Date;

  @Column({ type: 'enum', enum: Gender, default: Gender.MALE })
  @ApiProperty({ enum: Gender, example: Gender.MALE })
  gender: Gender;

  @Column({ length: 100, nullable: true })
  @ApiProperty({ example: 'svien@student.edu.vn', required: false })
  email: string;

  @Column({ length: 20, nullable: true })
  @ApiProperty({ example: '0901234567', required: false })
  phone: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ example: '123 Đường ABC, TP.HCM', required: false })
  address: string;

  @Column({ nullable: true })
  class_id: number;

  @ManyToOne(() => Class, { nullable: true, eager: true })
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ nullable: true })
  user_id: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
