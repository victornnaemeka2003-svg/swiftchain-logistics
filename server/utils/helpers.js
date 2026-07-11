import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

export function generateTrackingNumber() {
  const prefix = 'SC';
  const timestamp = Date.now().toString().slice(-8);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function generateShipmentId() {
  return `SHIP-${uuidv4().split('-')[0].toUpperCase()}`;
}

export function generateInvoiceNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `INV-${timestamp}-${random}`;
}

export function generateCustomerId() {
  return `CUST-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

export function generatePaymentId() {
  return `PAY-${uuidv4().split('-')[0].toUpperCase()}`;
}

export function calculateDaysDifference(startDate, endDate) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((endDate - startDate) / oneDay);
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function sanitizeInput(input) {
  return input.trim().replace(/[<>"']/g, '');
}
