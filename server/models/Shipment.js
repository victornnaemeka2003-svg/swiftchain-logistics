import pool from '../db.js';
import { generateTrackingNumber, generateShipmentId } from '../utils/helpers.js';

export class Shipment {
  static async create(shipmentData) {
    const trackingNumber = generateTrackingNumber();
    const shipmentId = generateShipmentId();

    const [result] = await pool.query(
      `INSERT INTO shipments (
        shipment_id, tracking_number, customer_id, sender_name, sender_email, sender_phone,
        sender_address, receiver_name, receiver_email, receiver_phone, receiver_address,
        origin_city, origin_country, destination_city, destination_country, shipping_method,
        weight, dimensions, package_type, declared_value, shipping_cost
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        shipmentId, trackingNumber, shipmentData.customer_id, shipmentData.sender_name,
        shipmentData.sender_email, shipmentData.sender_phone, shipmentData.sender_address,
        shipmentData.receiver_name, shipmentData.receiver_email, shipmentData.receiver_phone,
        shipmentData.receiver_address, shipmentData.origin_city, shipmentData.origin_country,
        shipmentData.destination_city, shipmentData.destination_country, shipmentData.shipping_method,
        shipmentData.weight, shipmentData.dimensions, shipmentData.package_type,
        shipmentData.declared_value, shipmentData.shipping_cost
      ]
    );

    return { id: result.insertId, tracking_number: trackingNumber };
  }

  static async findByTrackingNumber(trackingNumber) {
    const [rows] = await pool.query(
      'SELECT * FROM shipments WHERE tracking_number = ?',
      [trackingNumber]
    );
    return rows[0] || null;
  }

  static async getAll(limit = 100, offset = 0, filters = {}) {
    let query = 'SELECT * FROM shipments WHERE 1=1';
    const params = [];

    if (filters.status) {
      query += ' AND shipment_status = ?';
      params.push(filters.status);
    }

    if (filters.customer_id) {
      query += ' AND customer_id = ?';
      params.push(filters.customer_id);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async updateStatus(shipmentId, status) {
    await pool.query(
      'UPDATE shipments SET shipment_status = ?, updated_at = NOW() WHERE id = ?',
      [status, shipmentId]
    );
  }
}
