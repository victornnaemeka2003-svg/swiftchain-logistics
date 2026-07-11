import pool from '../db.js';
import { generateCustomerId } from '../utils/helpers.js';

export class Customer {
  static async create(customerData) {
    const customerId = generateCustomerId();

    const [result] = await pool.query(
      `INSERT INTO customers (
        customer_id, full_name, company_name, email, phone, address,
        city, state, country, postal_code, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId, customerData.full_name, customerData.company_name,
        customerData.email, customerData.phone, customerData.address,
        customerData.city, customerData.state, customerData.country,
        customerData.postal_code, customerData.notes
      ]
    );

    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async getAll(limit = 100, offset = 0, search = '') {
    let query = 'SELECT * FROM customers WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (full_name LIKE ? OR company_name LIKE ? OR email LIKE ?)';
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async update(id, customerData) {
    const updates = [];
    const values = [];

    Object.entries(customerData).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(value);
    });

    values.push(id);

    await pool.query(
      `UPDATE customers SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );
  }

  static async delete(id) {
    await pool.query('DELETE FROM customers WHERE id = ?', [id]);
  }
}
