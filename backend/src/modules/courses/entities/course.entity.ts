import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Department } from '../../departments/entities/department.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true, length: 20 })
  @ApiProperty({ example: 'CNTT101' })
  course_code: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Lập trình Web' })
  course_name: string;

  @Column({ default: 3 })
  @ApiProperty({ example: 3 })
  credits: number;

  @Column({ nullable: true })
  department_id: number;

  @ManyToOne(() => Department, { nullable: true, eager: true })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({
    example: 'Môn học về lập trình web với HTML, CSS, JS, ReactJS',
    required: false,
  })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
