import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('Starting database seeding...');

    const dataSource = app.get(DataSource);

    const userRepo = dataSource.getRepository('User');
    const menuItemRepo = dataSource.getRepository('MenuItem');
    const tableRepo = dataSource.getRepository('Table');

    // Seed Users
    console.log('\nCreating users...');
    
    const users = [
      { name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin' },
      { name: 'Manager John', username: 'manager', password: 'manager123', role: 'manager' },
      { name: 'Waiter Mary', username: 'waiter', password: 'waiter123', role: 'waiter' },
    ];

    for (const userData of users) {
      const userExists = await userRepo.findOne({ where: { username: userData.username } });
      if (!userExists) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await userRepo.save({
          name: userData.name,
          username: userData.username,
          password: hashedPassword,
          role: userData.role,
          active: true,
        });
        console.log(`  Created ${userData.role}: ${userData.username}`);
      } else {
        console.log(`  ${userData.role} already exists: ${userData.username}`);
      }
    }

    // Seed Tables
    const existingTablesCount = await tableRepo.count();
    if (existingTablesCount === 0) {
      console.log('\nCreating tables...');
      const tables = [
        { number: 1, seats: 2, status: 'free' },
        { number: 2, seats: 4, status: 'free' },
        { number: 3, seats: 4, status: 'free' },
        { number: 4, seats: 6, status: 'free' },
        { number: 5, seats: 2, status: 'free' },
        { number: 6, seats: 8, status: 'free' },
      ];

      await tableRepo.save(tables);
      console.log(`  Created ${tables.length} tables`);
    } else {
      console.log(`\nTables already exist (${existingTablesCount} tables)`);
    }

    // Seed Menu Items
    const existingMenuCount = await menuItemRepo.count();
    if (existingMenuCount === 0) {
      console.log('\nCreating menu items...');
      const menuItems = [
        // Drinks
        { name: 'Cappuccino', price: 150, category: 'Drinks', available: true },
        { name: 'Espresso', price: 100, category: 'Drinks', available: true },
        { name: 'Latte', price: 180, category: 'Drinks', available: true },
        { name: 'Fresh Orange Juice', price: 120, category: 'Drinks', available: true },
        { name: 'Mineral Water', price: 50, category: 'Drinks', available: true },
        { name: 'Soda', price: 80, category: 'Drinks', available: true },
        
        // Meals
        { name: 'Beef Burger', price: 500, category: 'Meals', available: true },
        { name: 'Chicken Wrap', price: 450, category: 'Meals', available: true },
        { name: 'Caesar Salad', price: 400, category: 'Meals', available: true },
        { name: 'Pasta Carbonara', price: 550, category: 'Meals', available: true },
        { name: 'Grilled Fish & Chips', price: 700, category: 'Meals', available: true },
        { name: 'Steak & Vegetables', price: 850, category: 'Meals', available: true },
        { name: 'Chicken Tikka', price: 600, category: 'Meals', available: true },
        
        // Desserts
        { name: 'Chocolate Cake', price: 300, category: 'Desserts', available: true },
        { name: 'Vanilla Ice Cream', price: 200, category: 'Desserts', available: true },
        { name: 'Cheesecake', price: 350, category: 'Desserts', available: true },
        { name: 'Fruit Salad', price: 250, category: 'Desserts', available: true },
      ];

      await menuItemRepo.save(menuItems);
      console.log(`  Created ${menuItems.length} menu items`);
      console.log('    - 6 Drinks');
      console.log('    - 7 Meals');
      console.log('    - 4 Desserts');
    } else {
      console.log(`\nMenu items already exist (${existingMenuCount} items)`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('Database seeded successfully!');
    console.log('='.repeat(50));
    console.log('\nLOGIN CREDENTIALS:');
    console.log('Admin    -> admin / admin123');
    console.log('Manager  -> manager / manager123');
    console.log('Waiter   -> waiter / waiter123');
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

bootstrap();