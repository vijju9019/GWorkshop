import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { Client, LocalAuth } from 'whatsapp-web.js';
// @ts-ignore
import qrcode from 'qrcode-terminal';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// WhatsApp Client Initialization
let waClientReady = false;
const disableWA = process.env.DISABLE_WHATSAPP === 'true';

const waClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

if (!disableWA) {
  waClient.on('qr', (qr) => {
    console.log('\n=========================================');
    console.log('📱 SCAN THIS QR CODE WITH WHATSAPP TO LINK 📱');
    console.log('=========================================');
    qrcode.generate(qr, { small: true });
  });

  waClient.on('ready', () => {
    console.log('✅ WhatsApp Bot is linked and Ready! It will now send OTPs automatically.');
    waClientReady = true;
  });

  try {
    waClient.initialize().catch(err => {
      console.error('⚠️ WhatsApp Init Failed (Bypassing):', err.message);
    });
  } catch (err: any) {
    console.error('⚠️ WhatsApp Startup Error:', err.message);
  }
} else {
  console.log('ℹ️ WhatsApp Bot disabled via environment variable.');
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename if possible, otherwise generate a unique one
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.originalname ? file.originalname : uniqueSuffix + path.extname(file.originalname || ''));
  }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Google Machine Server is running' });
});

// Temporary in-memory OTP store
const otpStore: Record<string, { code: string, expiresAt: number }> = {};

app.post('/api/auth/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  // Extract the last 10 digits (Fast2SMS expects 10 digit Indian numbers)
  const normalizedPhone = phone.replace(/\D/g, '').slice(-10);

  if (normalizedPhone.length !== 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit Indian phone number.' });
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store it (expires in 5 minutes)
  otpStore[normalizedPhone] = {
    code: otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  try {
    if (!waClientReady) {
      console.log(`\n================================`);
      console.log(`🔑 DEV OTP BYPASS: ${otp}`);
      console.log(`================================\n`);
      return res.status(200).json({ success: true, message: 'WhatsApp bot not linked. Bypassed for testing. Check terminal for OTP!' });
    }

    const chatId = `91${normalizedPhone}@c.us`; // WhatsApp ID format for India
    const msgText = `*GWorkspace Security*\n\nYour OTP verification code is: *${otp}*\n\nIt expires in 5 minutes. Please do not share this code with anyone.`;
    
    await waClient.sendMessage(chatId, msgText);
    
    console.log(`✅ WhatsApp OTP (${otp}) sent to ${normalizedPhone}`);
    res.status(200).json({ success: true, message: 'OTP sent via WhatsApp successfully' });

  } catch (error: any) {
    console.error('WhatsApp Error:', error);
    res.status(500).json({ error: 'Failed to send WhatsApp message.' });
  }
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, code } = req.body;
  const normalizedPhone = phone.replace(/\D/g, '').slice(-10);

  const record = otpStore[normalizedPhone];
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this number.' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[normalizedPhone];
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  if (record.code === code) {
    delete otpStore[normalizedPhone]; // Clean up
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid OTP code.' });
  }
});

const dbPath = path.join(__dirname, '..', 'database.json');

// Helper to read database
const readDB = () => {
  if (!fs.existsSync(dbPath)) {
    return { workspaces: {} }; // Map of userId -> array of workspaces
  }
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
};

// Helper to write database
const writeDB = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

app.use('/api/storage/download', express.static(uploadsDir));

app.get('/api/storage/files', (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileDetails = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      // Determine type
      let type = 'document';
      const ext = path.extname(filename).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) {
        type = 'image';
      } else if (['.mp4', '.avi', '.mov', '.mkv'].includes(ext)) {
        type = 'video';
      } else if (!ext || ext === '') {
        type = 'other';
      }

      return {
        id: filename,
        name: filename,
        type: stats.isDirectory() ? 'folder' : type,
        size: stats.isDirectory() ? '--' : `${(stats.size / 1024 / 1024).toFixed(2)} MB`,
        modified: stats.mtime.toLocaleDateString(),
      };
    });
    res.json(fileDetails);
  } catch (err) {
    console.error('Error reading files:', err);
    res.status(500).json({ error: 'Failed to list files' });
  }
});

app.post('/api/storage/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }
  res.status(200).json({ message: 'Files uploaded successfully', count: req.files.length });
});

app.delete('/api/storage/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'File deleted' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.get('/api/workspaces/:userId', (req, res) => {
  const { userId } = req.params;
  const { email } = req.query;
  const db = readDB();
  
  // Get user's own workspaces
  const userWorkspaces = (db.workspaces[userId] || []).map((w: any) => ({
    ...w,
    ownerId: userId
  }));

  // Get workspaces shared with this user's email
  const sharedWorkspaces: any[] = [];
  if (email) {
    Object.keys(db.workspaces).forEach((ownerId) => {
      if (ownerId !== userId) {
        db.workspaces[ownerId].forEach((w: any) => {
          if (w.sharedWith && w.sharedWith.includes(email)) {
            sharedWorkspaces.push({
              ...w,
              ownerId
            });
          }
        });
      }
    });
  }

  res.json([...userWorkspaces, ...sharedWorkspaces]);
});

app.post('/api/workspaces/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  
  if (!db.workspaces[userId]) {
    db.workspaces[userId] = [];
  }

  const newWorkspace = {
    id: Math.random().toString(36).substr(2, 9),
    status: 'stopped',
    ramUsage: '0GB',
    storageUsage: '0MB',
    lastActive: 'Provisioning...',
    sharedWith: [],
    ownerId: userId,
    ...req.body
  };
  
  db.workspaces[userId].push(newWorkspace);
  writeDB(db);
  
  res.status(201).json(newWorkspace);
});

app.put('/api/workspaces/:userId/:workspaceId', (req, res) => {
  const { userId, workspaceId } = req.params;
  const db = readDB();
  
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const workspaceIndex = db.workspaces[userId].findIndex((w: any) => w.id === workspaceId);
  if (workspaceIndex === -1) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  // Update workspace
  db.workspaces[userId][workspaceIndex] = {
    ...db.workspaces[userId][workspaceIndex],
    ...req.body
  };
  
  writeDB(db);
  res.json(db.workspaces[userId][workspaceIndex]);
});

import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const hasSMTPConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (hasSMTPConfig) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('✅ Real SMTP Mailer Initialized');
  } else {
    console.log('🔄 Creating Ethereal Mail Test Account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('✅ Ethereal Mailer Initialized. User:', testAccount.user);
  }

  return transporter;
}

app.post('/api/workspaces/:userId/:workspaceId/share', async (req, res) => {
  const { userId, workspaceId } = req.params;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required to share workspace' });
  }

  const db = readDB();
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const workspaceIndex = db.workspaces[userId].findIndex((w: any) => w.id === workspaceId);
  if (workspaceIndex === -1) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  const workspace = db.workspaces[userId][workspaceIndex];
  if (!workspace.sharedWith) {
    workspace.sharedWith = [];
  }

  if (!workspace.sharedWith.includes(email)) {
    workspace.sharedWith.push(email);
  }

  writeDB(db);

  // Send sharing notification email
  const shareLink = `http://localhost:5173/?shareWorkspace=${workspaceId}&ownerId=${userId}`;
  const isRealSMTP = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const mailOptions = {
    from: isRealSMTP ? (process.env.SMTP_FROM || '"GWorkspace" <noreply@gworkspace.local>') : '"GWorkspace" <noreply@gworkspace.local>',
    to: email,
    subject: `🚀 GWorkspace Invitation: Collaborate on ${workspace.name}`,
    text: `Hello,\n\nYou have been invited to collaborate on the workspace "${workspace.name}" in GWorkspace.\n\nClick the link below to access it:\n${shareLink}\n\nBest regards,\nGWorkspace Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="font-size: 32px; font-weight: 900; color: #2563eb;">GWorkspace</span>
        </div>
        <p style="font-size: 16px; color: #1e293b;">Hello,</p>
        <p style="font-size: 16px; color: #1e293b;">You have been invited to collaborate on the workspace <strong>"${workspace.name}"</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${shareLink}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Open Workspace</a>
        </div>
        <p style="font-size: 12px; color: #64748b; line-height: 1.5;">If the button above does not work, copy and paste this link in your browser:<br/><a href="${shareLink}">${shareLink}</a></p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">TLS 1.3 Encryption Active &bull; GWorkspace Team</p>
      </div>
    `
  };

  let previewUrl = '';
  try {
    const mailer = await getTransporter();
    const info = await mailer.sendMail(mailOptions);
    if (!isRealSMTP) {
      previewUrl = nodemailer.getTestMessageUrl(info) || '';
      console.log(`✉️ Email sent. Preview URL: ${previewUrl}`);
    } else {
      console.log(`✉️ Email sent successfully to ${email}`);
    }
  } catch (err) {
    console.error('Error sending email:', err);
  }

  res.json({ ...workspace, previewUrl });
});

app.get('/api/workspaces/:userId/:workspaceId/fs', (req, res) => {
  const { userId, workspaceId } = req.params;
  const db = readDB();
  
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const workspace = db.workspaces[userId].find((w: any) => w.id === workspaceId);
  if (!workspace) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  res.json(workspace.fsState || null);
});

app.post('/api/workspaces/:userId/:workspaceId/fs', (req, res) => {
  const { userId, workspaceId } = req.params;
  const { fsState } = req.body;
  const db = readDB();
  
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const workspaceIndex = db.workspaces[userId].findIndex((w: any) => w.id === workspaceId);
  if (workspaceIndex === -1) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  
  db.workspaces[userId][workspaceIndex].fsState = fsState;
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/workspaces/:ownerId/:workspaceId/fork', (req, res) => {
  const { ownerId, workspaceId } = req.params;
  const { newOwnerId } = req.body;
  
  if (!newOwnerId) {
    return res.status(400).json({ error: 'newOwnerId is required' });
  }

  const db = readDB();
  if (!db.workspaces[ownerId]) {
    return res.status(404).json({ error: 'Original user not found' });
  }

  const originalWs = db.workspaces[ownerId].find((w: any) => w.id === workspaceId);
  if (!originalWs) {
    return res.status(404).json({ error: 'Original workspace not found' });
  }

  if (!db.workspaces[newOwnerId]) {
    db.workspaces[newOwnerId] = [];
  }

  const newWorkspace = {
    ...originalWs,
    id: Math.random().toString(36).substr(2, 9),
    name: `${originalWs.name} (Fork)`,
    ownerId: newOwnerId,
    parentWorkspaceId: workspaceId,
    parentOwnerId: ownerId,
    sharedWith: [],
    status: 'stopped',
    lastActive: 'Just forked'
  };

  db.workspaces[newOwnerId].push(newWorkspace);
  writeDB(db);

  res.status(201).json(newWorkspace);
});

app.post('/api/workspaces/:userId/:workspaceId/merge', (req, res) => {
  const { userId, workspaceId } = req.params;
  
  const db = readDB();
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  const currentWs = db.workspaces[userId].find((w: any) => w.id === workspaceId);
  if (!currentWs) {
    return res.status(404).json({ error: 'Workspace not found' });
  }

  const { parentWorkspaceId, parentOwnerId } = currentWs;
  if (!parentWorkspaceId || !parentOwnerId) {
    return res.status(400).json({ error: 'Not a forked workspace' });
  }

  if (!db.workspaces[parentOwnerId]) {
    return res.status(404).json({ error: 'Parent owner not found' });
  }

  const parentWsIndex = db.workspaces[parentOwnerId].findIndex((w: any) => w.id === parentWorkspaceId);
  if (parentWsIndex === -1) {
    return res.status(404).json({ error: 'Parent workspace not found' });
  }

  // Perform a simple overwrite merge for fsState
  if (currentWs.fsState) {
     db.workspaces[parentOwnerId][parentWsIndex].fsState = currentWs.fsState;
     db.workspaces[parentOwnerId][parentWsIndex].lastActive = 'Merged recently';
  }

  writeDB(db);

  res.json({ success: true, message: 'Merged successfully into original workspace' });
});

app.delete('/api/workspaces/:userId/:workspaceId', (req, res) => {
  const { userId, workspaceId } = req.params;
  const db = readDB();
  
  if (!db.workspaces[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.workspaces[userId] = db.workspaces[userId].filter((w: any) => w.id !== workspaceId);
  writeDB(db);
  
  res.json({ success: true, message: 'Workspace deleted' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});