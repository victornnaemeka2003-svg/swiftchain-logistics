# SwiftChain Logistics

A modern, production-ready full-stack logistics company web application with a public-facing website and private admin management system.

## Features

### Public Website
- Responsive design (desktop, tablet, mobile)
- Hero banner and company introduction
- Shipment tracking page
- Service offerings (Air, Ocean, Road Freight, etc.)
- Pricing and quote requests
- Contact form and FAQ
- Careers and blog sections
- Privacy policy and terms & conditions

### Admin Dashboard
- User authentication with role-based access control
- Dashboard with real-time analytics and charts
- Customer management (CRUD operations)
- Shipment management with auto-generated tracking numbers
- Tracking event management
- Driver management
- Warehouse and inventory management
- Payment and invoice management
- Report generation (PDF/CSV export)
- Audit logs for all actions
- Email notifications

### Security Features
- Secure authentication (bcrypt password hashing)
- Session management
- CSRF protection
- Role-based access control (RBAC)
- Input validation and sanitization
- Activity logging
- Rate limiting

## Tech Stack

### Frontend
- React with Vite
- TailwindCSS for styling
- Chart.js for analytics
- Modern responsive components

### Backend
- Node.js with Express.js
- MySQL database
- RESTful API architecture
- Email notifications with Nodemailer

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/victornnaemeka2003-svg/swiftchain-logistics.git
   cd swiftchain-logistics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Setup database**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

## Default Credentials

After seeding the database, use these credentials to login:

- **Email:** admin@swiftchain.com
- **Password:** Admin@123456

## Project Structure

```
swiftchain-logistics/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── api/             # API client
│   ├── styles/          # CSS files
│   └── App.jsx
├── server/
│   ├── routes/          # API routes
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── middleware/       # Express middleware
│   ├── config/          # Configuration files
│   ├── utils/           # Server utilities
│   └── db.js            # Database connection
├── scripts/
│   ├── migrate.js       # Database migrations
│   └── seed.js          # Database seeding
└── vite.config.js       # Vite configuration
```

## Database Schema

Includes tables for:
- Users & Roles
- Customers
- Shipments & TrackingEvents
- Drivers
- Warehouses & Inventory
- Invoices & Payments
- Notifications & AuditLogs
- Settings & ContactMessages
- News & Testimonials
- FAQs

## API Documentation

Refer to `docs/API.md` for complete API documentation.

## Contributing

Please follow the coding standards and create feature branches from `main`.

## License

MIT License - See LICENSE file for details
