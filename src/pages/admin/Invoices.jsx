import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customer_id: '',
    shipment_id: '',
    amount: '',
    tax_amount: '',
    payment_method: '',
    payment_status: 'Pending',
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, [page, status]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);
      if (status) params.append('status', status);
      const response = await api.get(`/invoices?${params.toString()}`);
      setInvoices(response.data || []);
    } catch (err) {
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (invoice = null) => {
    if (invoice) {
      setEditingId(invoice.id);
      setFormData(invoice);
    } else {
      setEditingId(null);
      setFormData({
        customer_id: '',
        shipment_id: '',
        amount: '',
        tax_amount: '',
        payment_method: '',
        payment_status: 'Pending',
        notes: ''
      });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/invoices/${editingId}`, formData);
      } else {
        await api.post('/invoices', formData);
      }
      setModalOpen(false);
      fetchInvoices();
    } catch (err) {
      setError('Failed to save invoice');
    }
  };

  const columns = [
    { key: 'invoice_number', label: 'Invoice #' },
    { key: 'customer_id', label: 'Customer ID' },
    { key: 'amount', label: 'Amount', render: (amount) => `$${amount}` },
    { key: 'payment_method', label: 'Method' },
    {
      key: 'payment_status',
      label: 'Status',
      render: (status) => (
        <span className={`px-2 py-1 rounded text-white text-sm ${
          status === 'Paid' ? 'bg-green-600' :
          status === 'Pending' ? 'bg-orange-600' :
          'bg-red-600'
        }`}>
          {status}
        </span>
      )
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>New Invoice</Button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      <Card className="mb-6">
        <div className="mb-4">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading invoices...</div>
        ) : (
          <Table
            columns={columns}
            data={invoices}
            onEdit={handleOpenModal}
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Invoice' : 'New Invoice'}
      >
        <div className="space-y-4">
          <Input
            label="Customer ID"
            value={formData.customer_id}
            onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
            required
          />
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
          />
          <Input
            label="Tax Amount"
            type="number"
            value={formData.tax_amount}
            onChange={(e) => setFormData({...formData, tax_amount: e.target.value})}
          />
          <Input
            label="Payment Method"
            value={formData.payment_method}
            onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={formData.payment_status}
              onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Pending</option>
              <option>Paid</option>
              <option>Failed</option>
            </select>
          </div>
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Invoices;
