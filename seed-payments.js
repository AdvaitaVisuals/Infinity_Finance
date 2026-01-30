
const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(process.cwd(), 'loanbook.db');
const db = new Database(dbPath);

console.log('Seeding demo payments...');

// 1. Get existing loans
const loans = db.prepare('SELECT id, userId, principalAmount FROM loans').all();

if (loans.length === 0) {
    console.log('No loans found. Run seed-loans.js first.');
    process.exit(1);
}

// 2. Create Payments
const paymentModes = ['CASH', 'UPI', 'BANK_TRANSFER'];
const userId = 'test-user-id';

loans.forEach(loan => {
    // Create 2-3 payments per loan
    const numPayments = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numPayments; i++) {
        const amount = Math.floor(Math.random() * 5000) + 1000;
        const interestPortion = Math.floor(amount * 0.3);
        const principalPortion = amount - interestPortion;

        db.prepare(`
      INSERT INTO payments (
        id, userId, loanId, amount, 
        interestPortion, principalPortion, 
        paymentDate, paymentMode, receiptNumber, notes
      ) VALUES (
        ?, ?, ?, ?, 
        ?, ?, 
        ?, ?, ?, ?
      )
    `).run(
            uuidv4(),
            userId,
            loan.id,
            amount,
            interestPortion,
            principalPortion,
            new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(), // Random date in past
            paymentModes[Math.floor(Math.random() * paymentModes.length)],
            `RCP-${Math.floor(Math.random() * 10000)}`,
            'Demo Payment'
        );

        // Update loan totals (simplified)
        db.prepare(`
       UPDATE loans 
       SET totalPaid = totalPaid + ?, 
           principalPending = principalPending - ?
       WHERE id = ?
    `).run(amount, principalPortion, loan.id);
    }
});

console.log('Payments seeded successfully!');
