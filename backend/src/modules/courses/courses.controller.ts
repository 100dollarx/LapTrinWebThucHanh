import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách môn học',
    description: 'Lấy tất cả môn học, hỗ trợ tìm kiếm theo tên hoặc mã môn.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Từ khóa tìm kiếm (tên hoặc mã môn học)',
  })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll(@Query('search') search?: string) {
    return this.coursesService.findAll(search);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết môn học',
    description: 'Lấy thông tin chi tiết của môn học theo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID của môn học', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy môn học' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy môn học' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm môn học mới',
    description: 'Tạo một môn học (khóa học) mới.',
  })
  @ApiResponse({ status: 201, description: 'Tạo môn học thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật môn học',
    description: 'Chỉnh sửa thông tin môn học hiện có.',
  })
  @ApiParam({ name: 'id', description: 'ID của môn học', type: Number })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy môn học' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa môn học',
    description: 'Xóa môn học khỏi hệ thống.',
  })
  @ApiParam({ name: 'id', description: 'ID của môn học', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy môn học' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.coursesService.remove(id);
  }
}
