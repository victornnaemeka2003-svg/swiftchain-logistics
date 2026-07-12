import { query } from '../db.js';

export const getAllSettings = async (req, res) => {
  try {
    const settings = await query('SELECT * FROM settings');
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const getSettingByKey = async (req, res) => {
  try {
    const settings = await query('SELECT * FROM settings WHERE setting_key = ?', [req.params.key]);
    if (settings.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(settings[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

export const updateSetting = async (req, res) => {
  try {
    const { setting_key, setting_value, description } = req.body;
    await query(
      'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, description = ?',
      [setting_key, setting_value, description, setting_value, description]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

export const bulkUpdateSettings = async (req, res) => {
  try {
    const settings = req.body;
    for (const setting of settings) {
      await query(
        'INSERT INTO settings (setting_key, setting_value, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, description = ?',
        [setting.setting_key, setting.setting_value, setting.description || '', setting.setting_value, setting.description || '']
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
