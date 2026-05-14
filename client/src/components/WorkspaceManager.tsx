import React, { useState } from 'react';
import { Plus, Monitor, Pause, Play, Trash2, Clock, Cpu, HardDrive } from 'lucide-react';
import { Workspace } from '../types';

interface WorkspaceManagerProps {
  workspaces: Workspace[];
  onCreate: (name: string, template: string) => void;
  onLaunch: (id: string) => void;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({ workspaces, onCreate, onLaunch }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [template, setTemplate] = useState('Ubuntu Desktop');

  const templates = ['Ubuntu Desktop', 'ChromeOS Mini', 'Windows 11 Light', 'Cloud Debian'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(newName, template);
    setShowCreate(false);
    setNewName('');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-medium text-google-gray-900 mb-2">Workspace Manager</h1>
          <p className="text-google-gray-700">Create and manage your virtual environments.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="google-button google-button-primary"
        >
          <Plus size={20} />
          Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workspaces.map((ws) => (
          <div key={ws.id} className="google-card p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className={`w-14 h-14 rounded-google flex items-center justify-center ${ws.status === 'running' ? 'bg-green-100 text-google-green' : 'bg-google-gray-100 text-google-gray-500'}`}>
                  <Monitor size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-google-gray-800">{ws.name}</h3>
                  <p className="text-sm text-google-gray-600">{ws.template}</p>
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${ws.status === 'running' ? 'bg-green-100 text-google-green' : ws.status === 'paused' ? 'bg-yellow-100 text-google-yellow' : 'bg-google-gray-100 text-google-gray-700'}`}>
                    <div className={`w-2 h-2 rounded-full ${ws.status === 'running' ? 'bg-google-green' : ws.status === 'paused' ? 'bg-google-yellow' : 'bg-google-gray-400'}`}></div>
                    {ws.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-google-gray-100 rounded-google text-google-gray-600 transition-colors">
                  <Settings size={20} />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-google text-google-red transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 border-y border-google-gray-100 py-4 my-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-google-gray-500 text-xs uppercase font-bold">
                  <Cpu size={14} /> RAM
                </div>
                <div className="font-medium text-google-gray-800">{ws.ramUsage}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-google-gray-500 text-xs uppercase font-bold">
                  <HardDrive size={14} /> Storage
                </div>
                <div className="font-medium text-google-gray-800">{ws.storageUsage}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-google-gray-500 text-xs uppercase font-bold">
                  <Clock size={14} /> Last Active
                </div>
                <div className="font-medium text-google-gray-800 text-sm">{ws.lastActive}</div>
              </div>
            </div>

            <div className="flex gap-3">
              {ws.status === 'running' ? (
                <>
                  <button onClick={() => onLaunch(ws.id)} className="google-button google-button-primary flex-1">
                    <Play size={18} />
                    Resume
                  </button>
                  <button className="google-button google-button-secondary">
                    <Pause size={18} />
                    Pause
                  </button>
                </>
              ) : (
                <button onClick={() => onLaunch(ws.id)} className="google-button google-button-primary w-full">
                  <Play size={18} />
                  Launch Workspace
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[10001] p-4">
          <div className="google-card w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-medium text-google-gray-900 mb-6">Create New Workspace</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-google-gray-700 ml-1">Workspace Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2 border border-google-gray-300 rounded-google focus:ring-2 focus:ring-google-blue outline-none"
                  placeholder="e.g. Development Env"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-google-gray-700 ml-1">Select Template</label>
                <select 
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-2 border border-google-gray-300 rounded-google focus:ring-2 focus:ring-google-blue outline-none bg-white"
                >
                  {templates.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreate(false)}
                  className="google-button google-button-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="google-button google-button-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceManager;
