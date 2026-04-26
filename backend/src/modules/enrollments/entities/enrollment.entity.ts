import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';

export enum EnrollmentStatus {
  ENROLLED = 'enrolled',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  student_id: number;

  @ManyToOne(() => Student, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column()
  course_id: number;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ length: 20 })
  @ApiProperty({ example: 'HK2-2025-2026' })
  semester: string;

  @Column({
    type: 'enum',
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ENROLLED,
  })
  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ENROLLED })
  status: EnrollmentStatus;

  @CreateDateColumn()
  enrolled_at: Date;
}
