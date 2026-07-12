import { query } from '../server/db.js';
import { hashPassword, generateTrackingNumber } from '../server/utils/helpers.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create Super Admin User
    const hashedPassword = await hashPassword('Admin@123456');
    await query(
      `INSERT INTO users (email, password, full_name, role, status) 
       VALUES (?, ?, ?, ?, ?)`,
      ['admin@swiftchain.com', hashedPassword, 'Super Admin', 'Super Admin', 'Active']
    );

    // Create Admin User
    const adminPassword = await hashPassword('Admin@12345');
    await query(
      `INSERT INTO users (email, password, full_name, role, status) 
       VALUES (?, ?, ?, ?, ?)`,
      ['manager@swiftchain.com', adminPassword, 'John Manager', 'Admin', 'Active']
    );

    // Create sample customers
    const customers = [
      ['CUST001', 'Acme Corporation', 'Acme Corp', 'contact@acme.com', '+1234567890', '123 Business St', 'New York', 'NY', 'USA', '10001'],
      ['CUST002', 'Global Trade Inc', 'GTI', 'info@globaltrade.com', '+1987654321', '456 Commerce Ave', 'Los Angeles', 'CA', 'USA', '90001'],
      ['CUST003', 'Tech Solutions Ltd', 'TSL', 'support@techsol.com', '+442071838750', '789 Innovation Drive', 'London', 'LDN', 'UK', 'SW1A']
    ];

    for (const customer of customers) {
      await query(
        `INSERT INTO customers (customer_id, full_name, company_name, email, phone, address, city, state, country, postal_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        customer
      );
    }

    // Create sample drivers
    const drivers = [
      ['DRV001', 'James Smith', '+1234567890', 'james@swiftchain.com', 'Truck', 'ABC123XYZ', 'DL12345', 'Active'],
      ['DRV002', 'Maria Garcia', '+1987654321', 'maria@swiftchain.com', 'Van', 'XYZ789ABC', 'DL54321', 'Active'],
      ['DRV003', 'Ahmed Hassan', '+441234567890', 'ahmed@swiftchain.com', 'Truck', 'DEF456GHI', 'DL99999', 'Active']
    ];

    for (const driver of drivers) {
      await query(
        `INSERT INTO drivers (driver_id, full_name, phone, email, vehicle_type, vehicle_registration, license_number, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        driver
      );
    }

    // Create sample warehouses
    const warehouses = [
      ['WH001', 'Central Hub - New York', '123 Logistics Way', 'New York', 'NY', 'USA', 'David Lee', '+1234567890', 50000, 25000],
      ['WH002', 'West Coast Hub - LA', '456 Freight Street', 'Los Angeles', 'CA', 'USA', 'Sarah Wilson', '+1987654321', 40000, 18000],
      ['WH003', 'European Hub - London', '789 Cargo Lane', 'London', 'LDN', 'UK', 'Robert Brown', '+441234567890', 35000, 15000]
    ];

    for (const warehouse of warehouses) {
      await query(
        `INSERT INTO warehouses (warehouse_id, warehouse_name, location, city, state, country, contact_person, contact_phone, total_capacity, current_occupancy) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        warehouse
      );
    }

    // Create sample shipments
    const shipments = [
      ['SHP-001', generateTrackingNumber(), 1, 'John Doe', 'john@acme.com', '+1111111111', '123 Sender St', 'Jane Smith', 'jane@receiver.com', '+2222222222', '456 Receiver Ave', 'New York', 'Los Angeles', 'Road Freight', 50, 'kg', 40, 30, 20, 'cm', 'Box', 5000, 'USD', 450, 'Paid', 'In Transit', '2026-07-15'],
      ['SHP-002', generateTrackingNumber(), 2, 'Tom Brown', 'tom@globaltrade.com', '+3333333333', '789 Origin Blvd', 'Lisa Chen', 'lisa@dest.com', '+4444444444', '321 Destination St', 'Los Angeles', 'Miami', 'Air Freight', 25, 'kg', 30, 25, 15, 'cm', 'Box', 8000, 'USD', 1200, 'Paid', 'Shipment Created', '2026-07-20'],
      ['SHP-003', generateTrackingNumber(), 3, 'Emma Wilson', 'emma@techsol.com', '+441111111111', '555 UK Origin', 'Michael O\'Brien', 'michael@irish.com', '+353123456789', '777 Dublin St', 'London', 'Dublin', 'Ocean Freight', 500, 'kg', 200, 150, 100, 'cm', 'Pallet', 15000, 'GBP', 3500, 'Pending', 'Shipment Created', '2026-08-10']
    ];

    for (const shipment of shipments) {
      await query(
        `INSERT INTO shipments (shipment_id, tracking_number, customer_id, sender_name, sender_email, sender_phone, sender_address, receiver_name, receiver_email, receiver_phone, receiver_address, origin, destination, shipping_method, weight, weight_unit, dimensions_length, dimensions_width, dimensions_height, dimension_unit, package_type, declared_value, currency, shipping_cost, payment_status, shipment_status, estimated_delivery_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        shipment
      );
    }

    // Create sample FAQs
    const faqs = [
      ['How long does shipping take?', 'Shipping times vary based on distance and method. Air freight typically takes 3-5 days, ocean freight 15-30 days, and road freight 5-10 days.', 'Shipping', 1, 'Active'],
      ['How can I track my shipment?', 'Use your tracking number on our website or call our customer service team. You\'ll receive real-time updates via email.', 'Tracking', 2, 'Active'],
      ['What payment methods do you accept?', 'We accept credit cards, bank transfers, and digital wallets. All payments are secure and encrypted.', 'Payment', 3, 'Active'],
      ['Can I cancel or modify my shipment?', 'Cancellations and modifications are possible before the shipment leaves our facility. Contact us immediately for assistance.', 'Shipments', 4, 'Active']
    ];

    for (const faq of faqs) {
      await query(
        `INSERT INTO faqs (question, answer, category, order_position, status) 
         VALUES (?, ?, ?, ?, ?)`,
        faq
      );
    }

    // Create sample testimonials
    const testimonials = [
      ['Acme Corporation', 'Acme Corp', null, 'SwiftChain has been instrumental in our supply chain success. Reliable, fast, and professional!', 5, 'Approved'],
      ['Global Trade Inc', 'GTI', null, 'Outstanding service! They handle our international shipments with precision and care.', 5, 'Approved'],
      ['Tech Solutions Ltd', 'TSL', null, 'Highly recommended. Great customer service and excellent tracking capabilities.', 4, 'Approved']
    ];

    for (const testimonial of testimonials) {
      await query(
        `INSERT INTO testimonials (customer_name, company_name, customer_image, testimonial_text, rating, status) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        testimonial
      );
    }

    // Create settings
    const settings = [
      ['company_name', 'SwiftChain Logistics'],
      ['company_email', 'contact@swiftchainlogistics.com'],
      ['company_phone', '+1-800-SWIFT-CHAIN'],
      ['company_address', '100 Logistics Plaza, New York, NY 10001, USA'],
      ['company_city', 'New York'],
      ['company_country', 'USA'],
      ['company_website', 'www.swiftchainlogistics.com'],
      ['social_facebook', 'https://facebook.com/swiftchainlogistics'],
      ['social_twitter', 'https://twitter.com/swiftchain'],
      ['social_linkedin', 'https://linkedin.com/company/swiftchain-logistics'],
      ['social_instagram', 'https://instagram.com/swiftchainlogistics']
    ];

    for (const setting of settings) {
      await query(
        `INSERT INTO settings (setting_key, setting_value) 
         VALUES (?, ?)`,
        setting
      );
    }

    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
