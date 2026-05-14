import React, { useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from '../services/firebase';
import { Mail, Phone, Lock, Hash, ArrowRight, User, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    setIsMock(!auth.app);
    const unsub = onAuthStateChanged(auth, (user: any) => {
      if (user) onLogin(user);
    });
    return unsub;
  }, [onLogin]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isMock) {
      setTimeout(() => {
        handleGuestLogin();
      }, 1000);
      return;
    }
    
    try {
      if (isLoginMode) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(result.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
      setLoading(false);
    }
  };

  const handlePhoneAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!showOtp) {
      setTimeout(() => {
        setShowOtp(true);
        setLoading(false);
      }, 1500);
    } else {
      setTimeout(() => {
        handleGuestLogin();
      }, 1500);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        displayName: 'Guest Observer',
        email: 'guest@gworkspace.local',
        photoURL: 'https://ui-avatars.com/api/?name=Guest&background=64748b&color=fff',
        uid: 'guest-session-' + Math.random().toString(36).substr(2, 9),
        isGuest: true
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-[#f8fafc]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[140px]" />
      </div>

      <div className="relative w-full max-w-[460px] z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="bg-white rounded-[48px] p-12 text-center border border-slate-100 shadow-[0_32px_80px_rgba(30,41,59,0.08)]">
          {/* Brand Identity */}
          <div className="flex justify-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(37,99,235,0.3)] group hover:scale-110 transition-transform duration-700 cursor-pointer">
              <span className="text-white font-black text-4xl">G</span>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">GWorkspace</h1>
            <div className="flex items-center justify-center gap-2">
               <span className="h-[1px] w-4 bg-slate-200"></span>
               <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em]">Enterprise Virtualization</p>
               <span className="h-[1px] w-4 bg-slate-200"></span>
            </div>
          </div>

          {/* Auth Tabs */}
          <div className="flex p-1.5 bg-slate-50 rounded-[24px] mb-8 border border-slate-100">
            <button 
              onClick={() => { setLoginType('email'); setShowOtp(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${loginType === 'email' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Mail size={14} /> Email
            </button>
            <button 
              onClick={() => setLoginType('phone')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all ${loginType === 'phone' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Phone size={14} /> Phone
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {loginType === 'email' ? (
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="space-y-2 text-left px-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 py-5 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2 text-left px-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption Key</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 py-5 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold shadow-inner"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? 'Decrypting Session...' : (isLoginMode ? 'Access Workspace' : 'Initialize Account')}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            ) : (
              <form onSubmit={handlePhoneAuth} className="space-y-4 text-left px-2">
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{!showOtp ? 'Mobile Identifier' : 'Security Token'}</label>
                  {!showOtp ? (
                    <div className="relative group animate-in slide-in-from-right-4 duration-300">
                      <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 py-5 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold shadow-inner"
                        required
                      />
                    </div>
                  ) : (
                    <div className="relative group animate-in slide-in-from-right-4 duration-300">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="ENTER 6-DIGIT CODE"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-5 py-5 text-slate-900 placeholder-slate-300 outline-none focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm tracking-[0.5em] text-center font-black shadow-inner"
                        required
                      />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50 text-xs uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {loading ? 'Validating...' : (!showOtp ? 'Transmit Hash' : 'Unlock Environment')}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl px-5 py-4 text-red-500 text-[10px] font-black uppercase tracking-widest text-left flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
              <ShieldAlert size={16} /> {error}
            </div>
          )}

          {/* Premium Guest Mode Access */}
          <div className="mt-12 pt-8 border-t border-slate-50">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-6">Temporary Access</p>
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-black py-4.5 rounded-2xl transition-all border border-blue-100/50 flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <User size={14} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.1em]">Instant Guest Deployment</span>
            </button>
            
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="mt-8 text-slate-400 hover:text-blue-600 text-[9px] font-black uppercase tracking-[0.3em] transition-all"
            >
              {isLoginMode ? "Provision Enterprise Account" : "Return to Node Entry"}
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 opacity-20 hover:opacity-100 transition-opacity">
           <p className="text-[10px] uppercase tracking-[0.5em] font-black text-slate-400">Security Architecture v3.0</p>
           <div className="flex gap-4 items-center mt-2">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
             <p className="text-[8px] font-black text-slate-400 tracking-widest">TLS 1.3 ENCRYPTION ACTIVE</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
