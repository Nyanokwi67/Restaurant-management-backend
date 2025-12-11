
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'; // ✅ ADD THIS
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { TablesModule } from './tables/tables.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payment/payment.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    // ✅ ADD THIS: ConfigModule to load .env
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      envFilePath: '.env', // Path to your .env file
    }),

    // Database configuration
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    }),

    // Your other modules
    AuthModule,
    UsersModule,
    MenuItemsModule,
    TablesModule,
    OrdersModule,
    PaymentsModule,
    ExpensesModule,
  ],
})
export class AppModule {}