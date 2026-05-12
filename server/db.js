import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'database.sqlite'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    avatar TEXT,
    department TEXT,
    designation TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    employeeId TEXT,
    name TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    designation TEXT,
    manager TEXT,
    joinDate TEXT,
    status TEXT,
    avatar TEXT,
    location TEXT,
    type TEXT,
    salary REAL,
    skills TEXT
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id TEXT PRIMARY KEY,
    employeeId TEXT,
    employeeName TEXT,
    date TEXT,
    checkIn TEXT,
    checkOut TEXT,
    status TEXT,
    totalHours REAL,
    department TEXT
  );

  CREATE TABLE IF NOT EXISTS leave_requests (
    id TEXT PRIMARY KEY,
    employeeId TEXT,
    employeeName TEXT,
    type TEXT,
    startDate TEXT,
    endDate TEXT,
    days INTEGER,
    reason TEXT,
    status TEXT,
    appliedOn TEXT,
    department TEXT
  );
`);

// Seed default settings
const seedSettings = () => {
  const settings = [
    { key: 'company_name', value: 'DMS HRMS' },
    { key: 'company_logo', value: '' },
    { key: 'gps_attendance', value: 'false' },
    { key: 'auto_gen_id', value: 'true' },
    { key: 'self_service', value: 'true' }
  ];

  const insert = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  settings.forEach(s => insert.run(s.key, s.value));
};

// Seed default admin
const seedAdmin = async () => {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  db.prepare('INSERT OR IGNORE INTO users (id, name, email, password, role, department, designation) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run('u1', 'Sarah Johnson', 'admin@dms.com', hashedPassword, 'hr_admin', 'Human Resources', 'HR Director');
};

seedSettings();
seedAdmin();

export default db;
