import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  async findAll(search?: string) {
    if (search) {
      return this.courseRepo.find({
        where: [
          { course_name: ILike(`%${search}%`) },
          { course_code: ILike(`%${search}%`) },
        ],
        order: { course_name: 'ASC' },
      });
    }
    return this.courseRepo.find({ order: { course_name: 'ASC' } });
  }

  async findOne(id: number) {
    const course = await this.courseRepo.findOne({ where: { id } });
    if (!course) throw new NotFoundException(`Môn học #${id} không tồn tại`);
    return course;
  }

  async create(dto: CreateCourseDto) {
    const existing = await this.courseRepo.findOne({ where: { course_code: dto.course_code } });
    if (existing) throw new ConflictException(`Mã môn ${dto.course_code} đã tồn tại`);
    const course = this.courseRepo.create(dto);
    return this.courseRepo.save(course);
  }

  async update(id: number, dto: UpdateCourseDto) {
    const course = await this.findOne(id);
    Object.assign(course, dto);
    return this.courseRepo.save(course);
  }

  async remove(id: number) {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
    return { message: `Đã xóa môn học #${id}` };
  }
}
