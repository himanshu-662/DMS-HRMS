import express from 'express';
import db from './db.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Settings
router.get('/settings', authenticateToken, (req, res) => {
  const settings = db.prepare('SELECT * FROM settings').all();
  const settingsMap = {};
  settings.forEach(s => {
    settingsMap[s.key] = s.value === 'true' ? true : s.value === 'false' ? false : s.value;
  });
  res.json(settingsMap);
});

router.post('/settings', authenticateToken, (req, res) => {
  if (req.user.role !== 'hr_admin' && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  const updates = req.body;
  const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  
  const transaction = db.transaction((items) => {
    for (const [key, value] of Object.entries(items)) {
      updateStmt.run(key, String(value));
    }
  });
  
  transaction(updates);
  res.json({ message: 'Settings updated' });
});

// Employees
router.get('/employees', authenticateToken, (req, res) => {
  const employees = db.prepare('SELECT * FROM employees').all();
  res.json(employees.map(e => ({
    ...e,
    skills: e.skills ? JSON.parse(e.skills) : []
  })));
});

router.post('/employees', authenticateToken, (req, res) => {
  const employee = req.body;
  const id = employee.id || Math.random().toString(36).substring(2, 11);
  
  db.prepare(`
    INSERT INTO employees (id, employeeId, name, email, phone, department, designation, manager, joinDate, status, avatar, location, type, salary, skills)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    employee.employeeId,
    employee.name,
    employee.email,
    employee.phone,
    employee.department,
    employee.designation,
    employee.manager,
    employee.joinDate,
    employee.status,
    employee.avatar,
    employee.location,
    employee.type,
    employee.salary,
    JSON.stringify(employee.skills || [])
  );
  
  res.status(201).json({ id, ...employee });
});

// Attendance
router.get('/attendance', authenticateToken, (req, res) => {
  const records = db.prepare('SELECT * FROM attendance').all();
  res.json(records);
});

router.post('/attendance/checkin', authenticateToken, (req, res) => {
  const { time, date, employeeName, department } = req.body;
  const id = Math.random().toString(36).substring(2, 11);
  
  db.prepare(`
    INSERT INTO attendance (id, employeeId, employeeName, date, checkIn, checkOut, status, totalHours, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.user.id, employeeName, date, time, '-', 'present', 0, department);
  
  res.json({ id, checkIn: time });
});

// Leaves
router.get('/leaves', authenticateToken, (req, res) => {
  const requests = db.prepare('SELECT * FROM leave_requests').all();
  res.json(requests);
});

router.post('/leaves', authenticateToken, (req, res) => {
  const leave = req.body;
  const id = Math.random().toString(36).substring(2, 11);
  
  db.prepare(`
    INSERT INTO leave_requests (id, employeeId, employeeName, type, startDate, endDate, days, reason, status, appliedOn, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    req.user.id,
    leave.employeeName,
    leave.type,
    leave.startDate,
    leave.endDate,
    leave.days,
    leave.reason,
    'pending',
    new Date().toISOString().split('T')[0],
    leave.department
  );
  
  res.status(201).json({ id, ...leave, status: 'pending' });
});

export default router;
