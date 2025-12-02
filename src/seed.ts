import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🌱 Starting database seeding...');

    // Get DataSource
    const dataSource = app.get(DataSource);

    // Get repositories
    const userRepo = dataSource.getRepository('User');
    const menuItemRepo = dataSource.getRepository('MenuItem');
    const tableRepo = dataSource.getRepository('Table');

    // Seed Users
    console.log('👥 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminExists = await userRepo.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      await userRepo.save({
        name: 'Admin User',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        active: true,
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Check if tables already exist
    const existingTablesCount = await tableRepo.count();
    if (existingTablesCount === 0) {
      console.log('🪑 Creating tables...');
      const tables = [
        { number: 1, seats: 4, status: 'free' },
        { number: 2, seats: 2, status: 'free' },
        { number: 3, seats: 6, status: 'free' },
        { number: 4, seats: 4, status: 'free' },
        { number: 5, seats: 2, status: 'free' },
        { number: 6, seats: 8, status: 'free' },
      ];

      await tableRepo.save(tables);
      console.log(`✅ Created ${tables.length} tables`);
    } else {
      console.log(`ℹ️  Tables already exist (${existingTablesCount} tables)`);
    }

    // Check if menu items already exist
    const existingMenuCount = await menuItemRepo.count();
    if (existingMenuCount === 0) {
      console.log('🍔 Creating menu items...');
      const menuItems = [
        // Drinks
        { name: 'Cappuccino', price: 350, category: 'Drinks', available: true },
        { name: 'Espresso', price: 300, category: 'Drinks', available: true },
        { name: 'Latte', price: 400, category: 'Drinks', available: true },
        { name: 'Fresh Orange Juice', price: 450, category: 'Drinks', available: true },
        { name: 'Soda', price: 150, category: 'Drinks', available: true },
        { name: 'Mineral Water', price: 100, category: 'Drinks', available: true },
        
        // Meals
        { name: 'Beef Burger', price: 850, category: 'Meals', available: true },
        { name: 'Chicken Wrap', price: 750, category: 'Meals', available: true },
        { name: 'Caesar Salad', price: 650, category: 'Meals', available: true },
        { name: 'Pasta Carbonara', price: 900, category: 'Meals', available: true },
        { name: 'Grilled Fish & Chips', price: 1200, category: 'Meals', available: true },
        { name: 'Steak & Vegetables', price: 1500, category: 'Meals', available: true },
        { name: 'Chicken Tikka', price: 950, category: 'Meals', available: true },
        
        // Desserts
        { name: 'Chocolate Cake', price: 500, category: 'Desserts', available: true },
        { name: 'Vanilla Ice Cream', price: 350, category: 'Desserts', available: true },
        { name: 'Cheesecake', price: 550, category: 'Desserts', available: true },
        { name: 'Fruit Salad', price: 400, category: 'Desserts', available: true },
      ];

      await menuItemRepo.save(menuItems);
      console.log(`✅ Created ${menuItems.length} menu items`);
    } else {
      console.log(`ℹ️  Menu items already exist (${existingMenuCount} items)`);
    }

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

bootstrap();