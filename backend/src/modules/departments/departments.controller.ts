import {
  Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly deptService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách khoa', description: 'Lấy tất cả các khoa trong hệ thống.' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  findAll() { return this.deptService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khoa', description: 'Lấy thông tin chi tiết của một khoa theo ID.' })
  @ApiParam({ name: 'id', description: 'ID của khoa', type: Number })
  @ApiResponse({ status: 200, description: 'Tìm thấy khoa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khoa' })
  findOne(@Param('id', ParseIntPipe) id: number) { return this.deptService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Thêm khoa mới', description: 'Tạo một đơn vị khoa mới.' })
  @ApiResponse({ status: 201, description: 'Tạo khoa thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() dto: CreateDepartmentDto) { return this.deptService.create(dto); }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật khoa', description: 'Chỉnh sửa thông tin khoa hiện có.' })
  @ApiParam({ name: 'id', description: 'ID của khoa', type: Number })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khoa' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDto) {
    return this.deptService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa khoa', description: 'Xóa khoa khỏi hệ thống.' })
  @ApiParam({ name: 'id', description: 'ID của khoa', type: Number })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy khoa' })
  remove(@Param('id', ParseIntPipe) id: number) { return this.deptService.remove(id); }
}
