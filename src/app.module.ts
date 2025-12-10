// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { MpesaModule } from './mpesa/mpesa.module';
import { PaymentsModule } from './payment/payment.module'; 
import { ExpensesModule } from './expenses/expenses.module';  

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'restaurant_user',
      password: 'Restaurant@2024',
      database: 'restaurant_management',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),
    AuthModule,
    UsersModule,
    MenuItemsModule,
    TablesModule,
    OrdersModule,
    MpesaModule,
    PaymentsModule, 
    ExpensesModule,  
  ],
})
export class AppModule {}