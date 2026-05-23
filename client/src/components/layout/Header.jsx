import { Link } from 'react-router-dom';
import { LogOut, Search, Home } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthProvider.jsx';
import { Button } from '../ui/Button.jsx';
import { ThemeToggle } from '../theme/ThemeToggle.jsx';
import { motion } from 'framer-motion';

export function RailwayLogo({ className = "h-9 w-9" }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Railway Wheel Background */}
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" className="text-railway-gold/50 animate-spin-slow" />
      <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1.5" className="text-railway-blue/20" />
      
      {/* Rail Tracks Concept */}
      <path d="M25 78 L75 78 M30 84 L70 84 M35 90 L65 90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-railway-blue/30 dark:text-cyan-500/20" />
      
      {/* Vande Bharat Train Nose Silhouette */}
      <path d="M20 58 C35 58, 40 45, 55 45 C65 45, 75 52, 85 52 L85 58 Z" fill="url(#trainGrad)" />
      {/* Sleek windshield */}
      <path d="M60 47 C65 47, 72 49, 76 52 L68 52 Z" fill="#0a1128" className="dark:fill-slate-100" />
      {/* Speed lines */}
      <path d="M15 50 H35 M10 54 H25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-railway-red" />

      {/* Book base */}
      <path d="M30 65 C40 62, 50 65, 50 65 C50 65, 60 62, 70 65 L70 74 C60 71, 50 74, 50 74 C50 74, 40 71, 30 74 Z" fill="currentColor" className="text-railway-blue dark:text-cyan-400" />
      
      {/* AI Sparks */}
      <path d="M50 20 L52 27 L59 29 L52 31 L50 38 L48 31 L41 29 L48 27 Z" fill="currentColor" className="text-railway-gold animate-pulse-slow" />
      <path d="M78 28 L79 32 L83 33 L79 34 L78 38 L77 34 L73 33 L77 32 Z" fill="currentColor" className="text-railway-gold animate-pulse" />

      <defs>
        <linearGradient id="trainGrad" x1="20" y1="51.5" x2="85" y2="51.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D32F2F" />
          <stop offset="60%" stopColor="#005BAC" />
          <stop offset="100%" stopColor="#004e93" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Header() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-white/70 backdrop-blur-md dark:border-slate-800/40 dark:bg-[#0a1128]/70 shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-bold text-slate-900 dark:text-white group">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex items-center justify-center p-0.5 rounded-lg bg-gradient-to-br from-railway-blue to-railway-navy shadow-inner"
          >
            <RailwayLogo className="h-10 w-10 text-white" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg tracking-tight bg-gradient-to-r from-railway-blue via-railway-red to-railway-gold bg-clip-text text-transparent font-extrabold leading-tight">
              RAILWAY PREP
            </span>
            <span className="text-[9px] font-medium tracking-widest text-slate-500 dark:text-slate-400 -mt-0.5">
              AI-POWERED PLATFORM
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Desktop/Tablet Global Search Trigger */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => window.dispatchEvent(new window.CustomEvent('open-global-search'))}
                className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-900 hover:border-railway-blue/30 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-white dark:hover:border-cyan-500/30 sm:flex shadow-sm transition-all duration-200"
              >
                <Search size={14} className="text-slate-400 dark:text-slate-500" />
                <span>Search Dashboard...</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200/60 bg-slate-100 px-1.5 font-mono text-[9px] font-bold text-slate-400 dark:border-slate-800 dark:bg-slate-950/60">
                  /
                </kbd>
              </motion.button>

              {/* Mobile Global Search Trigger */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new window.CustomEvent('open-global-search'))}
                className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-white hover:text-slate-950 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400 dark:hover:bg-slate-950 dark:hover:text-white sm:hidden"
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              <Link
                to="/dashboard"
                className="hidden text-sm font-semibold bg-gradient-to-r from-railway-blue to-railway-gold bg-clip-text text-transparent hover:brightness-110 sm:inline transition-all duration-200"
              >
                {user?.name}
              </Link>
              
              <Button as={Link} to="/" variant="secondary" className="gap-2 px-3.5 h-9 rounded-lg border-slate-200/80 bg-slate-50/80 hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300">
                <Home size={15} aria-hidden="true" className="text-railway-blue dark:text-cyan-400" />
                <span className="hidden md:inline font-medium">Home</span>
              </Button>

              <Button type="button" variant="secondary" className="gap-2 px-3.5 h-9 rounded-lg border-slate-200/80 bg-slate-50/80 hover:bg-white dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300" onClick={logout}>
                <LogOut size={15} aria-hidden="true" className="text-railway-red" />
                <span className="hidden md:inline font-medium">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                as={Link} 
                to="/login" 
                variant="secondary"
                className="h-9 rounded-lg border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Login
              </Button>
              <Button 
                as={Link} 
                to="/register" 
                className="hidden sm:inline-flex h-9 rounded-lg bg-gradient-to-r from-railway-blue to-railway-red hover:from-railway-blue/90 hover:to-railway-red/90 text-white shadow-sm border-none"
              >
                Register
              </Button>
            </>
          )}
          <div className="pl-1 border-l border-slate-200/60 dark:border-slate-800/60">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}


