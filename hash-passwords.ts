import * as bcrypt from 'bcrypt';

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  console.log(`Password: ${password}`);
  console.log(`Hashed: ${hashed}`);
  console.log('---');
}

async function main() {
  await hashPassword('admin123');
  await hashPassword('manager123');
  await hashPassword('waiter123');
}

main();