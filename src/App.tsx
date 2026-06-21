import { useEffect, useState } from 'react';
import OrwellApp from './orwell/OrwellApp';
import AdminContact from './sections/AdminContact';

function App() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncRoute = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  if (pathname === '/admin' || window.location.hash === '#admin') {
    return <AdminContact />;
  }

  return <OrwellApp />;
}

export default App;
