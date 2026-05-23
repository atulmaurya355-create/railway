import { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../config/i18n.js';
import { httpClient } from '../services/httpClient.js';
import { useAuth } from '../features/auth/AuthProvider.jsx';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('railway-pref-language') || 'en';
  });

  // Pull preference from backend if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let active = true;
    async function fetchPreference() {
      try {
        const response = await httpClient.get('/language');
        if (active && response.data?.data?.language) {
          const serverLang = response.data.data.language;
          setLanguage(serverLang);
          localStorage.setItem('railway-pref-language', serverLang);
        }
      } catch (_error) {
        // Fallback silently to local state
      }
    }

    fetchPreference();
    return () => { active = false; };
  }, [isAuthenticated]);

  // Save preference to backend & localstorage
  async function changeLanguage(newLang) {
    if (newLang !== 'en' && newLang !== 'hi') return;

    setLanguage(newLang);
    localStorage.setItem('railway-pref-language', newLang);

    if (isAuthenticated) {
      try {
        await httpClient.post('/language', { language: newLang });
      } catch (_error) {
        // Silent recovery
      }
    }
  }

  // Translation helper function
  function t(key, replacements = {}) {
    const activeDict = translations[language] || translations.en;
    let text = activeDict[key] || translations.en[key] || key;

    // Apply template replacements, e.g., {{count}}
    Object.entries(replacements).forEach(([repKey, repVal]) => {
      text = text.replace(new RegExp(`\\{\\{\\s*${repKey}\\s*\\}\\}`, 'g'), String(repVal));
    });

    return text;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
