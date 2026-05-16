import React, { useState } from 'react';
import { 
  FileText, 
  Menu, 
  Share, 
  MessageSquare, 
  Video, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  Search,
  Mail,
  Inbox,
  Star,
  Clock,
  Send,
  File,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  Lock
} from 'lucide-react';

interface MockAppProps {
  appId: string;
}

const MockApp: React.FC<MockAppProps> = ({ appId }) => {
  if (appId === 'docs') {
    return (
      <div className="flex flex-col h-full bg-[#f8f9fa] font-sans">
        {/* Docs Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <FileText size={28} className="text-blue-600" fill="#4285f4" fillOpacity={0.2} />
            </div>
            <div>
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  defaultValue="Untitled Document" 
                  className="text-lg text-gray-800 focus:outline-none focus:bg-gray-100 px-2 py-0.5 rounded border border-transparent focus:border-gray-300"
                />
                <Star size={16} className="text-gray-400" />
              </div>
              <div className="flex text-[13px] text-gray-600 gap-3 mt-0.5 px-2">
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">File</span>
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">View</span>
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Insert</span>
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Format</span>
                <span className="hover:bg-gray-100 px-1.5 py-0.5 rounded cursor-pointer">Tools</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MessageSquare size={20} className="text-gray-600" />
            <Video size={24} className="text-gray-600" />
            <button className="bg-blue-200 hover:bg-blue-300 text-blue-900 px-6 py-2 rounded-full font-medium flex items-center gap-2 text-sm transition-colors">
              <Lock size={14} /> Share
            </button>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">U</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#edf2fa] border-b border-gray-200 text-gray-700">
          <select className="bg-transparent border-none outline-none text-sm font-medium hover:bg-gray-200 p-1 rounded">
            <option>Normal text</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
          </select>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <select className="bg-transparent border-none outline-none text-sm font-medium hover:bg-gray-200 p-1 rounded">
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Roboto</option>
          </select>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button className="p-1.5 hover:bg-gray-200 rounded"><Bold size={16} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><Italic size={16} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><Underline size={16} /></button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button className="p-1.5 hover:bg-gray-200 rounded bg-blue-100"><AlignLeft size={16} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><AlignCenter size={16} /></button>
          <button className="p-1.5 hover:bg-gray-200 rounded"><AlignRight size={16} /></button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button className="p-1.5 hover:bg-gray-200 rounded"><List size={16} /></button>
        </div>

        {/* Page Area */}
        <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#f8f9fa]">
          <div 
            className="w-[816px] min-h-[1056px] bg-white shadow-md border border-gray-200 p-24 outline-none text-gray-800 text-base"
            contentEditable
            suppressContentEditableWarning
          >
            Start typing your document here...
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'gmail') {
    return (
      <div className="flex flex-col h-full bg-white font-sans">
        {/* Gmail Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Menu size={24} className="text-gray-600" />
            <div className="flex items-center gap-2">
              <Mail size={28} className="text-red-500" fill="#ea4335" fillOpacity={0.2} />
              <span className="text-xl text-gray-600 font-medium tracking-tight">Gmail</span>
            </div>
          </div>
          <div className="flex-1 max-w-2xl px-8">
            <div className="flex items-center gap-3 bg-[#eaf1fb] px-4 py-2.5 rounded-full">
              <Search size={20} className="text-gray-600" />
              <input type="text" placeholder="Search mail" className="bg-transparent border-none outline-none w-full text-gray-800" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">U</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 p-4 flex flex-col gap-2 border-r border-gray-100">
            <button className="bg-[#c2e7ff] hover:bg-[#b5dfff] text-gray-900 px-6 py-4 rounded-2xl font-medium flex items-center gap-4 w-40 transition-colors shadow-sm">
              <span className="text-2xl font-light mb-1">+</span> Compose
            </button>
            <div className="mt-4 space-y-1">
              <div className="flex items-center gap-4 px-6 py-2 bg-[#d3e3fd] text-[#0b57d0] rounded-r-full font-medium cursor-pointer">
                <Inbox size={18} /> Inbox <span className="ml-auto text-xs font-bold">2</span>
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full cursor-pointer">
                <Star size={18} /> Starred
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full cursor-pointer">
                <Clock size={18} /> Snoozed
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full cursor-pointer">
                <Send size={18} /> Sent
              </div>
              <div className="flex items-center gap-4 px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-r-full cursor-pointer">
                <File size={18} /> Drafts
              </div>
            </div>
          </div>

          {/* Mail List */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center px-4 py-3 border-b border-gray-100 gap-4 text-gray-500">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <RotateCw size={18} className="cursor-pointer hover:text-gray-800" />
              <MoreVertical size={18} className="cursor-pointer hover:text-gray-800" />
            </div>
            
            <div className="divide-y divide-gray-100">
              {[
                { sender: 'Google Security', subject: 'Security alert for your linked Google account', time: '10:24 AM', unread: true },
                { sender: 'GitHub', subject: 'You have been added to the repository', time: 'Yesterday', unread: true },
                { sender: 'LinkedIn', subject: 'You appeared in 14 searches this week', time: 'Apr 12', unread: false },
                { sender: 'Slack', subject: 'New message from engineering-team', time: 'Apr 11', unread: false },
                { sender: 'AWS Support', subject: 'Your AWS invoice is available', time: 'Apr 10', unread: false },
              ].map((mail, i) => (
                <div key={i} className={`flex items-center px-4 py-2.5 gap-4 cursor-pointer hover:shadow-md transition-shadow border-l-4 ${mail.unread ? 'bg-white border-blue-600 text-gray-900' : 'bg-gray-50 border-transparent text-gray-600'}`}>
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                  <Star size={18} className={mail.unread ? "text-gray-400" : "text-gray-300"} />
                  <div className={`w-48 truncate ${mail.unread ? 'font-bold' : 'font-medium'}`}>{mail.sender}</div>
                  <div className="flex-1 truncate">
                    <span className={mail.unread ? 'font-bold' : 'font-medium'}>{mail.subject}</span>
                    <span className="text-gray-500 ml-2">- Tap to open this email and read the contents...</span>
                  </div>
                  <div className={`text-xs w-20 text-right ${mail.unread ? 'font-bold' : ''}`}>{mail.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === 'chrome') {
    return (
      <div className="flex flex-col h-full bg-white font-sans">
        {/* Chrome Header */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#dee1e6] border-b border-gray-300">
          <div className="flex gap-2 mr-2">
            <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600"><ArrowLeft size={16} /></button>
            <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-400"><ArrowRight size={16} /></button>
            <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600"><RotateCw size={16} /></button>
            <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600"><Home size={16} /></button>
          </div>
          <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 shadow-sm border border-gray-200">
            <Lock size={14} className="text-gray-500 mr-3" />
            <input type="text" defaultValue="https://www.bing.com" className="flex-1 outline-none text-sm text-gray-800" />
            <Star size={16} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
        {/* Content */}
        <iframe src="https://www.bing.com" className="flex-1 w-full border-none" title="Chrome Browser" />
      </div>
    );
  }

  // Fallback
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-lg font-bold text-gray-800">Application Sandbox</h2>
        <p className="text-sm mt-2">This application is currently running in headless mode.</p>
      </div>
    </div>
  );
};

export default MockApp;
