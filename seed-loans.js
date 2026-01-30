
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(process.cwd(), 'loanbook.db');
const db = new Database(dbPath);

console.log('Seeding demo loans...');

// 1. Ensure a user exists
const userId = 'test-user-id';
db.prepare(`
  INSERT OR IGNORE INTO users (id, name, phone, pin) VALUES (?, ?, ?, ?)
`).run(userId, 'Ankit Sharma', '9999999999', '1234');

// Check if borrowers exist
const existingBorrowers = db.prepare('SELECT count(*) as count FROM borrowers').get();

if (existingBorrowers.count < 5) {
    console.log('Creating borrowers...');
    const borrowers = [
        { name: 'Rahul Kumar', phone: '9876543210' },
        { name: 'Amit Singh', phone: '9876543211' },
        { name: 'Priya Sharma', phone: '9876543212' },
        { name: 'Vikram Malhotra', phone: '9876543213' },
        { name: 'Sneha Gupta', phone: '9876543214' }
    ];

    borrowers.forEach(b => {
        const id = uuidv4();
        db.prepare(`
        INSERT INTO borrowers (id, userId, name, phone, address, status)
        VALUES (?, ?, ?, ?, 'Delhi, India', 'ACTIVE')
      `).run(id, userId, b.name, b.phone);
    });
}

// 3. Create Loans if low count
const loanCount = db.prepare('SELECT count(*) as count FROM loans').get();

if (loanCount.count < 5) {
    console.log('Creating loans...');
    const allBorrowers = db.prepare('SELECT id FROM borrowers LIMIT 5').all();

    const loanTemplates = [
        { amount: 50000, rate: 2, duration: 12, type: 'MONTHLY_FLAT', status: 'ACTIVE' },
        { amount: 100000, rate: 3, duration: 24, type: 'MONTHLY_REDUCING', status: 'ACTIVE' },
        { amount: 25000, rate: 5, duration: 6, type: 'DAILY', status: 'OVERDUE' },
        { amount: 200000, rate: 1.5, duration: 36, type: 'MONTHLY_FLAT', status: 'ACTIVE' },
        { amount: 10000, rate: 10, duration: 3, type: 'DAILY', status: 'CLOSED' }
    ];

    loanTemplates.forEach((l, index) => {
        if (index < allBorrowers.length) {
            const id = uuidv4();
            const borrowerId = allBorrowers[index].id;
            const loanNumber = `LN-2026-00${index + 1}`;

            const monthlyData = calculate(l.amount, l.rate, l.duration);

            db.prepare(`
            INSERT INTO loans (
              id, loanNumber, userId, borrowerId, 
              principalAmount, interestRate, interestType, duration,
              startDate, endDate, 
              monthlyInterest, totalInterest, totalReceivable, emiAmount,
              principalPending, interestPending, status
            ) VALUES (
              ?, ?, ?, ?,
              ?, ?, ?, ?,
              ?, ?,
              ?, ?, ?, ?,
              ?, ?, ?
            )
          `).run(
                id, loanNumber, userId, borrowerId,
                l.amount, l.rate, l.type, l.duration,
                new Date().toISOString(), new Date(new Date().setMonth(new Date().getMonth() + l.duration)).toISOString(),
                monthlyData.monthlyInterest, monthlyData.totalInterest, monthlyData.totalReceivable, monthlyData.emiAmount,
                l.amount, monthlyData.totalInterest, l.status
            );
        }
    });
}

function calculate(p, r, t) {
    const interest = p * (r / 100) * t;
    return {
        monthlyInterest: (p * r / 100),
        totalInterest: interest,
        totalReceivable: p + interest,
        emiAmount: (p + interest) / t
    };
}

console.log('Seed check complete.');
