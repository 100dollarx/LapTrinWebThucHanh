import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'CNTT101' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  course_code: string;

  @ApiProperty({ example: 'Lập trình Web' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  course_name: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  credits: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  department_id?: number;

  @ApiProperty({ example: 'Môn học về lập trình web', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
