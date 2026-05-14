import React, { useState, useEffect } from 'react';
import { AppConfig, WindowState } from '../types';
import AppWindow from './AppWindow';
import { 
  Search, 
  ChevronUp, 
  Wifi, 
  Battery, 
  Volume2,
  LayoutGrid
} from 'lucide-react';

const GOOGLE_APPS: AppConfig[] = [
  { id: 'docs', name: 'Google Docs', icon: '📄', url: 'https://docs.google.com/document/u/0/?authuser=0' },
  { id: 'drive', name: 'Google Drive', icon: '📁', url: 'https://drive.google.com/drive/u/0/my-drive' },
  { id: 'youtube', name: 'YouTube', icon: '📺', url: 'https://www.youtube.com' },
  { id: 'gmail', name: 'Gmail', icon: '✉️', url: 'https://mail.google.com' },
  { id: 'calendar', name: 'Calendar', icon: '📅', url: 'https://calendar.google.com' },
  { id: 'meet', name: 'Meet', icon: '📹', url: 'https://meet.google.com' },
  { id: 'notes', name: 'Google Notes', icon: '📝', url: 'https://keep.google.com' },
  { id: 'notebook', name: 'NotebookLM', icon: '📓', url: 'https://notebooklm.google.com' },
];

const VirtualDesktop: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openApp = (app: AppConfig) => {
    const existing = windows.find(w => w.appId === app.id);
    if (existing) {
      focusWindow(existing.id);
      if (existing.isMinimized) {
        toggleMinimize(existing.id);
      }
      setLauncherOpen(false);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId: app.id,
      title: app.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: Math.max(0, ...windows.map(w => w.zIndex)) + 1,
      x: 100 + (windows.length * 30),
      y: 50 + (windows.length * 30),
      width: 800,
      height: 600,
    };

    setWindows([...windows, newWindow]);
    setLauncherOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    const maxZ = Math.max(0, ...windows.map(w => w.zIndex));
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: maxZ + 1 } : w
    ));
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  return (
    <div className="relative w-full h-screen bg-[#f8f9fa] overflow-hidden flex flex-col">
      {/* Desktop Area */}
      <div className="flex-1 relative p-4">
        {/* Windows */}
        {windows.map(win => (
          <AppWindow
            key={win.id}
            window={win}
            onClose={closeWindow}
            onFocus={focusWindow}
            onMinimize={toggleMinimize}
            onMaximize={toggleMaximize}
          >
            <iframe 
              src={GOOGLE_APPS.find(a => a.id === win.appId)?.url} 
              className="w-full h-full border-none"
              title={win.title}
            />
          </AppWindow>
        ))}

        {/* Launcher Overlay */}
        {launcherOpen && (
          <div className="absolute bottom-16 left-4 google-card w-[480px] p-6 z-[9999] animate-in slide-in-from-bottom-4 duration-200">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-google-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search apps, files, and more..."
                className="w-full pl-10 pr-4 py-2 bg-google-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-google-blue border-none"
              />
            </div>
            <div className="grid grid-cols-4 gap-6">
              {GOOGLE_APPS.map(app => (
                <button 
                  key={app.id}
                  onClick={() => openApp(app)}
                  className="flex flex-col items-center gap-2 p-2 hover:bg-google-gray-100 rounded-google transition-colors"
                >
                  <div className="text-4xl">{app.icon}</div>
                  <span className="text-xs text-google-gray-800 font-medium">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className="h-14 bg-white border-t border-google-gray-200 px-4 flex items-center justify-between z-[10000]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLauncherOpen(!launcherOpen)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${launcherOpen ? 'bg-google-blue text-white' : 'bg-google-gray-100 text-google-gray-800 hover:bg-google-gray-200'}`}
          >
            <LayoutGrid size={20} />
          </button>
          
          <div className="flex items-center gap-1 h-10 overflow-x-auto max-w-2xl">
            {windows.map(win => (
              <button
                key={win.id}
                onClick={() => win.isMinimized ? toggleMinimize(win.id) : focusWindow(win.id)}
                className={`px-3 h-full rounded-google flex items-center gap-2 transition-all border-b-2 ${win.isMinimized ? 'opacity-60 border-transparent' : 'bg-google-gray-100 border-google-blue'}`}
              >
                <span className="text-sm font-medium truncate max-w-[100px]">{win.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 bg-google-gray-100 px-4 py-1.5 rounded-full">
          <div className="flex items-center gap-3 text-google-gray-700 mr-2">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Battery size={16} />
          </div>
          <div className="text-sm font-medium text-google-gray-800">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button className="text-google-gray-700 hover:bg-google-gray-200 rounded p-1">
            <ChevronUp size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualDesktop;
