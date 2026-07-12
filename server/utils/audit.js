import { query } from '../db.js';

export const logAudit = async (userId, action, entityType, entityId, req) => {
  try {
    await query(
      'INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        action,
        entityType,
        entityId,
        req.ip || 'unknown',
        req.get('user-agent') || 'unknown'
      ]
    );
  } catch (error) {
    console.error('Audit log error:', error);
  }
};
