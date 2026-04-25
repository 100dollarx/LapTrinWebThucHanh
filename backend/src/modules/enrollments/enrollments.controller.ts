import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { BatchCreateEnrollmentDto } from './dto/batch-create-enrollment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả đăng ký môn học' })
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Danh sách môn đã đăng ký của một sinh viên' })
  @ApiParam({ name: 'studentId', type: Number })
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.enrollmentsService.findByStudent(studentId);
  }

  @Post()
  @ApiOperation({ summary: 'Đăng ký 1 môn học cho sinh viên' })
  create(@Body() dto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(dto);
  }

  @Post('batch')
  @ApiOperation({
    summary: 'Đăng ký nhiều môn học cùng lúc cho 1 sinh viên',
    description:
      'Trả về kết quả từng môn: success / skipped (đã đăng ký) / error',
  })
  batchCreate(@Body() dto: BatchCreateEnrollmentDto) {
    return this.enrollmentsService.batchCreate(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật trạng thái đăng ký (enrolled/completed/dropped)',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa bản ghi đăng ký môn học' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
