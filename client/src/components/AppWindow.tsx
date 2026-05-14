import React, { useRef } from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, Maximize } from 'lucide-react';
import type { WindowState } from '../types';

interface AppWindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  children: React.ReactNode;
  url?: string;
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  window, 
  onClose, 
  onFocus, 
  onMinimize, 
  onMaximize,
  children,
  url
}) => {
  const windowRef = useRef<HTMLDivElement>(null);

  if (window.isMinimized) return null;

  const handleNativeFullscreen = () => {
    if (windowRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        windowRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    }
  };

  return (
    <Rnd
      size={window.isMaximized ? { width: '100%', height: '100%' } : { width: window.width, height: window.height }}
      position={window.isMaximized ? { x: 0, y: 0 } : { x: window.x, y: window.y }}
      onDragStart={() => onFocus(window.id)}
      onResizeStart={() => onFocus(window.id)}
      onDragStop={() => {}}
      onResizeStop={() => {}}
      disableDragging={window.isMaximized}
      enableResizing={!window.isMaximized}
      bounds="parent"
      minWidth={300}
      minHeight={200}
      dragHandleClassName="window-header"
      style={{ zIndex: window.zIndex }}
      className="google-card overflow-hidden flex flex-col absolute"
    >
      <div 
        ref={windowRef}
        className="w-full h-full flex flex-col bg-white rounded-google overflow-hidden border border-google-gray-300 shadow-2xl"
      >
        <div 
          className="window-header bg-[#e6e8eb] px-4 py-2 flex items-center justify-between cursor-move select-none"
          onMouseDown={() => onFocus(window.id)}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium text-google-gray-800 text-sm truncate max-w-[200px] flex items-center gap-2">
              {window.appId !== 'linux' && (
                <img src={`https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg`} className="w-4 h-4" alt="Chrome" />
              )}
              {window.title}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleNativeFullscreen}
              title="Native Fullscreen"
              className="p-1 hover:bg-google-gray-300 rounded transition-colors text-google-gray-700"
            >
              <Maximize size={14} />
            </button>
            <button 
              onClick={() => onMinimize(window.id)}
              title="Minimize"
              className="p-1 hover:bg-google-gray-300 rounded transition-colors text-google-gray-700"
            >
              <Minus size={16} />
            </button>
            <button 
              onClick={() => onMaximize(window.id)}
              title="Maximize"
              className="p-1 hover:bg-google-gray-300 rounded transition-colors text-google-gray-700"
            >
              <Square size={14} />
            </button>
            <button 
              onClick={() => onClose(window.id)}
              title="Close"
              className="p-1 hover:bg-google-red hover:text-white rounded transition-colors text-google-gray-700 ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        {/* Chrome-like Address Bar */}
        {url && window.appId !== 'linux' && (
          <div className="bg-white border-b border-google-gray-200 px-2 py-1.5 flex items-center gap-2 select-none" onMouseDown={() => onFocus(window.id)}>
            <div className="flex gap-1 text-google-gray-600">
              <button className="p-1.5 hover:bg-google-gray-100 rounded-full text-google-gray-400 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <button className="p-1.5 hover:bg-google-gray-100 rounded-full text-google-gray-400 cursor-not-allowed">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="p-1.5 hover:bg-google-gray-100 rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6M2.13 15.57a10 10 0 1 0 3.43-11.44L2.5 8"/></svg>
              </button>
            </div>
            <div className="flex-1 bg-google-gray-100 hover:bg-google-gray-200 border border-transparent focus-within:border-google-blue focus-within:bg-white rounded-full flex items-center px-3 py-1 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-google-gray-500 mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input 
                type="text" 
                readOnly 
                value={url} 
                className="w-full bg-transparent border-none outline-none text-sm text-google-gray-800"
              />
            </div>
          </div>
        )}

        <div className="flex-1 bg-white relative">
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default AppWindow;

