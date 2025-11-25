import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import QuickActionCTA from '../components/QuickActionCTA';

/**
 * pages/index.jsx — Finalized Realtor Video Editing Portfolio
 * - Replaced generic templates with individual, hand-written montage descriptions
 * - Montage Showcase horizontally scrollable with keyboard and trackpad support
 * - Pointer-follow tilt effect (JS-enhanced) with reduced-motion respect
 * - About & Process further refined for a modern, high-conversion layout
 * - Improved accessibility: ARIA labels, focus outlines, keyboard scrolling
 */

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919905689072";
const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi Aamir — interested in your editing services. Please share pricing & turnaround.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@aamir.video";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-site.example";

const RAW = {
  montages: [
    "https://youtu.be/DPGOQye1iKk",
    "https://youtu.be/qGdq5SiQfwU",
    "https://youtu.be/DevuggJVgOo",
    "https://www.youtube.com/watch?v=jzF_Cc5KeWs",
    "https://youtu.be/lEbwVhWUqY0",
    "https://youtu.be/KxFNz5Ifc4w",
    "https://youtu.be/kk7_evjf-RE",
    "https://youtu.be/d5ZAYpkqvxA",
    "https://youtu.be/4wjWqpKbKSU",
    "https://youtu.be/xiBEAVN7LWs",
    "https://youtu.be/8Z-1A8YmTsE",
  ],
  cinematic: [
    "https://youtu.be/x75tbg0RBus",
    "https://youtu.be/x9DPLwAnWjM",
    "https://youtu.be/jy-ncpwHscw",
    "https://youtu.be/OnNx_Dpjnjg",
  ],
  shorts: [
    "https://youtube.com/shorts/U9HROCPcX4Q?feature=share",
    "https://youtube.com/shorts/hnKJcufqXTE?feature=share",
    "https://youtube.com/shorts/921OO715OyI?feature=share",
    "https://youtube.com/shorts/OMNSYjiF8vM?feature=share",
    "https://youtube.com/shorts/nryR-e3uRsg?feature=share",
    "https://youtube.com/shorts/AqaYtm3xuO8?feature=share",
    "https://youtube.com/shorts/PxZuimdPuVo?feature=share",
  ],
  aerial: [
    "https://youtu.be/NlPMM8tyf58",
    "https://youtu.be/aPk_UY7JD38",
    "https://youtube.com/shorts/ErZZV0GDgHw?feature=share",
    "https://youtu.be/XgUdC2dVgb8",
  ],
};

const extractId = (raw) => {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace("www.", "").toLowerCase();
    if (host === "youtu.be") return u.pathname.slice(1).split(/[/?#]/)[0];
    if (u.pathname.startsWith("/shorts/"))
      return u.pathname.split("/").pop().split(/[/?#]/)[0];
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const last = u.pathname.split("/").filter(Boolean).pop();
    return last && last.length >= 6 ? last : null;
  } catch (e) {
    const m = raw.match(/(?:v=|\/)([0-9A-Za-z_-]{6,})/);
    return m ? m[1] : null;
  }
};
const isShort = (u) => /shorts/i.test(u);
const thumb = (id, q = "hqdefault") => `https://img.youtube.com/vi/${id}/${q}.jpg`;

const SERVICES = Object.entries(RAW).map(([k, arr]) => {
  const seen = new Set();
  const videos = arr
    .map((u) => ({ url: u, id: extractId(u), short: isShort(u) }))
    .filter((v) => v.id)
    .filter((v) => (seen.has(v.id) ? false : seen.add(v.id) || true));

  const meta = {
    montages: { title: "Montages", tagline: "Emotion-driven property reels." },
    cinematic: { title: "Cinematic Walkthroughs", tagline: "Slow, immersive tours." },
    shorts: { title: "Reels & Shorts", tagline: "Scroll-stopping clips." },
    aerial: { title: "Aerial Highlights", tagline: "Neighborhood + context." },
  };

  return { id: k, videos, ...meta[k] };
});

const FLATTEN = SERVICES.flatMap((s) =>
  s.videos.map((v) => ({ ...v, category: s.id, categoryTitle: s.title }))
);

function PlayIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="inline-block" aria-hidden>
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function Modal({ open, embedUrl, title, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-neutral-900/95 shadow-2xl">
        <div className="p-3 flex items-center justify-between border-b border-neutral-800">
          <strong className="text-white">{title}</strong>
          <div className="flex gap-2">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="px-3 py-1 rounded bg-neutral-800 text-white text-sm">Contact</a>
            <button onClick={onClose} className="px-3 py-1 rounded bg-neutral-800 text-white text-sm">Close</button>
          </div>
        </div>
        <div style={{ background: "#000" }}>
          <div style={{ position: "relative", width: "100%", paddingBottom: "56.25%" }}>
            <iframe
              src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
              title={title}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* handcrafted short descriptions (one per montage) */
const MONTAGE_DESCRIPTIONS = [
  "Warm opening — curb appeal and entrance that sells the first impression.",
  "Bright, airy living spaces — showcases daylight and flow between rooms.",
  "Kitchen hero — closeups on finishes that attract buyers and agents.",
  "Bedroom retreat — mood, calm pacing, and lifestyle framing.",
  "Outdoor reveal — garden, patio, and entertaining potential.",
  "Aerial tease + reveal — shows context and nearby amenities.",
  "Night grade — mood lighting and inviting evening shots.",
  "Retail-ready vertical — perfect for reels and fast social engagement.",
  "Open-plan flow — guiding viewers naturally from room to room.",
  "Luxury finish focus — textures, materials and details that justify price.",
  "Quick-clip lead — thumb-stopping rhythm with a strong hook.",
];

/* MontageList: horizontally scrollable, keyboard-aware, and JS pointer tilt */
function MontageList({ items = [], onPlay }) {
  const listRef = useRef(null);
  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    // keyboard support when the list has focus
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        el.scrollBy({ left: 360, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft') {
        el.scrollBy({ left: -360, behavior: 'smooth' });
      }
    };

    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  // optional pointer-follow tilt per card (delegated)
  useEffect(() => {
    if (prefersReduced) return; // respect reduced motion
    const el = listRef.current;
    if (!el) return;

    const onMove = (e) => {
      // find nearest card under pointer
      const cards = Array.from(el.querySelectorAll('.tilt-card'));
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width;
        const dy = (e.clientY - cy) / rect.height;
        const rx = dy * -6; // rotateX
        const ry = dx * 8; // rotateY
        const inner = card.querySelector('.card-3d');
        if (inner) inner.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    };

    const onLeave = () => {
      el.querySelectorAll('.card-3d').forEach((inner) => (inner.style.transform = ''));
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold">Montage Showcase</h3>
        <div className="text-sm text-gray-600">Swipe or use ← → • Tap to play</div>
      </div>

      <div className="-mx-4 px-4">
        <div
          ref={listRef}
          className="flex gap-6 py-2 overflow-x-auto scrollbar-hide focus:outline-none"
          tabIndex={0}
          aria-label="Montage list — use arrow keys to scroll"
        >
          {items.map((it, i) => (
            <article
              key={it.id + i}
              className="tilt-card group relative rounded-2xl overflow-hidden bg-white card-3d min-w-[320px] sm:min-w-[380px] lg:min-w-[420px]"
            >
              <button
                onClick={() => onPlay(it.id, `Montage — ${it.id}`)}
                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                aria-label={`Play montage ${i + 1}`}
              >
                <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                  <img
                    src={thumb(it.id, 'maxresdefault')}
                    alt={`${it.categoryTitle} preview ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-3 rounded-full bg-white/90 shadow"><PlayIcon size={30} /></div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="category-pill">{it.categoryTitle}</span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-lg text-gray-900">{it.categoryTitle} — {i + 1}</h4>
                  <p className="text-sm text-gray-600 mt-2">{MONTAGE_DESCRIPTIONS[i % MONTAGE_DESCRIPTIONS.length]}</p>

                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">{it.categoryTitle}</span>
                    <span className="text-gray-500">• {it.short ? 'Short' : 'Full'}</span>
                  </div>
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PortfolioFinal() {
  const [modal, setModal] = useState({ open: false, embedUrl: "", title: "" });
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  const openModal = (embedUrl, title) => setModal({ open: true, embedUrl, title });
  const closeModal = () => setModal({ open: false, embedUrl: "", title: "" });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const getFilteredVideos = (categoryId) => {
    const svc = SERVICES.find((s) => s.id === categoryId);
    if (!svc) return [];
    if (!q.trim()) return svc.videos;
    const Q = q.toLowerCase();
    return svc.videos.filter((v) => (v.id + v.url + svc.title).toLowerCase().includes(Q));
  };

  const heroVideoId = FLATTEN[0]?.id;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <Head>
        <title>Aamir — Realtor Video Editing (Final)</title>
        <meta name="description" content="Luxury realtor video editing — montages, cinematic walkthroughs, reels & aerials. Fast delivery." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx>{`
        :root { --section-vertical: 56px; }
        @media (min-width: 640px) { :root { --section-vertical: 64px; } }
        @media (min-width: 1024px) { :root { --section-vertical: 80px; } }
        section { padding-top: var(--section-vertical); padding-bottom: var(--section-vertical); }

        .card-shadow { box-shadow: 0 8px 30px rgba(16,24,40,0.06); }
        .glass { background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.7)); backdrop-filter: blur(6px); border: 1px solid rgba(15,23,42,0.04); border-radius: 14px; }

        /* interactive tilt container */
        .tilt-card { perspective: 1000px; }
        .tilt-card .card-3d { transition: transform .32s cubic-bezier(.2,.9,.3,1), box-shadow .32s; transform-origin: center; }
        .tilt-card:hover .card-3d, .tilt-card:focus-within .card-3d { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(16,24,40,0.16); }
        .card-3d { border-radius: 14px; overflow: hidden; }

        .category-pill { display: inline-block; font-weight: 700; font-size: .75rem; padding: .35rem .6rem; border-radius: 999px; background: linear-gradient(90deg,#eef2ff,#fff7ed); color: #3730a3; box-shadow: 0 6px 18px rgba(99,102,241,0.06); }

        /* hide native scrollbar for a cleaner UI (keeps functionality) */
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        .about-hero { background: linear-gradient(180deg, rgba(99,102,241,0.06), rgba(59,130,246,0.02)); border-radius: 14px; padding: 1.25rem; }

        .process-step { transition: transform .28s ease, box-shadow .28s ease; border-radius: 12px; }
        .process-step:hover { transform: translateY(-6px); box-shadow: 0 18px 46px rgba(16,24,40,0.08); }

        @media (prefers-reduced-motion: reduce) {
          .tilt-card .card-3d, .process-step { transition: none; transform: none !important; }
        }

        /* focus styles for accessibility */
        :focus { outline: none; }
        .focus-ring:focus-visible { box-shadow: 0 0 0 3px rgba(99,102,241,0.18); border-radius: 10px; }
      `}</style>

      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-indigo-600 to-amber-400 flex items-center justify-center font-extrabold text-lg text-white">A</div>
            <div className="hidden sm:block">
              <div className="font-extrabold leading-none text-gray-900">Aamir</div>
              <div className="text-xs uppercase tracking-wide text-gray-500">Realtor Video Editor</div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#showcase-section" className="text-gray-700 hover:text-black">Showcase</a>
            <a href="#about-section" className="text-gray-700 hover:text-black">About</a>
            <a href="#contact" className="text-gray-700 hover:text-black">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-semibold">WhatsApp</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section aria-label="Hero" id="hero" className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <div className="text-sm uppercase tracking-wider text-indigo-600 font-medium mb-3">Video Editing for Realtors</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Videos That Make Buyers Fall in Love — <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-amber-400">Fast, Polished, Effective</span>
            </h1>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-700 max-w-xl">I transform raw property footage into cinematic walkthroughs, high-impact montages, and vertical reels optimized for leads — fast turnaround and realtor-first storytelling.</p>

            <div className="mt-5 sm:mt-6 flex items-center gap-3 flex-wrap">
              <a href="#showcase-section" className="inline-flex items-center gap-3 px-4 sm:px-5 py-2.5 rounded-full font-semibold bg-gradient-to-r from-indigo-600 to-amber-400 text-white shadow hover:scale-[1.02] transition-transform"> <PlayIcon /> View Work</a>
              {heroVideoId && (
                <button onClick={() => openModal(`https://www.youtube.com/embed/${heroVideoId}`, "Featured Reel")} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border text-gray-900 hover:shadow-md text-sm font-medium"> <PlayIcon /> Play Reel</button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
              <div className="glass p-3 text-center card-shadow">
                <div className="font-bold text-lg">24–48h</div>
                <div className="text-sm text-gray-600">Typical delivery</div>
              </div>
              <div className="glass p-3 text-center card-shadow">
                <div className="font-bold text-lg">Realtor-First</div>
                <div className="text-sm text-gray-600">Optimized formats</div>
              </div>
              <div className="glass p-3 text-center card-shadow">
                <div className="font-bold text-lg">WhatsApp & Email</div>
                <div className="text-sm text-gray-600">Fast communication</div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            {heroVideoId && (
              <div className="rounded-2xl overflow-hidden card-shadow bg-black w-full">
                <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                  <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&modestbranding=1`} title="Hero showreel" frameBorder="0" allow="autoplay; encrypted-media; picture-in-picture" />
                  <div className="absolute left-3 bottom-3 p-2 rounded-full bg-white/90 text-sm text-gray-900 shadow">Featured showreel</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8" />

      {/* SHOWCASE */}
      <section id="showcase-section" aria-label="Showcase" className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Showcase</h2>
              <div className="text-sm text-gray-600">Browse by category — tap thumbnails to play</div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setActive("all")} className={`px-3 py-1 rounded-full text-sm ${active === "all" ? "bg-indigo-600 text-white" : "bg-white border text-gray-900"}`}>All ({FLATTEN.length})</button>
                {SERVICES.map((s) => (
                  <button key={s.id} onClick={() => setActive(s.id)} className={`px-3 py-1 rounded-full text-sm ${active === s.id ? "bg-gradient-to-r from-indigo-600 to-amber-400 text-white" : "bg-white border text-gray-900"}`}>{s.title} ({s.videos.length})</button>
                ))}
              </div>
              <input placeholder="Search videos" value={q} onChange={(e) => setQ(e.target.value)} className="px-3 py-2 rounded-lg border bg-white text-sm" aria-label="Search videos" />
            </div>
          </div>

          {(active === "all" || active === "montages") && (
            <div className="mb-8">
              <MontageList items={getFilteredVideos("montages").map(v => ({ ...v, categoryTitle: "Montages" }))} onPlay={(id, title) => openModal(`https://www.youtube.com/embed/${id}`, title)} />
            </div>
          )}

          {(active === "all" || active === "cinematic") && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-gray-900">Cinematic Walkthroughs</h3>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {getFilteredVideos("cinematic").map((v, i) => (
                  <div key={v.id + i} className="min-w-[300px] sm:min-w-[420px] rounded-2xl overflow-hidden glass card-shadow">
                    <button onClick={() => openModal(`https://www.youtube.com/embed/${v.id}`, `Cinematic — ${v.id}`)} className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400">
                      <img src={thumb(v.id, "maxresdefault")} alt="cinematic" loading="lazy" className="w-full h-[240px] object-cover" />
                      <div className="p-3 text-sm text-gray-700">Cinematic Walkthrough</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(active === "all" || active === "shorts") && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-gray-900">Reels & Shorts</h3>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {getFilteredVideos("shorts").map((v, i) => (
                  <div key={v.id + i} className="min-w-[200px] rounded-2xl overflow-hidden glass card-shadow">
                    <button onClick={() => openModal(`https://www.youtube.com/embed/${v.id}`, `Short — ${v.id}`)} className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400">
                      <div style={{ paddingBottom: "177.78%", position: "relative" }}>
                        <img src={thumb(v.id)} alt="short" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="p-3 text-sm text-gray-700">Short</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(active === "all" || active === "aerial") && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-gray-900">Aerial Highlights</h3>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {getFilteredVideos("aerial").map((v, i) => (
                  <div key={v.id + i} className="min-w-[320px] rounded-2xl overflow-hidden glass card-shadow">
                    <button onClick={() => openModal(`https://www.youtube.com/embed/${v.id}`, `Aerial — ${v.id}`)} className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400">
                      <img src={thumb(v.id)} alt="aerial" loading="lazy" className="w-full h-[200px] object-cover" />
                      <div className="p-3 text-sm text-gray-700">Aerial</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8" />

      {/* About + Process (modern redesign) */}
      <section
  aria-label="About, Process & Testimonials"
  id="about-section"
  className="px-4 sm:px-6 lg:px-8"
>
  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    {/* ABOUT + PROCESS */}
    <div className="lg:col-span-2 p-6 about-hero card-shadow">
      {/* About */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500/40 via-amber-400/30 to-sky-400/30 blur-sm" />
<img
  src="https://res.cloudinary.com/dim7qn23t/image/upload/v1764104956/profile_ijg0q9.jpg"
  alt="Aamir"
  className="relative w-28 h-28 rounded-full object-cover shadow-lg"
/>
</div>

        <div>
          <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/70 border text-xs font-medium text-gray-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Real Estate Video Editor
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            About Aamir
          </h3>

          <p className="mt-2 text-gray-700 text-sm sm:text-base max-w-2xl">
            I specialize in turning raw listing footage into clean, cinematic videos
            that make properties stand out on MLS, YouTube and social platforms.
            My focus is simple: help you get more views, more showings, and faster offers
            with professional editing and consistent delivery.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white rounded-lg text-center shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Turnaround
              </div>
              <div className="font-bold text-lg">24–48 hours</div>
              <div className="text-xs text-gray-600">Per standard edit</div>
            </div>
            <div className="p-3 bg-white rounded-lg text-center shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Quality
              </div>
              <div className="font-bold text-lg">Cinematic grade</div>
              <div className="text-xs text-gray-600">Color & sound polish</div>
            </div>
            <div className="p-3 bg-white rounded-lg text-center shadow-sm">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Platforms
              </div>
              <div className="font-bold text-lg">MLS & Social</div>
              <div className="text-xs text-gray-600">All key aspect ratios</div>
            </div>
          </div>

          <div className="mt-5">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
              Tools I work with
            </h4>
            <div className="mt-2 flex gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                Premiere Pro
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                DaVinci Resolve
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                After Effects
              </span>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                Audio cleanup & mix
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Process */}
      <div className="mt-8 pt-6 border-t border-white/60">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            How the edit process works
          </h4>
          <span className="hidden sm:inline-block text-xs text-gray-500">
            Clear, simple, built for busy agents
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div className="process-step p-4 bg-white rounded-lg text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/70 to-amber-400/70" />
            <div className="text-indigo-600 font-bold text-xl mb-1">1</div>
            <div className="font-semibold">Share footage</div>
            <div className="text-xs text-gray-600 mt-2">
              Upload your raw clips to Drive / Dropbox and share a link plus a short brief.
            </div>
          </div>

          <div className="process-step p-4 bg-white rounded-lg text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/70 to-amber-400/70" />
            <div className="text-indigo-600 font-bold text-xl mb-1">2</div>
            <div className="font-semibold">Edit & polish</div>
            <div className="text-xs text-gray-600 mt-2">
              I handle pacing, cuts, color, sound and exports for the platforms you choose.
            </div>
          </div>

          <div className="process-step p-4 bg-white rounded-lg text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/70 to-amber-400/70" />
            <div className="text-indigo-600 font-bold text-xl mb-1">3</div>
            <div className="font-semibold">Review</div>
            <div className="text-xs text-gray-600 mt-2">
              You review the first cut and send notes. I quickly apply the requested tweaks.
            </div>
          </div>

          <div className="process-step p-4 bg-white rounded-lg text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/70 to-amber-400/70" />
            <div className="text-indigo-600 font-bold text-xl mb-1">4</div>
            <div className="font-semibold">Final delivery</div>
            <div className="text-xs text-gray-600 mt-2">
              You receive final files ready for MLS, YouTube, Instagram, TikTok and ads.
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* TESTIMONIALS / RESULTS */}
    <aside className="p-6 glass card-shadow sticky top-20">
      <h4 className="font-semibold mb-2 text-gray-900 text-sm sm:text-base">
        Agents & teams I’ve worked with
      </h4>
      <p className="text-xs text-gray-600 mb-4">
        A few quick notes from recent real estate clients.
      </p>

      <div className="space-y-3 text-sm">
        <div className="p-3 rounded-lg bg-white relative">
          <span className="absolute -top-3 left-3 text-2xl text-indigo-300">
            “
          </span>
          <p className="pl-4 text-gray-800">
            Sold in 7 days after the video went live. The listing looked far
            better than our usual phone video.
          </p>
          <div className="mt-2 text-xs text-gray-500">— Realtor, Residential</div>
        </div>

        <div className="p-3 rounded-lg bg-white relative">
          <span className="absolute -top-3 left-3 text-2xl text-indigo-300">
            “
          </span>
          <p className="pl-4 text-gray-800">
            Fast, reliable and very clean edits. Perfect for sending to sellers
            and using across our social channels.
          </p>
          <div className="mt-2 text-xs text-gray-500">— Agent, Team Lead</div>
        </div>
      </div>

      <div className="mt-6">
        <h5 className="font-semibold mb-2 text-gray-900 text-sm sm:text-base">
          Quick snapshot
        </h5>
        <div className="flex gap-3 text-sm">
          <div className="p-3 rounded-lg bg-white text-center flex-1">
            <div className="font-bold text-lg text-gray-900">+More views</div>
            <div className="text-xs text-gray-600">
              Clients report stronger engagement on listing videos.
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white text-center flex-1">
            <div className="font-bold text-lg text-gray-900">24–48h</div>
            <div className="text-xs text-gray-600">Typical delivery window.</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold text-sm"
        >
          Chat on WhatsApp
        </a>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="w-full mt-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border text-gray-900 font-semibold text-sm"
        >
          Email me
        </a>
      </div>
    </aside>
  </div>
</section>

<hr className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8" />

<QuickActionCTA whatsappLink={WHATSAPP_LINK} targetId="showcase-section" />




      {/* Contact */}
<section id="contact" className="px-4 sm:px-6 lg:px-8">
  <div className="max-w-3xl mx-auto p-6 sm:p-8 glass card-shadow">
    <h3 className="text-2xl font-bold mb-2 text-gray-900">Start Your Edit</h3>
    <p className="mb-4 text-gray-700 text-sm">
      Upload your raw footage to Google Drive, Dropbox, or WeTransfer and share the link below.
      Add a short note on how you want the final video to look.
    </p>

    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.target);

        const name = fd.get("name");
        const email = fd.get("email");
        const footageLink = fd.get("footageLink");
        const instructions = fd.get("instructions") || "";

        const subject = `New Video Edit Request from ${name}`;
        const body = `
Name: ${name}
Email: ${email}

Raw Footage Link:
${footageLink}

Instructions / Editing Notes:
${instructions}

— Sent from Aamir.video
        `;

        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
      }}
      className="grid grid-cols-1 gap-3 text-sm"
    >
      <input
        name="name"
        required
        placeholder="Your name"
        className="px-3 py-2 rounded-lg border bg-white"
      />

      <input
        name="email"
        required
        type="email"
        placeholder="Your email"
        className="px-3 py-2 rounded-lg border bg-white"
      />

      <input
        name="footageLink"
        required
        type="url"
        placeholder="Raw footage link (Drive / Dropbox / WeTransfer)"
        className="px-3 py-2 rounded-lg border bg-white"
      />

      <textarea
        name="instructions"
        placeholder="Editing instructions — style, music vibe, text overlays, references…"
        className="px-3 py-2 rounded-lg border bg-white h-28"
      />

      <div className="flex justify-end gap-3 mt-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold"
        >
          Send Request
        </button>
        <a
          href={WHATSAPP_LINK}
          className="px-4 py-2 rounded-full bg-white border text-gray-900 font-semibold"
        >
          WhatsApp
        </a>
      </div>
    </form>
  </div>
</section>


      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
        <div className="mb-2">Let’s create videos that make buyers fall in love with properties.</div>
        <div>© {new Date().getFullYear()} Aamir — Real Estate Video Editing</div>
      </footer>

      <Modal open={modal.open} embedUrl={modal.embedUrl} title={modal.title} onClose={closeModal} />
    </div>
  );
}
