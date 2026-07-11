import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Track from './pages/public/Track';
import Pricing from './pages/public/Pricing';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';
import Careers from './pages/public/Careers';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsConditions from './pages/public/TermsConditions';

// Auth Pages
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import CustomerManagement from './pages/admin/CustomerManagement';
import ShipmentManagement from './pages/admin/ShipmentManagement';
import UserManagement from './pages/admin/UserManagement';
import ReportGeneration from './pages/admin/ReportGeneration';
import AuditLogs from './pages/admin/AuditLogs';
import Settings from './pages/admin/Settings';

import './styles/App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/track/:trackingNumber" element={<Track />} />
        <Route path="/track" element={<Track />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />

        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/admin" /> : <Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin Routes */}
        {user ? (
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/customers" element={<CustomerManagement />} />
            <Route path="/admin/shipments" element={<ShipmentManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/reports" element={<ReportGeneration />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        ) : null}

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
