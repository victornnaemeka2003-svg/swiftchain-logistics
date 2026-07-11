import React, { useState, useEffect } from 'react';
import '../../styles/admin/Settings.css';

function Settings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings)
      });
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    }
  };

  return (
    <div className="management-container">
      <h1>Settings</h1>

      {saved && <div className="success-banner">Settings saved successfully!</div>}

      {loading ? (
        <div className="loading">Loading settings...</div>
      ) : (
        <div className="settings-form">
          <div className="settings-section">
            <h2>Company Information</h2>
            <div className="form-group">
              <label>Company Name</label>
              <input type="text" defaultValue="SwiftChain Logistics" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" defaultValue="info@swiftchain.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea defaultValue="123 Logistics St, Global City, GC 12345" />
            </div>
          </div>

          <div className="settings-section">
            <h2>Notification Settings</h2>
            <div className="form-group checkbox">
              <input type="checkbox" id="email-notifications" defaultChecked />
              <label htmlFor="email-notifications">Email Notifications</label>
            </div>
            <div className="form-group checkbox">
              <input type="checkbox" id="sms-notifications" />
              <label htmlFor="sms-notifications">SMS Notifications</label>
            </div>
          </div>

          <button onClick={handleSaveSettings} className="btn btn-primary btn-lg">Save Settings</button>
        </div>
      )}
    </div>
  );
}

export default Settings;
