import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepo: Repository<Class>,
  ) {}

  findAll() {
    return this.classRepo.find({ order: { class_name: 'ASC' } });
  }

  async findOne(id: number) {
    const cls = await this.classRepo.findOne({ where: { id } });
    if (!cls) throw new NotFoundException(`Lớp #${id} không tồn tại`);
    return cls;
  }

  async create(dto: CreateClassDto) {
    const existing = await this.classRepo.findOne({
      where: { class_code: dto.class_code },
    });
    if (existing)
      throw new ConflictException(`Mã lớp ${dto.class_code} đã tồn tại`);
    const cls = this.classRepo.create(dto);
    return this.classRepo.save(cls);
  }

  async update(id: number, dto: UpdateClassDto) {
    const cls = await this.findOne(id);
    Object.assign(cls, dto);
    return this.classRepo.save(cls);
  }

  async remove(id: number) {
    const cls = await this.findOne(id);
    await this.classRepo.remove(cls);
    return { message: `Đã xóa lớp #${id}` };
  }
}
