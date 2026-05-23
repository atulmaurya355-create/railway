import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider.jsx';
import { ThemeProvider } from './providers/ThemeProvider.jsx';
import { LanguageProvider } from './providers/LanguageProvider.jsx';
import { router } from './routes/router.jsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
