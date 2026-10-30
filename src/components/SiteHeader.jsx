import { useEffect, useRef, useState } from 'react';
import { navigationItems } from '../data/navigation.js';
import SpaLink from '../routing/SpaLink.jsx';

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const menuButton = useRef(null);
  const closeMenu = () => setMobileOpen(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const update = (event) => { setIsMobile(event.matches); setMobileOpen(false); };
    if (media.addEventListener) media.addEventListener('change', update);
    else media.addListener(update);
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', update);
      else media.removeListener(update);
    };
  }, []);
  return (
    <header className="site-header" onKeyDown={(event) => {
      if (event.key === 'Escape' && mobileOpen) {
        closeMenu();
        menuButton.current?.focus();
      }
    }}>
      <SpaLink className="brand" href="/" aria-label="Abdul Salam Saifi home">AS<span>.</span></SpaLink>
      <button ref={menuButton} className="menu-toggle" type="button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} aria-controls="main-navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)}>
        <i className={mobileOpen ? 'ri-close-line' : 'ri-menu-line'} />
      </button>
      <nav id="main-navigation" className={`main-nav ${mobileOpen ? 'is-open' : ''}`} aria-label="Main navigation" aria-hidden={isMobile && !mobileOpen} inert={isMobile && !mobileOpen}>
        {navigationItems.map(({ label, href }) => <SpaLink key={label} href={href} onClick={closeMenu}>{label}</SpaLink>)}
      </nav>
    </header>
  );
}
