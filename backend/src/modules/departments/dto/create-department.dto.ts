import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'CNTT' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  dept_code: string;

  @ApiProperty({ example: 'Công nghệ Thông tin' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dept_name: string;
}
