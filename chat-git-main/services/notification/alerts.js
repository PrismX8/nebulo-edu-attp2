const nodemailer = require('nodemailer');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const notificationEmail = process.env.NOTIFICATION_EMAIL;
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;

let emailTransporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_PORT) {
  emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

async function sendEmailNotification(subject, message, to = notificationEmail) {
  if (!emailTransporter || !to) {
    console.warn('Email notification not configured');
    return { success: false, message: 'Email notification not configured' };
  }

  try {
    const result = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@kchat.local',
      to,
      subject,
      text: message,
      html: message.replace(/\n/g, '<br>')
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error.message);
    return { success: false, message: `Error sending email: ${error.message}` };
  }
}

async function sendDiscordNotification(title, message, color = '#ff0000', fields = []) {
  if (!discordWebhookUrl) {
    console.warn('Discord webhook not configured');
    return { success: false, message: 'Discord webhook not configured' };
  }

  try {
    const payload = {
      embeds: [
        {
          title,
          description: message,
          color: parseInt(color.replace('#', ''), 16),
          fields,
          timestamp: new Date().toISOString()
        }
      ]
    };

    await axios.post(discordWebhookUrl, payload);

    return { success: true };
  } catch (error) {
    console.error('Error sending Discord notification:', error.message);
    return { success: false, message: `Error sending Discord notification: ${error.message}` };
  }
}

async function sendLowStockAlert(products, threshold) {
  if (!products || products.length === 0) {
    return { success: true, message: 'No low stock products to alert about' };
  }

  const title = `Low Stock Alert: ${products.length} products below threshold`;
  let message = `The following products are running low on stock (threshold: ${threshold}):\n\n`;

  products.forEach(product => {
    message += `- Product ID: ${product.product_id}\n`;
    message += `  Current stock: ${product.available_items}\n`;
    message += `  Threshold: ${threshold}\n\n`;
  });

  const fields = products.map(product => ({
    name: `Product: ${product.product_id}`,
    value: `Current stock: ${product.available_items} / Threshold: ${threshold}`,
    inline: true
  }));

  const results = {
    email: await sendEmailNotification(title, message),
    discord: await sendDiscordNotification(title, message, '#ff9800', fields)
  };

  return {
    success: Object.values(results).some(result => result.success),
    results
  };
}

async function sendRestockJobAlert(restockJobs) {
  if (!restockJobs || restockJobs.length === 0) {
    return { success: true, message: 'No restock jobs to alert about' };
  }

  const title = `Restock Jobs Started: ${restockJobs.length} products`;
  let message = 'Automatic restock jobs have been started for the following products:\n\n';

  restockJobs.forEach(job => {
    message += `- Product ID: ${job.productId}\n`;
    message += `  Job ID: ${job.jobId || 'N/A'}\n`;
    message += `  Target: ${job.targetCount || 'Unknown'} items\n`;
    message += `  Status: ${job.success ? 'Started' : 'Failed'}\n\n`;
  });

  const fields = restockJobs.map(job => ({
    name: `Product: ${job.productId}`,
    value: `Job: ${job.jobId || 'N/A'}\nTarget: ${job.targetCount || 'Unknown'} items\nStatus: ${job.success ? 'Started' : 'Failed'}`,
    inline: true
  }));

  const results = {
    email: await sendEmailNotification(title, message),
    discord: await sendDiscordNotification(title, message, '#4caf50', fields)
  };

  return {
    success: Object.values(results).some(result => result.success),
    results
  };
}

async function sendErrorAlert(title, message, details = {}) {
  const fullMessage = `${message}\n\nDetails:\n${JSON.stringify(details, null, 2)}`;
  const fields = Object.entries(details).map(([key, value]) => ({
    name: key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
    inline: false
  }));

  const results = {
    email: await sendEmailNotification(`Error: ${title}`, fullMessage),
    discord: await sendDiscordNotification(`Error: ${title}`, message, '#f44336', fields)
  };

  return {
    success: Object.values(results).some(result => result.success),
    results
  };
}

module.exports = {
  sendEmailNotification,
  sendDiscordNotification,
  sendLowStockAlert,
  sendRestockJobAlert,
  sendErrorAlert
};
