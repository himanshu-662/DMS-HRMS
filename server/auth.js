import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = Math.random().toString(36).substring(2, 11);
    
    db.prepare('INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)')
      .run(id, name, email, hashedPassword, role || 'employee');
      
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  
  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Role check (if requested by user login UI)
    if (role && user.role !== role) {
      return res.status(401).json({ error: `User is not a ${role}` });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Auth middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default router;
