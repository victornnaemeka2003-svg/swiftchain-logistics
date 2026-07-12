import { query } from '../db.js';
import { generateTrackingNumber, generateShipmentId } from '../utils/helpers.js';
import { logAudit } from '../utils/audit.js';

export const getAllShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', search = '' } = req.query;
    const offset = (page - 1) * limit;

    let shipments;
    let countQuery = 'SELECT COUNT(*) as count FROM shipments WHERE 1=1';
    let whereClause = '';
    const params = [];

    if (status) {
      whereClause += ' AND shipment_status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (tracking_number LIKE ? OR shipment_id LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    shipments = await query(
      `SELECT * FROM shipments WHERE 1=1 ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );

    const total = await query(countQuery + whereClause, params);
    res.json({ data: shipments, total: total[0].count, page, limit });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
};

export const getShipmentById = async (req, res) => {
  try {
    const shipments = await query('SELECT * FROM shipments WHERE id = ?', [req.params.id]);
    if (shipments.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
};

export const getShipmentByTracking = async (req, res) => {
  try {
    const shipments = await query('SELECT * FROM shipments WHERE tracking_number = ?', [req.params.trackingNumber]);
    if (shipments.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    res.json(shipments[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
};

export const createShipment = async (req, res) => {
  try {
    const {
      customer_id, sender_name, sender_email, sender_phone, sender_address,
      receiver_name, receiver_email, receiver_phone, receiver_address,
      origin, destination, shipping_method, weight, weight_unit,
      dimensions_length, dimensions_width, dimensions_height, dimension_unit,
      package_type, declared_value, currency, shipping_cost, estimated_delivery_date, notes
    } = req.body;

    const shipment_id = generateShipmentId();
    const tracking_number = generateTrackingNumber();

    await query(
      `INSERT INTO shipments (
        shipment_id, tracking_number, customer_id, sender_name, sender_email, sender_phone,
        sender_address, receiver_name, receiver_email, receiver_phone, receiver_address,
        origin, destination, shipping_method, weight, weight_unit, dimensions_length,
        dimensions_width, dimensions_height, dimension_unit, package_type, declared_value,
        currency, shipping_cost, estimated_delivery_date, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shipment_id, tracking_number, customer_id, sender_name, sender_email, sender_phone,
        sender_address, receiver_name, receiver_email, receiver_phone, receiver_address,
        origin, destination, shipping_method, weight, weight_unit, dimensions_length,
        dimensions_width, dimensions_height, dimension_unit, package_type, declared_value,
        currency, shipping_cost, estimated_delivery_date, notes
      ]
    );

    await logAudit(req.session.userId, 'CREATE', 'shipments', null, req);
    res.status(201).json({ success: true, shipment_id, tracking_number });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
};

export const updateShipment = async (req, res) => {
  try {
    const updates = req.body;
    const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(req.params.id);

    await query(`UPDATE shipments SET ${fields} WHERE id = ?`, values);
    await logAudit(req.session.userId, 'UPDATE', 'shipments', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shipment' });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    await query('DELETE FROM shipments WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'shipments', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
};

export const duplicateShipment = async (req, res) => {
  try {
    const shipments = await query('SELECT * FROM shipments WHERE id = ?', [req.params.id]);
    if (shipments.length === 0) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const shipment = shipments[0];
    const new_shipment_id = generateShipmentId();
    const new_tracking_number = generateTrackingNumber();

    const keys = Object.keys(shipment).filter(k => k !== 'id' && k !== 'shipment_id' && k !== 'tracking_number');
    const values = keys.map(k => shipment[k]);
    values.unshift(new_shipment_id, new_tracking_number);

    const placeholders = ['?', '?', ...keys.map(() => '?')].join(', ');
    const columns = ['shipment_id', 'tracking_number', ...keys].join(', ');

    await query(`INSERT INTO shipments (${columns}) VALUES (${placeholders})`, values);
    await logAudit(req.session.userId, 'DUPLICATE', 'shipments', req.params.id, req);

    res.json({ success: true, new_shipment_id, new_tracking_number });
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate shipment' });
  }
};

export const uploadShipmentDocuments = async (req, res) => {
  try {
    // TODO: Handle file uploads
    res.json({ success: true, message: 'Documents uploaded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload documents' });
  }
};

export const printShippingLabel = async (req, res) => {
  try {
    // TODO: Generate PDF
    res.json({ success: true, message: 'Label generated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate label' });
  }
};

export const generateInvoice = async (req, res) => {
  try {
    // TODO: Generate invoice
    res.json({ success: true, message: 'Invoice generated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
};
