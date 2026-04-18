import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { QueryStudentDto } from './dto/query-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
  ) {}

  async findAll(query: QueryStudentDto) {
    const { page = 1, limit = 10, search, class_id } = query;
    const skip = (page - 1) * limit;

    const where: any = [];

    if (search) {
      if (class_id) {
        where.push(
          { full_name: ILike(`%${search}%`), class_id },
          { student_code: ILike(`%${search}%`), class_id },
        );
      } else {
        where.push(
          { full_name: ILike(`%${search}%`) },
          { student_code: ILike(`%${search}%`) },
        );
      }
    } else if (class_id) {
      where.push({ class_id });
    }

    const [data, total] = await this.studentRepo.findAndCount({
      where: where.length > 0 ? where : undefined,
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const student = await this.studentRepo.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Sinh viên #${id} không tồn tại`);
    }
    return student;
  }

  async create(dto: CreateStudentDto) {
    const existing = await this.studentRepo.findOne({
      where: { student_code: dto.student_code },
    });
    if (existing) {
      throw new ConflictException(`MSSV ${dto.student_code} đã tồn tại`);
    }
    const student = this.studentRepo.create(dto);
    return this.studentRepo.save(student);
  }

  async update(id: number, dto: UpdateStudentDto) {
    const student = await this.findOne(id);
    if (dto.student_code && dto.student_code !== student.student_code) {
      const existing = await this.studentRepo.findOne({
        where: { student_code: dto.student_code },
      });
      if (existing) {
        throw new ConflictException(`MSSV ${dto.student_code} đã tồn tại`);
      }
    }
    Object.assign(student, dto);
    return this.studentRepo.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentRepo.remove(student);
    return { message: `Đã xóa sinh viên #${id}` };
  }
}
