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
const waClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

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

waClient.initialize();

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
  const db = readDB();
  const userWorkspaces = db.workspaces[userId] || [];
  res.json(userWorkspaces);
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