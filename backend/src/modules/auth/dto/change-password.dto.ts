import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Admin@123', description: 'Mật khẩu hiện tại' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'NewPass@456', description: 'Mật khẩu mới (tối thiểu 6 ký tự)', minLength: 6 })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
