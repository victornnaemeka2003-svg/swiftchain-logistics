import { query } from '../db.js';
import { logAudit } from '../utils/audit.js';

export const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await query('SELECT * FROM warehouses ORDER BY warehouse_name');
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
};

export const getWarehouseById = async (req, res) => {
  try {
    const warehouses = await query('SELECT * FROM warehouses WHERE id = ?', [req.params.id]);
    if (warehouses.length === 0) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }
    res.json(warehouses[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch warehouse' });
  }
};

export const createWarehouse = async (req, res) => {
  try {
    const { warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity } = req.body;
    const warehouse_id = `WH-${Date.now()}`;

    await query(
      'INSERT INTO warehouses (warehouse_id, warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [warehouse_id, warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity]
    );

    await logAudit(req.session.userId, 'CREATE', 'warehouses', null, req);
    res.status(201).json({ success: true, warehouse_id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create warehouse' });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity } = req.body;
    await query(
      'UPDATE warehouses SET warehouse_name = ?, location = ?, city = ?, state = ?, country = ?, contact_person = ?, contact_phone = ?, total_capacity = ? WHERE id = ?',
      [warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity, req.params.id]
    );
    await logAudit(req.session.userId, 'UPDATE', 'warehouses', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update warehouse' });
  }
};

export const deleteWarehouse = async (req, res) => {
  try {
    await query('DELETE FROM warehouses WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'warehouses', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete warehouse' });
  }
};

export const getWarehouseInventory = async (req, res) => {
  try {
    const inventory = await query(
      'SELECT * FROM inventory WHERE warehouse_id = ? ORDER BY item_name',
      [req.params.id]
    );
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
};

export const addInventory = async (req, res) => {
  try {
    const { item_name, quantity, unit_price, location_code } = req.body;
    await query(
      'INSERT INTO inventory (warehouse_id, item_name, quantity, unit_price, location_code) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, item_name, quantity, unit_price, location_code]
    );
    await logAudit(req.session.userId, 'CREATE', 'inventory', null, req);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add inventory' });
  }
};
