import { query } from '../db.js';
import { logAudit } from '../utils/audit.js';

export const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const offset = (page - 1) * limit;

    let invoices;
    if (status) {
      invoices = await query(
        'SELECT * FROM invoices WHERE payment_status = ? LIMIT ? OFFSET ?',
        [status, parseInt(limit), offset]
      );
    } else {
      invoices = await query(
        'SELECT * FROM invoices LIMIT ? OFFSET ?',
        [parseInt(limit), offset]
      );
    }

    const total = await query('SELECT COUNT(*) as count FROM invoices');
    res.json({ data: invoices, total: total[0].count, page, limit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoices = await query('SELECT * FROM invoices WHERE id = ?', [req.params.id]);
    if (invoices.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoices[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const { customer_id, shipment_id, amount, tax_amount, payment_method, invoice_date, due_date, notes } = req.body;
    const invoice_number = `INV-${Date.now()}`;
    const total_amount = parseFloat(amount) + parseFloat(tax_amount || 0);

    await query(
      'INSERT INTO invoices (invoice_number, customer_id, shipment_id, amount, tax_amount, total_amount, payment_method, invoice_date, due_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [invoice_number, customer_id, shipment_id, amount, tax_amount || 0, total_amount, payment_method, invoice_date, due_date, notes]
    );

    await logAudit(req.session.userId, 'CREATE', 'invoices', null, req);
    res.status(201).json({ success: true, invoice_number });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { amount, tax_amount, payment_method, payment_status, notes } = req.body;
    const total_amount = parseFloat(amount) + parseFloat(tax_amount || 0);

    await query(
      'UPDATE invoices SET amount = ?, tax_amount = ?, total_amount = ?, payment_method = ?, payment_status = ?, notes = ? WHERE id = ?',
      [amount, tax_amount || 0, total_amount, payment_method, payment_status, notes, req.params.id]
    );

    await logAudit(req.session.userId, 'UPDATE', 'invoices', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

export const printInvoice = async (req, res) => {
  try {
    // TODO: Generate PDF
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to print invoice' });
  }
};

export const recordPayment = async (req, res) => {
  try {
    const { amount, payment_method, transaction_id } = req.body;

    await query(
      'INSERT INTO payments (invoice_id, amount, payment_method, transaction_id, status) VALUES (?, ?, ?, ?, ?)',
      [req.params.id, amount, payment_method, transaction_id, 'Completed']
    );

    await query(
      'UPDATE invoices SET payment_status = ? WHERE id = ?',
      ['Paid', req.params.id]
    );

    await logAudit(req.session.userId, 'PAYMENT', 'invoices', req.params.id, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record payment' });
  }
};
