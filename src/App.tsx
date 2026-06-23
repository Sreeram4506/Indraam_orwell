import { useEffect, useState } from 'react';
import OrwellApp from './orwell/OrwellApp';
import AdminContact from './sections/AdminContact';

function App() {
  const [pathname, setPathname] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));
  const [hash, setHash] = useState(() => (typeof window !== 'undefined' ? window.location.hash : ''));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncRoute = () => {
      setPathname(window.location.pathname);
      setHash(window.location.hash);
    };

    syncRoute();
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  if (pathname === '/admin' || hash === '#admin') {
    return <AdminContact />;
  }

  return <OrwellApp />;
}

export default App;
