import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendEmail(to, subject, html, text = '') {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@swiftchainlogistics.com',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, '')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function getShipmentUpdateTemplate(shipment, status, location) {
  return `
    <h2>Shipment Status Update</h2>
    <p>Your shipment ${shipment.tracking_number} has been updated.</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Location:</strong> ${location}</p>
    <p><strong>Estimated Delivery:</strong> ${shipment.estimated_delivery}</p>
    <p>Track your shipment: <a href="${process.env.APP_URL}/track/${shipment.tracking_number}">Click here</a></p>
  `;
}
