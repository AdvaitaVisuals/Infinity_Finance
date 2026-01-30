
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'loanbook.db');
const schemaPath = path.join(process.cwd(), 'schema.sql');

console.log('Initializing database at:', dbPath);

try {
    // Remove existing db to start fresh (optional, maybe safe to keep)
    // fs.unlinkSync(dbPath); 

    const db = new Database(dbPath);
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema...');
    db.exec(schema);

    console.log('Database initialized successfully!');
    db.close();
} catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
}
