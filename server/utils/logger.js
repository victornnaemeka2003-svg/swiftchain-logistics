import pool from '../db.js';

export async function logAudit(userId, action, entityType, entityId, oldValues = null, newValues = null, req = null) {
  try {
    const ipAddress = req?.ip || 'unknown';
    const userAgent = req?.get('user-agent') || 'unknown';

    await pool.query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, action, entityType, entityId, JSON.stringify(oldValues), JSON.stringify(newValues), ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
}
