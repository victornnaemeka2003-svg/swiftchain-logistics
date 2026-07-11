import pool from '../db.js';
import bcrypt from 'bcryptjs';

export class User {
  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, full_name, role_id)
       VALUES (?, ?, ?, ?, ?)`,
      [userData.username, userData.email, hashedPassword, userData.full_name, userData.role_id]
    );
    return result.insertId;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [id]
    );
  }

  static async getAll(limit = 100, offset = 0) {
    const [rows] = await pool.query(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
  }
}
