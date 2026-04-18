import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from '../../departments/entities/department.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true, length: 20 })
  @ApiProperty({ example: 'CNTT2022A' })
  class_code: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Công nghệ Thông tin 2022 - Nhóm A' })
  class_name: string;

  @Column({ nullable: true })
  department_id: number;

  @ManyToOne(() => Department, { nullable: true, eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @CreateDateColumn()
  created_at: Date;
}
