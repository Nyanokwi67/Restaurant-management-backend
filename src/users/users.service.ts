// src/users/users.service.ts

import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating new user: ${createUserDto.username}`);

    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      this.logger.warn(
        `User creation failed: Username ${createUserDto.username} already exists`,
      );
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    this.logger.debug(`Password hashed for user: ${createUserDto.username}`);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    this.logger.log(
      `User created successfully: ${savedUser.username} (${savedUser.role})`,
    );

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }

  async findAll() {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.find();
    this.logger.log(`Found ${users.length} users`);

    return users.map((user) => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  async findOne(id: number) {
    this.logger.log(`Fetching user with ID: ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      this.logger.warn(`User not found: ID ${id}`);
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.logger.log(`User found: ${user.username}`);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Updating user: ID ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      this.logger.debug(`Password updated for user: ${user.username}`);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    this.logger.log(`User updated successfully: ID ${id}`);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: number) {
    this.logger.log(`Deleting user: ID ${id}`);

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);

    this.logger.log(`User deleted successfully: ${user.username}`);
    return { message: 'User deleted successfully' };
  }
}