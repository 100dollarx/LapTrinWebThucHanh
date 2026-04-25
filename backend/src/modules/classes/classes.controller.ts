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
  ApiResponse,
} from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({
    summary: 'Danh sách lớp học',
    description: 'Lấy tất cả các lớp học trong hệ thống.',
  })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Chi tiết lớp học',
    description: 'Lấy thông tin chi tiết của một lớp học theo ID.',
  })
  @ApiParam({ name: 'id', description: 'ID của lớp học', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy lớp học' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lớp học' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Thêm lớp học mới',
    description: 'Tạo một lớp học mới thuộc về một khoa.',
  })
  @ApiResponse({ status: 201, description: 'Tạo lớp thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() dto: CreateClassDto) {
    return this.classesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cập nhật lớp học',
    description: 'Chỉnh sửa thông tin lớp học hiện có.',
  })
  @ApiParam({ name: 'id', description: 'ID của lớp học', type: Number })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lớp học' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa lớp học',
    description: 'Xóa lớp học khỏi hệ thống.',
  })
  @ApiParam({ name: 'id', description: 'ID của lớp học', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lớp học' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
