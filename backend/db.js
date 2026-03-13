const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "clinic.sqlite");
const db = new sqlite3.Database(dbPath);

function initDb() {
  return new Promise((resolve, reject) => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS appointments (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        status TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        mail TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL
      )
      `,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = { db, initDb };