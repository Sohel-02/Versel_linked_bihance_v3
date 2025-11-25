// pages/index.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import Head from 'next/head';

/**
 * Aamir — Real Estate Video Portfolio (Updated UI)
 * - Implements the UI design suggestions: dark hero with autoplay loop, category tabs, cinematic grid,
 *   reels/shorts vertical carousel, aerial panoramic thumbnails, highlight reel, project detail pattern,
 *   and sticky contact CTA.
 * - Single-file React component (Next.js page) using Tailwind CSS utilities.
 * - All YouTube links provided by the user are included and organized by category.
 *
 * Notes and limitations:
 * - Video durations & view counts require YouTube Data API (not included here).
 * - Background video loop uses an autoplaying muted YouTube embed (works in most browsers; mobile autoplay restrictions may apply).
 * - Thumbnails are fetched from img.youtube.com (no API key).
 */

// ---------- Contact config
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919905689072';
const WHATSAPP_MESSAGE = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hi Aamir, I'm interested in your video editing services. Please share pricing & turnaround.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@aamir.video';
const EMAIL_LINK = `mailto:${EMAIL}?subject=${encodeURIComponent('Video editing inquiry')}`;

// ---------- Provided videos organized by category (user list)
const RAW = {
  montages: [
    'https://youtu.be/DPGOQye1iKk',
    'https://youtu.be/qGdq5SiQfwU',
    'https://youtu.be/DevuggJVgOo',
    'https://www.youtube.com/watch?v=jzF_Cc5KeWs',
    'https://youtu.be/lEbwVhWUqY0',
    'https://youtu.be/KxFNz5Ifc4w',
    'https://youtu.be/kk7_evjf-RE',
    'https://youtu.be/d5ZAYpkqvxA',
    'https://youtu.be/4wjWqpKbKSU',
    'https://youtu.be/xiBEAVN7LWs',
    'https://youtu.be/8Z-1A8YmTsE'
  ],
  cinematic: [
    'https://youtu.be/x75tbg0RBus',
    'https://youtu.be/x9DPLwAnWjM',
    'https://youtu.be/jy-ncpwHscw',
    'https://youtu.be/OnNx_Dpjnjg'
  ],
  shorts: [
    'https://youtube.com/shorts/U9HROCPcX4Q?feature=share',
    'https://youtube.com/shorts/hnKJcufqXTE?feature=share',
    'https://youtube.com/shorts/921OO715OyI?feature=share',
    'https://youtube.com/shorts/OMNSYjiF8vM?feature=share',
    'https://youtube.com/shorts/nryR-e3uRsg?feature=share',
    'https://youtube.com/shorts/AqaYtm3xuO8?feature=share',
    'https://youtube.com/shorts/PxZuimdPuVo?feature=share'
  ],
  aerial: [
    'https://youtu.be/NlPMM8tyf58',
    'https://youtu.be/aPk_UY7JD38',
    'https://youtube.com/shorts/ErZZV0GDgHw?feature=share',
    'https://youtu.be/XgUdC2dVgb8'
  ]
};

// ---------- Helpers
const extractVideoId = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace('www.', '').toLowerCase();
    if (host === 'youtu.be') return u.pathname.slice(1).split(/[/?#]/)[0];
    if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/').pop().split(/[/?#]/)[0];
    if (u.searchParams.get('v')) return u.searchParams.get('v');
    const lastSeg = u.pathname.split('/').filter(Boolean).pop();
    if (lastSeg && lastSeg.length >= 6 && lastSeg.length <= 20) return lastSeg;
    return null;
  } catch (e) {
    const m = raw.match(/(?:v=|\/)([0-9A-Za-z_-]{6,})/);
    return m ? m[1] : null;
  }
};
const isShort = (url) => /shorts/i.test(url);
const thumbFor = (id, q = 'hqdefault') => `https://img.youtube.com/vi/${id}/${q}.jpg`;

// Build structured services with deduped ids
const SERVICES = Object.entries(RAW).map(([key, arr]) => {
  const seen = new Set();
  const list = arr
    .map((u) => ({ url: u, id: extractVideoId(u), isShort: isShort(u) }))
    .filter((v) => v.id)
    .filter((v) => (seen.has(v.id) ? false : seen.add(v.id) || true));
  const meta = {
    montages: { title: 'Montages', short: '60s seller-focused montages.', accent: 'from-purple-500 to-pink-500' },
    cinematic: { title: 'Cinematic Walkthroughs', short: 'Slow, premium storytelling edits.', accent: 'from-blue-500 to-cyan-400' },
    shorts: { title: 'Reels & Shorts', short: 'Hook-first vertical content.', accent: 'from-green-500 to-lime-400' },
    aerial: { title: 'Aerial Highlights', short: 'Drone & location-driven shots.', accent: 'from-yellow-500 to-orange-400' }
  };
  return { id: key, videos: list, ...meta[key] };
});

// ---------- Small UI components
function IconPlay() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="drop-shadow"><path d="M8 5v14l11-7z" fill="white" /></svg>
  );
}

function Hero({ featuredId, onPlay }) {
  // Use an inline YouTube embed as a muted looping background (playlist param required for loop)
  const loopSrc = `https://www.youtube.com/embed/${featuredId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0&playlist=${featuredId}`;
  return (
    <section className="relative h-[56vh] min-h-[420px] lg:min-h-[520px] bg-black text-white overflow-hidden">
      <iframe
        src={loopSrc}
        title="Hero loop"
        frameBorder="0"
        allow="autoplay; encrypted-media; accelerometer; picture-in-picture"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/6 text-sm mb-4">Showreel • Aamir</div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Crafting Stories Through Edits</h1>
          <p className="mt-4 text-lg text-white/80">I turn property footage into emotion-driven films that help listings stand out.</p>

          <div className="mt-6 flex gap-3">
            <a href="#showcase" className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg">View My Work</a>
            <button onClick={() => onPlay({ embedUrl: `https://www.youtube.com/embed/${featuredId}`, title: 'Featured showreel' })} className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/10 text-white"> <IconPlay /> Play Reel</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceStrip({ services, onExplore }) {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-8 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {services.map((s) => (
          <div key={s.id} className="p-5 rounded-xl bg-gradient-to-r shadow-lg text-white" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.08), transparent)` }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center font-semibold text-lg">{s.title.charAt(0)}</div>
              <div className="flex-1">
                <div className="font-semibold text-lg">{s.title}</div>
                <div className="text-sm text-white/80 mt-1">{s.short}</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onExplore(s.id)} className="px-3 py-1 rounded-full bg-white/10 text-sm">Explore</button>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-sm">{s.videos.length} samples</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoCard({ v, onPlay, variant = 'default' }) {
  const thumb = thumbFor(v.id);
  const shortBadge = v.isShort;
  return (
    <div className={`rounded-2xl overflow-hidden relative group ${variant === 'panorama' ? 'h-44' : ''}`}>
      <button onClick={() => onPlay({ embedUrl: `https://www.youtube.com/embed/${v.id}`, title: `Video ${v.id}` })} className="w-full h-full block text-left">
        <div className={`w-full h-full relative`} style={{ paddingBottom: variant === 'tall' ? '177.78%' : variant === 'panorama' ? '38%' : '56.25%' }}>
          <img src={thumb} alt="video thumbnail" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: variant === 'panorama' ? 'cover' : 'cover' }} className="transition-transform group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/40 p-3 rounded-full scale-100 transform transition-all group-hover:scale-110">
              <IconPlay />
            </div>
          </div>
          {shortBadge && <div className="absolute left-3 top-3 px-2 py-1 rounded-full bg-white text-xs font-semibold">SHORT</div>}
        </div>
      </button>
    </div>
  );
}

function TestimonialSlider({ items = [] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % items.length), 4500); return () => clearInterval(t); }, [items.length]);
  if (items.length === 0) return null;
  return (
    <div className="p-6 rounded-2xl bg-white/5 text-white/90 shadow-lg">
      <div className="text-sm">"{items[idx].quote}"</div>
      <div className="mt-3 text-xs opacity-80">— {items[idx].author}</div>
    </div>
  );
}

// ---------- Main Page
export default function Page() {
  // Featured hero uses the first montage video (safe choice)
  const featured = SERVICES.find(s => s.id === 'montages')?.videos[0];
  const [modal, setModal] = useState({ open: false, embedUrl: '', title: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const flatten = useMemo(() => SERVICES.flatMap(s => s.videos.map(v => ({ ...v, category: s.id, categoryTitle: s.title }))), []);
  const filtered = useMemo(() => {
    const base = activeTab === 'all' ? flatten : flatten.filter(f => f.category === activeTab);
    if (!query.trim()) return base;
    const q = query.toLowerCase();
    return base.filter(b => (b.url + b.id + b.categoryTitle).toLowerCase().includes(q));
  }, [activeTab, query, flatten]);

  function openModal({ embedUrl, title }) { setModal({ open: true, embedUrl, title }); }
  function closeModal() { setModal({ open: false, embedUrl: '', title: '' }); }

  const highlight = flatten.slice(0, 4); // Top picks (first four)

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white">
      <Head>
        <title>Aamir — Real Estate Video Editing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* HERO */}
      <Hero featuredId={featured?.id} onPlay={openModal} />

      {/* Service strip beneath hero */}
      <ServiceStrip services={SERVICES} onExplore={(id) => { setActiveTab(id); document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' }); }} />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Top picks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Highlight Reel — Top Picks</h2>
            <a href="#showcase" className="text-sm text-white/60">View full showcase →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlight.map((h, i) => (
              <div key={h.id + i} className="rounded-2xl overflow-hidden">
                <VideoCard v={h} onPlay={openModal} variant={i === 0 ? 'panorama' : 'default'} />
                <div className="mt-2 text-sm text-white/80">{h.categoryTitle}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase: tabs + search */}
        <section id="showcase" className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Showcase</h2>
              <p className="text-white/70 text-sm">Browse by category or search for specific clips.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex gap-2 overflow-auto">
                <button onClick={() => setActiveTab('all')} className={`px-3 py-1 rounded-full text-sm ${activeTab === 'all' ? 'bg-white text-black' : 'bg-white/6'}`}>All ({flatten.length})</button>
                {SERVICES.map(s => (
                  <button key={s.id} onClick={() => setActiveTab(s.id)} className={`px-3 py-1 rounded-full text-sm ${activeTab === s.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-white/6'}`}>{s.title} ({s.videos.length})</button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search videos" className="px-3 py-2 rounded-lg bg-white/6 placeholder:text-white/60 text-white text-sm" />
              </div>
            </div>
          </div>

          {/* Shorts carousel when all or shorts selected */}
          {(activeTab === 'all' || activeTab === 'shorts') && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Reels & Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {SERVICES.find(s => s.id === 'shorts').videos.map((v, i) => (
                  <div key={`short-${i}`} style={{ minWidth: 220 }}>
                    <VideoCard v={v} onPlay={openModal} variant={'tall'} />
                    <div className="mt-2 text-sm text-white/70">Short</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v, i) => (
              <div key={`${v.id}-${i}`}>
                <VideoCard v={v} onPlay={openModal} variant={v.category === 'aerial' ? 'panorama' : 'default'} />
                <div className="mt-2 text-sm text-white/70">{v.categoryTitle}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Project detail pattern / testimonial */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-12">
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white/5">
            <h3 className="text-xl font-bold mb-3">Project Detail (example)</h3>
            <div className="rounded-lg overflow-hidden mb-4">
              {/* Placeholder hero player — to be swapped with selected project */}
              <div className="w-full" style={{ paddingBottom: '56.25%', background: '#000' }}>
                <div className="flex items-center justify-center h-full text-white/60">Select a project to view details</div>
              </div>
            </div>

            <p className="text-white/80">Short description: Story-driven montage that highlights flow, light & lifestyle. Tools: Premiere Pro, DaVinci Resolve. Deliverables: 60s montage, 30s social crop, 15s short.</p>
            <div className="mt-4 flex gap-3">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">Get a quote</a>
              <a href={EMAIL_LINK} className="px-4 py-2 rounded-full bg-white/6">Request details</a>
            </div>
          </div>

          <aside className="p-6 rounded-2xl bg-white/5">
            <h4 className="font-semibold mb-3">Testimonials</h4>
            <TestimonialSlider items={[{ quote: 'Great editing — sold the house in 3 days.', author: 'Realtor A' }, { quote: 'Quick turnaround and excellent color grade.', author: 'Agent B' }]} />
            <div className="mt-6">
              <h5 className="font-semibold mb-2">Brands & Clients</h5>
              <div className="flex gap-2 flex-wrap text-sm text-white/70">Brokerage A · Realtor B · Listing C</div>
            </div>
          </aside>
        </section>

        {/* CTA strip */}
        <section className="py-8 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-pink-600 text-white mb-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-lg font-bold">Ready to elevate your listing?</div>
              <div className="text-sm text-white/90">Quick delivery: 24–48h • Email + WhatsApp support</div>
            </div>
            <div className="flex gap-3">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-4 py-3 rounded-full bg-white text-black font-semibold">Message on WhatsApp</a>
              <a href={EMAIL_LINK} className="px-4 py-3 rounded-full bg-white/10">Email me</a>
            </div>
          </div>
        </section>

      </main>

      {/* Sticky floating CTA */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-full bg-green-500 shadow-lg">WhatsApp</a>
        <a href={EMAIL_LINK} className="flex items-center gap-3 px-4 py-3 rounded-full bg-white/6">Email</a>
      </div>

      {/* Modal for playback */}
      {modal.open && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4" onClick={() => setModal({ open: false, embedUrl: '', title: '' })}>
          <div className="absolute inset-0 bg-black/90" />
          <div className="relative w-full max-w-5xl rounded-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 flex items-center justify-between bg-white/5 text-white">
              <strong>{modal.title}</strong>
              <div className="flex gap-2">
                <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-white/10">Contact</a>
                <button onClick={() => setModal({ open: false, embedUrl: '', title: '' })} className="px-3 py-1 rounded bg-white/10">Close</button>
              </div>
            </div>
            <div style={{ background: '#000' }}>
              <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                <iframe src={`${modal.embedUrl}?autoplay=1&modestbranding=1&rel=0`} title={modal.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} />
              </div>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        /* subtle scrollbar for horizontal carousels */
        .overflow-x-auto::-webkit-scrollbar { height: 8px; }
        .overflow-x-auto::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
      `}</style>
    </div>
  );
}
