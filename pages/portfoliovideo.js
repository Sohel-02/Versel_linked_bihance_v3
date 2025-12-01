// pages/index.jsx
import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import QuickActionCTA from "../components/QuickActionCTA";

// Contact config
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "916202009606";
const WHATSAPP_MESSAGE =
  process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
  "Hi Sohel — interested in your editing services. Please share pricing & turnaround.";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE
)}`;
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@sohel.video";

/* -----------------------------
   SAMPLE DATA (videos kept)
   ----------------------------- */
const RAW = {
  montages: [
    "https://youtu.be/zSEaA7X4THw",
    "https://youtu.be/irNFQ2ksQdQ",
    "https://youtu.be/KolAwIkZPMk",
    "https://youtu.be/OqaKcXo6Q5o",
    "https://youtu.be/HzLYeVU7w30",
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
    cinematic: {
      title: "Cinematic Walkthroughs",
      tagline: "Slow, immersive tours.",
    },
    shorts: { title: "Reels & Shorts", tagline: "Scroll-stopping clips." },
    aerial: { title: "Aerial Highlights", tagline: "Neighborhood + context." },
  };

  return { id: k, videos, ...meta[k] };
});

const FLATTEN = SERVICES.flatMap((s) =>
  s.videos.map((v) => ({ ...v, category: s.id, categoryTitle: s.title }))
);

/* -----------------------------
   BENEFITS (kept)
   ----------------------------- */
const BENEFITS = [
  {
    id: "01",
    title: "Convert Focused",
    body:
      "Speed means nothing without conversions. Our integrated design, development, and copy work together to drive revenue not just win design awards.",
    icon: "chart",
  },
  {
    id: "02",
    title: "Quick Launch Or Retainer",
    body:
      "Scale up for major launches or down for maintenance. Whether it's a quick landing page or complete rebrand, we adapt to your business needs.",
    icon: "clock",
  },
  {
    id: "03",
    title: "Real-Time Collaboration",
    body:
      "Daily check-ins and rapid iterations keep projects moving. You're always in the loop with feedback cycles that eliminate delays.",
    icon: "cursor",
  },
  {
    id: "04",
    title: "Complete Creative Solution",
    body:
      "While others just do design, we handle copy too. Your entire funnel works together with cohesive messaging that actually converts.",
    icon: "bulb",
  },
  {
    id: "05",
    title: "Transparent Pricing",
    body:
      "Fixed monthly rates or clear project fees. No surprise charges, no scope creep. You know exactly what you're investing.",
    icon: "dollar",
  },
  {
    id: "06",
    title: "Real Human Connection",
    body:
      "Bi-weekly video calls keep us aligned on your vision. Real conversations with real people, not just project management tools.",
    icon: "users",
  },
];

/* -----------------------------
   Small UI helpers (icons)
   ----------------------------- */
function Icon({ name }) {
  return (
    <div className="icon-box">
      {name === "chart" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <rect x="3" y="6" width="3" height="11" rx="0.5" />
          <rect x="9" y="2" width="3" height="15" rx="0.5" />
          <rect x="15" y="9" width="3" height="8" rx="0.5" />
        </svg>
      )}
      {name === "clock" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M12 7v6l4 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {name === "cursor" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path d="M3 3l13 9-4 1 1 5-10-15z" fill="currentColor" />
        </svg>
      )}
      {name === "bulb" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            d="M9 18h6M10 22h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path d="M12 3a5 5 0 00-3 9v2h6v-2a5 5 0 00-3-9z" fill="currentColor" />
        </svg>
      )}
      {name === "dollar" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            d="M12 1v22"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M17 5H9.5a3.5 3.5 0 000 7H14a3.5 3.5 0 010 7H6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
      {name === "users" && (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
          <path
            d="M16 11a4 4 0 10-8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M2 20a6 6 0 0116 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      )}
    </div>
  );
}

/* -----------------------------
   Play icon + Modal components
   ----------------------------- */
function PlayIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="inline-block"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

/* -----------------------------
   WhatsApp icon (new)
   - uses currentColor so it inherits text color
   ----------------------------- */
function WhatsAppIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      role="img"
    >
      <path
        d="M20.52 3.48A11.91 11.91 0 0012 .01 11.93 11.93 0 00.01 12c0 2.1.55 4.14 1.6 5.93L0 24l6.33-1.66A11.93 11.93 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM17.42 14.1c-.28-.14-1.66-.82-1.92-.9-.26-.09-.45-.14-.64.13-.19.28-.74.9-.9 1.09-.16.19-.31.21-.59.07-.28-.14-1.17-.43-2.23-1.37-.82-.73-1.37-1.63-1.53-1.91-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.46.14-.15.19-.26.28-.43.09-.18.05-.34-.02-.48-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49-.16-.01-.35-.01-.54-.01-.19 0-.49.07-.75.34-.26.27-1 1-1 2.38s1.03 2.76 1.17 2.95c.14.19 2.02 3.08 4.9 4.31 1.44.62 2.56.99 3.44 1.27.91.29 1.74.25 2.4.15.73-.12 1.66-.68 1.9-1.34.24-.66.24-1.23.17-1.35-.06-.12-.26-.19-.54-.33z"
        fill="currentColor"
      />
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl rounded-2xl overflow-hidden bg-neutral-900/95 shadow-3d">
        <div className="p-3 flex items-center justify-between border-b border-neutral-800">
          <strong className="text-white">{title}</strong>
          <div className="flex gap-2">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 rounded bg-neutral-800 text-white text-sm inline-flex items-center gap-2"
            >
              <WhatsAppIcon size={14} />
              Contact
            </a>
            <button
              onClick={onClose}
              className="px-3 py-1 rounded bg-neutral-800 text-white text-sm"
            >
              Close
            </button>
          </div>
        </div>
        <div style={{ background: "#000" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
            }}
          >
            <iframe
              src={`${embedUrl}?autoplay=1&modestbranding=1&rel=0`}
              title={title}
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const MONTAGE_DESCRIPTIONS = [
  "Warm opening — curb appeal and entrance that sells the first impression.",
  "Bright, airy living spaces — showcases daylight and flow between rooms.",
  "Kitchen hero — closeups on finishes that attract buyers and agents.",
  "Bedroom retreat — mood, calm pacing, and lifestyle framing.",
  "Outdoor reveal — garden, patio, and entertaining potential.",
];

/* -----------------------------
   MontageList (no tilt; arrow + keyboard support)
   ----------------------------- */
function MontageList({ items = [], onPlay }) {
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight")
        el.scrollBy({ left: 420, behavior: "smooth" });
      else if (e.key === "ArrowLeft")
        el.scrollBy({ left: -420, behavior: "smooth" });
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  const scrollBy = (dir = 1) => {
    const el = listRef.current;
    if (!el) return;
    const amount = Math.max(360, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">Montage Showcase</h3>
        {/* <div className="card-deep small px-3 py-">
          <p className="text-black text-base font-bold">
            Swipe or use ← → • Tap to play
          </p>
        </div> */}
      </div>

      <div className="-mx-4 px-4 relative">
        {/* Arrow controls */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div
          ref={listRef}
          className="flex gap-6 py-2 overflow-x-auto scrollbar-hide focus:outline-none"
          tabIndex={0}
          aria-label="Montage list — use arrow keys to scroll"
        >
          {items.map((it, i) => (
            <article
              key={it.id + i}
              className="relative min-w-[320px] sm:min-w-[380px] lg:min-w-[420px]"
            >
              <div className="rounded-2xl overflow-hidden showcase-card">
                <button
                  onClick={() => onPlay(it.id, `Montage — ${it.id}`)}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    <img
                      src={thumb(it.id, "maxresdefault")}
                      alt={`${it.categoryTitle} preview ${i + 1}`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="p-3 rounded-full bg-white/95 shadow-md">
                        <PlayIcon size={30} />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="category-pill">{it.categoryTitle}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-semibold text-lg text-black">
                      {it.categoryTitle} — {i + 1}
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      {MONTAGE_DESCRIPTIONS[i % MONTAGE_DESCRIPTIONS.length]}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                        {it.categoryTitle}
                      </span>
                      <span className="text-gray-500">
                        • {it.short ? "Short" : "Full"}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Benefits section component
   ----------------------------- */
function BenefitsSection() {
  return (
    <section id="benefits" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-medium tracking-wider text-gray-400 uppercase">
            Why work with me
          </div>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
            Designed for{" "}
            <span className="text-gray-400">busy real estate teams</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl">
            I focus on edits that help listings move faster — clear storytelling,
            strong pacing, and clean exports for every platform you care about.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <article
              key={b.id}
              className="relative rounded-2xl bg-white border border-gray-100 p-6 shadow-sm hover:shadow-2xl transition-shadow hover:-translate-y-1"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="text-orange-500 text-xs font-semibold">
                    / {b.id}
                  </div>

                  <div className="mt-4 icon-wrap">
                    <Icon name={b.icon} />
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-black">
                    {b.title}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .icon-box {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0f1724, #111827);
          color: #fff;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45),
            inset 0 -6px 12px rgba(255, 255, 255, 0.02);
        }
        .icon-wrap {
          margin-top: 6px;
        }
        @media (min-width: 1024px) {
          #benefits {
            padding-top: 48px;
            padding-bottom: 48px;
          }
        }
      `}</style>
    </section>
  );
}

/* -----------------------------
   HERO
   ----------------------------- */
function HeroSection({ heroVideoId, openModal, onScrollTo }) {
  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (typeof onScrollTo === "function") onScrollTo("showcase-section");
    }
  };

  return (
    <section aria-label="Hero" id="hero" className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left column: headline + copy */}
        <div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold leading-tight">
            <div className="text-black">Cinematic Video Editing</div>
            <div className="text-gray-400">That Sells Homes Faster.</div>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl">
            From viral reels to aerial lifestyle highlights — I craft videos
            that captivate buyers and elevate your listings. Professional,
            fast-turnaround, and tailored for Realtors who want results.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() =>
                typeof onScrollTo === "function"
                  ? onScrollTo("showcase-section")
                  : (window.location.hash = "showcase-section")
              }
              onKeyDown={handleKey}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold bg-black text-white shadow-black shadow-2xl transform hover:translate-y-1 hover:scale-105 transition duration-300"
            >
              <PlayIcon /> View Work
            </button>

            {heroVideoId && (
              <button
                onClick={() =>
                  openModal(
                    `https://www.youtube.com/embed/${heroVideoId}`,
                    "Featured Reel"
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white border text-gray-900 hover:shadow-md text-sm font-medium"
              >
                <PlayIcon /> Play Reel
              </button>
            )}

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:scale-105 transform transition"
              aria-label="Book a Free Consultation on WhatsApp"
            >
              <WhatsAppIcon size={16} />
              📞 Book a Free Consultation
            </a>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div className="glass p-3 text-center card-deep small">
              <div className="font-bold text-lg text-black">24–48h</div>
              <div className="text-sm text-gray-600">Typical delivery</div>
            </div>
            <div className="glass p-3 text-center card-deep small">
              <div className="font-bold text-lg text-black">Realtor-First</div>
              <div className="text-sm text-gray-600">Optimized formats</div>
            </div>
            <div className="glass p-3 text-center card-deep small">
              <div className="font-bold text-lg text-black">WhatsApp & Email</div>
              <div className="text-sm text-gray-600">Fast communication</div>
            </div>
          </div>
        </div>

        {/* Right column: hero video / featured card */}
        <div>
          {heroVideoId ? (
            <div className="rounded-2xl overflow-hidden shadow-3d bg-black w-full">
              <div style={{ position: "relative", paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&modestbranding=1`}
                  title="Hero showreel"
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                />
                <div className="absolute left-3 bottom-3 p-2 rounded-full bg-white/90 text-sm text-gray-900 shadow">
                  Featured showreel
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-3d bg-white w-full p-8">
              <div className="h-60 flex items-center justify-center text-gray-400">
                No hero video available
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .glass {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.8)
          );
          backdrop-filter: blur(6px);
          border: 1px solid rgba(15, 23, 42, 0.04);
          border-radius: 14px;
        }
        .card-deep {
          background: #ffffff;
          padding: 0.6rem 1rem;
          border-radius: 14px;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.48);
        }
        .card-deep.small {
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
        }
        .shadow-3d {
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </section>
  );
}

/* -----------------------------
   Page (full)
   ----------------------------- */
export default function PortfolioFinalRedesign() {
  const [modal, setModal] = useState({ open: false, embedUrl: "", title: "" });
  const [active, setActive] = useState("all");
  const [q, setQ] = useState("");

  const openModal = (embedUrl, title) =>
    setModal({ open: true, embedUrl, title });
  const closeModal = () => setModal({ open: false, embedUrl: "", title: "" });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // shared scrollToSection
  const scrollToSection = (id) => {
    const el = document.getElementById(id) || document.querySelector(`#${id}`);
    if (el) {
      const prefersReduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      try {
        el.focus({ preventScroll: true });
      } catch (e) {}
    } else {
      window.location.hash = id;
    }
  };

  const getFilteredVideos = (categoryId) => {
    const svc = SERVICES.find((s) => s.id === categoryId);
    if (!svc) return [];
    if (!q.trim()) return svc.videos;
    const Q = q.toLowerCase();
    return svc.videos.filter((v) =>
      (v.id + v.url + svc.title).toLowerCase().includes(Q)
    );
  };

  const heroVideoId = FLATTEN[0]?.id;

  // refs for cinematic/shorts/aerial carousels
  const cinematicRef = useRef(null);
  const shortsRef = useRef(null);
  const aerialRef = useRef(null);

  const scrollContainer = (ref, dir = 1) => {
    const el = ref?.current;
    if (!el) return;
    const amount = Math.max(360, Math.floor(el.clientWidth * 0.75));
    el.scrollBy({ left: amount * dir, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <Head>
        <title>Cinematic Video Editing That Sells Homes Faster — Sohel</title>
        <meta
          name="description"
          content="From viral reels to aerial lifestyle highlights — cinematic editing that helps sell homes faster. Fast, professional, realtor-focused."
        />

        {/* Google Fonts import */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@500;700;800&display=swap"
          rel="stylesheet"
        />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        :root {
          --section-vertical: 32px;
        }
        @media (min-width: 640px) {
          :root {
            --section-vertical: 64px;
          }
        }
        @media (min-width: 1024px) {
          :root {
            --section-vertical: 80px;
          }
        }

        /* Fonts: headings use Montserrat, body uses Inter */
        html,
        body,
        #__next {
          font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto,
            "Helvetica Neue", Arial;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Montserrat", ui-sans-serif, system-ui, -apple-system,
            "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        section {
          padding-top: var(--section-vertical);
          padding-bottom: var(--section-vertical);
        }

        .card-deep {
          background: #ffffff;
          padding: 0.6rem 1rem;
          border-radius: 14px;
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.48);
        }
        .card-deep.small {
          padding: 0.4rem 0.8rem;
          border-radius: 12px;
        }

        .shadow-3d {
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6);
        }

        .showcase-card {
          background: #ffffff;
          box-shadow: 0 40px 120px rgba(0, 0, 0, 0.45);
        }

        .category-pill {
          display: inline-block;
          font-weight: 700;
          font-size: 0.75rem;
          padding: 0.35rem 0.6rem;
          border-radius: 999px;
          background: linear-gradient(90deg, #eef2ff, #fff7ed);
          color: #3730a3;
          box-shadow: 0 6px 8px rgba(99, 102, 241, 0.06);
        }

        .glass {
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.85),
            rgba(255, 255, 255, 0.8)
          );
          backdrop-filter: blur(6px);
          border: 1px solid rgba(15, 23, 42, 0.04);
          border-radius: 14px;
        }

        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .process-step {
            transition: none;
            transform: none !important;
          }
        }

        :focus {
          outline: none;
        }
        .focus-ring:focus-visible {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
          border-radius: 10px;
        }
      `}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-black to-white flex items-center justify-center font-extrabold text-lg text-white drop-shadow-lg">
              A
            </div>
            <div className="hidden sm:block">
              <div className="font-extrabold leading-none text-gray-900">
                Sohel
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Realtor Video Editor
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#benefits" className="text-gray-700 hover:text-black">
              Benefits
            </a>
            <a
              href="#showcase-section"
              className="text-gray-700 hover:text-black"
            >
              Showcase
            </a>
            <a href="#about-section" className="text-gray-700 hover:text-black">
              About
            </a>
            <a href="#contact" className="text-gray-700 hover:text-black">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-full text-sm font-semibold"
            >
              <WhatsAppIcon size={16} />
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <HeroSection
        heroVideoId={heroVideoId}
        openModal={openModal}
        onScrollTo={scrollToSection}
      />

      {/* Floating quick actions (present across page) */}
      <QuickActionCTA
        whatsappLink={WHATSAPP_LINK}
        targetId="showcase-section"
      />

      <hr className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8" />

      {/* SHOWCASE */}
      <section
        id="showcase-section"
        aria-label="Showcase"
        className="px-1 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div className="w-full flex flex-col items-center justify-center text-center pb-6">

  {/* Title */}
  <h2
    className="relative inline-block px-10 py-4 rounded-2xl font-extrabold tracking-tight
               text-3xl sm:text-4xl transition-all duration-500
               bg-white/80 text-black shadow-xl border border-black/10 backdrop-blur-md"
  >
    Showcase
    <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent 
                     opacity-40 hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
  </h2>

  {/* Subtitle — centered */}
  <div className="text-base text-gray-700 mt-3">
    <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
      Browse by category
    </span>{" "}
    — tap thumbnails to play
  </div>

</div>


            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setActive("all")}
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    active === "all"
                      ? "bg-black text-white shadow-md shadow-black"
                      : "bg-white border text-black hover:bg-gray-200"
                  }`}
                >
                  All ({FLATTEN.length})
                </button>
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      active === s.id
                        ? "bg-black text-white shadow-md shadow-black"
                        : "bg-white border text-black hover:bg-gray-200"
                    }`}
                  >
                    {s.title} ({s.videos.length})
                  </button>
                ))}
              </div>
              <input
                placeholder="Search videos"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-white text-sm"
                aria-label="Search videos"
              />
            </div>
          </div>

          {(active === "all" || active === "montages") && (
            <div className="mb-8">
              <MontageList
                items={getFilteredVideos("montages").map((v) => ({
                  ...v,
                  categoryTitle: "Montages",
                }))}
                onPlay={(id, title) =>
                  openModal(`https://www.youtube.com/embed/${id}`, title)
                }
              />
            </div>
          )}

          {(active === "all" || active === "cinematic") && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-black">
                Cinematic Walkthroughs
              </h3>

              <div className="relative -mx-4 px-4">
                <button
                  aria-label="Scroll cinematic left"
                  onClick={() => scrollContainer(cinematicRef, -1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Scroll cinematic right"
                  onClick={() => scrollContainer(cinematicRef, 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  ref={cinematicRef}
                  className="flex gap-4 overflow-x-auto pb-3 px-2 scrollbar-hide"
                >
                  {getFilteredVideos("cinematic").map((v, i) => (
                    <div
                      key={v.id + i}
                      className="min-w-[300px] sm:min-w-[420px] rounded-2xl overflow-hidden showcase-card"
                    >
                      <button
                        onClick={() =>
                          openModal(
                            `https://www.youtube.com/embed/${v.id}`,
                            `Cinematic — ${v.id}`
                          )
                        }
                        className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <img
                          src={thumb(v.id, "maxresdefault")}
                          alt="cinematic"
                          loading="lazy"
                          className="w-full h-[240px] object-cover"
                        />
                        <div className="p-3 text-sm text-gray-700">
                          Cinematic Walkthrough
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(active === "all" || active === "shorts") && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3 text-black">Reels & Shorts</h3>

              <div className="relative -mx-4 px-4">
                <button
                  aria-label="Scroll shorts left"
                  onClick={() => scrollContainer(shortsRef, -1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Scroll shorts right"
                  onClick={() => scrollContainer(shortsRef, 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  ref={shortsRef}
                  className="flex gap-4 overflow-x-auto pb-3 px-2 scrollbar-hide"
                >
                  {getFilteredVideos("shorts").map((v, i) => (
                    <div
                      key={v.id + i}
                      className="min-w-[200px] rounded-2xl overflow-hidden showcase-card"
                    >
                      <button
                        onClick={() =>
                          openModal(
                            `https://www.youtube.com/embed/${v.id}`,
                            `Short — ${v.id}`
                          )
                        }
                        className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <div
                          style={{
                            paddingBottom: "177.78%",
                            position: "relative",
                          }}
                        >
                          <img
                            src={thumb(v.id)}
                            alt="short"
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3 text-sm text-gray-700">Short</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {(active === "all" || active === "aerial") && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-black">
                Aerial Highlights
              </h3>

              <div className="relative -mx-4 px-4">
                <button
                  aria-label="Scroll aerial left"
                  onClick={() => scrollContainer(aerialRef, -1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  aria-label="Scroll aerial right"
                  onClick={() => scrollContainer(aerialRef, 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  ref={aerialRef}
                  className="flex gap-4 overflow-x-auto pb-3 px-2 scrollbar-hide"
                >
                  {getFilteredVideos("aerial").map((v, i) => (
                    <div
                      key={v.id + i}
                      className="min-w-[320px] rounded-2xl overflow-hidden showcase-card"
                    >
                      <button
                        onClick={() =>
                          openModal(
                            `https://www.youtube.com/embed/${v.id}`,
                            `Aerial — ${v.id}`
                          )
                        }
                        className="w-full block text-left focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <img
                          src={thumb(v.id)}
                          alt="aerial"
                          loading="lazy"
                          className="w-full h-[200px] object-cover"
                        />
                        <div className="p-3 text-sm text-gray-700">Aerial</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="border-t border-gray-100 mx-4 sm:mx-6 lg:mx-8" />
      <BenefitsSection />
      {/* About + Process + Testimonials */}
      <section
        aria-label="About, Process & Testimonials"
        id="about-section"
        className="px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto mb-6">
          <div className="text-xs font-medium tracking-wider text-gray-400 uppercase">
            About & Process
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-black">
            Real estate focused editing, end to end
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-3xl">
            Instead of juggling multiple freelancers, you get one editor who
            understands listings, social, and agent expectations — from raw
            footage upload to final export.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 p-6 about-hero card-deep">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-indigo-500/40 via-amber-400/30 to-sky-400/30 blur-sm" />
                <img
                  src="https://res.cloudinary.com/dim7qn23t/image/upload/v1764104956/profile_ijg0q9.jpg"
                  alt="Sohel"
                  className="relative w-28 h-28 rounded-full object-cover shadow-lg"
                />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/70 border text-xs font-medium text-gray-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Real Estate Video Editor
                </div>

                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-black">
                  About Sohel
                </h3>
                <p className="mt-2 text-gray-700 text-sm sm:text-base max-w-2xl">
                  I specialize in turning raw listing footage into clean,
                  cinematic videos that make properties stand out on MLS,
                  YouTube and social platforms.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-top border-white/60">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="font-semibold text-black text-sm sm:text-base">
                  How the edit process works
                </h4>
                <span className="hidden sm:inline-block text-xs text-gray-500">
                  Clear, simple, built for busy agents
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="process-step p-4 bg-white rounded-lg text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/70 to-amber-400/70" />
                    <div className="text-indigo-600 font-bold text-xl mb-1">
                      {n}
                    </div>
                    <div className="font-semibold">
                      {
                        [
                          "Share footage",
                          "Edit & polish",
                          "Review",
                          "Final delivery",
                        ][n - 1]
                      }
                    </div>
                    <div className="text-xs text-gray-600 mt-2">
                      {
                        [
                          "Upload your raw clips to Drive / Dropbox and share a link plus a short brief.",
                          "I handle pacing, cuts, color, sound and exports for the platforms you choose.",
                          "You review the first cut and send notes. I quickly apply the requested tweaks.",
                          "You receive final files ready for MLS, YouTube, Instagram, TikTok and ads.",
                        ][n - 1]
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="p-6 glass card-deep sticky top-24">
            <h4 className="font-semibold mb-2 text-black text-sm sm:text-base">
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
                  Sold in 7 days after the video went live. The listing looked
                  far better than our usual phone video.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  — Realtor, Residential
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white relative">
                <span className="absolute -top-3 left-3 text-2xl text-indigo-300">
                  “
                </span>
                <p className="pl-4 text-gray-800">
                  Fast, reliable and very clean edits. Perfect for sending to
                  sellers and using across our social channels.
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  — Agent, Team Lead
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-2 text-black text-sm sm:text-base">
                Quick snapshot
              </h5>
              <div className="flex gap-3 text-sm">
                <div className="p-3 rounded-lg bg-white text-center flex-1">
                  <div className="font-bold text-lg text-gray-900">
                    +More views
                  </div>
                  <div className="text-xs text-gray-600">
                    Clients report stronger engagement on listing videos.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white text-center flex-1">
                  <div className="font-bold text-lg text-gray-900">24–48h</div>
                  <div className="text-xs text-gray-600">
                    Typical delivery window.
                  </div>
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
                <WhatsAppIcon size={16} />
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

      {/* Contact */}
      <section id="contact" className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto p-6 sm:p-8 glass card-deep">
          <h3 className="text-2xl font-bold mb-2 text-black">
            Start Your Edit
          </h3>
          <p className="mb-4 text-gray-700 text-sm">
            Upload your raw footage to Google Drive, Dropbox, or WeTransfer and
            share the link below.
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
              const body = `Name: ${name}\nEmail: ${email}\n\nRaw Footage Link:\n${footageLink}\n\nInstructions / Editing Notes:\n${instructions}\n\n— Sent from Sohel.video`;
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
                className="px-4 py-2 rounded-full bg-white border text-gray-900 font-semibold inline-flex items-center gap-2"
              >
                <WhatsAppIcon size={14} />
                WhatsApp
              </a>
            </div>
          </form>
        </div>
      </section>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
        <div className="mb-2">
          Let’s create videos that make buyers fall in love with properties.
        </div>
        <div>© {new Date().getFullYear()} Sohel — Real Estate Video Editing</div>
      </footer>

      <Modal
        open={modal.open}
        embedUrl={modal.embedUrl}
        title={modal.title}
        onClose={closeModal}
      />
    </div>
  );
}
