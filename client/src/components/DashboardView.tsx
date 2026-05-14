import React from 'react';
import { Cloud, Monitor, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import type { Workspace } from '../types';

interface DashboardViewProps {
  workspaces: Workspace[];
  storageUsed: number;
  isDarkMode?: boolean;
  user: any;
  onLaunch: (id: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ workspaces, storageUsed, isDarkMode, user, onLaunch }) => {
  const maxStorage = 500; // MB
  const storagePercentage = (storageUsed / maxStorage) * 100;
  const firstName = (user?.displayName || user?.email || 'Admin').split(' ')[0];

  return (
    <div className={`p-12 max-w-7xl mx-auto animate-in fade-in duration-500 font-sans`}>
      <div className="mb-12">
        <h1 className={`text-5xl font-black mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          Welcome back, {firstName}
        </h1>
        <p className={isDarkMode ? 'text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]' : 'text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]'}>
          Instance Health Monitor • Active Clusters: {workspaces.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Storage Card */}
        <div className={`rounded-[40px] p-8 border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Cloud Storage</h3>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-inner'}`}>
              <Cloud size={24} />
            </div>
          </div>
          <div className={`text-4xl font-black mb-6 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {storageUsed} <span className={`text-xl font-bold ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>/ {maxStorage} MB</span>
          </div>
          <div className={`w-full h-2.5 rounded-full mb-4 overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000 shadow-lg shadow-blue-600/40" 
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Encrypted & Redundant</p>
          </div>
        </div>

        {/* Workspaces Card */}
        <div className={`rounded-[40px] p-8 border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Active Nodes</h3>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600 shadow-inner'}`}>
              <Monitor size={24} />
            </div>
          </div>
          <div className={`text-6xl font-black mb-6 tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {workspaces.filter(w => w.status === 'running').length}
          </div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Environments ready for deployment</p>
        </div>

        {/* Sync Status Card */}
        <div className={`rounded-[40px] p-8 border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`font-black text-[10px] uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Security Status</h3>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600 shadow-inner'}`}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div className={`text-2xl font-black mb-4 tracking-tight ${isDarkMode ? 'text-green-400' : 'text-emerald-600'}`}>FULLY SECURED</div>
          <p className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Zero vulnerabilities detected</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-xs font-black uppercase tracking-[0.4em] ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>Infrastructure Overview</h2>
        <div className={`h-[1px] flex-1 mx-8 ${isDarkMode ? 'bg-white/5' : 'bg-slate-100'}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspaces.map((ws) => (
          <div 
            key={ws.id} 
            onClick={() => onLaunch(ws.id)}
            className={`rounded-[32px] p-8 border transition-all flex items-center justify-between group cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10' : 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-600/5'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${ws.status === 'running' ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-50 text-slate-400')}`}>
                <Monitor size={32} />
              </div>
              <div>
                <h4 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{ws.name}</h4>
                <div className={`flex items-center gap-4 text-[10px] font-black uppercase tracking-widest mt-2 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="opacity-40" /> {ws.lastActive}
                  </span>
                  <span className="opacity-20 text-lg">·</span>
                  <span>{ws.template}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${ws.status === 'running' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : (isDarkMode ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-slate-50 text-slate-400 border border-slate-100')}`}>
                {ws.status}
              </span>
              <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isDarkMode ? 'text-blue-400 group-hover:text-blue-300' : 'text-blue-600 group-hover:text-blue-700'}`}>
                Access Engine <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
