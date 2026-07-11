import pool from '../db.js';
import { Shipment } from '../models/Shipment.js';
import { sendEmail, getShipmentUpdateTemplate } from '../utils/email.js';
import { logAudit } from '../utils/logger.js';
import { validateCurrency } from '../utils/validators.js';

export async function createShipment(req, res) {
  try {
    const { shipmentData } = req.body;

    // Validate required fields
    const requiredFields = ['customer_id', 'sender_name', 'receiver_name', 'origin_country', 'destination_country', 'shipping_method'];
    for (const field of requiredFields) {
      if (!shipmentData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    const result = await Shipment.create(shipmentData);

    await logAudit(req.session.userId, 'CREATE', 'shipment', result.id, null, shipmentData, req);

    res.json({
      success: true,
      shipment: {
        id: result.id,
        tracking_number: result.tracking_number
      }
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    res.status(500).json({ error: 'Failed to create shipment' });
  }
}

export async function getShipments(req, res) {
  try {
    const { page = 1, limit = 50, status, customer_id } = req.query;
    const offset = (page - 1) * limit;

    const filters = {};
    if (status) filters.status = status;
    if (customer_id) filters.customer_id = customer_id;

    const shipments = await Shipment.getAll(limit, offset, filters);

    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM shipments');
    const total = countResult[0].total;

    res.json({
      success: true,
      data: shipments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
}

export async function getShipmentByTrackingNumber(req, res) {
  try {
    const { trackingNumber } = req.params;

    const shipment = await Shipment.findByTrackingNumber(trackingNumber);
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    // Get tracking events
    const [events] = await pool.query(
      'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_date DESC',
      [shipment.id]
    );

    // Get customer info
    const [customer] = await pool.query(
      'SELECT full_name, email, phone FROM customers WHERE id = ?',
      [shipment.customer_id]
    );

    res.json({
      success: true,
      shipment,
      customer: customer[0] || null,
      events
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
}

export async function updateShipmentStatus(req, res) {
  try {
    const { shipmentId } = req.params;
    const { status, location, description } = req.body;

    const [shipment] = await pool.query('SELECT * FROM shipments WHERE id = ?', [shipmentId]);
    if (!shipment.length) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    const currentShipment = shipment[0];

    // Add tracking event
    await pool.query(
      `INSERT INTO tracking_events (shipment_id, event_date, location, status, description, created_by)
       VALUES (?, NOW(), ?, ?, ?, ?)`,
      [shipmentId, location, status, description, req.session.userId]
    );

    // Update shipment status
    await Shipment.updateStatus(shipmentId, status);

    // Send notification email
    const templateHtml = getShipmentUpdateTemplate(currentShipment, status, location);
    await sendEmail(currentShipment.receiver_email, 'Shipment Status Update', templateHtml);

    await logAudit(req.session.userId, 'UPDATE', 'shipment', shipmentId, { status: currentShipment.shipment_status }, { status }, req);

    res.json({ success: true, message: 'Shipment status updated' });
  } catch (error) {
    console.error('Update shipment error:', error);
    res.status(500).json({ error: 'Failed to update shipment' });
  }
}

export async function deleteShipment(req, res) {
  try {
    const { shipmentId } = req.params;

    const [shipment] = await pool.query('SELECT * FROM shipments WHERE id = ?', [shipmentId]);
    if (!shipment.length) {
      return res.status(404).json({ error: 'Shipment not found' });
    }

    await pool.query('DELETE FROM shipments WHERE id = ?', [shipmentId]);
    await logAudit(req.session.userId, 'DELETE', 'shipment', shipmentId, shipment[0], null, req);

    res.json({ success: true, message: 'Shipment deleted' });
  } catch (error) {
    console.error('Delete shipment error:', error);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
}
