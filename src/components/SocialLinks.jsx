const socialLinks = [
  { icon: 'ri-linkedin-box-fill', label: 'LinkedIn', href: 'https://www.linkedin.com/in/abdul-salam-saifi-583396263' },
  { icon: 'ri-github-fill', label: 'GitHub', href: 'https://github.com/AbdulSaifi11' },
  { icon: 'ri-mail-line', label: 'Email', href: 'mailto:adeebsaifi7711@gmail.com' },
  { icon: 'ri-twitter-x-fill', label: 'X', href: 'https://x.com/MohdAbdul9193' },
];

export default function SocialLinks({ compact = false }) {
  return (
    <div className={`social-links ${compact ? 'compact' : ''}`}>
      {socialLinks.map(({ icon, label, href }) => (
        <a key={label} href={href} aria-label={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
          <i className={icon} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
