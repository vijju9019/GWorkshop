import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor, Terminal, Globe, Palette, Wifi, Shield, Bell,
  User, Info, ChevronRight, Check, RefreshCw, HardDrive,
  Cpu, MemoryStick, Layout, Upload, Image as ImageIcon
} from 'lucide-react';

interface SystemInfo {
  os: string;
  hostname: string;
  username: string;
  cpus: string;
  totalMem: string;
  freeMem: string;
  platform: string;
  arch: string;
  uptime: string;
}

interface SettingsAppProps {
  wallpaper: string;
  onWallpaperChange: (url: string) => void;
}

const WALLPAPER_PRESETS = [
  { label: 'Enterprise Pro', url: '/wallpaper.png' },
  { label: 'Ocean Calm', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80' },
  { label: 'Abstract Flow', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&q=80' },
  { label: 'Mountain Peak', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80' },
  { label: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80' },
  { label: 'Clear Sky', url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80' },
  { label: 'Minimal Zen', url: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1920&q=80' },
  { label: 'City Dusk', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80' },
];

const FIREFOX_ENGINES = [
  { id: 'google', label: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bing', label: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'duckduckgo', label: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' },
  { id: 'yahoo', label: 'Yahoo', url: 'https://search.yahoo.com/search?p=' },
];

const SettingsApp: React.FC<SettingsAppProps> = ({ wallpaper, onWallpaperChange }) => {
  const [activeSection, setActiveSection] = useState('workspace');
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const [customWallpaper, setCustomWallpaper] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('google');
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('http://localhost:3001/api/storage/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const filename = file.name;
        const wallpaperUrl = `http://localhost:3001/api/storage/download/${filename}`;
        onWallpaperChange(wallpaperUrl);
        showSaved();
      } else {
        alert('Failed to upload wallpaper.');
      }
    } catch (err) {
      console.error('Error uploading wallpaper:', err);
      alert('Error uploading wallpaper.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };
  const [fontSize, setFontSize] = useState(14);
  const [termTheme, setTermTheme] = useState('dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');

  // Listen for deep-link events from the Quick Settings panel
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail as string;
      if (tab) setActiveSection(tab);
    };
    window.addEventListener('settings-tab', handler);
    return () => window.removeEventListener('settings-tab', handler);
  }, []);

  useEffect(() => {
    // Load real system info via Electron's Node.js APIs
    try {
      // @ts-ignore
      if (window.require) {
        // @ts-ignore
        const os = window.require('os');
        const cpus = os.cpus();
        const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);
        const uptimeSec = os.uptime();
        const h = Math.floor(uptimeSec / 3600);
        const m = Math.floor((uptimeSec % 3600) / 60);
        setSysInfo({
          os: `${os.type()} ${os.release()}`,
          hostname: os.hostname(),
          username: os.userInfo().username,
          cpus: cpus.length > 0 ? `${cpus[0].model} (${cpus.length} cores)` : 'Unknown',
          totalMem: `${totalMem} GB`,
          freeMem: `${freeMem} GB`,
          platform: os.platform(),
          arch: os.arch(),
          uptime: `${h}h ${m}m`,
        });
      }
    } catch (e) {
      setSysInfo({
        os: 'Ubuntu 22.04 LTS', hostname: 'google-machine', username: 'user',
        cpus: '4 cores', totalMem: '8.0 GB', freeMem: '4.2 GB',
        platform: 'linux', arch: 'x86_64', uptime: '2h 34m',
      });
    }
  }, []);

  const showSaved = () => {
    setSavedMsg('Settings saved!');
    setTimeout(() => setSavedMsg(''), 2000);
  };

  const navItems = [
    { id: 'workspace', label: 'Workspace', icon: <Layout size={18} /> },
    { id: 'linux', label: 'Linux Terminal', icon: <Terminal size={18} /> },
    { id: 'firefox', label: 'Firefox Browser', icon: <Globe size={18} /> },
    { id: 'personalization', label: 'Personalization', icon: <Palette size={18} /> },
    { id: 'system', label: 'System Info', icon: <Monitor size={18} /> },
    { id: 'network', label: 'Network', icon: <Wifi size={18} /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {

      case 'workspace':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Workspace Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Configure your GWorkspace virtual workspace experience.</p>
            <div className="space-y-4">
              {[
                { label: 'Auto-open Linux on startup', desc: 'Launch the Linux OS window when the workspace opens.' },
                { label: 'Enable window animations', desc: 'Smooth animations when opening and closing windows.' },
                { label: 'Show taskbar clock', desc: 'Display current time in the top taskbar.' },
                { label: 'Remember window positions', desc: 'Restore window positions on next launch.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={showSaved}
                    className="w-11 h-6 rounded-full bg-blue-500 relative cursor-pointer flex-shrink-0"
                  >
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Default app layout</p>
                <select className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Google Workspace (default)</option>
                  <option>Developer Mode</option>
                  <option>Minimal</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'linux':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Linux Terminal Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Customize your embedded Ubuntu terminal experience.</p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Terminal Theme</p>
                <div className="flex gap-2">
                  {['dark', 'light', 'solarized', 'dracula'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setTermTheme(t); showSaved(); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-all ${termTheme === t ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-3">Font Size: <span className="text-blue-500">{fontSize}px</span></p>
                <input
                  type="range" min={10} max={24} value={fontSize}
                  onChange={e => { setFontSize(parseInt(e.target.value)); showSaved(); }}
                  className="w-full accent-blue-500"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Default Shell</p>
                <select className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>/bin/bash</option>
                  <option>/bin/zsh</option>
                  <option>/bin/sh</option>
                </select>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-1">Working Directory</p>
                <p className="text-xs text-gray-500 mb-2">Initial directory when terminal opens.</p>
                <input
                  type="text" defaultValue="~/"
                  className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Pre-installed commands</p>
                <div className="flex flex-wrap gap-2">
                  {['ls', 'cd', 'pwd', 'mkdir', 'rm', 'touch', 'cat', 'echo', 'date', 'whoami', 'uname', 'firefox', 'clear'].map(cmd => (
                    <span key={cmd} className="px-2 py-1 bg-gray-800 text-green-400 rounded font-mono text-xs">{cmd}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'firefox':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Firefox Browser Settings</h2>
            <p className="text-sm text-gray-500 mb-6">Configure the built-in Firefox browser in your Linux desktop.</p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Default Search Engine</p>
                <div className="space-y-2">
                  {FIREFOX_ENGINES.map(engine => (
                    <button
                      key={engine.id}
                      onClick={() => { setSelectedEngine(engine.id); showSaved(); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-all ${selectedEngine === engine.id ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    >
                      <span className="font-medium">{engine.label}</span>
                      {selectedEngine === engine.id && <Check size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-1">Home Page URL</p>
                <input
                  type="text" defaultValue="https://en.wikipedia.org/wiki/Linux"
                  className="w-full text-sm border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {[
                { label: 'Block pop-ups', desc: 'Block websites from opening new windows.' },
                { label: 'Enable JavaScript', desc: 'Required for most websites to function.' },
                { label: 'Remember browsing history', desc: 'Save visited pages within the session.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={showSaved}
                    className="w-11 h-6 rounded-full bg-blue-500 relative cursor-pointer flex-shrink-0"
                  >
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Personalization</h2>
            <p className="text-sm text-gray-500 mb-6">Change the desktop wallpaper and visual theme.</p>
            <div className="space-y-6">
              {/* Active Wallpaper Preview */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-gray-200 bg-gray-200">
                  <div 
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${wallpaper})` }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <ImageIcon size={14} className="text-gray-400" />
                    Active Wallpaper
                  </p>
                  <p className="text-xs text-gray-500 truncate">{wallpaper.startsWith('http') ? wallpaper : 'System Default'}</p>
                </div>
              </div>

              <div>
                <p className="font-medium text-gray-800 text-sm mb-3">Wallpaper Presets</p>
                <div className="grid grid-cols-4 gap-3">
                  {WALLPAPER_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => { onWallpaperChange(preset.url); showSaved(); }}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${wallpaper === preset.url ? 'border-blue-500 ring-2 ring-blue-300' : 'border-transparent hover:border-blue-200'}`}
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${preset.url})`, minHeight: '60px' }}
                      />
                      {wallpaper === preset.url && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                          <Check size={20} className="text-white drop-shadow" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-2 text-center">{preset.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Upload Custom Wallpaper</p>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm font-semibold text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Upload size={16} />
                    {isUploading ? 'Uploading Wallpaper...' : 'Select and Upload Image from PC'}
                  </button>
                  <p className="text-[11px] text-gray-400">Supported formats: JPG, PNG, GIF, SVG, WEBP</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-medium text-gray-800 text-sm mb-2">Custom Wallpaper URL</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customWallpaper}
                    onChange={e => setCustomWallpaper(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 text-sm border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => { if (customWallpaper) { onWallpaperChange(customWallpaper); showSaved(); } }}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">System Information</h2>
            <p className="text-sm text-gray-500 mb-6">Details about your GWorkspace host computer.</p>
            {sysInfo ? (
              <div className="space-y-3">
                {[
                  { icon: <Monitor size={16} />, label: 'Operating System', value: sysInfo.os },
                  { icon: <User size={16} />, label: 'Username', value: sysInfo.username },
                  { icon: <Wifi size={16} />, label: 'Hostname', value: sysInfo.hostname },
                  { icon: <Cpu size={16} />, label: 'Processor', value: sysInfo.cpus },
                  { icon: <MemoryStick size={16} />, label: 'Total RAM', value: sysInfo.totalMem },
                  { icon: <MemoryStick size={16} />, label: 'Available RAM', value: sysInfo.freeMem },
                  { icon: <HardDrive size={16} />, label: 'Architecture', value: sysInfo.arch },
                  { icon: <RefreshCw size={16} />, label: 'System Uptime', value: sysInfo.uptime },
                  { icon: <Info size={16} />, label: 'Platform', value: sysInfo.platform },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="text-blue-500 flex-shrink-0">{row.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">{row.label}</p>
                      <p className="text-sm font-medium text-gray-800 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                <p className="text-sm">Loading system info...</p>
              </div>
            )}
          </div>
        );

      case 'network':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Network</h2>
            <p className="text-sm text-gray-500 mb-6">View network connection information.</p>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200 flex items-center gap-3">
                <Wifi size={20} className="text-green-500" />
                <div>
                  <p className="font-medium text-green-800 text-sm">Connected to Internet</p>
                  <p className="text-xs text-green-600">All apps have full network access via Electron.</p>
                </div>
              </div>
              {[
                { label: 'DNS Server', value: '8.8.8.8 (Google)' },
                { label: 'Proxy', value: 'None (Direct)' },
                { label: 'User Agent', value: 'Mozilla/5.0 (Electron)' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600">{r.label}</p>
                  <p className="text-sm font-medium text-gray-800">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Privacy & Security</h2>
            <p className="text-sm text-gray-500 mb-6">Manage permissions and security settings.</p>
            <div className="space-y-4">
              {[
                { label: 'Allow pop-ups', desc: 'Let apps open new windows.' },
                { label: 'Block third-party cookies', desc: 'Prevents cross-site tracking.' },
                { label: 'Clear data on exit', desc: 'Delete session data when you close the app.' },
                { label: 'Hardware acceleration', desc: 'Use GPU for faster rendering.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button onClick={showSaved} className="w-11 h-6 rounded-full bg-blue-500 relative cursor-pointer flex-shrink-0">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Notifications</h2>
            <p className="text-sm text-gray-500 mb-6">Control system notification behavior.</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Enable all notifications</p>
                  <p className="text-xs text-gray-500">Master switch for all notification types.</p>
                </div>
                <button
                  onClick={() => { setNotificationsEnabled(!notificationsEnabled); showSaved(); }}
                  className={`w-11 h-6 rounded-full relative cursor-pointer flex-shrink-0 transition-colors ${notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'account':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Account</h2>
            <p className="text-sm text-gray-500 mb-6">Your Google Machine account details.</p>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">G</div>
              <div>
                <p className="font-semibold text-gray-800">{sysInfo?.username || 'User'}</p>
                <p className="text-sm text-gray-500">{sysInfo?.hostname || 'google-machine'}</p>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">About GWorkspace</h2>
            <p className="text-sm text-gray-500 mb-6">Version and build information.</p>
            <div className="space-y-3">
              {[
                { label: 'Application', value: 'GWorkspace' },
                { label: 'Version', value: '2.0.0 (Electron Edition)' },
                { label: 'Electron Version', value: 'Latest' },
                { label: 'React Version', value: '19.x' },
                { label: 'Built With', value: 'Vite + TypeScript + Tailwind CSS' },
                { label: 'Rendering Engine', value: 'Chromium (via Electron)' },
              ].map((r, i) => (
                <div key={i} className="flex justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-sm text-gray-600">{r.label}</p>
                  <p className="text-sm font-medium text-gray-800">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-white font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 bg-[#f6f8fa] border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
        <div className="px-4 pt-5 pb-3 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Settings</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5 scrollbar-thin">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left ${
                activeSection === item.id
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className={activeSection === item.id ? 'text-blue-500' : 'text-gray-400'}>{item.icon}</span>
              {item.label}
              {activeSection === item.id && <ChevronRight size={14} className="ml-auto text-blue-400" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-2xl">
          {renderContent()}
          {savedMsg && (
            <div className="fixed bottom-6 right-6 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-4">
              <Check size={14} /> {savedMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsApp;
