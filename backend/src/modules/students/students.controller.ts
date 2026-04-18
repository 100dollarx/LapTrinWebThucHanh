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
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách sinh viên', description: 'Lấy danh sách sinh viên hỗ trợ phân trang, tìm kiếm và lọc theo lớp.' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll(@Query() query: QueryStudentDto) {
    return this.studentsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sinh viên', description: 'Lấy thông tin chi tiết của một sinh viên theo ID.' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy sinh viên' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sinh viên mới', description: 'Tạo một bản ghi sinh viên mới trong hệ thống.' })
  @ApiResponse({ status: 201, description: 'Tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 409, description: 'Mã số sinh viên (student_code) đã tồn tại' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sinh viên', description: 'Chỉnh sửa thông tin sinh viên hiện có.' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên', type: Number })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sinh viên', description: 'Xóa vĩnh viễn sinh viên khỏi hệ thống.' })
  @ApiParam({ name: 'id', description: 'ID của sinh viên', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sinh viên' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}
