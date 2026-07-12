import { query } from '../db.js';
import { logAudit } from '../utils/audit.js';

export const getAllDrivers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const drivers = await query(
      'SELECT * FROM drivers LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );

    const total = await query('SELECT COUNT(*) as count FROM drivers');
    res.json({ data: drivers, total: total[0].count, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};

export const getDriverById = async (req, res) => {
  try {
    const drivers = await query('SELECT * FROM drivers WHERE id = ?', [req.params.id]);
    if (drivers.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(drivers[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
};

export const createDriver = async (req, res) => {
  try {
    const { full_name, phone, email, vehicle_type, vehicle_registration, license_number } = req.body;
    const driver_id = `DRV-${Date.now()}`;

    await query(
      'INSERT INTO drivers (driver_id, full_name, phone, email, vehicle_type, vehicle_registration, license_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [driver_id, full_name, phone, email, vehicle_type, vehicle_registration, license_number]
    );

    await logAudit(req.session.userId, 'CREATE', 'drivers', null, req);
    res.status(201).json({ success: true, driver_id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create driver' });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const { full_name, phone, email, vehicle_type, vehicle_registration, license_number, status } = req.body;
    await query(
      'UPDATE drivers SET full_name = ?, phone = ?, email = ?, vehicle_type = ?, vehicle_registration = ?, license_number = ?, status = ? WHERE id = ?',
      [full_name, phone, email, vehicle_type, vehicle_registration, license_number, status, req.params.id]
    );
    await logAudit(req.session.userId, 'UPDATE', 'drivers', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update driver' });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    await query('DELETE FROM drivers WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'drivers', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};

export const getDriverShipments = async (req, res) => {
  try {
    const shipments = await query(
      'SELECT * FROM shipments WHERE assigned_driver_id = ? ORDER BY created_at DESC',
      [req.params.id]
    );
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver shipments' });
  }
};
