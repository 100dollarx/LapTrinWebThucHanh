import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true, length: 20 })
  @ApiProperty({ example: 'CNTT' })
  dept_code: string;

  @Column({ length: 100 })
  @ApiProperty({ example: 'Công nghệ Thông tin' })
  dept_name: string;

  @CreateDateColumn()
  created_at: Date;
}
