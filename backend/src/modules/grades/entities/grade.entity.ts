import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  enrollment_id: number;

  // eager: false — dùng QueryBuilder để load (tránh lỗi circular eager)
  @OneToOne(() => Enrollment)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: Enrollment;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  @ApiProperty({ example: 7.5, required: false })
  midterm_score: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  @ApiProperty({ example: 8.0, required: false })
  final_score: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  @ApiProperty({ example: 7.8, required: false })
  total_score: number;

  @Column({ length: 5, nullable: true })
  @ApiProperty({ example: 'B+', required: false })
  grade_letter: string;

  @CreateDateColumn()
  graded_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Tự tính total_score và grade_letter trước khi insert/update
  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    if (this.midterm_score != null && this.final_score != null) {
      this.total_score = parseFloat(
        (Number(this.midterm_score) * 0.4 + Number(this.final_score) * 0.6).toFixed(2),
      );
      this.grade_letter = this.getGradeLetter(this.total_score);
    }
  }

  private getGradeLetter(score: number): string {
    if (score >= 9.0) return 'A+';
    if (score >= 8.5) return 'A';
    if (score >= 8.0) return 'B+';
    if (score >= 7.0) return 'B';
    if (score >= 6.5) return 'C+';
    if (score >= 5.5) return 'C';
    if (score >= 5.0) return 'D+';
    if (score >= 4.0) return 'D';
    return 'F';
  }
}
