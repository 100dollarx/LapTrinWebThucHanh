import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Grades')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả điểm' })
  findAll() {
    return this.gradesService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Bảng điểm của một sinh viên' })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.gradesService.findByStudent(studentId);
  }

  @Post()
  @ApiOperation({ summary: 'Nhập điểm cho sinh viên' })
  create(@Body() dto: CreateGradeDto) {
    return this.gradesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật điểm' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGradeDto) {
    return this.gradesService.update(id, dto);
  }
}
