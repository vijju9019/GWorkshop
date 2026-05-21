import React, { useState } from 'react';
import { 
  Plus, Monitor, Pause, Play, Trash2, Clock, Cpu, HardDrive, Settings, X,
  Terminal, Globe, Shield, Layout, ArrowRight, Share2, Users
} from 'lucide-react';
import type { Workspace } from '../types';

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  onCreate: (name: string, template: string) => void;
  onLaunch: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onShare?: (id: string, email: string) => void;
  onMerge?: (id: string) => void;
  currentUser?: any;
  isDarkMode?: boolean;
  autoOpenCreateModal?: boolean;
  setAutoOpenCreateModal?: (open: boolean) => void;
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

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ 
  workspaces, 
  onCreate, 
  onLaunch, 
  onDelete, 
  onToggleStatus, 
  onShare,
  onMerge,
  currentUser,
  isDarkMode, 
  autoOpenCreateModal, 
  setAutoOpenCreateModal 
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [template, setTemplate] = useState('Ubuntu Desktop');

  // Share state
  const [showShare, setShowShare] = useState(false);
  const [shareWsId, setShareWsId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  React.useEffect(() => {
    if (autoOpenCreateModal) {
      setShowCreate(true);
      if (setAutoOpenCreateModal) {
        setAutoOpenCreateModal(false);
      }
    }
  }, [autoOpenCreateModal, setAutoOpenCreateModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreate(newName, template);
      setNewName('');
      setShowCreate(false);
    }
  };

  const handleShareClick = (id: string) => {
    setShareWsId(id);
    setShowShare(true);
  };

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shareWsId && shareEmail && onShare) {
      setShareLoading(true);
      try {
        const result = await onShare(shareWsId, shareEmail);
        setShareSuccess(true);
        if (result && result.previewUrl) {
          setSharePreviewUrl(result.previewUrl);
        }
      } catch (err) {
        console.error("Failed to share workspace:", err);
      } finally {
        setShareLoading(false);
      }
    }
  };

  const handleCopyLink = () => {
    if (!shareWsId || !currentUser) return;
    const ws = workspaces.find(w => w.id === shareWsId);
    const ownerId = ws?.ownerId || currentUser.uid;
    const shareLink = `${window.location.origin}/?shareWorkspace=${shareWsId}&ownerId=${ownerId}`;
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const templates = [
    { name: 'Ubuntu Desktop', icon: <Terminal size={20} className="text-orange-500" />, desc: 'Node.js, Docker, Git' },
    { name: 'ChromeOS Mini', icon: <Globe size={20} className="text-blue-500" />, desc: 'Lightweight web development' },
    { name: 'Windows 11 Light', icon: <Layout size={20} className="text-sky-500" />, desc: 'VS Code, PowerShell, .NET' },
    { name: 'Cloud Debian', icon: <Shield size={20} className="text-red-500" />, desc: 'Hardened production testing' },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-4xl font-black tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Compute Workspaces</h2>
          <p className={isDarkMode ? 'text-white/40 font-bold' : 'text-slate-500 font-bold'}>Manage and connect to your dedicated OS environments.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black px-8 py-5 rounded-[24px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-600/20 flex items-center gap-3 text-lg"
        >
          <Plus size={20} />
          Deploy Instance
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {workspaces.map((ws) => {
          const isOwner = !currentUser || !ws.ownerId || ws.ownerId === currentUser.uid;
          return (
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
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${ws.status === 'running' ? 'bg-green-500/10 text-green-600' : ws.status === 'paused' ? 'bg-yellow-500/10 text-yellow-600' : (isDarkMode ? 'bg-white/5 text-white/20' : 'bg-slate-100 text-slate-500')}`}>
                        <div className={`w-2 h-2 rounded-full ${ws.status === 'running' ? 'bg-green-500 animate-pulse' : ws.status === 'paused' ? 'bg-yellow-500' : 'bg-slate-400'}`}></div>
                        {ws.status}
                      </div>
                      
                      {isOwner && ws.sharedWith && ws.sharedWith.length > 0 && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`} title={`Shared with: ${ws.sharedWith.join(', ')}`}>
                          <Users size={10} />
                          {ws.sharedWith.length} Shared
                        </div>
                      )}

                      {!isOwner && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                          <Users size={10} />
                          Shared with you
                        </div>
                      )}

                      {ws.parentWorkspaceId && (
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`} title="Forked Workspace">
                          <Layout size={10} />
                          Fork
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isOwner ? (
                    <>
                      <button 
                        onClick={() => handleShareClick(ws.id)}
                        className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-700'}`}
                        title="Share Workspace"
                      >
                        <Share2 size={20} />
                      </button>
                      <button className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-white/5 text-white/20' : 'hover:bg-slate-50 text-slate-400'}`}>
                        <Settings size={20} />
                      </button>
                      <button 
                        onClick={() => onDelete(ws.id)}
                        className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-400'}`}
                      >
                        <Trash2 size={20} />
                      </button>
                      {ws.parentWorkspaceId && onMerge && (
                        <button 
                          onClick={() => onMerge(ws.id)}
                          className={`p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/40' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                          title="Merge to Original Workspace"
                        >
                          <ArrowRight size={20} />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-white/5 text-white/30' : 'bg-slate-50 text-slate-400'}`}>
                      Read Only Control
                    </div>
                  )}
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
          );
        })}
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

      {showShare && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[10001] p-4 animate-in fade-in duration-300">
          <div className={`w-full max-w-lg rounded-[40px] p-10 animate-in zoom-in-95 duration-400 relative shadow-2xl transition-colors ${isDarkMode ? 'bg-[#1e293b] text-white' : 'bg-white'}`}>
            <button 
              onClick={() => { 
                setShowShare(false); 
                setShareEmail(''); 
                setShareWsId(null);
                setShareSuccess(false);
                setSharePreviewUrl(null);
              }} 
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Share Workspace</h2>
              <p className={isDarkMode ? 'text-white/40 font-medium text-sm' : 'text-slate-500 font-medium text-sm'}>
                {!shareSuccess ? "Allow others to access and work on this compute instance." : "Workspace access has been shared."}
              </p>
            </div>

            {!shareSuccess ? (
              <form onSubmit={handleShareSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Collaborator's Email</label>
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    className={`w-full px-5 py-4 rounded-2xl outline-none transition-all font-bold ${isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:bg-white/10 focus:border-blue-500' : 'bg-slate-50 border border-slate-100 text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}`}
                    placeholder="colleague@domain.com"
                    required
                    disabled={shareLoading}
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={handleCopyLink}
                    className={`flex-1 py-5 font-black rounded-2xl transition-all border flex items-center justify-center gap-3 text-lg ${
                      isDarkMode 
                        ? 'border-white/10 text-white hover:bg-white/5' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {linkCopied ? "Link Copied!" : "Copy Share Link"}
                  </button>

                  <button 
                    type="submit" 
                    disabled={shareLoading}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 text-lg disabled:opacity-50 animate-pulse-once"
                  >
                    {shareLoading ? "Sharing..." : "Send Invite"}
                    <Share2 size={20} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckIcon size={32} />
                </div>
                
                <div className="space-y-2">
                  <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Shared successfully!</p>
                  <p className="text-xs text-slate-400">An invitation email has been sent to <strong>{shareEmail}</strong>.</p>
                </div>

                <div className="space-y-3 pt-4">
                  <button 
                    onClick={handleCopyLink}
                    className={`w-full py-4 font-black rounded-2xl transition-all border flex items-center justify-center gap-3 text-sm ${
                      isDarkMode 
                        ? 'border-white/10 text-white hover:bg-white/5' 
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {linkCopied ? "Link Copied!" : "Copy Share Link"}
                  </button>

                  {sharePreviewUrl && (
                    <div className={`p-4 rounded-2xl text-left text-xs ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300' : 'bg-blue-50 border border-blue-100 text-blue-700'}`}>
                      <p className="font-bold mb-1">📬 Dev Mode Email Preview:</p>
                      <p className="mb-2">Since you're running locally, you can view the sent email in the mock inbox:</p>
                      <a 
                        href={sharePreviewUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="font-bold underline flex items-center gap-1.5 hover:text-blue-500"
                      >
                        Open Ethereal Mail Inbox &rarr;
                      </a>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => { 
                    setShowShare(false); 
                    setShareEmail(''); 
                    setShareWsId(null);
                    setShareSuccess(false);
                    setSharePreviewUrl(null);
                  }}
                  className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all text-sm uppercase tracking-widest mt-6"
                >
                  Done
                </button>
              </div>
            )}
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
