import { navigationItems } from '../data/navigation.js';
import SocialLinks from './SocialLinks.jsx';
import SpaLink from '../routing/SpaLink.jsx';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <SocialLinks compact />
      <nav aria-label="Footer navigation">
        {navigationItems.map(({ label, href }) => <SpaLink key={label} href={href}>{label === 'About Me' ? 'About' : label === 'Contact Me' ? 'Contact' : label}</SpaLink>)}
      </nav>
      <small>Copyright © 2026 · All rights reserved.</small>
    </footer>
  );
}
