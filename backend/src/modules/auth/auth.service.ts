import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      throw new ConflictException('Username hoặc email đã tồn tại');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashed,
      role: dto.role,
    });
    const saved = await this.userRepo.save(user);
    const { password: _pw, ...result } = saved;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (!user) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai username hoặc mật khẩu');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const { password: _pw, ...result } = user;
    return result;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const isMatch = await bcrypt.compare(dto.oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }
    const isSame = await bcrypt.compare(dto.newPassword, user.password);
    if (isSame) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ');
    }

    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepo.save(user);

    return { message: 'Đổi mật khẩu thành công' };
  }
}
