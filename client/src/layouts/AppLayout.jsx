import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header.jsx';
import { GlobalSearchModal } from '../components/GlobalSearchModal.jsx';

export function AppLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen">
      <Header />
      {isHomePage ? (
        <main className="w-full">
          <Outlet />
        </main>
      ) : (
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      )}
      <GlobalSearchModal />
    </div>
  );
}

