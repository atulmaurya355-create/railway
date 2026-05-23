import { Link } from 'react-router-dom';
import { LogOut, Search, Home, Flame, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { Button } from '../ui/Button.jsx';
import { ThemeToggle } from '../theme/ThemeToggle.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NotificationDropdown } from '../NotificationDropdown.jsx';
import { useLanguage } from '../../providers/LanguageProvider.jsx';

export function RailwayLogo({ className = "h-9 w-9" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Speed Ring */}
      <circle 
        cx="50" 
        cy="50" 
        r="44" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeDasharray="12 6" 
        className="text-cyan-500/40 dark:text-cyan-400/30 animate-spin-slow" 
      />
      <circle 
        cx="50" 
        cy="50" 
        r="32" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        className="text-railway-blue/20 dark:text-cyan-500/10" 
      />
      
      {/* Ground tracks */}
      <path 
        d="M20 80 L80 80 M25 86 L75 86 M30 92 L70 92" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        className="text-railway-red/40 dark:text-rose-500/30" 
      />
      
      {/* Vande Bharat train hull */}
      <path 
        d="M18 56 C32 56, 38 43, 56 43 C68 43, 76 50, 86 50 L86 56 Z" 
        fill="url(#vandeGrad)" 
      />
      
      {/* Windshield */}
      <path d="M60 45 C64 45, 72 47, 76 50 L68 50 Z" fill="#030712" className="dark:fill-slate-100" />
      
      {/* Spark star */}
      <path 
        d="M50 16 L52 23 L59 25 L52 27 L50 34 L48 27 L41 25 L48 23 Z" 
        fill="currentColor" 
        className="text-railway-gold animate-pulse-slow" 
      />

      <defs>
        <linearGradient id="vandeGrad" x1="18" y1="49.5" x2="86" y2="49.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF2E93" />
          <stop offset="50%" stopColor="#005BAC" />
          <stop offset="100%" stopColor="#00F0FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const [showSearchAlert, setShowSearchAlert] = useState(false);

  const handleSearchClick = () => {
    // Dispatch search modal opener
    window.dispatchEvent(new window.CustomEvent('open-global-search'));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/80 backdrop-blur-lg dark:border-slate-800/40 dark:bg-[#060b19]/80 shadow-md transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO AREA */}
        <Link to="/" className="flex items-center gap-3 font-bold text-slate-900 dark:text-white group">
          <motion.div 
            whileHover={{ scale: 1.06, rotate: 2 }}
            className="flex items-center justify-center p-0.5 rounded-xl bg-gradient-to-br from-railway-blue via-railway-red to-railway-gold shadow-md"
          >
            <div className="bg-slate-950 p-1.5 rounded-[10px] flex items-center justify-center">
              <RailwayLogo className="h-9 w-9 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base tracking-tight bg-gradient-to-r from-railway-blue via-railway-red to-railway-gold bg-clip-text text-transparent font-black leading-tight">
              RAILWAY PREP
            </span>
            <span className="text-[9px] font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-0.5">
              3D AI STUDY SHELL
            </span>
          </div>
        </Link>

        {/* MIDDLE CONTROLS */}
        <div className="flex items-center gap-3">
          
          {isAuthenticated ? (
            <>
              {/* STREAK MULTIPLIER (Duolingo style) */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400 font-bold text-xs shadow-sm cursor-help animate-pulse-slow"
                title={t('streakStatus')}
              >
                <Flame size={14} className="text-orange-500 fill-current animate-bounce" />
                <span>{t('streakDays', { days: 15 })}</span>
              </motion.div>

              {/* SEARCH TRIGGER */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleSearchClick}
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-900 hover:border-railway-blue/30 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-white dark:hover:border-cyan-500/35 sm:flex shadow-sm transition-all"
              >
                <Search size={13} className="text-slate-400 dark:text-slate-500" />
                <span>{t('searchPlaceholder')}</span>
                <kbd className="pointer-events-none inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[8px] font-bold text-slate-450 dark:border-slate-800 dark:bg-slate-950">
                  /
                </kbd>
              </motion.button>

              {/* MOBILE SEARCH ICON */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="grid size-9 place-items-center rounded-xl border border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-white hover:text-slate-950 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-white sm:hidden"
                aria-label="Search Dashboard"
              >
                <Search size={15} />
              </button>

              {/* BILINGUAL LANGUAGE SWITCHER */}
              <div className="relative flex items-center">
                <select
                  value={language}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white/90 px-2 py-1.5 text-xs font-extrabold text-slate-700 outline-none hover:bg-slate-50 hover:border-railway-blue/30 dark:border-slate-800/60 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 cursor-pointer shadow-sm transition"
                >
                  <option value="en">🇬🇧 EN</option>
                  <option value="hi">🇮🇳 हिन्दी</option>
                </select>
              </div>

              {/* NOTIFICATION DROP-DOWN */}
              <div className="relative">
                <NotificationDropdown />
              </div>

              {/* BACKSTAGE ROUTE LINKS */}
              <Button 
                as={Link} 
                to="/dashboard" 
                className="h-9 px-3 rounded-xl border-none bg-gradient-to-r from-railway-blue to-cyan-500 hover:brightness-110 text-white shadow-sm flex items-center gap-1 text-xs font-extrabold"
              >
                <Sparkles size={13} className="animate-spin-slow" />
                <span>{t('studyCockpit')}</span>
              </Button>

              <Button 
                type="button" 
                variant="secondary" 
                className="gap-1.5 px-3 h-9 rounded-xl border-slate-200/80 bg-slate-50/80 hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-350 text-xs font-semibold" 
                onClick={logout}
              >
                <LogOut size={13} className="text-railway-red" />
                <span className="hidden md:inline">{t('logout')}</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                as={Link} 
                to="/login" 
                variant="secondary"
                className="h-9 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 text-xs font-semibold"
              >
                Login
              </Button>
              <Button 
                as={Link} 
                to="/register" 
                className="h-9 rounded-xl bg-gradient-to-r from-railway-blue to-railway-red hover:brightness-110 text-white shadow-md border-none text-xs font-extrabold px-4"
              >
                Register Free
              </Button>
            </>
          )}

          {/* THEME TOGGLER */}
          <div className="pl-1 border-l border-slate-200/60 dark:border-slate-800/60">
            <ThemeToggle />
          </div>
        </div>

      </div>
    </header>
  );
}
