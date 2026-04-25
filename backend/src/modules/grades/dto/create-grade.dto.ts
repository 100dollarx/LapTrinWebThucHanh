import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty({ example: 1, description: 'ID của enrollment' })
  @IsNumber()
  enrollment_id: number;

  @ApiProperty({
    example: 7.5,
    required: false,
    description: 'Điểm giữa kỳ (0-10)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  midterm_score?: number;

  @ApiProperty({
    example: 8.0,
    required: false,
    description: 'Điểm cuối kỳ (0-10)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  final_score?: number;
}
