import React from 'react';
import { Cloud, Monitor, CheckCircle, Clock } from 'lucide-react';
import { Workspace } from '../types';

interface DashboardViewProps {
  workspaces: Workspace[];
  storageUsed: number;
}

const DashboardView: React.FC<DashboardViewProps> = ({ workspaces, storageUsed }) => {
  const maxStorage = 500; // MB
  const storagePercentage = (storageUsed / maxStorage) * 100;

  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-google-gray-900 mb-2">Welcome back, User</h1>
        <p className="text-google-gray-700">Here's an overview of your virtual infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Storage Card */}
        <div className="google-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-google-gray-800">Cloud Storage</h3>
            <Cloud className="text-google-blue" size={24} />
          </div>
          <div className="text-3xl font-semibold mb-2">
            {storageUsed} <span className="text-lg font-normal text-google-gray-500">/ {maxStorage} MB</span>
          </div>
          <div className="w-full bg-google-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-google-blue h-2 rounded-full transition-all duration-500" 
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-google-gray-600">Your cloud workspace is synced.</p>
        </div>

        {/* Workspaces Card */}
        <div className="google-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-google-gray-800">Active Workspaces</h3>
            <Monitor className="text-google-green" size={24} />
          </div>
          <div className="text-3xl font-semibold mb-2">
            {workspaces.filter(w => w.status === 'running').length}
          </div>
          <p className="text-sm text-google-gray-600">Running on virtual infrastructure.</p>
        </div>

        {/* Sync Status Card */}
        <div className="google-card p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-google-gray-800">Sync Status</h3>
            <CheckCircle className="text-google-blue" size={24} />
          </div>
          <div className="text-xl font-medium text-google-green">Up to date</div>
          <p className="text-sm text-google-gray-600 mt-2">Last synced: Just now</p>
        </div>
      </div>

      <h2 className="text-xl font-medium text-google-gray-900 mb-4">Recent Workspaces</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workspaces.map((ws) => (
          <div key={ws.id} className="google-card google-card-hover p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${ws.status === 'running' ? 'bg-green-100 text-google-green' : 'bg-google-gray-100 text-google-gray-500'}`}>
                <Monitor size={24} />
              </div>
              <div>
                <h4 className="font-medium text-google-gray-800">{ws.name}</h4>
                <div className="flex items-center gap-3 text-sm text-google-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {ws.lastActive}
                  </span>
                  <span>•</span>
                  <span>{ws.template}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${ws.status === 'running' ? 'bg-green-100 text-google-green' : 'bg-google-gray-100 text-google-gray-700'}`}>
                {ws.status.toUpperCase()}
              </span>
              <button className="text-google-blue text-sm font-medium mt-2 hover:underline">Launch</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
