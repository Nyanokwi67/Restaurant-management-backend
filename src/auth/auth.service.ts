// src/auth/auth.service.ts

import {
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    this.logger.log(`Login attempt for user: ${username}`);

    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      this.logger.warn(`Login failed: User ${username} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user ${username}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`Login successful: ${user.username} (${user.role})`);

    const token = this.generateToken(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword,
    };
  }

  // ADD THIS METHOD - Required by jwt.strategy.ts
  async validateUser(userId: number): Promise<User | null> {
    this.logger.debug(`Validating user: ID ${userId}`);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      this.logger.warn(`User validation failed: ID ${userId} not found`);
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  private generateToken(user: User): string {
    this.logger.debug(`Generating JWT token for user: ${user.username}`);

    const payload = {
      sub: user.id,  // Changed to 'sub' for jwt.strategy
      id: user.id,
      username: user.username,
      role: user.role,
    };

    return this.jwtService.sign(payload);
  }
}