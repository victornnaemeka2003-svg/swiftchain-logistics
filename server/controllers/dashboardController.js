import { query } from '../db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = {};

    const totalShipments = await query('SELECT COUNT(*) as count FROM shipments');
    stats.totalShipments = totalShipments[0].count;

    const deliveredShipments = await query(
      'SELECT COUNT(*) as count FROM shipments WHERE shipment_status = ?',
      ['Delivered']
    );
    stats.deliveredShipments = deliveredShipments[0].count;

    const activeShipments = await query(
      'SELECT COUNT(*) as count FROM shipments WHERE shipment_status IN (?, ?)',
      ['In Transit', 'Out for Delivery']
    );
    stats.activeShipments = activeShipments[0].count;

    const pendingShipments = await query(
      'SELECT COUNT(*) as count FROM shipments WHERE shipment_status = ?',
      ['Shipment Created']
    );
    stats.pendingShipments = pendingShipments[0].count;

    const cancelledShipments = await query(
      'SELECT COUNT(*) as count FROM shipments WHERE shipment_status = ?',
      ['Returned']
    );
    stats.cancelledShipments = cancelledShipments[0].count;

    const revenue = await query(
      'SELECT SUM(shipping_cost) as total FROM shipments WHERE payment_status = ?',
      ['Paid']
    );
    stats.revenue = revenue[0].total || 0;

    const customers = await query('SELECT COUNT(*) as count FROM customers');
    stats.customers = customers[0].count;

    const drivers = await query('SELECT COUNT(*) as count FROM drivers');
    stats.drivers = drivers[0].count;

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getRecentActivity = async (req, res) => {
  try {
    const activity = await query(
      'SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 20'
    );
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};

export const getRevenueChart = async (req, res) => {
  try {
    const data = await query(
      'SELECT DATE(created_at) as date, SUM(shipping_cost) as total FROM shipments WHERE payment_status = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) GROUP BY DATE(created_at) ORDER BY date',
      ['Paid']
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
};

export const getShipmentChart = async (req, res) => {
  try {
    const data = await query(
      'SELECT shipment_status as status, COUNT(*) as count FROM shipments GROUP BY shipment_status'
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment data' });
  }
};
