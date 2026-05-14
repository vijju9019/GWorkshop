import React from 'react';
import { Settings, Shield, User, Bell, Globe, HardDrive } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-google-gray-900 mb-2">Settings</h1>
        <p className="text-google-gray-700">Manage your workspace preferences and account security.</p>
      </div>

      <div className="space-y-6">
        <div className="google-card overflow-hidden">
          <div className="p-6 border-b border-google-gray-100 flex items-center gap-3">
            <User className="text-google-blue" size={20} />
            <h3 className="font-medium text-google-gray-800">Account Settings</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Display Name</p>
                <p className="text-sm text-google-gray-600">User Name</p>
              </div>
              <button className="text-google-blue text-sm font-medium hover:underline">Edit</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Email Address</p>
                <p className="text-sm text-google-gray-600">user@example.com</p>
              </div>
              <button className="text-google-blue text-sm font-medium hover:underline">Change</button>
            </div>
          </div>
        </div>

        <div className="google-card overflow-hidden">
          <div className="p-6 border-b border-google-gray-100 flex items-center gap-3">
            <HardDrive className="text-google-green" size={20} />
            <h3 className="font-medium text-google-gray-800">Workspace Preferences</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Auto-Pause Workspaces</p>
                <p className="text-sm text-google-gray-600">Automatically pause workspaces after 30 mins of inactivity</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-google-blue" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Default Region</p>
                <p className="text-sm text-google-gray-600">Cloud Node: US-East-1</p>
              </div>
              <select className="bg-google-gray-100 border-none rounded p-1 text-sm outline-none focus:ring-1 focus:ring-google-blue">
                <option>US-East-1</option>
                <option>EU-West-1</option>
                <option>Asia-South-1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="google-card overflow-hidden">
          <div className="p-6 border-b border-google-gray-100 flex items-center gap-3">
            <Shield className="text-google-red" size={20} />
            <h3 className="font-medium text-google-gray-800">Security & Privacy</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Two-Step Verification</p>
                <p className="text-sm text-google-gray-600">Add an extra layer of security to your account</p>
              </div>
              <button className="google-button google-button-secondary py-1 px-4 text-sm">Enable</button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-google-gray-800">Workspace Sync Encryption</p>
                <p className="text-sm text-google-gray-600">All data is encrypted before uploading to cloud</p>
              </div>
              <span className="text-google-green text-sm font-medium">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
