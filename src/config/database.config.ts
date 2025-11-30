import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: 'localhost',
  port: 1433,
  username: 'restaurant_user',
  password: 'Restaurant@2024',
  database: 'restaurant_management',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  logging: true,
};