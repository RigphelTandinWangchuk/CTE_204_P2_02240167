const Database = require('better-sqlite3');
const path = require('path');

// Initialize database file connection
const db = new Database(path.join(__dirname, '../../assignments.db'), { verbose: console.log });

// Create assignments table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    moduleName TEXT NOT NULL,
    title TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    priority TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

module.exports = db;