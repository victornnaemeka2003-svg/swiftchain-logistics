import pool from '../db.js';
import { logAudit } from '../utils/logger.js';
import { User } from '../models/User.js';

export async function getDashboardStats(req, res) {
  try {
    // Get shipment statistics
    const [shipmentStats] = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN shipment_status = 'delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN shipment_status IN ('in_transit', 'picked_up', 'arrived', 'out_for_delivery') THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN shipment_status IN ('created', 'customs', 'picked_up') THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN shipment_status IN ('failed', 'returned') THEN 1 ELSE 0 END) as cancelled
      FROM shipments`
    );

    // Get revenue
    const [revenueStats] = await pool.query(
      `SELECT SUM(total_amount) as total_revenue FROM invoices WHERE payment_status = 'paid'`
    );

    // Get customer count
    const [customerStats] = await pool.query('SELECT COUNT(*) as total_customers FROM customers');

    // Get driver count
    const [driverStats] = await pool.query('SELECT COUNT(*) as total_drivers FROM drivers WHERE status = 'active'');

    // Get recent activity
    const [recentActivity] = await pool.query(
      `SELECT a.action, a.entity_type, a.entity_id, u.full_name, a.created_at
       FROM audit_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT 10`
    );

    res.json({
      success: true,
      stats: {
        shipments: shipmentStats[0],
        revenue: revenueStats[0],
        customers: customerStats[0],
        drivers: driverStats[0]
      },
      recentActivity
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
}

export async function getUsers(req, res) {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.getAll(limit, offset);

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    res.json({
      success: true,
      data: users.map(u => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role_name,
        status: u.status,
        last_login: u.last_login
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function createUser(req, res) {
  try {
    const { email, password, full_name, role_id } = req.body;

    if (!email || !password || !full_name || !role_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Only super_admin can create users
    if (req.session.userRole !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admin can create users' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const username = email.split('@')[0];
    const userId = await User.create({
      username,
      email,
      password,
      full_name,
      role_id
    });

    await logAudit(req.session.userId, 'CREATE', 'user', userId, null, { email, full_name }, req);

    res.json({
      success: true,
      message: 'User created successfully',
      user_id: userId
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function getAuditLogs(req, res) {
  try {
    const { page = 1, limit = 100, action, entity_type } = req.query;
    const offset = (page - 1) * limit;

    let query = 'SELECT a.*, u.full_name as user_name FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE 1=1';
    const params = [];

    if (action) {
      query += ' AND a.action = ?';
      params.push(action);
    }

    if (entity_type) {
      query += ' AND a.entity_type = ?';
      params.push(entity_type);
    }

    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [logs] = await pool.query(query, params);

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM audit_logs WHERE 1=1 ${action ? ' AND action = ?' : ''} ${entity_type ? ' AND entity_type = ?' : ''}`,
      [...params.slice(0, -2)]
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
}
