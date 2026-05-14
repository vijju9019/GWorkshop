"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
