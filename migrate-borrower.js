
const Database = require('better-sqlite3');
const db = new Database('loanbook.db');

try {
    db.prepare("ALTER TABLE borrowers ADD COLUMN defaultInterestRate REAL DEFAULT 0.0").run();
    console.log("Migration successful");
} catch (err) {
    if (err.message.includes("duplicate column name")) {
        console.log("Column already exists");
    } else {
        console.error(err);
    }
}
