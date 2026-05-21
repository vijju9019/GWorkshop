export interface Workspace {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped';
  ramUsage: string;
  storageUsage: string;
  lastActive: string;
  template: string;
  sharedWith?: string[];
  ownerId?: string;
  parentWorkspaceId?: string;
  parentOwnerId?: string;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  url?: string;
  type: 'google' | 'system' | 'custom';
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
}
