import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../entities/student.entity';

export class CreateStudentDto {
  @ApiProperty({ example: '52400001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  student_code: string;

  @ApiProperty({ example: 'Nguyễn Văn An' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({ example: '2004-01-15', required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date_of_birth?: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: 'svien@student.edu.vn', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '0901234567', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: '123 Đường ABC, TP.HCM', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  class_id?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
