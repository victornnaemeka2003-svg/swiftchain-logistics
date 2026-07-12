export const CREATE_TABLES_SQL = `
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('Super Admin', 'Admin', 'Manager', 'Staff', 'Viewer') DEFAULT 'Viewer',
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(role)
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(customer_id),
  INDEX(email)
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driver_id VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  vehicle_type VARCHAR(100),
  vehicle_registration VARCHAR(50),
  license_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
  assigned_shipments INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(driver_id),
  INDEX(status)
);

-- Warehouses Table
CREATE TABLE IF NOT EXISTS warehouses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  warehouse_id VARCHAR(50) UNIQUE NOT NULL,
  warehouse_name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  contact_person VARCHAR(255),
  contact_phone VARCHAR(20),
  total_capacity DECIMAL(10, 2),
  current_occupancy DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(warehouse_id)
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  warehouse_id INT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 0,
  unit_price DECIMAL(10, 2),
  location_code VARCHAR(50),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  INDEX(warehouse_id)
);

-- Shipments Table
CREATE TABLE IF NOT EXISTS shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shipment_id VARCHAR(50) UNIQUE NOT NULL,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  sender_phone VARCHAR(20),
  sender_address TEXT,
  receiver_name VARCHAR(255) NOT NULL,
  receiver_email VARCHAR(255),
  receiver_phone VARCHAR(20),
  receiver_address TEXT NOT NULL,
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  shipping_method ENUM('Air Freight', 'Ocean Freight', 'Road Freight', 'Express Delivery', 'Warehousing'),
  weight DECIMAL(10, 2),
  weight_unit VARCHAR(10),
  dimensions_length DECIMAL(10, 2),
  dimensions_width DECIMAL(10, 2),
  dimensions_height DECIMAL(10, 2),
  dimension_unit VARCHAR(10),
  package_type VARCHAR(100),
  declared_value DECIMAL(15, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  shipping_cost DECIMAL(15, 2),
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Cancelled') DEFAULT 'Pending',
  shipment_status ENUM('Shipment Created', 'Package Received', 'Customs Clearance', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'Delivery Failed', 'Returned') DEFAULT 'Shipment Created',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  estimated_delivery_date DATETIME,
  actual_delivery_date DATETIME,
  assigned_driver_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
  INDEX(shipment_id),
  INDEX(tracking_number),
  INDEX(customer_id),
  INDEX(shipment_status),
  INDEX(payment_status)
);

-- Tracking Events Table
CREATE TABLE IF NOT EXISTS tracking_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT NOT NULL,
  event_date DATETIME NOT NULL,
  location VARCHAR(255),
  status ENUM('Shipment Created', 'Package Received', 'Customs Clearance', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'Delivery Failed', 'Returned') NOT NULL,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(shipment_id),
  INDEX(event_date)
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  shipment_id INT,
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status ENUM('Pending', 'Paid', 'Failed', 'Cancelled') DEFAULT 'Pending',
  invoice_date DATETIME,
  due_date DATETIME,
  paid_date DATETIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE SET NULL,
  INDEX(invoice_number),
  INDEX(customer_id),
  INDEX(payment_status)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id INT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('Pending', 'Completed', 'Failed') DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  INDEX(invoice_id),
  INDEX(transaction_id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX(user_id),
  INDEX(is_read)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(100),
  entity_type VARCHAR(100),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(entity_type),
  INDEX(user_id),
  INDEX(created_at)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value LONGTEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(setting_key)
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(created_at)
);

-- Quote Requests Table
CREATE TABLE IF NOT EXISTS quote_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  shipping_method VARCHAR(100),
  weight DECIMAL(10, 2),
  dimensions_length DECIMAL(10, 2),
  dimensions_width DECIMAL(10, 2),
  dimensions_height DECIMAL(10, 2),
  package_description TEXT,
  special_requirements TEXT,
  quote_amount DECIMAL(15, 2),
  status ENUM('Pending', 'Quoted', 'Accepted', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(email),
  INDEX(status)
);

-- News/Blog Table
CREATE TABLE IF NOT EXISTS news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  author_id INT,
  featured_image VARCHAR(255),
  category VARCHAR(100),
  status ENUM('Draft', 'Published') DEFAULT 'Draft',
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX(slug),
  INDEX(status)
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  customer_image VARCHAR(255),
  testimonial_text TEXT NOT NULL,
  rating INT,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(status)
);

-- FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_position INT DEFAULT 0,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(category),
  INDEX(status)
);

-- Partners Table
CREATE TABLE IF NOT EXISTS partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partner_name VARCHAR(255) NOT NULL,
  partner_logo VARCHAR(255),
  partner_website VARCHAR(255),
  description TEXT,
  category VARCHAR(100),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(category)
);
`;
