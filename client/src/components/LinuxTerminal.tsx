import React, { useState, useRef, useEffect } from 'react';

const LinuxTerminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'Welcome to GWorkspace Linux Environment',
    'Kernel 6.1.0-cloud-amd64 on an x86_64',
    '',
    'type "help" for a list of available commands.'
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, `root@google-machine:~# ${cmd}`];
      
      if (cmd === 'help') {
        newHistory.push('Available commands:');
        newHistory.push('  help     - Show this message');
        newHistory.push('  clear    - Clear terminal output');
        newHistory.push('  date     - Print system date and time');
        newHistory.push('  whoami   - Print effective userid');
        newHistory.push('  uname    - Print system information');
        newHistory.push('  echo     - Print text to stdout');
        newHistory.push('  ls       - List directory contents');
        newHistory.push('  pwd      - Print working directory');
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'date') {
        newHistory.push(new Date().toString());
      } else if (cmd === 'whoami') {
        newHistory.push('root');
      } else if (cmd === 'uname' || cmd === 'uname -a') {
        newHistory.push('Linux google-machine 6.1.0-cloud-amd64 #1 SMP PREEMPT_RT x86_64 GNU/Linux');
      } else if (cmd.startsWith('echo ')) {
        newHistory.push(cmd.substring(5));
      } else if (cmd === 'ls' || cmd === 'ls -la') {
        newHistory.push('drwxr-xr-x 1 root root 4096 May 14 10:00 .');
        newHistory.push('drwxr-xr-x 1 root root 4096 May 14 10:00 ..');
        newHistory.push('-rw-r--r-- 1 root root   24 May 14 10:00 .bashrc');
        newHistory.push('drwxr-xr-x 2 root root 4096 May 14 10:00 projects');
        newHistory.push('drwxr-xr-x 2 root root 4096 May 14 10:00 workspace');
      } else if (cmd === 'pwd') {
        newHistory.push('/root');
      } else if (cmd !== '') {
        newHistory.push(`bash: ${cmd}: command not found`);
      }
      
      setHistory(newHistory);
      setInput('');
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  return (
    <div 
      className="w-full h-full bg-[#0c0c0c] text-green-400 font-mono p-4 overflow-y-auto text-[15px] select-text cursor-text"
      onClick={() => document.getElementById('terminal-input')?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="flex items-center">
        <span className="mr-2 text-green-400 font-bold">root@google-machine:~#</span>
        <input
          id="terminal-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleCommand}
          className="flex-1 bg-transparent outline-none border-none text-white focus:ring-0 p-0 m-0"
          autoFocus
          autoComplete="off"
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default LinuxTerminal;
