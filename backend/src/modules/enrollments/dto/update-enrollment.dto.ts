import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../entities/enrollment.entity';

export class UpdateEnrollmentDto {
  @ApiPropertyOptional({
    enum: EnrollmentStatus,
    example: EnrollmentStatus.COMPLETED,
    description: 'Trạng thái đăng ký: enrolled | completed | dropped',
  })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;
}
