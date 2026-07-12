export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  STAFF: 'Staff',
  VIEWER: 'Viewer'
};

export const SHIPMENT_STATUSES = {
  CREATED: 'Shipment Created',
  RECEIVED: 'Package Received',
  CUSTOMS: 'Customs Clearance',
  IN_TRANSIT: 'In Transit',
  HUB_ARRIVED: 'Arrived at Hub',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  FAILED: 'Delivery Failed',
  RETURNED: 'Returned'
};

export const PAYMENT_STATUSES = {
  PENDING: 'Pending',
  PAID: 'Paid',
  FAILED: 'Failed',
  CANCELLED: 'Cancelled'
};

export const SHIPPING_METHODS = {
  AIR: 'Air Freight',
  OCEAN: 'Ocean Freight',
  ROAD: 'Road Freight',
  EXPRESS: 'Express Delivery',
  WAREHOUSE: 'Warehousing'
};
