import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, body, name }) => {
  const fullBody = `
Dear ${name},

${body}

Regards,
UPLB Alumni Admin Team

---
This is an automated message. Please do not reply to this email.
  `.trim();

  const mailOptions = {
    from: `UPLB Alumni Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: fullBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

const emailService = {
  sendEmail
};

export default emailService;