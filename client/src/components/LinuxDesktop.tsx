import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal, 
  Folder, 
  Globe, 
  X, 
  Code, 
  Calculator as CalcIcon, 
  Activity, 
  Settings as SettingsIcon,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Maximize,
  FileText
} from 'lucide-react';
import { Rnd } from 'react-rnd';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      webview: any;
    }
  }
}

interface LinuxDesktopProps {
  user: any;
  isDarkMode?: boolean;
  workspaceId?: string;
  ownerId?: string;
  template?: string;
  wallpaper?: string;
}

const InternalWindow = ({ title, icon: Icon, isOpen, onClose, children, className = "", width = 800, height = 500, defaultX = 150, defaultY = 100, isDarkMode, zIndices, bringToFront, maximizedApps, setMaximizedApps }: any) => {
  if (!isOpen) return null;
  const isMax = maximizedApps[title] || false;
  const toggleMax = () => setMaximizedApps((prev: any) => ({ ...prev, [title]: !isMax }));
  
  const isTerminal = title.toLowerCase().includes('terminal');
  const winBg = isTerminal ? 'bg-[#0f172a]' : (isDarkMode ? 'bg-[#1e293b]' : 'bg-white');
  const borderColor = isTerminal ? 'border-white/10' : (isDarkMode ? 'border-white/5' : 'border-slate-200');

  return (
    <Rnd
      default={{ x: defaultX, y: defaultY, width, height }}
      size={isMax ? { width: '100%', height: '100%' } : undefined}
      position={isMax ? { x: 0, y: 0 } : undefined}
      disableDragging={isMax}
      enableResizing={!isMax}
      bounds="parent"
      dragHandleClassName="internal-window-header"
      onDragStart={() => bringToFront(title)}
      style={{ zIndex: zIndices[title] || 30 }}
    >
      <div 
        className={`w-full h-full shadow-2xl flex flex-col overflow-hidden border animate-in zoom-in-95 duration-200 ${className} ${winBg} ${borderColor} ${isMax ? 'rounded-none' : 'rounded-2xl'}`}
      >
        <div className={`internal-window-header h-11 flex items-center justify-between px-4 select-none border-b shrink-0 cursor-grab active:cursor-grabbing ${isTerminal ? 'bg-black/40 border-white/10' : (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200')}`}>
          <div className="flex items-center gap-2 pointer-events-none">
            <Icon size={16} className={isTerminal || isDarkMode ? 'text-white/40' : 'text-slate-500'} />
            <span className={`text-[11px] font-black uppercase tracking-widest ${isTerminal || isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleMax(); }}
              title={isMax ? "Restore" : "Full Screen"}
              className={`w-3 h-3 rounded-full transition-colors flex items-center justify-center group ${isTerminal || isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {isMax ? <Minimize2 size={8} className="text-blue-500" /> : <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />}
            </button>
            <button className={`w-3 h-3 rounded-full transition-colors ${isTerminal || isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300'}`}></button>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 flex items-center justify-center transition-colors group">
              <X size={8} strokeWidth={4} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden" onMouseDown={() => bringToFront(title)}>{children}</div>
      </div>
    </Rnd>
  );
};

const LinuxDesktop: React.FC<LinuxDesktopProps> = ({ user, isDarkMode, workspaceId, ownerId, template = 'Ubuntu Desktop', wallpaper = '/luffy_gear5.png' }) => {
  const username = (user?.displayName || user?.email || 'user').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  
  const getOSDefaults = (t: string) => {
    switch (t) {
      case 'Windows 11 Light':
        return {
          prompt: `C:\\Users\\${username}>`,
          welcome: `Microsoft Windows [Version 10.0.22621.1702]\n(c) Microsoft Corporation. All rights reserved.\n\nActive Node: ${workspaceId || 'Primary'}\nType "help" for a list of commands.`,
          user: 'Administrator'
        };
      case 'ChromeOS Mini':
        return {
          prompt: `chronos@localhost / $`,
          welcome: `Welcome to ChromeOS Mini v120.0.6099.235 (Official Build)\nHardware Sandbox Active.\n\ntype "help" for system instructions.`,
          user: 'chronos'
        };
      case 'Cloud Debian':
        return {
          prompt: `root@debian:~#`,
          welcome: `Debian GNU/Linux 12 (bookworm)\nLast login: ${new Date().toDateString()} from gworkspace-auth\n\nSecurity Cluster: ${workspaceId || 'Debian-Node'}`,
          user: 'root'
        };
      default: // Ubuntu Desktop
        return {
          prompt: `${username}@gworkspace:~$`,
          welcome: `Welcome to Ubuntu 24.04 LTS (GNU/Linux 6.8.0-generic x86_64)\n\n * Documentation:  https://help.ubuntu.com\n * Management:     https://landscape.canonical.com\n\nSystem Load: 0.12 | Workspaces: 1 | Users: 1`,
          user: username
        };
    }
  };

  const osDefaults = getOSDefaults(template);
  const terminalPrompt = osDefaults.prompt;
  
  // App States
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [firefoxOpen, setFirefoxOpen] = useState(false);
  const [vscodeOpen, setVscodeOpen] = useState(false);
  const [calcOpen, setCalcOpen] = useState(false);
  const [monitorOpen, setMonitorOpen] = useState(false);
  
  const [maximizedApps, setMaximizedApps] = useState<Record<string, boolean>>({});
  
  const [firefoxUrl, setFirefoxUrl] = useState('https://www.google.com/search?igu=1');
  const [calcValue, setCalcValue] = useState('0');

  const [history, setHistory] = useState<string[]>([
    osDefaults.welcome
  ]);
  const [input, setInput] = useState('');

  // Window Z-Index Management
  const [zIndices, setZIndices] = useState<Record<string, number>>({});
  const bringToFront = (title: string) => {
    const maxZ = Math.max(0, ...Object.values(zIndices)) + 1;
    setZIndices(prev => ({ ...prev, [title]: maxZ }));
  };

  const vRoot = `/home/${username}`;
  const [cwd, setCwd] = useState<string>(vRoot);
  const [fsState, setFsState] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem(`gws_fs_${workspaceId || 'default'}`);
    if (saved) return JSON.parse(saved);
    
    return {
      '/': { type: 'dir', children: ['home'] },
      '/home': { type: 'dir', children: [username] },
      [vRoot]: { type: 'dir', children: ['welcome.txt'] },
      [`${vRoot}/welcome.txt`]: { type: 'file', content: `Welcome to GWorkspace OS!\nYour files are saved in local storage.\nUser: ${username}\nWorkspace: ${workspaceId || 'root'}` }
    };
  });

  const [fsLoaded, setFsLoaded] = useState(false);

  useEffect(() => {
    const loadFileSystem = async () => {
      if (!workspaceId) {
        setFsLoaded(true);
        return;
      }
      const oId = ownerId || user?.uid;
      if (!oId) {
        setFsLoaded(true);
        return;
      }
      
      try {
        const res = await fetch(`http://localhost:3001/api/workspaces/${oId}/${workspaceId}/fs`);
        if (res.ok) {
          const remoteFs = await res.json();
          if (remoteFs) {
            setFsState(remoteFs);
          }
        }
      } catch (err) {
        console.error("Failed to load VFS from server, falling back to local storage", err);
      } finally {
        setFsLoaded(true);
      }
    };
    loadFileSystem();
  }, [workspaceId, ownerId, user?.uid]);

  useEffect(() => {
    if (!fsLoaded) return;
    
    // Save to local storage as fallback
    localStorage.setItem(`gws_fs_${workspaceId || 'default'}`, JSON.stringify(fsState));
    
    // Save to server
    if (workspaceId) {
      const oId = ownerId || user?.uid;
      if (oId) {
        fetch(`http://localhost:3001/api/workspaces/${oId}/${workspaceId}/fs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fsState })
        }).catch(err => {
          console.error("Failed to save VFS to server", err);
        });
      }
    }
  }, [fsState, workspaceId, ownerId, user?.uid, fsLoaded]);

  // Poll for changes from server every 5 seconds
  useEffect(() => {
    if (!workspaceId || !fsLoaded) return;
    const oId = ownerId || user?.uid;
    if (!oId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/workspaces/${oId}/${workspaceId}/fs`);
        if (res.ok) {
          const remoteFs = await res.json();
          if (remoteFs && JSON.stringify(remoteFs) !== JSON.stringify(fsState)) {
            setFsState(remoteFs);
          }
        }
      } catch (err) {
        console.error("Failed to sync VFS from server", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [workspaceId, ownerId, user?.uid, fsLoaded, fsState]);

  useEffect(() => {
    try {
      // @ts-ignore
      if (window.require) {
        // ... (Node.js FS logic remains as fallback/priority)
      }
    } catch (e) {
      console.error("FS Error:", e);
    }
  }, [workspaceId]);

  const sanitizePath = (target: string) => {
    if (target === '~' || target === '') return vRoot;
    if (target.startsWith('/')) return target;
    const parts = cwd.split('/').filter(Boolean);
    const targetParts = target.split('/').filter(Boolean);
    for (const part of targetParts) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }
    return '/' + parts.join('/');
  };

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const relativeCwd = cwd.replace(vRoot, '') || '/';
      const newHistory = [...history, `${terminalPrompt} ${cmd}`];
      
      if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      setHistory(newHistory);
      setInput('');

      if (cmd === '') return;

      const args = cmd.split(' ');
      const baseCmd = args[0];
      let output: string[] = [];

      const currentFs = { ...fsState };

      switch (baseCmd) {
        case 'help':
          output.push('GWorkspace Virtual Shell v1.0');
          output.push('Available Commands:');
          output.push('  ls [dir]      - List directory contents');
          output.push('  cd <dir>      - Change directory');
          output.push('  pwd           - Print working directory');
          output.push('  cat <file>    - Display file contents');
          output.push('  mkdir <name>  - Create a directory');
          output.push('  touch <name>  - Create an empty file');
          output.push('  rm <name>     - Remove file or directory');
          output.push('  clear         - Clear terminal screen');
          break;
        case 'pwd': output.push(cwd); break;
        case 'whoami': output.push(username); break;
        case 'date': output.push(new Date().toString()); break;
        case 'uname': output.push('Linux gworkspace-node 6.8.0-generic x86_64 GNU/Linux'); break;
        case 'echo': output.push(args.slice(1).join(' ')); break;
        case 'ls': {
          const target = args[1] ? sanitizePath(args[1]) : cwd;
          const node = currentFs[target];
          if (node && node.type === 'dir') {
            if (node.children.length === 0) output.push('total 0');
            else output.push(node.children.join('  '));
          } else output.push(`ls: cannot access '${args[1] || '.'}': No such file or directory`);
          break;
        }
        case 'cd': {
          const target = sanitizePath(args[1] || '~');
          const node = currentFs[target];
          if (node && node.type === 'dir') setCwd(target);
          else output.push(`cd: ${args[1]}: No such file or directory`);
          break;
        }
        case 'cat': {
          const target = sanitizePath(args[1]);
          const node = currentFs[target];
          if (node && node.type === 'file') output.push(node.content);
          else output.push(`cat: ${args[1]}: No such file or directory`);
          break;
        }
        case 'mkdir': {
          const target = sanitizePath(args[1]);
          if (!args[1]) { output.push('mkdir: missing operand'); break; }
          currentFs[target] = { type: 'dir', children: [] };
          const parentPath = target.substring(0, target.lastIndexOf('/')) || '/';
          if (currentFs[parentPath]) {
            const name = target.split('/').pop();
            if (!currentFs[parentPath].children.includes(name)) currentFs[parentPath].children.push(name);
          }
          setFsState(currentFs);
          break;
        }
        case 'touch': {
          const target = sanitizePath(args[1]);
          if (!args[1]) { output.push('touch: missing file operand'); break; }
          currentFs[target] = { type: 'file', content: '' };
          const parentPath = target.substring(0, target.lastIndexOf('/')) || '/';
          if (currentFs[parentPath]) {
            const name = target.split('/').pop();
            if (!currentFs[parentPath].children.includes(name)) currentFs[parentPath].children.push(name);
          }
          setFsState(currentFs);
          break;
        }
        case 'rm': {
          const target = sanitizePath(args[1]);
          if (currentFs[target]) {
            delete currentFs[target];
            const parentPath = target.substring(0, target.lastIndexOf('/')) || '/';
            if (currentFs[parentPath]) {
              currentFs[parentPath].children = currentFs[parentPath].children.filter((c: string) => c !== target.split('/').pop());
            }
            setFsState(currentFs);
          } else output.push(`rm: cannot remove '${args[1]}': No such file or directory`);
          break;
        }
        case 'code': setVscodeOpen(true); bringToFront('Visual Studio Code'); break;
        case 'firefox': setFirefoxOpen(true); bringToFront('Firefox Browser'); break;
        case 'calc': setCalcOpen(true); bringToFront('Calculator'); break;
        case 'monitor': setMonitorOpen(true); bringToFront('Cluster Monitor'); break;
        default:
          output.push(`${baseCmd}: command not found`);
      }

      if (output.length > 0) setHistory(prev => [...prev, ...output]);
    }
  };

  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const commonProps = { isDarkMode, zIndices, bringToFront, maximizedApps, setMaximizedApps };

  return (
    <div 
      className={`w-full h-full flex flex-col overflow-hidden relative font-sans select-none bg-cover bg-center transition-opacity duration-700`}
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      {/* Background Overlay */}
      <div className={`absolute inset-0 ${isDarkMode ? 'bg-slate-950/40' : 'bg-white/10'} backdrop-blur-[2px]`} />

      {/* Top Panel */}
      <div className={`h-8 border-b flex items-center justify-between px-4 text-[11px] font-black uppercase tracking-widest z-[100] transition-all duration-500 ${isDarkMode ? 'bg-black/60 backdrop-blur-2xl border-white/10 text-white' : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'}`}>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2 hover:bg-white/10 px-2 py-0.5 rounded-md cursor-pointer transition-all active:scale-95 group">
            <ShieldCheck size={14} className="text-blue-500" />
            <span>Activities</span>
          </div>
          <div className={`h-4 w-[1px] mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          <div className="flex gap-4 items-center opacity-60">
            <Terminal size={14} className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setTerminalOpen(true)} />
            <Globe size={14} className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setFirefoxOpen(true)} />
            <Code size={14} className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setVscodeOpen(true)} />
          </div>
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 font-bold tracking-[0.2em] opacity-80">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>

        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleFullscreen}
            className={`p-1 rounded-lg hover:bg-white/10 transition-all active:scale-90 ${isDarkMode ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            title="Toggle OS Fullscreen"
          >
            <Maximize size={14} />
          </button>
          <SettingsIcon size={14} className="opacity-40 hover:opacity-100 cursor-pointer transition-all hover:rotate-90" />
          <div className={`flex gap-1.5 items-center px-3 py-1 rounded-full border shadow-sm transition-all hover:scale-105 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-[9px] font-black ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Kernel Active</span>
          </div>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 relative p-8 flex gap-8 flex-col flex-wrap content-start z-10">
        {[
          { id: 'terminal', name: 'Terminal', icon: Terminal, color: isDarkMode ? 'bg-slate-800' : 'bg-slate-900', action: () => { setTerminalOpen(true); bringToFront('Virtual Terminal'); } },
          { id: 'files', name: 'Workspace', icon: Folder, color: 'bg-blue-600', action: () => { setHomeOpen(true); bringToFront('File Infrastructure'); } },
          { id: 'firefox', name: 'Firefox', icon: Globe, color: 'bg-sky-500', action: () => { setFirefoxOpen(true); bringToFront('Firefox Browser'); } },
          { id: 'vscode', name: 'VS Code', icon: Code, color: 'bg-indigo-600', action: () => { setVscodeOpen(true); bringToFront('Visual Studio Code'); } },
          { id: 'calc', name: 'Calculator', icon: CalcIcon, color: 'bg-emerald-500', action: () => { setCalcOpen(true); bringToFront('Calculator'); } },
          { id: 'monitor', name: 'Monitor', icon: Activity, color: 'bg-rose-500', action: () => { setMonitorOpen(true); bringToFront('Cluster Monitor'); } },
        ].map(app => (
          <div 
            key={app.id}
            onDoubleClick={app.action} 
            onClick={app.action} 
            className={`flex flex-col items-center gap-2 w-20 p-2 rounded-3xl cursor-pointer group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-white/40'}`}
          >
            <div className={`${app.color} w-16 h-16 rounded-[22px] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300 ${isDarkMode ? 'shadow-black/20' : 'shadow-slate-200'}`}>
              <app.icon size={32} />
            </div>
            <span className={`text-[10px] text-center font-black uppercase tracking-wider ${isDarkMode ? 'text-white/60' : 'text-slate-700'}`}>{app.name}</span>
          </div>
        ))}

        {/* Internal Windows */}
        <InternalWindow title="Visual Studio Code" icon={Code} isOpen={vscodeOpen} onClose={() => setVscodeOpen(false)} width={1000} height={650} {...commonProps}>
          <webview src="https://vscode.dev" className="w-full h-full border-none" />
        </InternalWindow>

        <InternalWindow title="Calculator" icon={CalcIcon} isOpen={calcOpen} onClose={() => setCalcOpen(false)} width={300} height={420} defaultX={400} defaultY={150} {...commonProps}>
          <div className={`p-6 h-full flex flex-col gap-4 ${isDarkMode ? 'bg-[#1e293b]' : 'bg-slate-50'}`}>
            <div className={`p-5 rounded-2xl text-right text-3xl font-black shadow-sm border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5 text-white' : 'bg-white border-slate-100 text-slate-800'}`}>
              {calcValue}
            </div>
            <div className="grid grid-cols-4 gap-2 flex-1">
              {['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'].map(btn => (
                <button 
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') setCalcValue('0');
                    else if (btn === '=') {
                      try { setCalcValue(eval(calcValue).toString()); } catch { setCalcValue('Error'); }
                    } else {
                      setCalcValue(prev => prev === '0' ? btn : prev + btn);
                    }
                  }}
                  className={`rounded-xl font-bold transition-all border ${btn === '=' ? 'bg-blue-600 text-white col-span-2 border-transparent hover:bg-blue-500' : (isDarkMode ? 'bg-white/5 text-white border-white/5 hover:bg-white/10' : 'bg-white text-slate-700 border-slate-100 hover:bg-slate-100')}`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </InternalWindow>

        <InternalWindow title="Cluster Monitor" icon={Activity} isOpen={monitorOpen} onClose={() => setMonitorOpen(false)} width={600} height={450} defaultX={300} defaultY={100} {...commonProps}>
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}><span>CPU Payload</span><span>12%</span></div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                <div className="bg-blue-600 h-full w-[12%] transition-all"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}><span>Memory Allocation</span><span>2.4 GB / 16 GB</span></div>
              <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                <div className="bg-indigo-600 h-full w-[15%] transition-all"></div>
              </div>
            </div>
            <div className={`pt-6 border-t ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
              <table className="w-full text-[11px] font-bold">
                <thead><tr className={`text-left border-b uppercase tracking-widest ${isDarkMode ? 'text-white/20 border-white/5' : 'text-slate-400 border-slate-100'}`}><th className="pb-3">Instance</th><th className="pb-3">Load</th><th className="pb-3">RAM</th></tr></thead>
                <tbody className={isDarkMode ? 'text-white/60' : 'text-slate-700'}>
                  <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}><td className="py-3">GWorkspace Core</td><td>2.4%</td><td>450 MB</td></tr>
                  <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}><td className="py-3">Display Engine</td><td>1.1%</td><td>120 MB</td></tr>
                  <tr className={`border-b ${isDarkMode ? 'border-white/5' : 'border-slate-50'}`}><td className="py-3">Virtual Shell</td><td>0.8%</td><td>280 MB</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </InternalWindow>

        <InternalWindow title="Firefox Browser" icon={Globe} isOpen={firefoxOpen} onClose={() => setFirefoxOpen(false)} width={900} height={600} defaultX={100} defaultY={50} {...commonProps}>
          <div className="flex flex-col h-full bg-white">
            <div className={`p-3 flex gap-3 border-b ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <input 
                className={`flex-1 px-5 py-2 rounded-xl text-xs outline-none focus:ring-4 transition-all font-bold ${isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-blue-500/10' : 'bg-white border border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500/30'}`}
                defaultValue={firefoxUrl}
                onKeyDown={e => { if (e.key === 'Enter') setFirefoxUrl(e.currentTarget.value.includes('http') ? e.currentTarget.value : `https://www.bing.com/search?q=${e.currentTarget.value}`); }}
              />
            </div>
            <webview 
              src={firefoxUrl} 
              className="flex-1 bg-white border-none w-full" 
              title="Firefox"
              allowpopups="true"
            />
          </div>
        </InternalWindow>

        <InternalWindow title="File Infrastructure" icon={Folder} isOpen={homeOpen} onClose={() => setHomeOpen(false)} width={800} height={500} defaultX={250} defaultY={150} {...commonProps}>
          <div className={`flex h-full ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
            <div className={`w-56 border-r p-6 space-y-4 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <div className="space-y-1">
                <p className={`text-[9px] font-black uppercase tracking-widest px-3 mb-2 ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>System</p>
                <div className="p-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-600/20 cursor-pointer"><Folder size={14}/> Root Vault</div>
                <div className={`p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors cursor-pointer ${isDarkMode ? 'text-white/40 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}><Activity size={14}/> Node Stats</div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className={`h-12 border-b flex items-center px-6 gap-4 ${isDarkMode ? 'border-white/5' : 'border-slate-100'}`}>
                <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isDarkMode ? 'text-white/40' : 'text-slate-400'}`}>
                  <span>/</span> <span>home</span> <span>/</span> <span className={isDarkMode ? 'text-blue-400' : 'text-blue-600'}>{username}</span>
                </div>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="grid grid-cols-4 gap-6">
                  {fsState[cwd]?.children?.map((item: string) => {
                    const fullPath = `${cwd}/${item}`.replace(/\/+/g, '/');
                    const isDir = fsState[fullPath]?.type === 'dir';
                    return (
                      <div 
                        key={item} 
                        className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition-all cursor-pointer group ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                        onDoubleClick={() => isDir && setCwd(fullPath)}
                      >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${isDir ? 'text-blue-500' : (isDarkMode ? 'text-white/20' : 'text-slate-300')}`}>
                          {isDir ? <Folder size={40} fill="currentColor" fillOpacity={0.1} /> : <FileText size={40} />}
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-wider text-center break-all ${isDarkMode ? 'text-white/60' : 'text-slate-600'}`}>{item}</span>
                      </div>
                    );
                  })}
                  {(!fsState[cwd]?.children || fsState[cwd].children.length === 0) && (
                    <div className="col-span-4 flex flex-col items-center justify-center py-20 opacity-20">
                      <Folder size={64} strokeWidth={1} />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-4">Directory Empty</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={`h-10 border-t flex items-center px-6 justify-between ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                <span className={`text-[9px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white/20' : 'text-slate-400'}`}>{fsState[cwd]?.children?.length || 0} Items</span>
                <div className="flex items-center gap-2">
                   <ShieldCheck size={12} className="text-emerald-500" />
                   <span className={`text-[9px] font-black uppercase tracking-widest text-emerald-500`}>Storage Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </InternalWindow>

        <InternalWindow title="Virtual Terminal" icon={Terminal} isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} width={650} height={420} defaultX={200} defaultY={100} {...commonProps}>
          <div 
            ref={terminalBodyRef}
            className={`h-full p-6 overflow-y-auto font-mono text-sm leading-relaxed shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-black/60 text-emerald-400' : 'bg-[#1e293b] text-blue-400'}`}
            onClick={() => document.getElementById('linux-terminal-input')?.focus()}
          >
            {history.map((line, i) => <div key={i} className="whitespace-pre-wrap">{line}</div>)}
            <div className="flex items-start mt-2">
              <span className={`mr-2 font-bold shrink-0 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-400'}`}>{terminalPrompt}{' '}</span>
              <input id="linux-terminal-input" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} className="flex-1 bg-transparent border-none outline-none text-white p-0 m-0" autoFocus autoComplete="off" spellCheck="false" />
            </div>
          </div>
        </InternalWindow>
      </div>
    </div>
  );
};

export default LinuxDesktop;
