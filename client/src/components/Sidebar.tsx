import React from 'react';
import { 
  LayoutDashboard, 
  Monitor, 
  Cloud, 
  AppWindow, 
  Activity, 
  Settings, 
  User,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspaces', label: 'Workspaces', icon: Monitor },
    { id: 'storage', label: 'Cloud Storage', icon: Cloud },
    { id: 'apps', label: 'Installed Apps', icon: AppWindow },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <div className="w-64 bg-white border-r border-google-gray-200 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-google-blue rounded-full flex items-center justify-center text-white font-bold">G</div>
        <span className="text-xl font-medium text-google-gray-800">Google Machine</span>
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-item ${activeTab === item.id ? 'sidebar-item-active' : ''}`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-google-gray-200">
        <div 
          onClick={onLogout}
          className="sidebar-item hover:text-google-red transition-colors rounded-google"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
