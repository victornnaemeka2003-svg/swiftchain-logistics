import { query } from '../db.js';
import { logAudit } from '../utils/audit.js';

export const getAllTrackingEvents = async (req, res) => {
  try {
    const events = await query(
      'SELECT * FROM tracking_events ORDER BY event_date DESC LIMIT 100'
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking events' });
  }
};

export const getTrackingEventById = async (req, res) => {
  try {
    const events = await query('SELECT * FROM tracking_events WHERE id = ?', [req.params.id]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Tracking event not found' });
    }
    res.json(events[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking event' });
  }
};

export const getShipmentTrackingEvents = async (req, res) => {
  try {
    const events = await query(
      'SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_date DESC',
      [req.params.shipmentId]
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracking events' });
  }
};

export const createTrackingEvent = async (req, res) => {
  try {
    const { shipment_id, event_date, location, status, description } = req.body;

    await query(
      'INSERT INTO tracking_events (shipment_id, event_date, location, status, description, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [shipment_id, event_date, location, status, description, req.session.userId]
    );

    // Update shipment status
    await query('UPDATE shipments SET shipment_status = ? WHERE id = ?', [status, shipment_id]);

    await logAudit(req.session.userId, 'CREATE', 'tracking_events', null, req);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tracking event' });
  }
};

export const updateTrackingEvent = async (req, res) => {
  try {
    const { event_date, location, status, description } = req.body;
    await query(
      'UPDATE tracking_events SET event_date = ?, location = ?, status = ?, description = ? WHERE id = ?',
      [event_date, location, status, description, req.params.id]
    );
    await logAudit(req.session.userId, 'UPDATE', 'tracking_events', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update tracking event' });
  }
};

export const deleteTrackingEvent = async (req, res) => {
  try {
    await query('DELETE FROM tracking_events WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'tracking_events', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete tracking event' });
  }
};
