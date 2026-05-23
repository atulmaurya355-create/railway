import { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Trophy, 
  Flame, 
  ClipboardList, 
  Check, 
  Trash2, 
  X, 
  Sparkles,
  Inbox
} from 'lucide-react';
import { notificationService } from '../features/notifications/notificationService.js';
import { useAuth } from '../features/auth/AuthProvider.jsx';

// High-fidelity initial demo alerts to showcase UI immediately
const DEMO_NOTIFICATIONS = [
  {
    _id: 'demo-1',
    title: 'Study Streak Alert! 🔥',
    message: 'Your 15-day streak is in danger! Complete a sectional practice test today to keep it burning.',
    type: 'dailyReminder',
    status: 'unread',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hrs ago
    isDemo: true
  },
  {
    _id: 'demo-2',
    title: 'Badge Unlocked: Top Scorer! 🏆',
    message: 'Incredible! You scored 94% on the full length RRB NTPC test and unlocked the Elite badge!',
    type: 'achievement',
    status: 'unread',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    isDemo: true
  },
  {
    _id: 'demo-3',
    title: 'New Sectional Quiz: Current Affairs 📝',
    message: 'A new quiz on Indian Railways budget highlights is now available in General Awareness.',
    type: 'newQuiz',
    status: 'read',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isDemo: true
  }
];

export function NotificationDropdown() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications from the backend API
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await notificationService.getNotifications({ limit: 10 });
      // If the backend has actual notifications, use them. Otherwise, show demo notifications.
      if (response && response.data && response.data.notifications && response.data.notifications.length > 0) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount || 0);
      } else {
        setNotifications(DEMO_NOTIFICATIONS);
        setUnreadCount(DEMO_NOTIFICATIONS.filter(n => n.status === 'unread').length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications from database. Using fallback demo notifications.', error);
      // Fallback to high-fidelity demo alerts
      setNotifications(DEMO_NOTIFICATIONS);
      setUnreadCount(DEMO_NOTIFICATIONS.filter(n => n.status === 'unread').length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 30 seconds for a live experience
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const toggleDropdown = () => {
    setIsOpen(current => !current);
  };

  const handleMarkAsRead = async (notificationId, isDemo) => {
    // Update local state first for immediate UI responsiveness
    setNotifications(prev =>
      prev.map(n => (n._id === notificationId ? { ...n, status: 'read' } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    if (isDemo) return;

    try {
      await notificationService.markAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read on backend:', error);
    }
  };

  const handleMarkAllRead = async () => {
    // Check if any notifications are actually demo notifications
    const containsDemo = notifications.some(n => n.isDemo);

    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    setUnreadCount(0);

    if (containsDemo) return;

    try {
      await notificationService.markAllRead();
    } catch (error) {
      console.error('Error marking all notifications as read on backend:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, isDemo) => {
    const target = notifications.find(n => n._id === notificationId);
    const wasUnread = target && target.status === 'unread';

    setNotifications(prev => prev.filter(n => n._id !== notificationId));
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (isDemo) return;

    try {
      await notificationService.deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification on backend:', error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  // Render specific category icon with HSL tailored theme
  const renderCategoryIcon = (type) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <Trophy size={18} className="animate-bounce" />
          </div>
        );
      case 'dailyReminder':
        return (
          <div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            <Flame size={18} className="animate-pulse" />
          </div>
        );
      case 'newQuiz':
      default:
        return (
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400">
            <ClipboardList size={18} />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        aria-label="Notifications Panel"
        aria-expanded={isOpen}
      >
        <Bell size={18} className={unreadCount > 0 ? "animate-swing" : ""} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-rose-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown Pane */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95 shadow-2xl overflow-hidden transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-950/50">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">Alerts & Notifications</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/40 dark:text-cyan-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-cyan-400 dark:hover:text-cyan-300 hover:underline transition-all"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="mb-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900/40">
                  <Inbox className="size-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">All caught up!</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">You don&apos;t have any notifications at the moment.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`flex gap-3 p-4 transition-all duration-200 relative group hover:bg-slate-50/60 dark:hover:bg-slate-900/40 ${
                    n.status === 'unread' 
                      ? 'bg-brand-50/10 dark:bg-cyan-950/5 border-l-2 border-brand-500 dark:border-cyan-400' 
                      : ''
                  }`}
                >
                  {/* Glowing unread indicator dot */}
                  {n.status === 'unread' && (
                    <span className="absolute right-4 top-4 size-2 rounded-full bg-brand-500 dark:bg-cyan-400 shadow-sm shadow-brand-500"></span>
                  )}

                  {/* Notification Icon */}
                  <div className="flex-shrink-0">
                    {renderCategoryIcon(n.type)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-grow min-w-0 pr-6">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-sm font-semibold truncate text-slate-900 dark:text-slate-100 ${
                        n.status === 'unread' ? 'font-bold' : ''
                      }`}>
                        {n.title}
                      </p>
                      {n.isDemo && (
                        <span className="rounded bg-slate-100 px-1 py-0.2 text-[9px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {n.message}
                    </p>
                    <p className="mt-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {formatTimeAgo(n.createdAt)}
                    </p>
                  </div>

                  {/* Floating Action Buttons on Hover */}
                  <div className="absolute right-3 bottom-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/80 dark:bg-slate-950/80 rounded-lg p-0.5 shadow-sm border border-slate-100 dark:border-slate-800/40 backdrop-blur-sm">
                    {n.status === 'unread' && (
                      <button
                        type="button"
                        onClick={() => handleMarkAsRead(n._id, n.isDemo)}
                        title="Mark as read"
                        className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-emerald-50/50 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/20 transition-all"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteNotification(n._id, n.isDemo)}
                      title="Delete alert"
                      className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50/80 dark:bg-slate-900/40 px-4 py-2 text-center border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sparkles size={10} className="text-amber-500" /> Powered by Railway Prep AI
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
