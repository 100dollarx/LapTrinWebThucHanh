import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryStudentDto {
  @ApiPropertyOptional({ example: 1, description: 'Số trang (bắt đầu từ 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Số record mỗi trang' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Nguyen', description: 'Tìm theo tên hoặc MSSV' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'Lọc theo class_id' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  class_id?: number;
}
