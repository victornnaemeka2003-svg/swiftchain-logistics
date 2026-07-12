import { query } from '../db.js';
import { logAudit } from '../utils/audit.js';

export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    let customers;
    if (search) {
      customers = await query(
        'SELECT * FROM customers WHERE full_name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?',
        [`%${search}%`, `%${search}%`, parseInt(limit), offset]
      );
    } else {
      customers = await query(
        'SELECT * FROM customers LIMIT ? OFFSET ?',
        [parseInt(limit), offset]
      );
    }

    const total = await query('SELECT COUNT(*) as count FROM customers');
    res.json({ data: customers, total: total[0].count, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customers = await query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customers[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { full_name, company_name, email, phone, address, city, state, country, postal_code, notes } = req.body;
    const customer_id = `CUST-${Date.now()}`;

    await query(
      'INSERT INTO customers (customer_id, full_name, company_name, email, phone, address, city, state, country, postal_code, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [customer_id, full_name, company_name, email, phone, address, city, state, country, postal_code, notes]
    );

    await logAudit(req.session.userId, 'CREATE', 'customers', null, req);
    res.status(201).json({ success: true, customer_id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create customer' });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const { full_name, company_name, email, phone, address, city, state, country, postal_code, notes } = req.body;
    await query(
      'UPDATE customers SET full_name = ?, company_name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, country = ?, postal_code = ?, notes = ? WHERE id = ?',
      [full_name, company_name, email, phone, address, city, state, country, postal_code, notes, req.params.id]
    );
    await logAudit(req.session.userId, 'UPDATE', 'customers', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update customer' });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    await logAudit(req.session.userId, 'DELETE', 'customers', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete customer' });
  }
};

export const getCustomerShipments = async (req, res) => {
  try {
    const shipments = await query('SELECT * FROM shipments WHERE customer_id = ? ORDER BY created_at DESC', [req.params.id]);
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer shipments' });
  }
};

export const getCustomerProfile = async (req, res) => {
  try {
    const customers = await query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (customers.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const shipmentStats = await query(
      'SELECT COUNT(*) as total, SUM(CASE WHEN shipment_status = ? THEN 1 ELSE 0 END) as delivered FROM shipments WHERE customer_id = ?',
      ['Delivered', req.params.id]
    );

    res.json({
      ...customers[0],
      shipmentStats: shipmentStats[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer profile' });
  }
};
