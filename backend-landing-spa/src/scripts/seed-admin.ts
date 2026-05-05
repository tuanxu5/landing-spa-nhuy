import { connect, connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../../.env') });

const SALT_ROUNDS = 10;

// Default administrator credentials
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'Admin@123',
  email: 'admin@spanhuy.com',
};

/**
 * Administrator schema interface for direct MongoDB operations
 */
interface Administrator {
  username: string;
  passwordHash: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Seeds the initial administrator account into the database
 */
async function seedAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    console.log('Connecting to MongoDB...');
    await connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('Connected to MongoDB successfully');

    const db = connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }
    
    const administratorsCollection = db.collection<Administrator>('administrators');

    // Check if admin already exists
    const existingAdmin = await administratorsCollection.findOne({
      username: DEFAULT_ADMIN.username,
    });

    if (existingAdmin) {
      console.log(`Administrator '${DEFAULT_ADMIN.username}' already exists. Skipping creation.`);
      return;
    }

    // Hash the password
    console.log('Hashing password...');
    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, SALT_ROUNDS);

    // Create the administrator document
    const administrator: Administrator = {
      username: DEFAULT_ADMIN.username,
      passwordHash,
      email: DEFAULT_ADMIN.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the administrator
    console.log('Creating administrator account...');
    await administratorsCollection.insertOne(administrator);

    console.log('\n✅ Administrator account created successfully!');
    console.log('\nDefault credentials:');
    console.log(`  Username: ${DEFAULT_ADMIN.username}`);
    console.log(`  Password: ${DEFAULT_ADMIN.password}`);
    console.log(`  Email: ${DEFAULT_ADMIN.email}`);
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!\n');
  } catch (error) {
    console.error('Error seeding administrator:', error);
    process.exit(1);
  } finally {
    await connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed script
seedAdmin()
  .then(() => {
    console.log('Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
