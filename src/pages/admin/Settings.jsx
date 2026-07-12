import React, { useState, useEffect } from 'react';
import * as api from '../../api/client';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await api.get('/settings');
      const settingsMap = {};
      response.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        setting_key: key,
        setting_value: value
      }));
      await api.post('/settings/bulk', settingsArray);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const settingsGroups = [
    {
      title: 'Company Information',
      items: [
        { key: 'company_name', label: 'Company Name' },
        { key: 'company_email', label: 'Company Email' },
        { key: 'company_phone', label: 'Company Phone' },
        { key: 'company_address', label: 'Company Address' }
      ]
    },
    {
      title: 'Social Media',
      items: [
        { key: 'social_facebook', label: 'Facebook' },
        { key: 'social_twitter', label: 'Twitter' },
        { key: 'social_linkedin', label: 'LinkedIn' },
        { key: 'social_instagram', label: 'Instagram' }
      ]
    }
  ];

  if (loading) return <div className="text-center py-8">Loading settings...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {saved && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Settings saved successfully!
        </div>
      )}

      {settingsGroups.map((group) => (
        <Card key={group.title} className="mb-6">
          <h2 className="text-2xl font-bold mb-4">{group.title}</h2>
          <div className="space-y-4">
            {group.items.map((item) => (
              <Input
                key={item.key}
                label={item.label}
                value={settings[item.key] || ''}
                onChange={(e) => setSettings({...settings, [item.key]: e.target.value})}
              />
            ))}
          </div>
        </Card>
      ))}

      <div className="flex gap-2">
        <Button variant="primary" onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default Settings;
