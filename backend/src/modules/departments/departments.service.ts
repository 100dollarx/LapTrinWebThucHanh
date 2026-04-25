import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private deptRepo: Repository<Department>,
  ) {}

  findAll() {
    return this.deptRepo.find({ order: { dept_name: 'ASC' } });
  }

  async findOne(id: number) {
    const dept = await this.deptRepo.findOne({ where: { id } });
    if (!dept) throw new NotFoundException(`Khoa #${id} không tồn tại`);
    return dept;
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.deptRepo.findOne({
      where: { dept_code: dto.dept_code },
    });
    if (existing)
      throw new ConflictException(`Mã khoa ${dto.dept_code} đã tồn tại`);
    const dept = this.deptRepo.create(dto);
    return this.deptRepo.save(dept);
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const dept = await this.findOne(id);
    Object.assign(dept, dto);
    return this.deptRepo.save(dept);
  }

  async remove(id: number) {
    const dept = await this.findOne(id);
    await this.deptRepo.remove(dept);
    return { message: `Đã xóa khoa #${id}` };
  }
}
