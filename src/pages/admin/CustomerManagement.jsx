import React, { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { apiPost, apiDelete, apiPut } from '../../api/client';
import '../../styles/admin/Management.css';

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, [search, page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customers/list?page=${page}&limit=50&search=${search}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiPut(`/customers/${editingId}`, formData);
      } else {
        await apiPost('/customers/create', formData);
      }
      setShowForm(false);
      setFormData({
        full_name: '',
        company_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        notes: ''
      });
      setEditingId(null);
      fetchCustomers();
    } catch (error) {
      alert('Error saving customer: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await apiDelete(`/customers/${id}`);
        fetchCustomers();
      } catch (error) {
        alert('Error deleting customer: ' + error.message);
      }
    }
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      full_name: '',
      company_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      notes: ''
    });
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Customer Management</h1>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">+ Add Customer</button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Form */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.company_name}
                  onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="Address *"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Country *"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                />
              </div>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows="3"
              />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <tr key={customer.id}>
                    <td>{customer.full_name}</td>
                    <td>{customer.company_name || '-'}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.country}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(customer)} className="btn btn-sm btn-info">Edit</button>
                      <button onClick={() => handleDelete(customer.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
