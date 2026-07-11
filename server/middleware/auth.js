import pool from '../db.js';

export async function isAuthenticated(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

export async function isAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const [user] = await pool.query(
      'SELECT u.role_id, r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [req.session.userId]
    );

    if (!user || !['super_admin', 'admin'].includes(user[0]?.name)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Authorization check failed' });
  }
}

export async function requireRole(...allowedRoles) {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const [user] = await pool.query(
        'SELECT u.role_id, r.name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [req.session.userId]
      );

      if (!user || !allowedRoles.includes(user[0]?.name)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
}
