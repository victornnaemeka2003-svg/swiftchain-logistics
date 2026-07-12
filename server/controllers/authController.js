import { query } from '../db.js';
import { hashPassword, verifyPassword } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'Active') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userRole = user.role;
    req.session.fullName = user.full_name;

    await query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const users = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // TODO: Generate reset token and send email
    res.json({ success: true, message: 'Password reset link sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Error processing request' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    // TODO: Verify token and update password
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const users = await query('SELECT id, email, full_name, role FROM users WHERE id = ?', [req.session.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
};
