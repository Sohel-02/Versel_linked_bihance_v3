import React, { useState } from 'react';

function QuickActionCTA({ whatsappLink, targetId = 'showcase-section' }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((v) => !v);

  const scrollTo = (id) => {
    const el = document.getElementById(id) || document.querySelector(`#${id}`);
    if (el) {
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
      // move keyboard focus to the section for accessibility
      if (el.tabIndex === -1 || el.getAttribute('tabindex') === null) {
        el.setAttribute('tabindex', '-1');
      }
      el.focus({ preventScroll: true });
    } else {
      // fallback: try anchor navigation (changes URL hash)
      window.location.hash = id;
    }
    setOpen(false);
  };

  const handleKey = (e, cb) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cb();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      <div className="flex flex-col items-center gap-3">
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-200 ${
            open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3'
          }`}
        >
          {/* Scroll to Showcase (uses targetId) */}
          <button
            onClick={() => scrollTo(targetId)}
            onKeyDown={(e) => handleKey(e, () => scrollTo(targetId))}
            aria-label="Open showcase"
            className="w-12 h-12 rounded-full shadow-lg bg-white flex items-center justify-center ring-1 ring-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="Showcase"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="14" rx="2" />
              <path d="M7 21h10" />
            </svg>
          </button>

          {/* WhatsApp CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact on WhatsApp"
            className="w-12 h-12 rounded-full shadow-lg bg-green-500 flex items-center justify-center text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300"
            title="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.1a9 9 0 1 0-2.6 6.2L21 21l-1.7-5.4A8.9 8.9 0 0 0 21 12.1z" />
              <path d="M17.5 14.5c-.2-.1-1.2-.6-1.4-.7-.4-.1-.6-.1-.8.2-.1.2-.5.7-.6.8-.1.1-.3.1-.5 0-.2-.1-.9-.3-1.7-1.1-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.5.1-.1.1-.2 0-.4-.1-.2-.8-1.8-1.1-2.5-.3-.7-.6-.6-.8-.6-.2 0-.5 0-.8 0-.3 0-.8.1-1.2.6-.4.5-1.3 1.3-1.3 3.1 0 1.8 1.3 3.5 1.4 3.7.1.2 2.2 3.3 5.6 4.5 3.4 1.2 3.4.8 4 1.1.6.3 2.6 1 3 1.1.4.1 1.6.1 1.8-1.2.2-1.3.2-2.4.1-2.6-.1-.2-.3-.2-.6-.3z" />
            </svg>
          </a>
        </div>

        {/* Main FAB */}
        <button
          onClick={toggleOpen}
          onKeyDown={(e) => handleKey(e, toggleOpen)}
          aria-expanded={open}
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
          className="w-14 h-14 rounded-full bg-red-500 shadow-2xl flex items-center justify-center text-white transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
          title={open ? 'Close' : 'Quick actions'}
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          )}
        </button>
      </div>

      <style jsx>{`
        .quick-action-enter {
          opacity: 0;
          transform: translateY(6px) scale(0.98);
        }
      `}</style>
    </div>
  );
}

export default QuickActionCTA;
