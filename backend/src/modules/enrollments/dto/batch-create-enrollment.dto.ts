import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, ArrayMinSize } from 'class-validator';

export class BatchCreateEnrollmentDto {
  @ApiProperty({ example: 1, description: 'ID sinh viên' })
  @IsNumber()
  student_id: number;

  @ApiProperty({ example: [1, 2, 3], description: 'Danh sách ID môn học muốn đăng ký' })
  @IsArray()
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  course_ids: number[];

  @ApiProperty({ example: 'HK2-2025-2026', description: 'Học kỳ' })
  @IsString()
  @IsNotEmpty()
  semester: string;
}
