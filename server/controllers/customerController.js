import pool from '../db.js';
import { Customer } from '../models/Customer.js';
import { logAudit } from '../utils/logger.js';
import { validateEmail, validatePhone, validateAddress } from '../utils/validators.js';

export async function createCustomer(req, res) {
  try {
    const { full_name, company_name, email, phone, address, city, state, country, postal_code, notes } = req.body;

    // Validation
    if (!full_name || !email || !phone || !address || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    if (!validateAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }

    const customerId = await Customer.create({
      full_name,
      company_name,
      email,
      phone,
      address,
      city,
      state,
      country,
      postal_code,
      notes
    });

    await logAudit(req.session.userId, 'CREATE', 'customer', customerId, null, { full_name, email }, req);

    res.json({
      success: true,
      message: 'Customer created successfully',
      customer_id: customerId
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

export async function getCustomers(req, res) {
  try {
    const { page = 1, limit = 50, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const customers = await Customer.getAll(limit, offset, search);

    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM customers WHERE 1=1' + (search ? ' AND (full_name LIKE ? OR email LIKE ?)' : ''),
      search ? [`%${search}%`, `%${search}%`] : []
    );
    const total = countResult[0].total;

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

export async function getCustomer(req, res) {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get customer shipments
    const [shipments] = await pool.query(
      'SELECT id, shipment_id, tracking_number, shipment_status, created_at FROM shipments WHERE customer_id = ? ORDER BY created_at DESC LIMIT 10',
      [customerId]
    );

    res.json({
      success: true,
      customer,
      shipments
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

export async function updateCustomer(req, res) {
  try {
    const { customerId } = req.params;
    const updateData = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    if (updateData.email && !validateEmail(updateData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    await Customer.update(customerId, updateData);
    await logAudit(req.session.userId, 'UPDATE', 'customer', customerId, customer, updateData, req);

    res.json({ success: true, message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}

export async function deleteCustomer(req, res) {
  try {
    const { customerId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await Customer.delete(customerId);
    await logAudit(req.session.userId, 'DELETE', 'customer', customerId, customer, null, req);

    res.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}
