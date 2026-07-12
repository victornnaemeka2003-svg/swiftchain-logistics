import { query } from '../db.js';
import { CREATE_TABLES_SQL } from '../config/schema.js';

const runMigration = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    const statements = CREATE_TABLES_SQL.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement + ';', []);
      }
    }
    
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

runMigration();
