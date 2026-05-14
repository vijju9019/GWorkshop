import React, { useState } from 'react';
import { 
  Plus, Monitor, Pause, Play, Trash2, Clock, Cpu, HardDrive, Settings, X,
  Terminal, Globe, Shield, Layout, ArrowRight, Check
} from 'lucide-react';
import type { Workspace } from '../types';

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  onCreate: (name: string, template: string) => void;
  onLaunch: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isDarkMode?: boolean;
}

const getTemplateIcon = (template: string) => {
  switch (template) {
    case 'Ubuntu Desktop': return <Terminal size={32} className="text-orange-500" />;
    case 'ChromeOS Mini': return <Globe size={32} className="text-blue-500" />;
    case 'Windows 11 Light': return <Layout size={32} className="text-sky-500" />;
    case 'Cloud Debian': return <Shield size={32} className="text-red-500" />;
    default: return <Monitor size={32} />;
  }
};

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ workspaces, onCreate, onLaunch, onDelete, onToggleStatus, isDarkMode }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [template, setTemplate] = useState('Ubuntu Desktop');

  const templates = [
    { name: 'Ubuntu Desktop', icon: <Terminal size={18} />, desc: 'LTS edition with full terminal support' },
    { name: 'ChromeOS Mini', icon: <Globe size={18} />, desc: 'Lightweight web-centric environment' },
    { name: 'Windows 11 Light', icon: <Layout size={18} />, desc: 'Familiar productivity interface' },
    { name: 'Cloud Debian', icon: <Shield size={18} />, desc: 'Secure server-grade environment' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newName, template);
    setShowCreate(false);
    setNewName('');
  };

  return (
    <div className={`p-10 max-w-7xl mx-auto animate-in fade-in duration-500 font-sans transition-colors duration-500`}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className={`text-4xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GWorkspace Console</h1>
          <p className={isDarkMode ? 'text-white/40 font-medium' : 'text-slate-500 font-medium'}>Manage your virtual clusters and private cloud environments.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={20} />
          Deploy New Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {workspaces.map((ws) => (
          <div key={ws.id} className={`rounded-[32px] p-8 flex flex-col gap-6 border transition-all group relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-blue-500/30' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200'}`}>
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full -mr-10 -mt-10 ${ws.status === 'running' ? 'bg-green-500' : 'bg-slate-400'}`} />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex gap-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${ws.status === 'running' ? (isDarkMode ? 'bg-white/10' : 'bg-white shadow-xl ring-1 ring-slate-100') : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-400')}`}>
                  {getTemplateIcon(ws.template)}
                </div>
                <div>
                  <h3 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{ws.name}</h3>
                  <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>{ws.template}</p>
                  <div className={`mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ws.status === 'running' ? 'bg-green-500/10 text-green-600' : ws.status === 'paused' ? 'bg-yellow-500/10 text-yellow-600' : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-500')}`}>
                    <div className={`w-2 h-2 rounded-full ${ws.status === 'running' ? 'bg-green-500 animate-pulse' : ws.status === 'paused' ? 'bg-yellow-500' : 'bg-slate-400'}`}></div>
                    {ws.status}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5 text-white/20' : 'hover:bg-slate-50 text-slate-400'}`}>
                  <Settings size={20} />
                </button>
                <button 
                  onClick={() => onDelete(ws.id)}
                  className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-400'}`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className={`grid grid-cols-3 gap-6 rounded-2xl p-5 relative z-10 border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50/50 border-slate-50'}`}>
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                  <Cpu size={14} /> RAM
                </div>
                <div className={`font-bold ${isDarkMode ? 'text-white/60' : 'text-slate-800'}`}>{ws.ramUsage}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                  <HardDrive size={14} /> Storage
                </div>
                <div className={`font-bold ${isDarkMode ? 'text-white/60' : 'text-slate-800'}`}>{ws.storageUsage}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className={`flex items-center gap-2 text-[10px] uppercase font-black tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                  <Clock size={14} /> Active
                </div>
                <div className={`font-bold text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-800'}`}>{ws.lastActive}</div>
              </div>
            </div>

            <div className="flex gap-4 mt-2 relative z-10">
              {ws.status === 'running' ? (
                <>
                  <button onClick={() => onLaunch(ws.id)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                    <Play size={20} />
                    Open Session
                  </button>
                  <button onClick={() => onToggleStatus(ws.id)} className={`px-6 rounded-2xl transition-all flex items-center justify-center ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                    <Pause size={20} />
                  </button>
                </>
              ) : (
                <button onClick={() => onLaunch(ws.id)} className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                  <Play size={20} />
                  Launch Workspace
                </button>
              )}
            </div>
          </div>
        ))}
        {workspaces.length === 0 && (
          <div className={`col-span-full py-32 text-center rounded-[40px] border-4 border-dashed transition-colors ${isDarkMode ? 'bg-white/5 border-white/5 text-white/10' : 'bg-slate-50 border-slate-200 text-slate-200'}`}>
            <Monitor size={64} className="mx-auto mb-6" />
            <h3 className="text-xl font-bold">No active deployments</h3>
            <p className="text-sm mt-2">Deploy your first workspace to start working.</p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[10001] p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95 duration-400 relative shadow-2xl transition-colors ${isDarkMode ? 'bg-[#1e293b] text-white' : 'bg-white'}`}>
            <button onClick={() => setShowCreate(false)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 tracking-tight">New Workspace</h2>
              <p className={isDarkMode ? 'text-white/40 font-medium text-sm' : 'text-slate-500 font-medium text-sm'}>Select a blueprint to begin deployment.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Environment Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-5 py-4 rounded-2xl outline-none transition-all font-bold ${isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-blue-500' : 'bg-slate-50 border border-slate-100 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
                  placeholder="e.g. Production Shell"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Blueprint</label>
                <div className="grid grid-cols-1 gap-3">
                  {templates.map(t => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setTemplate(t.name)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${template === t.name ? (isDarkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50/50') : (isDarkMode ? 'border-white/5 bg-white/5 hover:border-white/10' : 'border-slate-50 hover:border-slate-200')}`}
                    >
                      <div className={`p-3 rounded-xl ${template === t.name ? 'bg-blue-500 text-white' : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-400')}`}>
                        {t.icon}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${template === t.name ? (isDarkMode ? 'text-blue-400' : 'text-blue-900') : (isDarkMode ? 'text-white/60' : 'text-slate-700')}`}>{t.name}</p>
                        <p className={`text-[10px] font-medium uppercase tracking-wider mt-0.5 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>{t.desc}</p>
                      </div>
                      {template === t.name && <div className="ml-auto w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white"><CheckIcon size={14} /></div>}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 text-lg">
                Deploy Workspace
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

export default WorkspaceManager;
