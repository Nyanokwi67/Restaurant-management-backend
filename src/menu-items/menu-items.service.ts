// src/menu-items/menu-items.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    const menuItem = this.menuItemRepository.create(createMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async findAll() {
    return await this.menuItemRepository.find();
  }

  async findOne(id: number) {
    const menuItem = await this.menuItemRepository.findOne({ where: { id } });
    if (!menuItem) {
      throw new NotFoundException(`Menu item with ID ${id} not found`);
    }
    return menuItem;
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.findOne(id);
    Object.assign(menuItem, updateMenuItemDto);
    return await this.menuItemRepository.save(menuItem);
  }

  async remove(id: number) {
    const menuItem = await this.findOne(id);
    await this.menuItemRepository.delete(id);
    return { message: 'Menu item deleted successfully' };
  }
}