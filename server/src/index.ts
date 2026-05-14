import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Google Machine Server is running' });
});

// Mock workspace data for demo
let workspaces = [
  {
    id: '1',
    name: 'Main Dev Environment',
    status: 'running',
    ramUsage: '1.2GB',
    storageUsage: '120MB',
    lastActive: '2 mins ago',
    template: 'Ubuntu Desktop'
  }
];

app.get('/api/workspaces', (req, res) => {
  res.json(workspaces);
});

app.post('/api/workspaces', (req, res) => {
  const newWorkspace = {
    id: Math.random().toString(36).substr(2, 9),
    status: 'stopped',
    ramUsage: '0GB',
    storageUsage: '0MB',
    lastActive: 'Never',
    ...req.body
  };
  workspaces.push(newWorkspace);
  res.status(201).json(newWorkspace);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
