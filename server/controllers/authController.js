import pool from '../db.js';
import { User } from '../models/User.js';
import { sendEmail } from '../utils/email.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { logAudit } from '../utils/logger.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordValid = await User.verifyPassword(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role_name;
    req.session.userName = user.full_name;

    await User.updateLastLogin(user.id);
    await logAudit(user.id, 'LOGIN', 'user', user.id, null, null, req);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
}

export async function logout(req, res) {
  try {
    const userId = req.session.userId;
    await logAudit(userId, 'LOGOUT', 'user', userId, null, null, req);

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId);
    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role_name,
      status: user.status
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists
      return res.json({ success: true, message: 'Password reset link sent to email' });
    }

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    const [resetResult] = await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
      [user.id, resetToken]
    );

    const resetLink = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Password Reset Request',
      `<p>Click <a href="${resetLink}">here</a> to reset your password.</p><p>This link expires in 1 hour.</p>`
    );

    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
}
