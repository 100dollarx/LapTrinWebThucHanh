import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grade } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectRepository(Grade)
    private gradeRepo: Repository<Grade>,
  ) {}

  async create(dto: CreateGradeDto) {
    const existing = await this.gradeRepo.findOne({ where: { enrollment_id: dto.enrollment_id } });
    if (existing) throw new ConflictException('Đã có điểm cho đăng ký này, dùng PATCH để cập nhật');
    const grade = this.gradeRepo.create(dto);
    // @BeforeInsert sẽ tự gọi calculateTotal()
    return this.gradeRepo.save(grade);
  }

  async findAll() {
    // Join enrollment → student & course để frontend render được tên
    return this.gradeRepo
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course')
      .orderBy('grade.graded_at', 'DESC')
      .getMany();
  }

  async findByStudent(studentId: number) {
    return this.gradeRepo
      .createQueryBuilder('grade')
      .leftJoinAndSelect('grade.enrollment', 'enrollment')
      .leftJoinAndSelect('enrollment.student', 'student')
      .leftJoinAndSelect('enrollment.course', 'course')
      .where('student.id = :studentId', { studentId })
      .orderBy('enrollment.semester', 'DESC')
      .getMany();
  }

  async update(id: number, dto: UpdateGradeDto) {
    const grade = await this.gradeRepo.findOne({ where: { id } });
    if (!grade) throw new NotFoundException(`Điểm #${id} không tồn tại`);
    Object.assign(grade, dto);
    // @BeforeUpdate sẽ tự gọi calculateTotal() — không cần gọi thủ công
    return this.gradeRepo.save(grade);
  }
}
