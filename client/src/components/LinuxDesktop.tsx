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
  Maximize
} from 'lucide-react';

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
}

const LinuxDesktop: React.FC<LinuxDesktopProps> = ({ user, isDarkMode, workspaceId }) => {
  const username = (user?.displayName || user?.email || 'user').split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const terminalPrompt = `${username}@gworkspace`;
  
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
    'Welcome to GWorkspace Linux v2.4.0 LTS',
    `Active Workspace: ${workspaceId || 'Default Node'}`,
    '',
    'type "help" for a list of available commands.'
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  // Sandboxed Filesystem Path
  const [vRoot, setVRoot] = useState<string>('');
  const [cwd, setCwd] = useState<string>('');

  useEffect(() => {
    try {
      // @ts-ignore
      if (window.require) {
        // @ts-ignore
        const path = window.require('path');
        // @ts-ignore
        const fs = window.require('fs');
        // @ts-ignore
        const os = window.require('os');
        
        // Isolate filesystem by workspace ID
        const baseDir = path.join(os.homedir(), '.gworkspace');
        const workspaceDir = workspaceId ? path.join(baseDir, 'workspaces', workspaceId) : baseDir;
        const root = path.join(workspaceDir, 'root');
        
        if (!fs.existsSync(root)) {
          fs.mkdirSync(root, { recursive: true });
          fs.writeFileSync(path.join(root, 'welcome.txt'), `Welcome to your private GWorkspace!\nWorkspace ID: ${workspaceId || 'root'}\nAll your files here are persistent.`);
        }
        setVRoot(root);
        setCwd(root);
      }
    } catch (e) {
      console.error("FS Error:", e);
    }
  }, [workspaceId]);

  const sanitizePath = (target: string) => {
    // @ts-ignore
    if (!window.require) return target;
    // @ts-ignore
    const path = window.require('path');
    const resolved = path.resolve(cwd, target);
    if (!resolved.startsWith(vRoot)) return vRoot;
    return resolved;
  };

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const relativeCwd = cwd.replace(vRoot, '') || '/';
      const newHistory = [...history, `${terminalPrompt}:${relativeCwd}$ ${cmd}`];
      
      if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      }

      setHistory(newHistory);
      setInput('');

      if (cmd === '') return;

      try {
        // @ts-ignore
        if (window.require) {
          // @ts-ignore
          const fs = window.require('fs');
          // @ts-ignore
          const path = window.require('path');
          // @ts-ignore
          const { exec } = window.require('child_process');

          const args = cmd.split(' ');
          const baseCmd = args[0];

          let output: string[] = [];

          switch (baseCmd) {
            case 'help':
              output.push('Core: cd, ls, pwd, cat, mkdir, rm, touch, echo, date');
              output.push('Apps: firefox, code, calc, monitor');
              break;
            case 'code': setVscodeOpen(true); output.push('Starting VS Code...'); break;
            case 'firefox': setFirefoxOpen(true); output.push('Starting Firefox...'); break;
            case 'calc': setCalcOpen(true); output.push('Starting Calculator...'); break;
            case 'monitor': setMonitorOpen(true); output.push('Starting System Monitor...'); break;
            case 'pwd': output.push(cwd.replace(vRoot, '~') || '~'); break;
            case 'cd': {
              const target = args[1] || '';
              if (target === '~' || !target) { setCwd(vRoot); break; }
              const newDir = sanitizePath(target);
              if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) setCwd(newDir);
              else output.push(`cd: ${target}: No such file or directory`);
              break;
            }
            case 'ls': {
              try {
                const files = fs.readdirSync(cwd);
                output.push(files.join('  '));
              } catch (err: any) { output.push(`ls error: ${err.message}`); }
              break;
            }
            default:
              exec(cmd, { cwd }, (_error: any, stdout: string, stderr: string) => {
                if (stdout) setHistory(prev => [...prev, ...stdout.trim().split('\n')]);
                if (stderr) setHistory(prev => [...prev, ...stderr.trim().split('\n')]);
              });
              return; 
          }
          if (output.length > 0) setHistory(prev => [...prev, ...output]);
        }
      } catch (err: any) { setHistory(prev => [...prev, `Error: ${err.message}`]); }
    }
  };

  useEffect(() => {
    if (terminalOpen) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, terminalOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const Window = ({ title, icon: Icon, isOpen, onClose, children, className = "", width = "800px", height = "500px" }: any) => {
    if (!isOpen) return null;
    const isMax = maximizedApps[title] || false;
    const toggleMax = () => setMaximizedApps(prev => ({ ...prev, [title]: !isMax }));

    return (
      <div 
        className={`absolute shadow-2xl flex flex-col overflow-hidden border z-30 animate-in zoom-in-95 duration-200 ${className} ${isDarkMode ? 'bg-[#1e293b] border-white/5' : 'bg-white border-slate-200'} ${isMax ? 'inset-0 !w-full !h-full !top-0 !left-0 rounded-none' : 'rounded-2xl'}`}
        style={isMax ? {} : { width, height, top: '10%', left: '15%' }}
      >
        <div className={`h-11 flex items-center justify-between px-4 select-none border-b shrink-0 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-2">
            <Icon size={16} className={isDarkMode ? 'text-white/40' : 'text-slate-500'} />
            <span className={`text-[11px] font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{title}</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={toggleMax}
              title={isMax ? "Restore" : "Full Screen"}
              className={`w-3 h-3 rounded-full transition-colors flex items-center justify-center group ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300'}`}
            >
              {isMax ? <Minimize2 size={8} className="text-blue-500" /> : <Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />}
            </button>
            <button className={`w-3 h-3 rounded-full transition-colors ${isDarkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-slate-200 hover:bg-slate-300'}`}></button>
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 text-red-500 flex items-center justify-center transition-colors group">
              <X size={8} strokeWidth={4} className="opacity-0 group-hover:opacity-100 text-white transition-opacity" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    );
  };

  return (
    <div className={`w-full h-full flex flex-col overflow-hidden relative font-sans select-none transition-colors duration-700 ${isDarkMode ? 'bg-[#0f172a]' : 'bg-[#f1f5f9]'}`}>
      {/* Background Layer */}
      {isDarkMode ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e293b,transparent)] opacity-40" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-100 opacity-60" />
      )}

      {/* Top Panel */}
      <div className={`h-8 border-b flex items-center justify-between px-4 text-[11px] font-black uppercase tracking-widest z-50 transition-all duration-500 ${isDarkMode ? 'bg-black/40 backdrop-blur-xl border-white/5 text-white' : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-800'}`}>
        <div className="flex gap-4 items-center">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Activities</span>
          <div className={`h-4 w-[1px] mx-1 ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
          <div className="flex gap-4 items-center opacity-40">
            <Terminal size={14} />
            <Globe size={14} />
            <Code size={14} />
          </div>
        </div>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex gap-4 items-center">
          <button 
            onClick={toggleFullscreen}
            className={`p-1 rounded hover:bg-white/10 transition-colors ${isDarkMode ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            title="Toggle OS Fullscreen"
          >
            <Maximize size={14} />
          </button>
          <SettingsIcon size={14} className="opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
          <div className={`flex gap-1.5 items-center px-2.5 py-1 rounded-full border ${isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-100'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></span>
            <span className={`text-[9px] font-black ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Node Active</span>
          </div>
        </div>
      </div>

      {/* Desktop Area */}
      <div className="flex-1 relative p-8 flex gap-8 flex-col flex-wrap content-start z-10">
        {[
          { id: 'terminal', name: 'Terminal', icon: Terminal, color: isDarkMode ? 'bg-slate-800' : 'bg-slate-900', action: () => setTerminalOpen(true) },
          { id: 'files', name: 'Workspace', icon: Folder, color: 'bg-blue-600', action: () => setHomeOpen(true) },
          { id: 'firefox', name: 'Firefox', icon: Globe, color: 'bg-sky-500', action: () => setFirefoxOpen(true) },
          { id: 'vscode', name: 'VS Code', icon: Code, color: 'bg-indigo-600', action: () => setVscodeOpen(true) },
          { id: 'calc', name: 'Calculator', icon: CalcIcon, color: 'bg-emerald-500', action: () => setCalcOpen(true) },
          { id: 'monitor', name: 'Monitor', icon: Activity, color: 'bg-rose-500', action: () => setMonitorOpen(true) },
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

        {/* VS Code Window */}
        <Window title="Visual Studio Code" icon={Code} isOpen={vscodeOpen} onClose={() => setVscodeOpen(false)} width="1100px" height="700px">
          <iframe src="https://stackblitz.com/edit/node-js-sandbox?embed=1&theme=dark" className="w-full h-full border-none bg-[#1e1e1e]" title="VS Code" allow="cross-origin-isolated" />
        </Window>

        {/* Calculator Window */}
        <Window title="Calculator" icon={CalcIcon} isOpen={calcOpen} onClose={() => setCalcOpen(false)} width="300px" height="420px" className="!left-[40%]">
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
        </Window>

        {/* System Monitor Window */}
        <Window title="Cluster Monitor" icon={Activity} isOpen={monitorOpen} onClose={() => setMonitorOpen(false)} width="600px" height="450px" className="!left-[30%]">
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
        </Window>

        {/* Firefox Window */}
        <Window title="Firefox Browser" icon={Globe} isOpen={firefoxOpen} onClose={() => setFirefoxOpen(false)} width="1000px" height="650px" className="!top-[5%] !left-[10%]">
          <div className="flex flex-col h-full bg-white">
            <div className={`p-3 flex gap-3 border-b ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <input 
                className={`flex-1 px-5 py-2 rounded-xl text-xs outline-none focus:ring-4 transition-all font-bold ${isDarkMode ? 'bg-white/5 border border-white/10 text-white focus:ring-blue-500/10' : 'bg-white border border-slate-200 text-slate-700 focus:ring-blue-500/5 focus:border-blue-500/30'}`}
                defaultValue={firefoxUrl}
                onKeyDown={e => { if (e.key === 'Enter') setFirefoxUrl(e.currentTarget.value.includes('http') ? e.currentTarget.value : `https://www.bing.com/search?q=${e.currentTarget.value}`); }}
              />
            </div>
            <iframe src={firefoxUrl} className="flex-1 bg-white border-none w-full" title="Firefox" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
          </div>
        </Window>

        {/* Workspace Root Window */}
        <Window title="File Infrastructure" icon={Folder} isOpen={homeOpen} onClose={() => setHomeOpen(false)} width="700px" height="450px" className="!top-[20%] !left-[25%]">
          <div className={`flex h-full ${isDarkMode ? 'bg-[#1e293b]' : 'bg-white'}`}>
            <div className={`w-56 border-r p-6 space-y-3 ${isDarkMode ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <div className="p-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-600/20"><Folder size={14}/> Root Vault</div>
              <div className={`p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors cursor-pointer ${isDarkMode ? 'text-white/20 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'}`}><Activity size={14}/> Recent Logs</div>
            </div>
            <div className="flex-1 p-12 flex flex-col items-center justify-center gap-4">
              <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                <ShieldCheck size={48} className={isDarkMode ? 'text-white/5' : 'text-slate-100'} />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>Hardware Sandbox Active</p>
            </div>
          </div>
        </Window>

        {/* Terminal Window */}
        <Window title="Virtual Terminal" icon={Terminal} isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} width="650px" height="420px" className="!top-[15%] !left-[20%]">
          <div 
            className={`h-full p-6 overflow-y-auto font-mono text-sm leading-relaxed shadow-inner transition-colors duration-500 ${isDarkMode ? 'bg-black/60 text-emerald-400' : 'bg-[#1e293b] text-blue-400'}`}
            onClick={() => document.getElementById('linux-terminal-input')?.focus()}
          >
            {history.map((line, i) => <div key={i} className="whitespace-pre-wrap">{line}</div>)}
            <div className="flex items-start mt-2">
              <span className={`mr-2 font-bold shrink-0 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-400'}`}>{terminalPrompt}:~${' '}</span>
              <input id="linux-terminal-input" type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleCommand} className="flex-1 bg-transparent border-none outline-none text-white p-0 m-0" autoFocus autoComplete="off" spellCheck="false" />
            </div>
            <div ref={endRef} />
          </div>
        </Window>
      </div>
    </div>
  );
};

export default LinuxDesktop;
