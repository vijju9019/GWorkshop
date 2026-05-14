import React from 'react';
import { Rnd } from 'react-rnd';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../types';

interface AppWindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  children: React.ReactNode;
}

const AppWindow: React.FC<AppWindowProps> = ({ 
  window, 
  onClose, 
  onFocus, 
  onMinimize, 
  onMaximize,
  children 
}) => {
  if (window.isMinimized) return null;

  return (
    <Rnd
      size={{ width: window.width, height: window.height }}
      position={{ x: window.x, y: window.y }}
      onDragStart={() => onFocus(window.id)}
      onResizeStart={() => onFocus(window.id)}
      onDragStop={(e, d) => {
        // Here we would normally update state if we want persistent positions
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        // Here we would normally update state
      }}
      bounds="parent"
      minWidth={300}
      minHeight={200}
      dragHandleClassName="window-header"
      style={{ zIndex: window.zIndex }}
      className={`google-card overflow-hidden flex flex-col ${window.isMaximized ? '!w-full !h-full !translate-x-0 !translate-y-0 !top-0 !left-0' : ''}`}
    >
      <div 
        className="window-header bg-google-gray-100 px-4 py-2 flex items-center justify-between cursor-move select-none border-b border-google-gray-200"
        onMouseDown={() => onFocus(window.id)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-google-gray-800 text-sm truncate max-w-[200px]">{window.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onMinimize(window.id)}
            className="p-1 hover:bg-google-gray-200 rounded transition-colors text-google-gray-700"
          >
            <Minus size={16} />
          </button>
          <button 
            onClick={() => onMaximize(window.id)}
            className="p-1 hover:bg-google-gray-200 rounded transition-colors text-google-gray-700"
          >
            <Square size={14} />
          </button>
          <button 
            onClick={() => onClose(window.id)}
            className="p-1 hover:bg-google-red hover:text-white rounded transition-colors text-google-gray-700 ml-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 bg-white relative">
        {children}
      </div>
    </Rnd>
  );
};

export default AppWindow;
