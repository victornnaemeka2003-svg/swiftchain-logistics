import { query } from '../db.js';
import { hashPassword } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await query('SELECT id, email, full_name, role, status FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const users = await query('SELECT id, email, full_name, role, status FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    const hashedPassword = await hashPassword(password);

    await query(
      'INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, full_name, role]
    );

    await logAudit(req.session.userId, 'CREATE', 'users', null, req);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, full_name, role } = req.body;
    await query(
      'UPDATE users SET email = ?, full_name = ?, role = ? WHERE id = ?',
      [email, full_name, role, req.params.id]
    );
    await logAudit(req.session.userId, 'UPDATE', 'users', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'users', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const users = await query('SELECT password FROM users WHERE id = ?', [req.params.id]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    // TODO: Verify current password
    const hashedPassword = await hashPassword(newPassword);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    await query('UPDATE users SET status = ? WHERE id = ?', ['Inactive', req.params.id]);
    await logAudit(req.session.userId, 'DEACTIVATE', 'users', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
};

export const activateUser = async (req, res) => {
  try {
    await query('UPDATE users SET status = ? WHERE id = ?', ['Active', req.params.id]);
    await logAudit(req.session.userId, 'ACTIVATE', 'users', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to activate user' });
  }
};
