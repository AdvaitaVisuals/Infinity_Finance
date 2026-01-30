
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'loanbook.db');

declare global {
    var sqliteFn: Database.Database | undefined;
}

export function getDb() {
    if (process.env.NODE_ENV === 'development') {
        if (!global.sqliteFn) {
            global.sqliteFn = new Database(dbPath);
            global.sqliteFn.pragma('journal_mode = WAL');
            global.sqliteFn.pragma('foreign_keys = ON');
        }
        return global.sqliteFn;
    } else {
        const db = new Database(dbPath);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        return db;
    }
}

export const db = getDb();
