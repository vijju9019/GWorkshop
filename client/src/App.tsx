import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import WorkspaceManager from './components/WorkspaceManager';
import VirtualDesktop from './components/VirtualDesktop';
import CloudStorage from './components/CloudStorage';
import PerformanceMonitor from './components/PerformanceMonitor';
import SettingsPage from './pages/SettingsPage';
import type { Workspace } from './types';
import { auth, signOut, onAuthStateChanged, type User } from './services/firebase';
import { Sun, Moon, Layout, Cpu, Globe, MessageSquare, Terminal, Maximize } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDesktopMode, setIsDesktopMode] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('gw_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('gw_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Workspace Persistence via Backend API
  const fetchWorkspaces = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/workspaces/${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          // Create initial workspace
          const initialWs = {
            name: user.isGuest ? 'Guest Cluster Alpha' : 'Primary Dev Node',
            template: 'Ubuntu Desktop',
            ramUsage: '2.4GB',
            storageUsage: '1.2GB',
            status: 'running',
            lastActive: 'Just now'
          };
          const createRes = await fetch(`http://localhost:3001/api/workspaces/${user.uid}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(initialWs)
          });
          if (createRes.ok) {
            const newWs = await createRes.json();
            setWorkspaces([newWs]);
          }
        } else {
          setWorkspaces(data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch workspaces', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWorkspaces();
      // Removed auto-launch for guests to prevent "opening directly" issue
      // Guests will now land on the dashboard and click "Open Session" manually.
    } else {
      setWorkspaces([]);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (loggedInUser: User) => setUser(loggedInUser);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsDesktopMode(false);
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const createWorkspace = async (name: string, template: string) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3001/api/workspaces/${user.uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, template })
      });
      if (res.ok) {
        const newWs = await res.json();
        setWorkspaces(prev => [...prev, newWs]);
      }
    } catch (err) {
      console.error('Failed to create workspace', err);
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!user) return;
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    try {
      await fetch(`http://localhost:3001/api/workspaces/${user.uid}/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete workspace', err);
    }
  };

  const toggleWorkspaceStatus = async (id: string) => {
    if (!user) return;
    let newStatus = 'stopped';
    setWorkspaces(prev => prev.map(w => {
      if (w.id === id) {
        newStatus = w.status === 'running' ? 'stopped' : 'running';
        return { ...w, status: newStatus as any };
      }
      return w;
    }));
    try {
      await fetch(`http://localhost:3001/api/workspaces/${user.uid}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error('Failed to update workspace status', err);
    }
  };

  const launchWorkspace = async (id: string) => {
    if (!user) return;
    setWorkspaces(prev => prev.map(w =>
      w.id === id ? { ...w, status: 'running' as const } : w
    ));
    setActiveWorkspaceId(id);
    setIsDesktopMode(true);
    try {
      await fetch(`http://localhost:3001/api/workspaces/${user.uid}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'running' })
      });
    } catch (err) {
      console.error('Failed to update workspace status', err);
    }
  };

  const [shouldOpenCreateModal, setShouldOpenCreateModal] = useState(false);

  const handleDeploy = () => {
    setActiveTab('workspaces');
    setShouldOpenCreateModal(true);
  };

  if (authLoading) {
    return (
      <div className={`h-screen w-screen flex flex-col items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse mb-6">
          <span className="text-white font-black text-3xl">G</span>
        </div>
        <div className={`${isDarkMode ? 'text-white/40' : 'text-slate-400'} text-xs font-black uppercase tracking-[0.3em] animate-pulse`}>Initializing GWorkspace...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  const avatarUrl = user.photoURL;
  const fullName = user.displayName || user.email || 'User';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (isDesktopMode) {
    const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
    return (
      <div className="h-screen w-screen flex flex-col animate-in fade-in duration-700">
        <div className={`${isDarkMode ? 'bg-[#0f172a] border-white/5 text-white/60' : 'bg-white border-slate-200 text-slate-400'} border-b px-6 py-2 text-[10px] font-black uppercase tracking-widest flex justify-between items-center z-[10001] transition-colors duration-500`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeWorkspace?.name || 'VIRTUAL SESSION'}</span>
            </div>
            <span className={isDarkMode ? 'text-white/20' : 'text-slate-200'}>|</span>
            <span>IDENT: {user.uid.slice(0, 8)}</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-2 py-1 rounded-full transition-all ${isDarkMode ? 'bg-white/10 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
            >
              {isDarkMode ? <Sun size={12} /> : <Moon size={12} />}
              <span className="text-[8px] font-black">{isDarkMode ? 'LIGHT' : 'DARK'}</span>
            </button>
            <button
              onClick={() => setIsDesktopMode(false)}
              className="hover:text-red-500 transition-colors flex items-center gap-2 group"
            >
              Terminate Session <LogOut size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <VirtualDesktop user={user} workspace={activeWorkspace} isDarkMode={isDarkMode} />
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
      />

      <main className="flex-1 overflow-y-auto relative">
        {/* Decorative Background Element */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'bg-blue-500/10 opacity-50' : 'bg-blue-600/5'}`} />

        <header className={`h-20 border-b flex items-center justify-between px-10 sticky top-0 z-30 transition-all duration-500 ${isDarkMode ? 'bg-[#0f172a]/80 backdrop-blur-md border-white/5' : 'bg-white/80 backdrop-blur-md border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <span className={isDarkMode ? 'text-white/40 text-xs font-bold uppercase tracking-widest' : 'text-slate-400 text-xs font-bold uppercase tracking-widest'}>Active Node:</span>
            <span className={isDarkMode ? 'text-white text-xs font-black uppercase tracking-widest' : 'text-slate-900 text-xs font-black uppercase tracking-widest'}>Main Cluster-01</span>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all shadow-sm group ${isDarkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
            >
              {isDarkMode ? <Sun size={18} className="group-hover:rotate-45 transition-transform" /> : <Moon size={18} className="group-hover:-rotate-12 transition-transform" />}
              <span className="text-[10px] font-black tracking-widest">{isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
            </button>

            <button 
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else if (document.exitFullscreen) {
                  document.exitFullscreen();
                }
              }}
              className={`p-2 rounded-2xl transition-all ${isDarkMode ? 'bg-white/5 text-white/40 hover:text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              title="Toggle Fullscreen"
            >
              <Maximize size={18} />
            </button>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-white/10" />

            <div className="flex items-center gap-4">
              <div className="text-right leading-tight">
                <p className={`text-sm font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{fullName}</p>
                <p className={isDarkMode ? 'text-white/40 text-[10px] font-bold uppercase tracking-widest' : 'text-slate-400 text-[10px] font-bold uppercase tracking-widest'}>Authorized Access</p>
              </div>
              {avatarUrl
                ? <img src={avatarUrl} className={`w-11 h-11 rounded-2xl ring-4 shadow-sm ${isDarkMode ? 'ring-white/5' : 'ring-slate-50'}`} alt={fullName} />
                : <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-blue-600/20">{initials}</div>
              }
            </div>
          </div>
        </header>

        <div className="relative z-10">
          {activeTab === 'dashboard' && (
            <DashboardView 
              workspaces={workspaces} 
              storageUsed={1.2} 
              isDarkMode={isDarkMode} 
              user={user}
              onLaunch={launchWorkspace}
              onDeploy={handleDeploy}
            />
          )}
          {activeTab === 'workspaces' && (
            <WorkspaceManager
              workspaces={workspaces}
              onCreate={createWorkspace}
              onLaunch={launchWorkspace}
              onDelete={deleteWorkspace}
              onToggleStatus={toggleWorkspaceStatus}
              isDarkMode={isDarkMode}
              autoOpenCreateModal={shouldOpenCreateModal}
              setAutoOpenCreateModal={setShouldOpenCreateModal}
            />
          )}
          {activeTab === 'storage' && <CloudStorage />}
          {activeTab === 'performance' && <PerformanceMonitor />}
          {activeTab === 'settings' && <SettingsPage isDarkMode={isDarkMode} user={user} onUpdateUser={(data) => setUser((prev: any) => ({...prev, ...data}))} />}
          {activeTab === 'account' && (
            <div className="p-12 flex justify-center">
              <div className={`rounded-[40px] shadow-xl p-10 w-full max-w-md text-center border transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5 shadow-black/20' : 'bg-white border-slate-100'}`}>
                {avatarUrl
                  ? <img src={avatarUrl} className={`w-24 h-24 rounded-[32px] mx-auto mb-6 shadow-xl ring-8 ${isDarkMode ? 'ring-white/5' : 'ring-slate-50'}`} alt={fullName} />
                  : <div className="w-24 h-24 rounded-[32px] bg-blue-600 flex items-center justify-center text-white text-4xl font-black mx-auto mb-6 shadow-xl shadow-blue-600/30">{initials}</div>
                }
                <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{fullName}</h2>
                <p className={`font-bold text-xs uppercase tracking-[0.2em] mt-2 mb-8 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>{user.email}</p>
                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl text-left border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Level</p>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Super Administrator</p>
                  </div>
                  <div className={`p-4 rounded-2xl text-left border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Instance Region</p>
                    <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Global Infrastructure</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className={`mt-10 w-full py-4 rounded-2xl font-black transition-all text-sm uppercase tracking-widest active:scale-[0.98] ${isDarkMode ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                >
                  Terminate Authority
                </button>
              </div>
            </div>
          )}
          {activeTab === 'apps' && (
            <div className="p-12">
              <div className="mb-10">
                <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>App Marketplace</h2>
                <p className={`text-sm font-bold uppercase tracking-widest mt-2 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Available Enterprise Modules</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Cloud Terminal Pro', icon: Terminal, desc: 'Advanced shell access with root capabilities.', color: 'bg-emerald-500' },
                  { name: 'Node Inspector', icon: Cpu, desc: 'Real-time monitoring for your virtual clusters.', color: 'bg-blue-600' },
                  { name: 'Global VPN', icon: Globe, desc: 'Encrypted tunnel for all virtual traffic.', color: 'bg-indigo-600' },
                  { name: 'Team Chat', icon: MessageSquare, desc: 'Collaborative messaging for node operators.', color: 'bg-rose-500' },
                  { name: 'Design Studio', icon: Layout, desc: 'Enterprise UI/UX prototyping environment.', color: 'bg-amber-500' },
                ].map((app, i) => (
                  <div key={i} className={`p-6 rounded-[32px] border group hover:scale-[1.02] transition-all cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-xl hover:shadow-blue-600/5'}`}>
                    <div className={`${app.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:rotate-6 transition-transform`}>
                      <app.icon size={28} />
                    </div>
                    <h3 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{app.name}</h3>
                    <p className={`text-sm font-medium mt-2 leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-slate-500'}`}>{app.desc}</p>
                    <button className={`mt-6 w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white/5 text-white/40 group-hover:bg-blue-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>Provision Module</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const LogOut = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

export default App;
