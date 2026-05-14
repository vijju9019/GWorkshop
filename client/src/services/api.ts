import axios from 'axios';
import { Workspace } from '../types';

const API_URL = 'http://localhost:3001/api';

export const workspaceService = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    try {
      const response = await axios.get(`${API_URL}/workspaces`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return [
        {
          id: '1',
          name: 'Main Dev Environment',
          status: 'running',
          ramUsage: '1.2GB',
          storageUsage: '120MB',
          lastActive: '2 mins ago',
          template: 'Ubuntu Desktop'
        },
        {
          id: '2',
          name: 'Personal Workspace',
          status: 'paused',
          ramUsage: '0GB',
          storageUsage: '45MB',
          lastActive: '1 day ago',
          template: 'ChromeOS Mini'
        }
      ];
    }
  },
  
  createWorkspace: async (data: Partial<Workspace>): Promise<Workspace> => {
    try {
      const response = await axios.post(`${API_URL}/workspaces`, data);
      return response.data;
    } catch (error) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || 'New Workspace',
        status: 'stopped',
        ramUsage: '0GB',
        storageUsage: '0MB',
        lastActive: 'Never',
        template: data.template || 'Default'
      };
    }
  }
};
