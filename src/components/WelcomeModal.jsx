import { useEffect, useRef } from 'react';

export default function WelcomeModal({ onClose }) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const focusable = dialog.current?.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialog} className="welcome-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <button ref={closeButton} type="button" className="modal-close" aria-label="Close welcome" onClick={onClose}><i className="ri-close-line" /></button>
        <p className="eyebrow">Thanks for visiting</p>
        <h2 id="welcome-title">Hi, welcome!</h2>
        <p><strong>I'm Abdul,</strong> a frontend developer / React developer. My skills include HTML, CSS, JavaScript, Bootstrap, React.js, Figma, TypeScript, Git &amp; GitHub, Java and REST APIs. Explore this page to learn about my education, experience and projects.</p>
        <button type="button" className="button button-primary" onClick={onClose}>Explore my profile <i className="ri-arrow-right-line" /></button>
      </section>
    </div>
  );
}
