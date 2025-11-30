import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
  ) {}

  create(createTableDto: CreateTableDto) {
    const table = this.tableRepository.create(createTableDto);
    return this.tableRepository.save(table);
  }

  findAll() {
    return this.tableRepository.find();
  }

  findOne(id: number) {
    return this.tableRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    await this.tableRepository.update(id, updateTableDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.tableRepository.delete(id);
    return { deleted: true };
  }
}