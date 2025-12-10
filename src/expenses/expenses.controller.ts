

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExpensesController {
  private readonly logger = new Logger(ExpensesController.name);

  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles('admin', 'manager')
  create(@Body() createExpenseDto: CreateExpenseDto) {
    this.logger.log('POST /expenses');
    return this.expensesService.create(createExpenseDto);
  }

  @Get()
  @Roles('admin', 'manager')
  findAll() {
    this.logger.log('GET /expenses');
    return this.expensesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  findOne(@Param('id') id: string) {
    this.logger.log(`GET /expenses/${id}`);
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin', 'manager')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    this.logger.log(`PATCH /expenses/${id}`);
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    this.logger.log(`DELETE /expenses/${id}`);
    return this.expensesService.remove(+id);
  }
}