import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  student_id: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  course_id: number;

  @ApiProperty({ example: 'HK2-2025-2026' })
  @IsString()
  @IsNotEmpty()
  semester: string;

  @ApiProperty({ enum: EnrollmentStatus, example: EnrollmentStatus.ENROLLED, required: false })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
