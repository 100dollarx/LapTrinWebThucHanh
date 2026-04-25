import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: 'CNTT2022A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  class_code: string;

  @ApiProperty({ example: 'Công nghệ Thông tin 2022 - Nhóm A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  class_name: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  department_id?: number;
}
