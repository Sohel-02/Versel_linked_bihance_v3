import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ── Contact settings ──────────────────────────────────────────────────────────
const DEFAULT_WHATSAPP_NUMBER = '919430198982';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi Aamir, I'm interested in your thumbnail design services. Could you share pricing and turnaround?";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

function nowIso() {
  try { return new Date().toISOString(); } catch { return ''; }
}

export default function Portfolio() {
  const router = useRouter();
  const { rid: ridFromRouter } = router.query;

  const [images, setImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // mobile nav

  // Core value emphasized across the page
  const coreValue = 'I specialize in crafting high-CTR thumbnails that help creators like you stand out and grow faster.';

  // theme toggle persistence
  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) setTheme(saved);
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) setTheme('light');
    } catch (e) { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('portfolio-theme', theme); } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const getRidFromLocation = () => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('rid');
    } catch {
      return null;
    }
  };

  // ── Tracking (unchanged logic) ───────────────────────────────────────────────
  useEffect(() => {
    const rid = (router.isReady ? (ridFromRouter || null) : null) || getRidFromLocation();
    if (!rid) return;

    (async () => {
      const payload = {
        rid: String(rid),
        utm_source: 'email',
        utm_medium: 'drip',
        utm_campaign: 'portfolio',
        timestamp: nowIso()
      };

      try {
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const params = new URLSearchParams(payload);
          const ok = navigator.sendBeacon('/api/logClick', params.toString());
          if (process.env.NODE_ENV === 'development') {
            console.log('[Portfolio] sendBeacon → /api/logClick :', ok);
          }
          if (ok) return;
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.warn('[Portfolio] sendBeacon error', e);
      }

      try {
        await fetch('/api/logClick', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true
        });
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Portfolio] fetch(/api/logClick) failed', e);
        }
      }
    })();

    try {
      const urlsFromEnv = (process.env.NEXT_PUBLIC_APPS_SCRIPT_URLS || '')
        .split(',')
        .map(u => u.trim())
        .filter(Boolean);
      const singleFromEnv = (process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || '').trim();

      const candidates = [];
      if (urlsFromEnv.length) candidates.push(...urlsFromEnv);
      if (singleFromEnv) candidates.push(singleFromEnv);
      candidates.push(
        'https://script.google.com/macros/s/AKfycbxN9U9Py6E4f1gU0HeuTW-DOdn2avbSKH_tX1--WClbUyn4Fi1ldZahS76y_CmpM3cd9w/exec'
      );

      const seen = new Set();
      const scriptBases = candidates.filter(u => {
        if (!u) return false;
        if (seen.has(u)) return false;
        seen.add(u);
        return true;
      });

      const ts = Date.now();
      scriptBases.forEach((scriptBase) => {
        try {
          const base = scriptBase.endsWith('/') ? scriptBase.slice(0, -1) : scriptBase;
          const url = `${base}?action=track&rid=${encodeURIComponent(String(rid))}&via=landing-page&_t=${ts}`;
          if (process.env.NODE_ENV === 'development') console.log('[Portfolio] beacon img:', url);
          const img = new Image();
          img.onerror = () => { if (process.env.NODE_ENV === 'development') console.error('[Portfolio] beacon fail:', url); };
          img.onload = () => { if (process.env.NODE_ENV === 'development') console.log('[Portfolio] beacon ok:', url); };
          img.src = url;
        } catch (e) {
          if (process.env.NODE_ENV === 'development') console.error('[Portfolio] beacon err', e);
        }
      });
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.warn('[Portfolio] beacons block error', e);
    }
  }, [ridFromRouter, router.isReady]);

  // ── Load images (env-first, else placeholders) ──────────────────────────────
  useEffect(() => {
    const cloudinaryImages =
      process.env.NEXT_PUBLIC_CLOUDINARY_IMAGES || process.env.NEXT_PUBLIC_PORTFOLIO_IMAGES || '';

    if (cloudinaryImages) {
      const imageUrls = cloudinaryImages.split(',').map(url => url.trim()).filter(Boolean);
      setImages(imageUrls);
    } else {
      setImages([
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1600&h=1000&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=1000&fit=crop'
      ]);
    }
  }, []);

  const galleryImgError = (index) => (e) => {
    e.currentTarget.src = `https://via.placeholder.com/1200x800/111827/9CA3AF?text=Image+${index + 1}`;
  };

  const openLightbox = useCallback((index) => { setActiveIndex(index); }, []);

  // quick-pitch helpers — single canonical pitch (templates removed)
  const pitchMessage = (name = 'Creator', cta = 'Recent Work: [link]') =>
    `Hi ${name},\n\n${coreValue} ${cta}\n\nWould you like to try a thumbnail that increases CTR for your next video?`;

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) { alert('Unable to copy'); }
  };

  // theme classes
  const rootClass = theme === 'dark' ? 'dark-mode' : 'light-mode';

  return (
    <>
      <Head>
        <title>Aamir — Thumbnail Designer | Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Aamir — Premium thumbnail design that increases CTR and viewer engagement." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className={`${rootClass} min-h-screen bg-tiles`}>
        {/* ── NAV (Work + About only) ─────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-black/12 border-b border-white/6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo */}
              <div className="flex items-center gap-3">
                <a href="/" className="flex items-center gap-3 no-underline">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#ff3b3b] to-[#ff9b3b] flex items-center justify-center font-extrabold text-lg ring-2 ring-white/6 transform-gpu transition-all duration-300 logo-bounce">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <div className="font-extrabold leading-none" style={{fontFamily:'Bebas Neue,system-ui', color:'var(--text)'}}>Aamir</div>
                    <div className="text-[11px] tracking-wide uppercase muted-strong">Thumbnail Designer</div>
                  </div>
                </a>
              </div>

              {/* Center: Navigation (hidden on small screens) */}
              <div className="hidden md:flex items-center gap-6">
                <a href="#gallery" className="nav-link">Work</a>
                <a href="#about" className="nav-link">About</a>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                {/* theme toggle */}
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full muted-bg hover:muted-bg-hover transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block">
                    {theme === 'dark' ? (
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="#FFDDDE" />
                    ) : (
                      <g>
                        <circle cx="12" cy="12" r="4" fill="#FFDDDE" />
                      </g>
                    )}
                  </svg>
                  <span className="text-xs muted-strong">{theme === 'dark' ? 'Night' : 'Day'}</span>
                </button>

                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex px-4 py-2 rounded-full bg-[#ff4949] hover:bg-[#ff5f5f] transition text-sm font-semibold items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="inline-block"><path d="M20.5 3.5v17l-4.3-3c-.9.3-1.8.5-2.7.5-4.8 0-8.7-3.9-8.7-8.7S8.5 1.6 13.3 1.6c3.2 0 6 .1 7.2 1.9z" fill="#fff"/></svg>
                  WhatsApp
                </a>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMenuOpen(m => !m)}
                  aria-expanded={menuOpen}
                  aria-label="Toggle menu"
                  className="md:hidden p-2 rounded-full muted-bg hover:muted-bg-hover transition"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" className="block">
                    {menuOpen ? (
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    ) : (
                      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel (only Work + About) */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/6 bg-[var(--card-bg)]">
              <div className="px-4 py-4 space-y-3">
                <a href="#gallery" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-md nav-link-mobile">Work</a>
                <a href="#about" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-md nav-link-mobile">About</a>
                <div className="pt-2 border-t border-white/6">
                  <a href={WHATSAPP_LINK} onClick={() => setMenuOpen(false)} className="block w-full text-center py-2 rounded-full bg-[var(--accent)] font-semibold">Contact on WhatsApp</a>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* HERO with updated composition and clearer CTA */}
        <header className="relative py-20 overflow-hidden">
          {/* Decorative background blobs */}
          <div aria-hidden className="absolute -left-32 -top-36 w-[760px] h-[760px] pointer-events-none z-0">
            <svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#ff9b3b" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <g transform="translate(300,300)">
                <path fill="url(#g1)">
                  <animate attributeName="d" dur="10s" repeatCount="indefinite"
                    values="M120,-160C162,-128,176,-64,164,-12C152,40,114,80,62,116C9,151,-52,182,-112,164C-172,146,-231,79,-225,14C-219,-50,-147,-101,-89,-144C-31,-187,9,-221,64,-213C119,-204,78,-192,120,-160Z;
                            M112,-146C153,-117,189,-67,186,-18C182,31,139,59,95,91C50,123,3,164,-44,161C-90,158,-176,111,-196,49C-216,-12,-170,-82,-119,-122C-68,-162,-34,-172,5,-176C44,-180,71,-175,112,-146Z;
                            M120,-160C162,-128,176,-64,164,-12C152,40,114,80,62,116C9,151,-52,182,-112,164C-172,146,-231,79,-225,14C-219,-50,-147,-101,-89,-144C-31,-187,9,-221,64,-213C119,-204,78,-192,120,-160Z" />
                </path>
              </g>
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Copy + stats */}
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full muted-bg border muted-border text-xs muted-strong">
                  <span className="inline-block h-4 w-6 -mt-[2px]">
                    <svg viewBox="0 0 24 24" className="block h-full w-full"><rect x="1" y="4" width="22" height="16" rx="4" fill="#FF0000"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="#fff"/></svg>
                  </span>
                  Aamir • <span className="muted-strong">Thumbnail Designer</span>
                </div>

                {/* Layered headline for depth */}
                <div className="relative mt-4">
                  <h1 className="mt-0 text-5xl md:text-6xl leading-[1.02] font-extrabold heading-layer" style={{color:'var(--text)'}}>
                    Thumbnails that Stop The Scroll
                  </h1>

                  {/* duplicate for layered depth */}
                  <h1 aria-hidden className="absolute top-1 left-1 text-5xl md:text-6xl leading-[1.02] font-extrabold heading-layer shadow-dup opacity-30 pointer-events-none" style={{color:'var(--text)'}}>
                    Thumbnails that Stop The Scroll
                  </h1>
                </div>

                <p className="mt-4 text-lg muted-strong" style={{color:'var(--muted)'}}>
                  <strong style={{color:'var(--accent)'}}> {coreValue} </strong>
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full bg-[var(--accent)] text-sm font-semibold shadow-lg hover:translate-y-[-1px] transition">Get a quote</a>
                  <a href="#gallery" className="px-4 py-3 rounded-full border muted-border text-sm hover:muted-bg-hover transition">See work</a>
                 
                    
                  
                </div>

                {/* Trust stats */}
                <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                  <div className="stat">
                    <div className="num">+250</div>
                    <div className="lbl">Thumbnails delivered</div>
                  </div>
                  <div className="stat">
                    <div className="num">+35%</div>
                    <div className="lbl">Average CTR uplift</div>
                  </div>
                  <div className="stat">
                    <div className="num">48h</div>
                    <div className="lbl">Fast turnaround</div>
                  </div>
                </div>
              </div>

              {/* Featured thumbnail preview */}
              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 hero-thumb card-bg border muted-border">
                  {images[0] ? (
                    <img
                      src={images[0]}
                      alt="Featured thumbnail"
                      className="w-full h-[460px] object-cover"
                      onError={galleryImgError(0)}
                    />
                  ) : (
                    <div className="w-full h-[460px] card-bg" />
                  )}

                  {/* overlay: modern label + sample micro-thumbnails */}
                  <div className="absolute right-6 bottom-6 flex items-center gap-3">
                    <div className="mini-thumbs flex gap-2">
                      {images.slice(1,4).map((s,i) => (
                        <img key={i} src={s} alt={`mini-${i}`} className="w-16 h-10 object-cover rounded-md ring-1 ring-white/6" onError={galleryImgError(i+1)} />
                      ))}
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-xs font-semibold bg-black/50 px-3 py-1 rounded-full">Case Study</div>
                      <div className="text-[10px] muted-strong mt-1">CTR uplift • +32%</div>
                    </div>
                  </div>

                  <div className="shine" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Gallery */}
        <main id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold" style={{color:'var(--text)'}}>Selected thumbnails</h2>
            <div className="text-sm muted-strong">Creator-focused • High-CTR • Fast revisions</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="group relative block w-full rounded-xl overflow-hidden card-bg hover:scale-[1.02] transition will-change-transform"
              >
                <img
                  src={src}
                  alt={`thumb-${i+1}`}
                  className="w-full h-52 object-cover group-hover:brightness-110 transition"
                  onError={galleryImgError(i)}
                />
                <div className="tile-overlay" />
                <div className="tile-title">Thumbnail {i+1}</div>
              </button>
            ))}
          </div>

          {/* Credibility / mini case studies */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="case p-6 rounded-2xl">
              <div className="font-bold text-lg" style={{color:'var(--text)'}}>Gaming Channel</div>
              <div className="text-sm muted-text mt-2">32% CTR uplift after 4 thumbnails — focused on facial expression + bold text.</div>
            </div>
            <div className="case p-6 rounded-2xl">
              <div className="font-bold text-lg" style={{color:'var(--text)'}}>Tech Reviews</div>
              <div className="text-sm muted-text mt-2">Click-through improved by 28% with bright accent colors and simplified visual hierarchy.</div>
            </div>
            <div className="case p-6 rounded-2xl">
              <div className="font-bold text-lg" style={{color:'var(--text)'}}>Lifestyle Vlogs</div>
              <div className="text-sm muted-text mt-2">Double-tap style thumbnails and consistent branding led to faster viewer recognition.</div>
            </div>
          </div>
        </main>

        {/* Small About section */}
        <section id="about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[var(--card-bg)] border muted-border rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold" style={{color:'var(--text)'}}>About Aamir</h3>
                <p className="mt-2 text-sm muted-text">
                  I design high-impact YouTube thumbnails focused on clear faces, bold titles, and contrast-first composition to increase CTR and long-term channel growth. I work with creators across gaming, tech and lifestyle niches — fast revisions, brand consistency, and pixel-perfect exports.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-sm muted-strong">Services</div>
                <div className="text-sm">
                  <span className="inline-block px-3 py-1 rounded-full border muted-border text-xs">Thumbnail Design</span>
                  <span className="inline-block px-3 py-1 rounded-full border muted-border text-xs ml-2">Batch Packages</span>
                </div>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 px-4 py-2 rounded-full bg-[var(--accent)] text-sm font-semibold">Contact</a>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        {activeIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveIndex(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur" />
            <div className="relative max-w-5xl w-full rounded-xl overflow-hidden z-10">
              <img
                src={images[activeIndex]}
                alt={`open-${activeIndex+1}`}
                className="w-full h-auto max-h-[85vh] object-contain bg-black"
              />
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="muted-text mb-4">Let’s craft thumbnails that make people click.</div>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 rounded-full bg-[var(--accent)] text-sm font-semibold shadow-xl"
          >
            Book a slot on WhatsApp
          </a>
        </footer>

        <style jsx>{`
          :root { --accent:#ff3b3b; }

          /* Theme skins using semantic variables */
          .light-mode { --bg:#ffffff; --text:#0b0b0d; --muted:#334155; --card-bg: rgba(0,0,0,0.06); --card-border: rgba(0,0,0,0.08); --muted-strong: rgba(0,0,0,0.76); }
          .dark-mode { --bg: #07070a; --text: #f8fafc; --muted:#94a3b8; --card-bg: rgba(255,255,255,0.03); --card-border: rgba(255,255,255,0.04); --muted-strong: rgba(255,255,255,0.82); }

          .bg-tiles { background: radial-gradient(1000px 300px at 20% -10%, rgba(255,59,59,0.10), transparent 40%), radial-gradient(1000px 300px at 110% 10%, rgba(255,184,107,0.06), transparent 40%), var(--bg); }

          /* semantic utility classes (overrides for light/dark) */
          .muted-text { color: var(--muted); }
          .muted-strong { color: var(--muted-strong); }

          .muted-bg { background: var(--card-bg); }
          .muted-bg-hover { background: rgba(0,0,0,0.08); }
          .muted-border { border: 1px solid var(--card-border); }
          .muted-btn { background: var(--card-bg); border: 1px solid var(--card-border); padding: 8px 12px; }

          .card-bg { background: var(--card-bg); }

          .badge { position:absolute; left:16px; top:16px; background:var(--card-bg); padding:8px 12px; border-radius:12px; display:flex; align-items:center; gap:6px; border:1px solid var(--card-border); }

          .heading-layer { font-family: 'Bebas Neue', system-ui; letter-spacing:.5px; color:var(--text); text-shadow: 0 12px 28px rgba(0,0,0,0.12); }
          .shadow-dup { filter: blur(6px); transform: translate(6px,6px); }

          .stat { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border-radius:14px; padding:14px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); border:1px solid var(--card-border); }
          .stat .num { font: 800 22px/1 'Inter', system-ui; color:var(--text); }
          .stat .lbl { font: 600 11px/1.2 'Inter', system-ui; color:var(--muted); margin-top:6px; text-transform:uppercase; letter-spacing:.4px; }

          .hero-thumb { position:relative; }
          .shine { position:absolute; inset:0; background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 60%); transform: translateX(-120%); animation: shine 4s ease-in-out infinite; pointer-events:none; mix-blend-mode:screen; }
          @keyframes shine { 0%{transform:translateX(-120%);} 60%{transform:translateX(120%);} 100%{transform:translateX(120%);} }

          .tile-overlay { position:absolute; inset:0; background: radial-gradient(400px 120px at 90% 100%, rgba(255,59,59,0.08), transparent 40%); opacity:.95; mix-blend-mode: overlay; pointer-events:none; }
          .tile-title { position:absolute; left:12px; bottom:12px; font-weight:800; font-size:12px; background: rgba(0,0,0,.45); padding:6px 10px; border-radius:10px; }

          .case { background: var(--card-bg); border:1px solid var(--card-border); }

          .decor-yts { position:absolute; inset:0; pointer-events:none; }

          /* NAV / header specific */
          .nav-link {
            color: var(--muted-strong);
            font-weight:600;
            text-decoration:none;
            padding:6px 10px;
            border-radius:8px;
            transition: all .18s ease;
          }
          .nav-link:hover { color: var(--text); background: rgba(255,255,255,0.02); transform: translateY(-2px); }

          .nav-link-mobile {
            color: var(--muted-strong);
            text-decoration:none;
          }

          .logo-bounce { transform-origin:center; }
          .logo-bounce:hover { transform: translateY(-3px) scale(1.02); }

          .mini-thumbs img { box-shadow: 0 6px 18px rgba(0,0,0,0.24); }

          /* accessible responsive tweaks */
          @media (max-width:1024px){ .heading-layer{font-size:44px;} }
          @media (max-width:640px){ .heading-layer{font-size:36px;} }
        `}</style>
      </div>
    </>
  );
}
