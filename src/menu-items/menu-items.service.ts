import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
  ) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return this.menuItemRepository.save(menuItem);
  }

  findAll() {
    return this.menuItemRepository.find();
  }

  findOne(id: number) {
    return this.menuItemRepository.findOne({ where: { id } });
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    await this.menuItemRepository.update(id, updateMenuItemDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.menuItemRepository.delete(id);
    return { deleted: true };
  }
}