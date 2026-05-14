import React, { useState } from 'react';
import { 
  Cloud, 
  Search, 
  Upload, 
  FolderPlus, 
  MoreVertical, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  File,
  ChevronRight,
  HardDrive
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'other';
  size: string;
  modified: string;
}

const CloudStorage: React.FC = () => {
  const [files] = useState<FileItem[]>([
    { id: '1', name: 'Project Proposals', type: 'folder', size: '--', modified: 'Oct 12, 2026' },
    { id: '2', name: 'Design Assets', type: 'folder', size: '--', modified: 'Oct 14, 2026' },
    { id: '3', name: 'System Logs.txt', type: 'document', size: '12 KB', modified: 'Just now' },
    { id: '4', name: 'Workspace_Backup.iso', type: 'other', size: '85 MB', modified: 'Yesterday' },
    { id: '5', name: 'Profile_Picture.png', type: 'image', size: '2.4 MB', modified: '2 days ago' },
    { id: '6', name: 'Tutorial_Video.mp4', type: 'video', size: '18 MB', modified: '3 days ago' },
  ]);

  const storageUsed = 120;
  const maxStorage = 500;
  const percentage = (storageUsed / maxStorage) * 100;

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <File className="text-google-blue fill-google-blue opacity-20" size={20} />;
      case 'document': return <FileText className="text-google-blue" size={20} />;
      case 'image': return <ImageIcon className="text-google-green" size={20} />;
      case 'video': return <Video className="text-google-red" size={20} />;
      default: return <File className="text-google-gray-500" size={20} />;
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 border-b border-google-gray-200 bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cloud className="text-google-blue" size={24} />
          <h1 className="text-xl font-medium text-google-gray-900">Cloud Storage</h1>
        </div>
        <div className="flex gap-3">
          <button className="google-button google-button-secondary">
            <FolderPlus size={18} />
            New Folder
          </button>
          <button className="google-button google-button-primary">
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 text-google-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search in Drive"
              className="w-full pl-10 pr-4 py-2 bg-google-gray-100 rounded-google focus:bg-white focus:ring-2 focus:ring-google-blue border-none transition-all"
            />
          </div>

          <div className="mb-4 text-sm font-medium text-google-gray-600 flex items-center gap-2">
            My Drive <ChevronRight size={14} /> Workspaces
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-google-gray-600 text-sm border-b border-google-gray-100">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Last modified</th>
                <th className="pb-3 font-medium">File size</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-google-gray-50">
              {files.map(file => (
                <tr key={file.id} className="hover:bg-google-gray-50 group transition-colors">
                  <td className="py-3 flex items-center gap-3">
                    {getIcon(file.type)}
                    <span className="text-google-gray-800 font-medium">{file.name}</span>
                  </td>
                  <td className="py-3 text-sm text-google-gray-600">Me</td>
                  <td className="py-3 text-sm text-google-gray-600">{file.modified}</td>
                  <td className="py-3 text-sm text-google-gray-600">{file.size}</td>
                  <td className="py-3 text-right">
                    <button className="p-1 hover:bg-google-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar Info */}
        <div className="w-72 border-l border-google-gray-200 bg-google-gray-50 p-6 hidden xl:block">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-google-blue bg-opacity-10 rounded-full flex items-center justify-center text-google-blue mb-4">
              <HardDrive size={40} />
            </div>
            <h3 className="font-semibold text-google-gray-900">Storage Usage</h3>
            <p className="text-sm text-google-gray-600">500 MB Free Plan</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-google-gray-700">Used Storage</span>
                <span className="font-medium text-google-gray-900">{storageUsed} MB</span>
              </div>
              <div className="w-full bg-google-gray-200 rounded-full h-2">
                <div 
                  className="bg-google-blue h-2 rounded-full" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-google-gray-200">
              <h4 className="text-xs font-bold text-google-gray-500 uppercase tracking-wider mb-3">Breakdown</h4>
              <ul className="space-y-3">
                <li className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-google-gray-700">
                    <div className="w-2 h-2 rounded-full bg-google-blue"></div> Workspaces
                  </span>
                  <span className="font-medium">85 MB</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-google-gray-700">
                    <div className="w-2 h-2 rounded-full bg-google-green"></div> Media
                  </span>
                  <span className="font-medium">20.4 MB</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="flex items-center gap-2 text-google-gray-700">
                    <div className="w-2 h-2 rounded-full bg-google-yellow"></div> Documents
                  </span>
                  <span className="font-medium">14.6 MB</span>
                </li>
              </ul>
            </div>

            <button className="w-full mt-6 py-2 px-4 border border-google-blue text-google-blue rounded-google font-medium hover:bg-blue-50 transition-colors">
              Upgrade Storage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudStorage;
