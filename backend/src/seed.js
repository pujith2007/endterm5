import dotenv from 'dotenv';
import { connectDB, closeDB } from './config/db.js';
import { runSeed } from './services/seedService.js';

dotenv.config();

const main = async () => {
  try {
    await connectDB();
    await runSeed({ force: true });
    console.log('------------------------------------------------------');
    console.log('[Seed] Ready to test! Demo accounts:');
    console.log('       alex@student.edu   / password123 (Project Owner)');
    console.log('       sarah@student.edu  / password123 (AI/ML Engineer)');
    console.log('       marcus@student.edu / password123 (Mobile Dev)');
    console.log('------------------------------------------------------');
    await closeDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

main();
