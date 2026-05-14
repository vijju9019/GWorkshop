import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, HardDrive, Activity, Zap } from 'lucide-react';

const data = [
  { time: '10:00', cpu: 12, ram: 45, net: 20 },
  { time: '10:05', cpu: 25, ram: 48, net: 45 },
  { time: '10:10', cpu: 15, ram: 46, net: 30 },
  { time: '10:15', cpu: 45, ram: 52, net: 85 },
  { time: '10:20', cpu: 32, ram: 50, net: 60 },
  { time: '10:25', cpu: 28, ram: 49, net: 40 },
  { time: '10:30', cpu: 22, ram: 48, net: 35 },
];

const PerformanceMonitor: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-google-gray-900 mb-2">System Performance</h1>
        <p className="text-google-gray-700">Real-time resource allocation for your cloud workspaces.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="google-card p-6">
          <div className="flex items-center gap-3 text-google-blue mb-4">
            <Cpu size={24} />
            <h3 className="font-medium text-google-gray-800">CPU Virtualization</h3>
          </div>
          <div className="text-3xl font-semibold mb-1">22%</div>
          <div className="text-sm text-google-green font-medium flex items-center gap-1">
            <Zap size={14} /> Low load
          </div>
        </div>

        <div className="google-card p-6">
          <div className="flex items-center gap-3 text-google-green mb-4">
            <Activity size={24} />
            <h3 className="font-medium text-google-gray-800">Virtual RAM</h3>
          </div>
          <div className="text-3xl font-semibold mb-1">1.2 GB</div>
          <div className="text-sm text-google-gray-600">Total available: 8 GB</div>
        </div>

        <div className="google-card p-6">
          <div className="flex items-center gap-3 text-google-red mb-4">
            <HardDrive size={24} />
            <h3 className="font-medium text-google-gray-800">Cloud Storage</h3>
          </div>
          <div className="text-3xl font-semibold mb-1">120 MB</div>
          <div className="text-sm text-google-gray-600">Total available: 500 MB</div>
        </div>

        <div className="google-card p-6">
          <div className="flex items-center gap-3 text-google-yellow mb-4">
            <Activity size={24} />
            <h3 className="font-medium text-google-gray-800">Network Speed</h3>
          </div>
          <div className="text-3xl font-semibold mb-1">12.5 MB/s</div>
          <div className="text-sm text-google-gray-600">Synced to cloud node</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="google-card p-6 h-[400px]">
          <h3 className="font-medium text-google-gray-800 mb-6">Resource Allocation (Last 30 mins)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a73e8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f4" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9aa0a6', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9aa0a6', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="#1a73e8" 
                fillOpacity={1} 
                fill="url(#colorCpu)" 
                strokeWidth={2}
                name="CPU Usage (%)"
              />
              <Area 
                type="monotone" 
                dataKey="ram" 
                stroke="#34a853" 
                fill="transparent"
                strokeWidth={2}
                name="RAM Usage (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
