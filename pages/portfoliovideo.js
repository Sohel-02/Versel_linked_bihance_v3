// pages/index.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Real Estate Video Editing — Portfolio (Next.js + Tailwind-friendly)
 * Updated: Responsive modal with correct aspect-box sizing + professional QuickActionCTA
 * - Fixed iframe aspect rendering (padding-bottom fallback)
 * - Reworked QuickActionCTA to a set of rounded floating action buttons with icons, tooltips, and keyboard support
 */

// ---------- ProgressiveImage (kept for potential poster/placeholder usage) ----------
function ProgressiveImage({
  src,
  placeholder,
  alt = '',
  className = '',
  eager = false,
  fit = 'cover'
}) {
  const imgRef = useRef(null);
  const [inView, setInView] = useState(eager);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (eager) return;
    if (!imgRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '300px', threshold: 0.01 }
    );
    io.observe(imgRef.current);
    return () => io.disconnect();
  }, [eager]);

  const style = {
    width: '100%',
    height: fit === 'auto' ? 'auto' : '100%',
    objectFit: fit,
    transition: 'opacity .42s, transform .42s',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(6px)'
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`} aria-busy={!loaded}>
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(8px) saturate(.9)',
            transform: 'scale(1.02)',
            transition: 'opacity .42s ease'
          }}
        />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={style}
        />
      )}
    </div>
  );
}

// ---------- Services Data ----------
const SERVICES = [
  {
    id: 'home-tours',
    title: 'Dynamic Home Tours & Montages',
    hero: 'Dynamic Home Tours & Montages — Make buyers fall in love at first click',
    sub: 'Stylish, fast-paced montages that highlight selling points and inspire viewing inquiries.',
    description: 'Curated home tour videos (60s–2m) that show flow, light, and lifestyle. Includes optimized social cuts and MLS-safe exports.',
    features: [
      'Fast 24–72 hour turnaround available',
      'Color grading tailored to natural light',
      'Shot organization & continuity edits',
      'MLS-ready H.264 MP4 + social crops'
    ],
    showcase: [
      'https://youtu.be/kfAQH-eUXn8',
      'https://youtu.be/SoqR188ZP9E',
      'https://youtu.be/EbnjctFkO14'
    ]
  },
  {
    id: 'shorts',
    title: 'Viral Shorts (Reels / TikToks)',
    hero: 'Viral Shorts — Capture attention on Instagram & TikTok',
    sub: 'Hook-first edits optimized for 15–60s social formats to convert views into leads.',
    description: 'Short, high-energy vertical edits, with animated captions and beat edits. Perfect to generate showing requests and DMs.',
    features: ['Hook-first editing (0–3s optimized)', 'Animated captions & CTAs', 'Beat-synced cuts & trending audio', 'Vertical & square crops with captions'],
    showcase: [
      'https://youtube.com/shorts/921OO715OyI?feature=share',
      'https://youtube.com/shorts/muneHSilb84?feature=share'
    ]
  },
  {
    id: 'cinematic',
    title: 'Cinematic Walkthroughs',
    hero: 'Cinematic Walkthroughs — Show the story of the house',
    sub: 'Slow, cinematic pacing for high-end listings with music and scene-building edits.',
    description: 'Slow-paced walkthroughs for premium listings. Emphasis on motion smoothing, cinematic color grade, and optional VO.',
    features: ['4K-ready edits', 'Stabilization & motion smoothing', 'Professional color grade & LUTs', 'Optional voiceover / script edits'],
    showcase: ['https://youtu.be/6EzERzpkorM', 'https://youtu.be/KW4B5tV1woQ']
  },
  {
    id: 'drone',
    title: 'Aerial Neighborhood & Lifestyle Highlights',
    hero: 'Aerial Neighborhood & Lifestyle Highlights — Sell the location, not just the home',
    sub: 'Drone edits that showcase location, amenities, and lifestyle — parks, skyline, and approach shots.',
    description: 'Smooth aerial edits with location callouts and animated maps. Deliverables for ads and listings.',
    features: ['Drone stabilization & color grade', 'Location callouts & animated maps', 'Smooth aerial-to-ground transitions', '30s & 60s ad-ready versions'],
    showcase: ['https://youtu.be/NlPMM8tyf58', 'https://youtu.be/aPk_UY7JD38']
  }
];

const DEFAULT_WHATSAPP_NUMBER = '919905689072';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || DEFAULT_WHATSAPP_NUMBER;
const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi Aamir, I'm interested in your real estate video editing services. Could you share pricing and turnaround?";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const HERO_VIDEO_URL = 'https://youtu.be/RkUuN4ErGmg';

// ---------- Thumbnail loader: tries multiple candidates to avoid blurry missing thumbs ----------
function useYoutubeThumbnail(videoId, preferred = 'maxresdefault') {
  const [url, setUrl] = useState('');
  useEffect(() => {
    if (!videoId) {
      setUrl('');
      return;
    }
    
    // Comprehensive fallback chain: try highest quality first, then progressively lower
    // Note: Some 404 errors in console are expected when thumbnails don't exist - the fallback handles this
    const candidates = [
      `https://img.youtube.com/vi/${videoId}/${preferred}.jpg`, // Try preferred first
      `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,   // Standard definition (640x480) - good for shorts
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,   // High quality (480x360) - most reliable
      `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,  // Medium quality (320x180)
      `https://img.youtube.com/vi/${videoId}/default.jpg`      // Default fallback (120x90)
    ];

    let cancelled = false;
    let currentIndex = 0;
    
    const tryLoad = (index = 0) => {
      if (cancelled) return;
      
      // If we've tried all candidates, use hqdefault as final fallback (most reliable)
      if (index >= candidates.length) {
        if (!cancelled) {
          setUrl(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
        }
        return;
      }
      
      const img = new Image();
      const timeout = setTimeout(() => {
        // If image doesn't load within 2 seconds, try next candidate
        if (!cancelled && currentIndex === index) {
          tryLoad(index + 1);
        }
      }, 2000);
      
      img.onload = () => {
        clearTimeout(timeout);
        if (!cancelled && currentIndex === index) {
          setUrl(candidates[index]);
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        if (!cancelled && currentIndex === index) {
          // Try next candidate on error
          tryLoad(index + 1);
        }
      };
      
      currentIndex = index;
      // Set src last to trigger load
      img.src = candidates[index];
    };
    
    tryLoad(0);
    
    return () => {
      cancelled = true;
    };
  }, [videoId, preferred]);

  return url;
}

// ---------- Lazy YouTube Embed (robust video id extraction + short detection) ----------
function LazyYouTubeVideo({ url, title = 'Video', className = '', eager = false, thumbnailQuality = 'hqdefault', onThumbnailClick }) {
  const [inView, setInView] = useState(eager);
  const containerRef = useRef(null);

  // Extract video ID from many YouTube URL formats
  const getVideoId = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    try {
      const u = new URL(raw.trim());
      const host = u.hostname.replace('www.', '').toLowerCase();

      if (host === 'youtu.be') {
        return u.pathname.slice(1).split(/[/?#]/)[0] || null;
      }
      if (u.pathname.startsWith('/shorts/')) {
        return u.pathname.split('/').pop().split(/[/?#]/)[0] || null;
      }
      if (u.pathname.startsWith('/embed/')) {
        return u.pathname.split('/').pop().split(/[/?#]/)[0] || null;
      }
      if (u.searchParams.get('v')) {
        return u.searchParams.get('v');
      }
      const lastSeg = u.pathname.split('/').filter(Boolean).pop();
      if (lastSeg && lastSeg.length >= 6 && lastSeg.length <= 20) {
        return lastSeg;
      }
      return null;
    } catch (e) {
      const m = raw.match(/(?:v=|\/)([0-9A-Za-z_-]{6,})/);
      return m ? m[1] : null;
    }
  };

  const videoId = getVideoId(url);
  if (!videoId) return null;

  // A safer, simpler short detection: check for 'shorts' in the URL path or query
  const isShort = /shorts/i.test(url);

  // use hook to get the best available thumbnail
  // For shorts, use sddefault or hqdefault as they're more reliably available
  // For regular videos, use the passed thumbnailQuality (usually maxresdefault for hero, hqdefault for others)
  const preferredQuality = isShort ? 'sddefault' : thumbnailQuality;
  const thumbnailUrl = useYoutubeThumbnail(videoId, preferredQuality);

  const embedBase = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

  useEffect(() => {
    if (eager) {
      setInView(true);
      return;
    }
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: '300px', threshold: 0.12 }
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, [eager]);

  const handleClick = () => {
    if (onThumbnailClick) {
      onThumbnailClick({ videoId, title, embedUrl: embedBase, url });
    }
  };

  // aspect style: vertical (shorts) uses ~9/16 (height > width)
  const paddingBottom = isShort ? '177.78%' : '56.25%'; // 9/16 => 177.78%, 16/9 => 56.25%

  return (
    <div
      ref={containerRef}
      className={`${className} relative w-full`}
      style={{ minHeight: 100 }}
      aria-label={title}
    >
      <button
        onClick={handleClick}
        className="w-full group block rounded-2xl overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
        aria-label={`Play ${title}`}
        style={{ textAlign: 'left' }}
      >
        <div
          className="w-full bg-cover bg-center relative"
          style={{
            paddingBottom,
            backgroundImage: inView && thumbnailUrl ? `url(${thumbnailUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#111'
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.28) 100%)' }}
          >
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2 group-hover:scale-105 transition-transform"
              style={{
                background: 'rgba(0,0,0,0.52)',
                color: 'white',
                transform: 'translateY(0)'
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="flex-shrink-0">
                <path d="M8 5v14l11-7z" />
              </svg>
              <div className="text-left">
                <div className="text-sm font-semibold leading-tight">{title}</div>
                <div className="text-xs opacity-80 mt-0.5">Click to play</div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

// ---------- Video Modal Component (responsive aspect-box sizing to avoid mobile clipping) ----------
function VideoModal({ videoId, title, embedUrl, isOpen, onClose }) {
  const [muted, setMuted] = useState(true);
  const [iframeKey, setIframeKey] = useState(0); // to reload iframe when toggling mute

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // reset mute when new video opens
  useEffect(() => {
    if (isOpen) {
      setMuted(true);
      setIframeKey((k) => k + 1);
    }
  }, [videoId, isOpen]);

  if (!isOpen || !videoId) return null;

  const isShort = embedUrl ? /shorts/i.test(embedUrl) || /shorts/i.test(title) : /shorts/i.test(title);

  const ensureEmbed = (raw, id) => {
    if (!raw || typeof raw !== 'string') {
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    }
    try {
      const u = new URL(raw);
      if (/\/embed\//i.test(u.pathname)) {
        const base = `https://${u.hostname}${u.pathname}`;
        return `${base}?rel=0&modestbranding=1&playsinline=1`;
      }
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    } catch (e) {
      return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;
    }
  };

  const finalEmbedBase = ensureEmbed(embedUrl, videoId);
  const iframeSrc = `${finalEmbedBase}${finalEmbedBase.includes('?') ? '&' : '?'}autoplay=1&playsinline=1${muted ? '&mute=1' : ''}`;

  const handleUnmute = () => {
    setMuted(false);
    setIframeKey((k) => k + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* BACKDROP (explicit stacking) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 1
        }}
      />

      {/* MODAL CONTENT BOX (stack above backdrop) */}
      <div
        className="relative w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          zIndex: 2,
          width: '100%',
          maxWidth: 1100,
          borderRadius: 18,
          padding: '8px',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
          aria-label="Close video"
          style={{ zIndex: 30 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {muted && (
          <button
            onClick={handleUnmute}
            className="absolute left-4 top-3 z-30 px-3 py-2 rounded-full bg-white/90 text-black font-semibold transition-colors hover:bg-white"
            aria-label="Unmute"
            style={{ zIndex: 30 }}
          >
            Unmute
          </button>
        )}

        {/* Player wrapper: fixed aspect ratio container */}
        <div
          style={{
            width: '100%',
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
            background: '#000',
            position: 'relative'
          }}
        >
          {/* Aspect ratio container - ensures proper video display without black areas */}
          <div
            className="video-container"
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: isShort ? '177.78%' : '56.25%', // 9/16 for vertical shorts, 16/9 for standard videos
              height: 0,
              background: '#000',
              overflow: 'hidden',
              display: 'block',
              aspectRatio: isShort ? '9/16' : '16/9' // Modern CSS fallback
            }}
          >
            <iframe
              key={`iframe-${iframeKey}`}
              src={iframeSrc}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                margin: 0,
                padding: 0,
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Professional QuickActionCTA (rounded action buttons) ----------
function QuickActionCTA({ whatsappLink }) {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => setOpen((v) => !v);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      {/* Main FAB: expands to show smaller action buttons */}
      <div className="flex flex-col items-center gap-3">
        {/* Action buttons: shown when open */}
        <div className={`flex flex-col items-center gap-3 transition-all duration-200 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-3'}`}>
          <button
            onClick={() => scrollTo('showcase')}
            onKeyDown={(e) => handleKey(e, () => scrollTo('showcase'))}
            aria-label="Open showcase"
            className="w-12 h-12 rounded-full shadow-lg bg-white flex items-center justify-center ring-1 ring-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Showcase"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="14" rx="2" />
              <path d="M7 21h10" />
            </svg>
          </button>

          <button
            onClick={() => scrollTo('services')}
            onKeyDown={(e) => handleKey(e, () => scrollTo('services'))}
            aria-label="See services"
            className="w-12 h-12 rounded-full shadow-lg bg-white flex items-center justify-center ring-1 ring-gray-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Services"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

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
              <path d="M17.5 14.5c-.2-.1-1.2-.6-1.4-.7-.4-.1-.6-.1-.8.2-.1.2-.5.7-.6.8-.1.1-.3.1-.5.0-.2-.1-.9-.3-1.7-1.1-.6-.5-1-1.1-1.1-1.3-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.5.1-.1.1-.2 0-.4-.1-.2-.8-1.8-1.1-2.5-.3-.7-.6-.6-.8-.6-.2 0-.5 0-.8 0-.3 0-.8.1-1.2.6-.4.5-1.3 1.3-1.3 3.1 0 1.8 1.3 3.5 1.4 3.7.1.2 2.2 3.3 5.6 4.5 3.4 1.2 3.4.8 4 1.1.6.3 2.6 1 3 1.1.4.1 1.6.1 1.8-1.2.2-1.3.2-2.4.1-2.6-.1-.2-.3-.2-.6-.3z" />
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
        /* small fade/slide for the action stack */
        .quick-action-enter { opacity: 0; transform: translateY(6px) scale(.98); }
      `}</style>
    </div>
  );
}

// ---------- Main Page ----------
export default function RealEstatePortfolio() {
  const router = useRouter();
  const { rid: ridFromRouter } = router.query;

  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);

  const coreValue = 'I create property videos that shorten time on market and convert views into showing requests.';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) setTheme(saved);
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark');
      else setTheme('light');
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const handleVideoClick = (videoData) => {
    setModalVideo(videoData);
  };

  const closeModal = () => {
    setModalVideo(null);
  };

  const renderVideoEmbed = (url, idx, isHero = false) => {
    const title = `Showcase video ${idx + 1}`;
    return (
      <LazyYouTubeVideo
        key={`${idx}-${url}`}
        url={url}
        title={title}
        className={isHero ? 'hero-video' : 'video-embed'}
        onThumbnailClick={handleVideoClick}
        eager={isHero}
        thumbnailQuality={isHero ? 'maxresdefault' : 'hqdefault'}
      />
    );
  };

  return (
    <>
      <Head>
        <title>Real Estate Video Editing — Portfolio | Aamir</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Professional video editing for realtors — home tours, cinematic walkthroughs, viral shorts, and drone highlights that drive leads." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <VideoModal
        videoId={modalVideo?.videoId}
        title={modalVideo?.title || 'Video'}
        embedUrl={modalVideo?.embedUrl || modalVideo?.url}
        isOpen={!!modalVideo}
        onClose={closeModal}
      />

      <QuickActionCTA whatsappLink={WHATSAPP_LINK} />

      <div className={`${theme === 'dark' ? 'dark' : 'light'} min-h-screen bg-white text-black`}>
        <nav className="sticky top-0 z-40 bg-white/60 backdrop-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <a href="/" className="flex items-center gap-3 no-underline">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-red-500 to-yellow-400 flex items-center justify-center font-extrabold text-lg text-white">A</div>
                  <div className="hidden sm:block">
                    <div className="font-extrabold leading-none" style={{ fontFamily: 'Bebas Neue, system-ui' }}>Aamir</div>
                    <div className="text-xs uppercase tracking-wide text-gray-500">Video Editor</div>
                  </div>
                </a>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <a href="#services" className="text-sm font-medium text-gray-700 hover:text-black">Services</a>
                <a href="#showcase" className="text-sm font-medium text-gray-700 hover:text-black">Showcase</a>
                <a href="#why" className="text-sm font-medium text-gray-700 hover:text-black">Why Choose Me</a>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={toggleTheme} aria-label="Toggle theme" className="hidden md:inline-flex items-center px-3 py-2 rounded-full bg-gray-100">
                  <span className="text-sm">{theme === 'dark' ? 'Night' : 'Day'}</span>
                </button>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full">
                  Contact
                </a>

                <button onClick={() => setMenuOpen((m) => !m)} className="md:hidden p-2">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-4 py-4 space-y-3">
                <a href="#services" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-md">Services</a>
                <a href="#showcase" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-md">Showcase</a>
                <a href="#why" onClick={() => setMenuOpen(false)} className="block py-2 px-3 rounded-md">Why Choose Me</a>
                <a href={WHATSAPP_LINK} onClick={() => setMenuOpen(false)} className="block w-full text-center py-2 rounded-full bg-red-500 text-white font-semibold">Contact on WhatsApp</a>
              </div>
            </div>
          )}
        </nav>

        {/* HERO */}
        <header className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-sm mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mr-1">
                    <rect x="1" y="4" width="22" height="16" rx="4" fill="#FF0000" />
                    <path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="#fff" />
                  </svg>
                  Aamir • Real Estate Video Editor
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Video Editing for Realtors — Sell Homes Faster</h1>
                <p className="text-lg text-gray-700 mb-6"><strong className="text-red-600">{coreValue}</strong></p>

                <div className="flex flex-wrap gap-3">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full bg-red-500 text-white font-semibold">Get a Quote</a>
                  <a href="#services" className="px-4 py-3 rounded-full border border-gray-200 text-sm">See Services</a>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-bold">48–72h</div>
                    <div className="text-xs text-gray-500">Typical delivery</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-bold">Realtor-First</div>
                    <div className="text-xs text-gray-500">Editing templates</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-center">
                    <div className="font-bold">US Based</div>
                    <div className="text-xs text-gray-500">Timezone-friendly</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <LazyYouTubeVideo
                    url={HERO_VIDEO_URL}
                    title="Featured Real Estate Video"
                    className="hero-video"
                    eager={true}
                    thumbnailQuality="maxresdefault"
                    onThumbnailClick={handleVideoClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* SERVICES */}
        <main id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold">Services</h2>
              <p className="text-sm text-gray-600 mt-2">Four focused services tailored for property marketing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s) => (
              <article key={s.id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.sub}</p>
                <ul className="text-sm text-gray-700 space-y-2 mb-4">
                  {s.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 text-red-500 flex-shrink-0">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-3">
                  <a href={`#${s.id}`} className="text-sm font-semibold text-red-600">Learn more ➜</a>
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="ml-auto px-3 py-2 rounded-full bg-red-500 text-white text-sm">Request</a>
                </div>
              </article>
            ))}
          </div>
        </main>

        {/* Per-Category Sections */}
        {SERVICES.map((s) => (
          <section id={s.id} key={s.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="pt-8 border-t border-gray-100">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold mb-1">{s.hero}</h2>
                <p className="text-gray-600">{s.sub}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <p className="text-gray-700 mb-4">{s.description}</p>
                  <ul className="mb-6 space-y-2">
                    {s.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <span className="text-red-600 font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Showcase Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {s.showcase.length === 0 ? (
                      <div className="p-4 rounded-lg bg-gray-50 text-center text-sm text-gray-500">No videos yet — add YouTube links in the SERVICES array.</div>
                    ) : (
                      s.showcase.map((url, i) => (
                        <div key={`cat-${s.id}-${i}`} className="rounded-2xl overflow-hidden border border-gray-100">
                          {renderVideoEmbed(url, i)}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <aside className="lg:col-span-1">
                  <div className="sticky top-24 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <h4 className="font-bold text-lg mb-3">Service Snapshot</h4>
                    <p className="text-sm text-gray-700 mb-4">{s.description}</p>
                    <ul className="text-sm text-gray-700 space-y-2 mb-4">
                      {s.features.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 rounded-full bg-red-500 text-white font-semibold">Request this service</a>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        ))}

        {/* Why Choose Me */}
        <section id="why" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-2">Why Choose Me</h2>
            <p className="text-sm text-gray-600">Professional editing that converts views into leads</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { title: 'Quick Delivery', desc: '48–72h standard delivery; rush options available.' },
              { title: 'Realtor-First Expertise', desc: 'Editing decisions made to highlight salable features and create emotional connection.' },
              { title: 'Flexible Pricing', desc: 'Single edits, bundle packages, and subscription options for agents and teams.' },
              { title: 'US-Based Editors', desc: 'Timezone-friendly communication and quality assurance.' },
              { title: '100% Satisfaction', desc: "Unlimited revisions until you're confident to publish." }
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase summary (all categories) */}
        <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-2">Showcase</h2>
            <p className="text-sm text-gray-600">Selected edits — all videos are embedded below by category</p>
          </div>

          <div className="space-y-12">
            {SERVICES.map((s) => (
              <div key={`summary-${s.id}`} className="pb-8 border-b border-gray-100">
                <h3 className="font-bold text-xl mb-4">{s.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {s.showcase.length === 0 ? (
                    <div className="col-span-full p-6 rounded-lg bg-gray-50 text-center text-sm text-gray-500">No links added yet</div>
                  ) : (
                    s.showcase.map((u, i) => (
                      <div key={`summary-${s.id}-${i}`} className="rounded-2xl overflow-hidden border border-gray-100">
                        {renderVideoEmbed(u, i)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-xl font-extrabold mb-3">About Aamir</h3>
                <p className="text-sm text-gray-700">
                  I provide realtor-focused video editing that helps sell homes faster. I prioritize story-driven edits,
                  quick turnaround, and social-ready deliverables that convert views into showing requests.
                </p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-sm font-semibold text-gray-700">Services</div>
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">Home Tours</span>
                  <span className="px-3 py-1 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">Cinematic Edits</span>
                  <span className="px-3 py-1 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">Viral Shorts</span>
                  <span className="px-3 py-1 rounded-full bg-gray-50 text-sm text-gray-700 border border-gray-100">Drone Highlights</span>
                </div>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 px-5 py-2 rounded-full bg-red-500 text-white font-semibold">Contact on WhatsApp</a>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="text-gray-700 mb-4">Let's create videos that make buyers fall in love with properties.</div>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-red-500 text-white font-semibold">Book a slot on WhatsApp</a>
          <div className="mt-6 text-sm text-gray-500">© {new Date().getFullYear()} Aamir — Real Estate Video Editing • Fast delivery • Realtor-first templates</div>
        </footer>
      </div>

      <style jsx>{`
        /* Minimal overrides and helper classes to keep the page pleasant even if Tailwind isn't fully configured */
        .hero-video { min-height: 260px; }
        .video-embed { min-height: 160px; }
        
        /* Ensure video container and iframe fill completely without black areas */
        .video-container {
          position: relative;
          width: 100%;
          display: block;
          overflow: hidden;
          background: #000;
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
          margin: 0;
          padding: 0;
          outline: none;
          box-sizing: border-box;
        }
        
        /* Prevent any overlay or z-index issues in video modal */
        :global(.video-container) {
          isolation: isolate;
        }
      `}</style>
    </>
  );
}
