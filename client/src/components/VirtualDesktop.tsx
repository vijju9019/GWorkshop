import React, { useState, useEffect } from 'react';
import type { AppConfig, WindowState, Workspace } from '../types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: any;
    }
  }
}
import AppWindow from './AppWindow';
import { 
  Search, 
  ChevronUp, 
  Wifi, 
  Battery, 
  Volume2,
  LayoutGrid,
  Settings
} from 'lucide-react';
import LinuxDesktop from './LinuxDesktop';
import SettingsApp from './SettingsApp';
import CloudStorage from './CloudStorage';
import MockApp from './MockApp';
import { Rnd } from 'react-rnd';

const GOOGLE_APPS: AppConfig[] = [
  { id: 'docs', name: 'Google Docs', icon: 'https://www.google.com/s2/favicons?domain=docs.google.com&sz=128', url: 'https://docs.google.com/document/u/0/', type: 'google' },
  { id: 'sheets', name: 'Google Sheets', icon: 'https://www.google.com/s2/favicons?domain=sheets.google.com&sz=128', url: 'https://docs.google.com/spreadsheets/u/0/', type: 'google' },
  { id: 'slides', name: 'Google Slides', icon: 'https://www.google.com/s2/favicons?domain=slides.google.com&sz=128', url: 'https://docs.google.com/presentation/u/0/', type: 'google' },
  { id: 'drive', name: 'Google Drive', icon: 'https://www.google.com/s2/favicons?domain=drive.google.com&sz=128', url: 'https://drive.google.com/drive/u/0/my-drive', type: 'google' },
  { id: 'gmail', name: 'Gmail', icon: 'https://www.google.com/s2/favicons?domain=mail.google.com&sz=128', url: 'https://mail.google.com', type: 'google' },
  { id: 'calendar', name: 'Google Calendar', icon: 'https://www.google.com/s2/favicons?domain=calendar.google.com&sz=128', url: 'https://calendar.google.com', type: 'google' },
  { id: 'meet', name: 'Google Meet', icon: 'https://www.google.com/s2/favicons?domain=meet.google.com&sz=128', url: 'https://meet.google.com', type: 'google' },
  { id: 'youtube', name: 'YouTube', icon: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128', url: 'https://www.youtube.com', type: 'google' },
  { id: 'keep', name: 'Google Keep', icon: 'https://www.google.com/s2/favicons?domain=keep.google.com&sz=128', url: 'https://keep.google.com', type: 'google' },
  { id: 'notebooklm', name: 'NotebookLM', icon: 'https://www.google.com/s2/favicons?domain=notebooklm.google.com&sz=128', url: 'https://notebooklm.google.com', type: 'google' },
  { id: 'maps', name: 'Google Maps', icon: 'https://www.google.com/s2/favicons?domain=maps.google.com&sz=128', url: 'https://maps.google.com', type: 'google' },
  { id: 'photos', name: 'Google Photos', icon: 'https://www.google.com/s2/favicons?domain=photos.google.com&sz=128', url: 'https://photos.google.com', type: 'google' },
  { id: 'chrome', name: 'Google Chrome', icon: 'https://www.google.com/s2/favicons?domain=chrome.com&sz=128', url: 'https://www.google.com/chrome/', type: 'google' },
  { id: 'chromium', name: 'Chromium', icon: 'https://www.google.com/s2/favicons?domain=chromium.org&sz=128', url: 'https://www.chromium.org', type: 'google' },
  { id: 'earth', name: 'Google Earth', icon: 'https://www.google.com/s2/favicons?domain=earth.google.com&sz=128', url: 'https://earth.google.com/web/', type: 'google' },
  { id: 'contacts', name: 'Google Contacts', icon: 'https://www.google.com/s2/favicons?domain=contacts.google.com&sz=128', url: 'https://contacts.google.com', type: 'google' },
  { id: 'linux', name: 'Linux OS', icon: 'https://www.google.com/s2/favicons?domain=ubuntu.com&sz=128', url: 'local:linux', type: 'system' },
  { id: 'vscode', name: 'VS Code', icon: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg', url: 'https://stackblitz.com/edit/node-js-sandbox?embed=1&theme=dark', type: 'system' },
  { id: 'settings', name: 'Settings', icon: 'https://www.gstatic.com/images/icons/material/system/2x/settings_grey600_48dp.png', url: 'local:settings', type: 'system' },
];

interface VirtualDesktopProps {
  user: any;
  workspace?: Workspace;
  isDarkMode?: boolean;
}

const VirtualDesktop: React.FC<VirtualDesktopProps> = ({ user, workspace, isDarkMode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [launcherOpen, setLauncherOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState('/luffy_gear5.png');
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false);

  // Sticker State
  const [stickerPos, setStickerPos] = useState({ x: window.innerWidth - 350, y: 50 });

  useEffect(() => {
    // Auto-launch Linux OS on startup as requested
    const linuxApp = GOOGLE_APPS.find(a => a.id === 'linux');
    if (linuxApp) {
      openApp(linuxApp);
    }
  }, []);


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const openSettingsTab = (tab: string) => {
    setQuickSettingsOpen(false);
    const settingsApp = GOOGLE_APPS.find(a => a.id === 'settings')!;
    const existing = windows.find(w => w.appId === 'settings');
    if (existing) {
      focusWindow(existing.id);
      if (existing.isMinimized) toggleMinimize(existing.id);
    } else {
      openApp(settingsApp);
    }
    // Store tab to open — passed via event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('settings-tab', { detail: tab }));
    }, 100);
  };

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
      x: 150 + (windows.length * 40),
      y: 100 + (windows.length * 40),
      width: app.id === 'settings' ? 900 : 950,
      height: app.id === 'settings' ? 620 : 650,
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

  const renderWindowContent = (win: WindowState, appUrl?: string) => {
    if (win.appId === 'linux') return <LinuxDesktop user={user} isDarkMode={isDarkMode} workspaceId={workspace?.id} template={workspace?.template} />;
    if (win.appId === 'settings') return (
      <SettingsApp wallpaper={wallpaper} onWallpaperChange={setWallpaper} />
    );
    if (win.appId === 'drive') return <CloudStorage />;
    if (win.appId === 'docs' || win.appId === 'gmail' || win.appId === 'chrome') return <MockApp appId={win.appId} />;
    
    if (win.appId === 'vscode') return (
      <iframe src={appUrl} className="w-full h-full border-none bg-[#1e1e1e]" title={win.title} allow="cross-origin-isolated" />
    );
    
    // Unique partition per workspace to keep sessions isolated and working in every workspace
    const partition = `persist:user-${user.uid}-ws-${workspace?.id || 'default'}`;
    
    return (
      <webview 
        src={appUrl} 
        className="w-full h-full border-none bg-white"
        title={win.title}
        allowpopups={true}
        partition={partition}
      />
    );
  };

  return (
    <div 
      className="relative w-full h-screen overflow-hidden flex flex-col transition-all duration-700"
      style={{ backgroundImage: `url('${wallpaper}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Desktop Area */}
      <div 
        className="flex-1 relative p-4"
        onClick={() => {
          setLauncherOpen(false);
          setQuickSettingsOpen(false);
        }}
      >
        {/* Movable Luffy Sticker */}
        <Rnd
          default={{
            x: stickerPos.x,
            y: stickerPos.y,
            width: 300,
            height: 300,
          }}
          bounds="parent"
          className="z-0 pointer-events-auto"
        >
          <div className="w-full h-full group relative">
             <img 
               src="/luffy_gear5.png" 
               className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.3)] filter brightness-110 contrast-110 animate-pulse-slow cursor-grab active:cursor-grabbing"
               alt="Gear 5 Luffy" 
             />
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] font-black uppercase tracking-widest text-white">
               Warrior of Liberation
             </div>
          </div>
        </Rnd>

        {/* Desktop Icons - Consistent across all workspaces as requested */}
        <div className="absolute top-8 left-8 flex flex-col gap-6">
          {GOOGLE_APPS.filter(app => ['vscode', 'linux', 'drive', 'gmail', 'chrome', 'docs'].includes(app.id)).map(app => (
            <div 
              key={app.id} 
              onDoubleClick={() => openApp(app)}
              onClick={(e) => { e.stopPropagation(); openApp(app); }}
              className="flex flex-col items-center gap-2 w-20 cursor-pointer group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg ${isDarkMode ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'bg-white/80 backdrop-blur-sm border border-white'}`}>
                <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain drop-shadow-sm" />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] text-center drop-shadow-lg ${isDarkMode ? 'text-white/60 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                {app.name === 'Linux OS' ? 'Compute' : app.name.replace('Google ', '')}
              </span>
            </div>
          ))}
        </div>

        {/* Windows */}
        {windows.map(win => {
          const appUrl = GOOGLE_APPS.find(a => a.id === win.appId)?.url;
          return (
            <AppWindow
              key={win.id}
              window={win}
              url={appUrl}
              onClose={closeWindow}
              onFocus={focusWindow}
              onMinimize={toggleMinimize}
              onMaximize={toggleMaximize}
            >
              {renderWindowContent(win, appUrl)}
            </AppWindow>
          );
        })}

        {/* Launcher Overlay */}
        {launcherOpen && (
          <div 
            className={`absolute bottom-16 left-4 backdrop-blur-xl rounded-2xl shadow-2xl w-[520px] p-6 z-[9999] animate-in slide-in-from-bottom-4 duration-200 border transition-colors ${isDarkMode ? 'bg-[#0f172a]/90 border-white/5' : 'bg-white/90 border-white/60'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative mb-5">
              <Search className={`absolute left-3 top-3 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`} size={18} />
              <input 
                type="text" 
                placeholder="Search apps, files, and more..."
                className={`w-full pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 border-none text-sm ${isDarkMode ? 'bg-white/5 text-white placeholder:text-white/20' : 'bg-gray-100 text-slate-800'}`}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {GOOGLE_APPS.map(app => (
                <button 
                  key={app.id}
                  onClick={() => openApp(app)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
                >
                  <img src={app.icon} alt={app.name} className="w-12 h-12 object-contain drop-shadow-sm group-hover:scale-110 transition-transform" />
                  <span className={`text-xs font-medium text-center leading-tight ${isDarkMode ? 'text-white/60' : 'text-gray-700'}`}>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Taskbar */}
      <div className={`h-14 backdrop-blur-md border-t px-4 flex items-center justify-between z-[10000] transition-colors duration-500 ${isDarkMode ? 'bg-black/60 border-white/5' : 'bg-white/80 border-white/50'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setLauncherOpen(!launcherOpen);
              setQuickSettingsOpen(false);
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${launcherOpen ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-gray-800 hover:bg-white')}`}
          >
            <LayoutGrid size={20} />
          </button>
          
          {/* Settings shortcut in taskbar */}
          <button
            onClick={() => openApp(GOOGLE_APPS.find(a => a.id === 'settings')!)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
            title="Settings"
          >
            <Settings size={18} />
          </button>
          
          <div className="flex items-center gap-1 h-10 overflow-x-auto max-w-2xl">
            {windows.map(win => (
              <div
                key={win.id}
                className="flex items-center"
              >
                <button
                  onClick={() => win.isMinimized ? toggleMinimize(win.id) : focusWindow(win.id)}
                  className={`px-3 h-10 rounded-l-lg flex items-center gap-2 transition-all border-b-2 text-sm ${win.isMinimized ? 'opacity-60 border-transparent bg-white/40' : (isDarkMode ? 'bg-white/10 border-blue-500 text-white' : 'bg-white/80 border-blue-500 shadow-sm')}`}
                >
                  <span className="font-medium truncate max-w-[100px]">{win.title}</span>
                </button>
                <button
                  onClick={() => closeWindow(win.id)}
                  className={`px-2 h-10 rounded-r-lg border-b-2 flex items-center justify-center transition-all hover:bg-red-500 hover:text-white ${win.isMinimized ? 'opacity-60 border-transparent bg-white/40' : (isDarkMode ? 'bg-white/10 border-blue-500 text-white/40' : 'bg-white/80 border-blue-500 text-slate-400')}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Quick Settings Panel */}
          {quickSettingsOpen && (
            <div className={`absolute bottom-12 right-0 w-72 backdrop-blur-xl rounded-2xl shadow-2xl border p-4 z-[99999] animate-in slide-in-from-bottom-4 duration-200 ${isDarkMode ? 'bg-[#1e293b]/95 border-white/5' : 'bg-white/95 border-gray-200'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? 'text-white/20' : 'text-gray-400'}`}>Quick Settings</p>

              {/* Toggle tiles */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: <Wifi size={18}/>, label: 'Wi-Fi', active: true, tab: 'network' },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 7l5-5 5 5M7 17l5 5 5-5"/><line x1="12" y1="2" x2="12" y2="22"/></svg>, label: 'Bluetooth', active: false, tab: 'network' },
                  { icon: <Volume2 size={18}/>, label: 'Volume', active: true, tab: 'notifications' },
                  { icon: <Battery size={18}/>, label: 'Battery', active: true, tab: 'system' },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>, label: 'Brightness', active: true, tab: 'personalization' },
                  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>, label: 'Display', active: true, tab: 'system' },
                ].map((tile, i) => (
                  <button
                    key={i}
                    onClick={() => openSettingsTab(tile.tab)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-xs font-medium ${
                      tile.active
                        ? (isDarkMode ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200')
                        : (isDarkMode ? 'bg-white/5 text-white/40 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')
                    }`}
                  >
                    {tile.icon}
                    {tile.label}
                  </button>
                ))}
              </div>

              {/* Volume slider */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <Volume2 size={14} className={isDarkMode ? 'text-white/20' : 'text-gray-500'} />
                  <span className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>Volume</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={80} className="w-full accent-blue-500" />
              </div>

              {/* Brightness slider */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDarkMode ? 'text-white/20' : 'text-gray-500'}><circle cx="12" cy="12" r="5"/><path d="M12 2v2m0 16v2"/></svg>
                  <span className={`text-xs ${isDarkMode ? 'text-white/40' : 'text-gray-600'}`}>Brightness</span>
                </div>
                <input type="range" min={0} max={100} defaultValue={100} className="w-full accent-blue-500" />
              </div>

              {/* Settings link */}
              <button
                onClick={() => openSettingsTab('workspace')}
                className={`w-full flex items-center justify-center gap-2 py-2 text-sm rounded-xl transition-colors font-medium ${isDarkMode ? 'text-blue-400 hover:bg-white/5' : 'text-blue-600 hover:bg-blue-50'}`}
              >
                <Settings size={15} /> Open Settings
              </button>
            </div>
          )}

          {/* Taskbar right cluster */}
          <div
            className={`flex items-center gap-4 backdrop-blur px-4 py-1.5 rounded-full shadow cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/70 hover:bg-white/90'}`}
            onClick={(e) => {
              e.stopPropagation();
              setQuickSettingsOpen(o => !o);
              setLauncherOpen(false);
            }}
          >
            <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
              <Wifi size={16} />
              <Volume2 size={16} />
              <Battery size={16} />
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <ChevronUp size={16} className={`transition-transform ${isDarkMode ? 'text-white/60' : 'text-gray-600'} ${quickSettingsOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDesktop;
