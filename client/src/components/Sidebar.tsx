import React from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  HardDrive, 
  Activity, 
  Settings, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Grid
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, isDarkMode }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Console', icon: <LayoutDashboard size={20} /> },
    { id: 'workspaces', label: 'Virtual Machines', icon: <Monitor size={20} /> },
    { id: 'storage', label: 'Cloud Storage', icon: <HardDrive size={20} /> },
    { id: 'performance', label: 'Cluster Stats', icon: <Activity size={20} /> },
    { id: 'apps', label: 'Marketplace', icon: <Grid size={20} /> },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Global Settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`w-72 h-screen flex flex-col border-r relative z-20 font-sans transition-all duration-500 ${isDarkMode ? 'bg-[#0f172a] border-white/5 shadow-2xl shadow-black/50' : 'bg-white border-slate-200 shadow-sm'}`}>
      {/* Brand Header */}
      <div className="p-8 pb-10">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
            <span className="text-white font-black text-2xl">G</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-black text-xl tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GWorkspace</span>
            <span className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-[10px] font-black uppercase tracking-[0.2em] mt-1`}>Enterprise v2.4</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] font-black uppercase tracking-[0.2em] mb-4 ml-4`}>Management</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
              {item.icon}
            </div>
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
            {activeTab === item.id && (
              <div className="ml-auto">
                <ChevronRight size={16} className="text-white/60" />
              </div>
            )}
            
            {/* Active Indicator Line */}
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-full -ml-1" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-6 mt-auto space-y-2">
        <div className={`mb-4 px-4 py-3 rounded-2xl border flex items-center gap-3 transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
            <ShieldCheck size={16} className="text-green-500" />
          </div>
          <div className="flex flex-col">
            <span className={`text-[10px] font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Security Shield</span>
            <span className={`${isDarkMode ? 'text-green-500/80' : 'text-green-600/80'} text-[8px] font-bold uppercase tracking-widest`}>Active & Protected</span>
          </div>
        </div>

        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {item.icon}
            <span className="font-bold text-sm tracking-tight">{item.label}</span>
          </button>
        ))}

        <button 
          onClick={onLogout}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm tracking-tight group ${isDarkMode ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-500 hover:text-red-600 hover:bg-red-50'}`}
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          Logout
        </button>
      </div>

      {/* Footer Branding */}
      <div className={`p-8 pt-0 transition-opacity ${isDarkMode ? 'opacity-20' : 'opacity-40'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] text-center ${isDarkMode ? 'text-white' : 'text-slate-400'}`}>G-ENGINE CLOUD INFRA</p>
      </div>
    </aside>
  );
};

export default Sidebar;
