import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function normalizePath(path) {
  const normalized = path.toLowerCase().replace(/\/$/, '');
  return normalized || '/';
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    const nextPath = normalizePath(to);
    if (nextPath !== path) window.history.pushState({}, '', to);
    setPath(nextPath);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior });
  };

  const value = useMemo(() => ({ path, navigate }), [path]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useRouter must be used inside RouterProvider.');
  return router;
}
