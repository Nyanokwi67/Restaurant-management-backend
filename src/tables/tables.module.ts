// src/tables/tables.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { Table } from './entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Table]),
    AuthModule,
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}