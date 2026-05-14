import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import WorkspaceManager from './components/WorkspaceManager';
import VirtualDesktop from './components/VirtualDesktop';
import CloudStorage from './components/CloudStorage';
import PerformanceMonitor from './components/PerformanceMonitor';
import SettingsPage from './pages/SettingsPage';
import { Workspace } from './types';
import { workspaceService } from './services/api';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const data = await workspaceService.getWorkspaces();
      setWorkspaces(data);
      setLoading(false);
    };
    if (isLoggedIn) fetchWorkspaces();
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDesktopMode(false);
  };

  const createWorkspace = async (name: string, template: string) => {
    const newWs = await workspaceService.createWorkspace({ name, template });
    setWorkspaces([...workspaces, newWs]);
  };

  const launchWorkspace = (id: string) => {
    // Update status to running if it's not
    setWorkspaces(workspaces.map(w => 
      w.id === id ? { ...w, status: 'running' as const } : w
    ));
    setIsDesktopMode(true);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (isDesktopMode) {
    return (
      <div className="h-screen w-screen flex flex-col">
        <div className="bg-google-blue text-white px-4 py-1 text-xs flex justify-between items-center z-[10001]">
          <span>Virtual Session: Main Dev Environment</span>
          <button 
            onClick={() => setIsDesktopMode(false)}
            className="hover:bg-blue-600 px-2 py-0.5 rounded transition-colors font-medium"
          >
            Exit Workspace
          </button>
        </div>
        <VirtualDesktop />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-google-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-google-gray-200 flex items-center justify-end px-8 gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center text-white text-sm font-bold">U</div>
            <span className="text-sm font-medium text-google-gray-700">User Name</span>
          </div>
        </div>

        <div className="pb-12">
          {activeTab === 'dashboard' && (
            <DashboardView workspaces={workspaces} storageUsed={120} />
          )}
          {activeTab === 'workspaces' && (
            <WorkspaceManager 
              workspaces={workspaces} 
              onCreate={createWorkspace}
              onLaunch={launchWorkspace}
            />
          )}
          {activeTab === 'storage' && (
            <CloudStorage />
          )}
          {activeTab === 'performance' && (
            <PerformanceMonitor />
          )}
          {activeTab === 'settings' && (
            <SettingsPage />
          )}
          {activeTab === 'account' && (
            <div className="p-8 text-center text-google-gray-600">Account details coming soon...</div>
          )}
          {activeTab === 'apps' && (
            <div className="p-8 text-center text-google-gray-600">App marketplace coming soon...</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
