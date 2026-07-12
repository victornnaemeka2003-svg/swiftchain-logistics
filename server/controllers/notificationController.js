import { query } from '../db.js';

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.userId]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const result = await query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [req.session.userId]
    );
    res.json({ unreadCount: result[0].count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await query('UPDATE notifications SET is_read = TRUE WHERE user_id = ?', [req.session.userId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    await query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
