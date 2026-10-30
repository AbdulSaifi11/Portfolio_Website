import { useRouter } from './Router.jsx';

export default function SpaLink({ href, className = '', onClick, children, ...props }) {
  const { path, navigate } = useRouter();
  const isInternal = href?.startsWith('/') && !href.startsWith('/assets/');
  const isActive = isInternal && (path === href || (href !== '/' && path.startsWith(`${href}/`)));
  const classes = [className, isActive ? 'active' : ''].filter(Boolean).join(' ');

  return (
    <a
      {...props}
      href={href}
      className={classes || undefined}
      aria-current={isActive ? 'page' : undefined}
      onClick={(event) => {
        onClick?.(event);
        const plainLeftClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if (!event.defaultPrevented && isInternal && plainLeftClick) {
          event.preventDefault();
          navigate(href);
        }
      }}
    >
      {children}
    </a>
  );
}
