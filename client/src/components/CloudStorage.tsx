import React, { useState, useEffect, useRef } from 'react';
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
  HardDrive,
  Trash2,
  Download
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'other';
  size: string;
  modified: string;
}

const CloudStorage: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/storage/files');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);


  const storageUsed = 120;
  const maxStorage = 500;
  const percentage = (storageUsed / maxStorage) * 100;

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <File className="text-google-blue fill-google-blue opacity-20" size={20} />;
      case 'document': return <FileText className="text-google-blue" size={20} />;
      case 'image': return <ImageIcon className="text-google-green" size={20} />;
      case 'video': return <Video className="text-google-red" size={20} />;
      default: return <File className="text-google-gray-500" size={20} />;
    }
  };

  const handleUploadFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const res = await fetch('http://localhost:3001/api/storage/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        fetchFiles();
      }
    } catch (err) {
      console.error('Error uploading files:', err);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/storage/files/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchFiles();
      }
    } catch (err) {
      console.error('Error deleting file:', err);
    } finally {
      setActiveMenuId(null);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300 select-none">
      {/* Header */}
      <div className="p-6 border-b border-google-gray-200 bg-white flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Cloud className="text-google-blue" size={24} />
          <h1 className="text-xl font-medium text-google-gray-900">Cloud Storage</h1>
        </div>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
          />
          <input 
            type="file" 
            ref={folderInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            {...({ webkitdirectory: "true", directory: "true" } as any)} 
          />
          <button 
            onClick={handleUploadFolderClick}
            disabled={isUploading}
            className="google-button google-button-secondary py-1.5 text-sm disabled:opacity-50"
          >
            <FolderPlus size={18} />
            Upload Folder
          </button>
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="google-button google-button-primary py-1.5 text-sm disabled:opacity-50"
          >
            <Upload size={18} />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white scrollbar-thin">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 text-google-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-google-gray-100 rounded-google focus:bg-white focus:ring-2 focus:ring-google-blue border-none transition-all outline-none"
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
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-google-gray-50 group transition-colors">
                  <td className="py-3 flex items-center gap-3">
                    {getIcon(file.type)}
                    <span className="text-google-gray-800 font-medium">{file.name}</span>
                  </td>
                  <td className="py-3 text-sm text-google-gray-600">Me</td>
                  <td className="py-3 text-sm text-google-gray-600">{file.modified}</td>
                  <td className="py-3 text-sm text-google-gray-600">{file.size}</td>
                  <td className="py-3 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === file.id ? null : file.id)}
                      className="p-1 hover:bg-google-gray-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {activeMenuId === file.id && (
                      <div className="absolute right-0 top-10 w-36 bg-white rounded-lg shadow-xl border border-google-gray-200 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                        <a 
                          href={`http://localhost:3001/api/storage/download/${file.id}`} 
                          download={file.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full text-left px-3 py-1.5 text-xs hover:bg-google-gray-100 flex items-center gap-2"
                        >
                          <Download size={14} /> Download
                        </a>
                        <button 
                          onClick={() => handleDelete(file.id)}
                          className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredFiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-google-gray-500 italic">
                    No files found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Sidebar Info */}
        <div className="w-72 border-l border-google-gray-200 bg-google-gray-50 p-6 hidden xl:flex flex-col">
          <div className="flex flex-col items-center text-center mb-8 shrink-0">
            <div className="w-20 h-20 bg-google-blue bg-opacity-10 rounded-full flex items-center justify-center text-google-blue mb-4">
              <HardDrive size={40} />
            </div>
            <h3 className="font-semibold text-google-gray-900">Storage Usage</h3>
            <p className="text-sm text-google-gray-600">500 MB Free Plan</p>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-google-gray-700">Used Storage</span>
                <span className="font-medium text-google-gray-900">{storageUsed} MB</span>
              </div>
              <div className="w-full bg-google-gray-200 rounded-full h-2">
                <div 
                  className="bg-google-blue h-2 rounded-full transition-all duration-500" 
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
