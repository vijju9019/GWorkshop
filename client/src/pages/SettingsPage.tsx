import React, { useState } from 'react';
import { Shield, User, HardDrive, Check, X } from 'lucide-react';
import { updateProfile, updateEmail } from 'firebase/auth';
import { auth } from '../services/firebase';

interface SettingsPageProps {
  isDarkMode?: boolean;
  user?: any;
  onUpdateUser?: (updatedData: any) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ isDarkMode, user, onUpdateUser }) => {
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || 'User Name');
  
  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || 'user@example.com');

  const [loading, setLoading] = useState(false);

  const saveName = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }
      if (onUpdateUser) {
        onUpdateUser({ displayName });
      }
      setEditingName(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to update name');
    }
    setLoading(false);
  };

  const saveEmail = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, email);
      }
      if (onUpdateUser) {
        onUpdateUser({ email });
      }
      setEditingEmail(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to update email. You may need to sign in again.');
    }
    setLoading(false);
  };

  const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
  const subTextColor = isDarkMode ? 'text-white/60' : 'text-slate-500';
  const cardBg = isDarkMode ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100';
  const headerBorder = isDarkMode ? 'border-white/5' : 'border-slate-100';
  const inputBg = isDarkMode ? 'bg-black/20 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className={`text-3xl font-black mb-2 ${textColor}`}>Settings</h1>
        <p className={`font-medium ${subTextColor}`}>Manage your workspace preferences and account security.</p>
      </div>

      <div className="space-y-6">
        <div className={`rounded-3xl border ${cardBg} overflow-hidden shadow-sm`}>
          <div className={`p-6 border-b ${headerBorder} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
               <User size={20} />
            </div>
            <h3 className={`text-lg font-black tracking-tight ${textColor}`}>Account Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Display Name */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className={`font-bold ${textColor}`}>Display Name</p>
                {editingName ? (
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={e => setDisplayName(e.target.value)}
                    className={`mt-2 px-3 py-2 rounded-xl outline-none border w-full max-w-xs ${inputBg}`}
                    autoFocus
                  />
                ) : (
                  <p className={`text-sm mt-1 ${subTextColor}`}>{displayName}</p>
                )}
              </div>
              <div className="ml-4">
                {editingName ? (
                  <div className="flex gap-2">
                    <button onClick={saveName} disabled={loading} className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingName(false)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditingName(true)} className="text-blue-500 text-sm font-black uppercase tracking-widest hover:underline px-4 py-2 rounded-full hover:bg-blue-500/5 transition-colors">
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div className={`h-[1px] w-full ${headerBorder}`} />

            {/* Email Address */}
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <p className={`font-bold ${textColor}`}>Email Address</p>
                {editingEmail ? (
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className={`mt-2 px-3 py-2 rounded-xl outline-none border w-full max-w-xs ${inputBg}`}
                    autoFocus
                  />
                ) : (
                  <p className={`text-sm mt-1 ${subTextColor}`}>{email}</p>
                )}
              </div>
              <div className="ml-4">
                {editingEmail ? (
                  <div className="flex gap-2">
                    <button onClick={saveEmail} disabled={loading} className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500/20">
                      <Check size={16} />
                    </button>
                    <button onClick={() => setEditingEmail(false)} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditingEmail(true)} className="text-blue-500 text-sm font-black uppercase tracking-widest hover:underline px-4 py-2 rounded-full hover:bg-blue-500/5 transition-colors">
                    Change
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border ${cardBg} overflow-hidden shadow-sm`}>
          <div className={`p-6 border-b ${headerBorder} flex items-center gap-3`}>
             <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
               <HardDrive size={20} />
            </div>
            <h3 className={`text-lg font-black tracking-tight ${textColor}`}>Workspace Preferences</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-bold ${textColor}`}>Auto-Pause Workspaces</p>
                <p className={`text-sm mt-1 ${subTextColor}`}>Automatically pause workspaces after 30 mins of inactivity</p>
              </div>
              <input type="checkbox" defaultChecked className="w-6 h-6 accent-blue-500" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-bold ${textColor}`}>Default Region</p>
                <p className={`text-sm mt-1 ${subTextColor}`}>Cloud Node: US-East-1</p>
              </div>
              <select className={`${inputBg} rounded-xl px-4 py-2 text-sm outline-none font-bold`}>
                <option>US-East-1</option>
                <option>EU-West-1</option>
                <option>Asia-South-1</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border ${cardBg} overflow-hidden shadow-sm`}>
          <div className={`p-6 border-b ${headerBorder} flex items-center gap-3`}>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
               <Shield size={20} />
            </div>
            <h3 className={`text-lg font-black tracking-tight ${textColor}`}>Security & Privacy</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-bold ${textColor}`}>Two-Step Verification</p>
                <p className={`text-sm mt-1 ${subTextColor}`}>Add an extra layer of security to your account</p>
              </div>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-colors">
                Enable
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className={`font-bold ${textColor}`}>Workspace Sync Encryption</p>
                <p className={`text-sm mt-1 ${subTextColor}`}>All data is encrypted before uploading to cloud</p>
              </div>
              <span className="text-green-500 bg-green-500/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
