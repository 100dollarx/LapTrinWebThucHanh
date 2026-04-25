import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { BatchCreateEnrollmentDto } from './dto/batch-create-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepo: Repository<Enrollment>,
  ) {}

  async create(dto: CreateEnrollmentDto) {
    // Kiểm tra sinh viên đã đăng ký môn này trong học kỳ chưa
    const existing = await this.enrollmentRepo.findOne({
      where: {
        student_id: dto.student_id,
        course_id: dto.course_id,
        semester: dto.semester,
      },
    });
    if (existing) {
      throw new ConflictException(
        'Sinh viên đã đăng ký môn này trong học kỳ này',
      );
    }
    const enrollment = this.enrollmentRepo.create(dto);
    return this.enrollmentRepo.save(enrollment);
  }

  async batchCreate(dto: BatchCreateEnrollmentDto) {
    const results: { course_id: number; status: string; message: string }[] =
      [];

    for (const course_id of dto.course_ids) {
      // Kiểm tra trùng từng môn
      const existing = await this.enrollmentRepo.findOne({
        where: {
          student_id: dto.student_id,
          course_id,
          semester: dto.semester,
        },
      });

      if (existing) {
        results.push({
          course_id,
          status: 'skipped',
          message: 'Đã đăng ký môn này trước đó',
        });
        continue;
      }

      try {
        const enrollment = this.enrollmentRepo.create({
          student_id: dto.student_id,
          course_id,
          semester: dto.semester,
        });
        await this.enrollmentRepo.save(enrollment);
        results.push({
          course_id,
          status: 'success',
          message: 'Đăng ký thành công',
        });
      } catch {
        results.push({ course_id, status: 'error', message: 'Lỗi khi lưu' });
      }
    }

    const successCount = results.filter((r) => r.status === 'success').length;
    const skippedCount = results.filter((r) => r.status === 'skipped').length;

    return {
      total: dto.course_ids.length,
      success: successCount,
      skipped: skippedCount,
      results,
    };
  }

  async findByStudent(studentId: number) {
    return this.enrollmentRepo.find({
      where: { student_id: studentId },
      order: { enrolled_at: 'DESC' },
    });
  }

  async findAll() {
    return this.enrollmentRepo.find({ order: { enrolled_at: 'DESC' } });
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
    if (!enrollment)
      throw new NotFoundException(`Đăng ký #${id} không tồn tại`);
    Object.assign(enrollment, dto);
    return this.enrollmentRepo.save(enrollment);
  }

  async remove(id: number) {
    const enrollment = await this.enrollmentRepo.findOne({ where: { id } });
    if (!enrollment)
      throw new NotFoundException(`Đăng ký #${id} không tồn tại`);
    await this.enrollmentRepo.remove(enrollment);
    return { message: `Đã xóa đăng ký #${id}` };
  }
}
