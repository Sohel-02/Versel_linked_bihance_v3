// pages/index.jsx — Refactored & modernized single-file page
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

/*
  pages/index.jsx — Refactored & modernized single-file page
  - Cleaner structure: Nav, Hero, About, Services, Testimonials, Contact, Footer
  - Accessibility improvements (aria, keyboard focus, semantic tags)
  - Theme handling with localStorage + prefers-color-scheme fallback
  - Reusable small components and helpers (cls)
  - Tailwind-first styling + small scoped CSS for glass + 3D card effect
  - Conversion-first CTA, clearer hierarchy and spacing

  NOTES:
  - This file expects Tailwind CSS to be configured in the project.
  - Replace image URLs and the WhatsApp number via env or inline values.
*/

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919905689072";
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi Aamir — I'm interested in your services (video / thumbnail / website). Could you share pricing & turnaround?"
);
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const services = [
  {
    id: "thumbnail",
    title: "Thumbnail Design",
    lead: "Data-driven thumbnails that increase CTR and session time.",
    href: "/portfolio",
    icon: ThumbnailIcon,
  },
  {
    id: "video",
    title: "Video Production",
    lead: "Cinematic storytelling optimized for YouTube, Reels, Shorts.",
    href: "/portfoliovideo",
    icon: VideoIcon,
  },
  {
    id: "web",
    title: "Website Development",
    lead: "Fast, SEO-friendly websites built for conversion.",
    href: "https://weburone.com",
    icon: WebIcon,
  },
];

const testimonialsSeed = [
  { who: "Ritu — Realtor", text: "Sold in 5 days after the video — incredible work." },
  { who: "Sam — Creator", text: "Thumbnails doubled my CTR in two weeks." },
  { who: "Lina — Startup", text: "Fast turnaround and professional delivery." },
];

// tiny helper for conditional classes (small and dependency-free)
function cls(...args) {
  return args.filter(Boolean).join(" ");
}

export default function Home() {
  const [theme, setTheme] = useState("day"); // <-- default set to 'day' now
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useRef(false);

  // Initialize theme with localStorage or prefers-color-scheme
  useEffect(() => {
    mounted.current = true;
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("aamir_theme") : null;
      if (saved === "day" || saved === "night") {
        setTheme(saved);
      } else if (typeof window !== "undefined") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "night" : "day");
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // persist theme
  useEffect(() => {
    if (!mounted.current) return;
    try {
      localStorage.setItem("aamir_theme", theme);
    } catch (e) {}
  }, [theme]);

  // keyboard shortcut: D toggles theme
  useEffect(() => {
    const onKey = (e) => {
      if (e.key && e.key.toLowerCase() === "d") setTheme((t) => (t === "day" ? "night" : "day"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "day" ? "night" : "day")), []);

  return (
    <>
      <Head>
        <title>Transform Your Brand — Cinematic Video, Thumbnails & Sites</title>
        <meta name="description" content="Cinematic videos, thumbnails and fast websites designed to convert. Day/Night UI with polished glass cards." />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&family=Montserrat:wght@600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={cls("min-h-screen font-sans", theme === "day" ? "theme-day" : "theme-night")}>
        <Nav
          theme={theme}
          toggleTheme={toggleTheme}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          whatsapp={WHATSAPP_LINK}
        />

        <Hero theme={theme} whatsapp={WHATSAPP_LINK} />

        

        <Services theme={theme} services={services} whatsapp={WHATSAPP_LINK} />

        <Testimonials theme={theme} items={testimonialsSeed} />

        <About theme={theme} whatsapp={WHATSAPP_LINK} />

        <ContactSection theme={theme} whatsapp={WHATSAPP_LINK} />

        <Footer theme={theme} />

        {/* WhatsApp FAB integration (only added component render) */}
        <WhatsAppFab theme={theme} whatsapp={WHATSAPP_LINK} />

        {/* small scoped styles for the glass + card 3D effect (keeps layout in Tailwind) */}
        <style jsx>{`
          :root { --card-radius: 1rem; --glass-strength: 0.06; }
          .theme-night { background: linear-gradient(180deg,#000,#071024 140%); color: #fff; }
          .theme-day { background: linear-gradient(180deg,#f8fafc,#ffffff 140%); color: #111; }

          /* service card base */
          .glass-card { border-radius: var(--card-radius); overflow: hidden; padding: 1rem; transition: transform .22s cubic-bezier(.2,.9,.3,1), box-shadow .22s; will-change: transform; }
          .glass-card:focus-within { box-shadow: 0 12px 40px rgba(2,6,23,0.2); }

          /* day/night glass */
          .glass-day { background: rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,var(--glass-strength)); }
          .glass-night { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,var(--glass-strength)); }

          /* subtle 3D tilt transform preserved inline via style attr for perf */
          .icon-ring { position: absolute; inset: -8px; border-radius: 999px; pointer-events: none; opacity: .9; }
        `}</style>
      </main>
    </>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ theme, toggleTheme, mobileOpen, setMobileOpen, whatsapp }) {
  return (
    <nav className="fixed inset-x-0 top-5 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Primary">
      <div className={cls("flex items-center justify-between gap-4 rounded-2xl p-3", theme === "day" ? "bg-white/90 border border-black/6" : "bg-black/40 border border-white/6")}>
        <Link href="/" className="flex items-center gap-3" aria-label="Aamir — Home">
          <div className={cls("h-10 w-10 rounded-md flex items-center justify-center font-bold", theme === "day" ? "bg-black text-white" : "bg-white/10 text-white")}>
            A
          </div>
          <div className="hidden sm:block">
            <div className={cls("font-semibold", theme === "day" ? "text-black" : "text-white")}>Aamir</div>
            <div className={cls("text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>Cinematic Video • Thumbnails • Websites</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className={cls("hover:underline", theme === "day" ? "text-black/80" : "text-white/80")}>
            Services
          </a>
          {/* <a href="#work" className={cls("hover:underline", theme === "day" ? "text-black/80" : "text-white/80")}>
            Work
          </a> */}
          <a href="#contact" className={cls("hover:underline", theme === "day" ? "text-black/80" : "text-white/80")}>
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cls("hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold shadow-sm", theme === "day" ? "bg-black text-white" : "bg-indigo-500 text-white")}>
            <WhatsAppIcon size={16} className="inline-block" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>

          <button onClick={toggleTheme} aria-label='Toggle day/night (press D)' className={cls("px-3 py-2 rounded-full flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2", theme === "day" ? "bg-black text-white" : "bg-white/6 text-white")}>
            {theme === "day" ? <SunIcon /> : <MoonIcon />}
            <span className="text-xs">{theme === "day" ? "Day" : "Night"}</span>
          </button>

          <button onClick={() => setMobileOpen((s) => !s)} className="p-2 rounded-md md:hidden focus:outline-none">
            <MenuIcon />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={cls("mt-3 md:hidden rounded-xl p-4 border", theme === "day" ? "bg-white/90 text-black border-black/6" : "bg-black/60 text-white border-white/6")}>
          <ul className="flex flex-col gap-3">
            <li>
              <a href="#services" onClick={() => setMobileOpen(false)} className="block">Services</a>
            </li>
            {/* <li>
              <a href="#work" onClick={() => setMobileOpen(false)} className="block">Work</a>
            </li> */}
            <li>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="block">Contact</a>
            </li>
            <li>
              <a href={whatsapp} className="mt-2 block text-center px-4 py-2 rounded-full bg-black text-white">Start Project</a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ theme, whatsapp }) {
  return (
    <header className="pt-28 lg:pt-36 pb-8 relative overflow-hidden">
      <BackgroundBlobs theme={theme} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <h1 className={cls("leading-tight font-extrabold text-3xl sm:text-4xl md:text-5xl", theme === "day" ? "text-black" : "text-white")}>
              Transform your brand with <span className="text-indigo-400/90">cinematic video</span>, scroll-stopping thumbnails & high-converting sites.
            </h1>

            <p className={cls("mt-4 text-lg max-w-2xl", theme === "day" ? "text-black/70" : "text-white/75")}>
              I craft visuals that don’t just look good — they drive clicks, leads and sales. Fast turnaround, clear pricing and a cinematic finish.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cls("px-6 py-3 rounded-full font-semibold shadow-md focus:ring-2 focus:ring-offset-2 focus:outline-none", theme === "day" ? "bg-black text-white" : "bg-indigo-500 text-white")}>Let’s Build Your Vision</a>
              <a href="#services" className={cls("px-4 py-2 rounded-full border text-sm", theme === "day" ? "border-black/10 text-black" : "border-white/10 text-white")}>See Services</a>
            </div>

            <div className={cls("mt-5 text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>Trusted by realtors, creators & startups • 30-day support</div>
          </div>

          <aside className="lg:col-span-5">
            <div className={cls("rounded-3xl p-6 shadow-lg", theme === "day" ? "bg-white/95 border border-black/6" : "bg-white/04 border border-white/6")}>
              <div className="flex items-center gap-4">
                <img alt="Aamir profile" src="https://res.cloudinary.com/dim7qn23t/image/upload/v1764104956/profile_ijg0q9.jpg" loading="lazy" className="w-20 h-20 rounded-full object-cover shadow" />
                <div>
                  <div className={cls("font-semibold", theme === "day" ? "text-black" : "text-white")}>Aamir — Video & Design</div>
                  <div className={cls("text-sm", theme === "day" ? "text-black/70" : "text-white/70")}>Cinematic editing, thumbnails & websites</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className={cls("font-bold", theme === "day" ? "text-black" : "text-white")}>24–48h</div>
                  <div className={cls("mt-1 text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>Typical delivery</div>
                </div>
                <div className="text-center">
                  <div className={cls("font-bold", theme === "day" ? "text-black" : "text-white")}>Realtor-First</div>
                  <div className={cls("mt-1 text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>Optimized formats</div>
                </div>
                <div className="text-center">
                  <div className={cls("font-bold", theme === "day" ? "text-black" : "text-white")}>Fast Support</div>
                  <div className={cls("mt-1 text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>30-day support</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}

/* ---------------- ABOUT ---------------- */
function About({ theme, whatsapp }) {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <h2 className={cls("text-2xl font-bold", theme === "day" ? "text-black" : "text-white")}>About me</h2>
            <p className={cls("mt-4 max-w-xl", theme === "day" ? "text-black/70" : "text-white/70")}>
              I blend creative storytelling with technical workflow to deliver assets that look premium and perform under real marketing conditions. I work with realtors, creators and early-stage startups.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <StatCard theme={theme} title="40%" subtitle="Avg inquiry increase (mock)" />
              <StatCard theme={theme} title="2x" subtitle="Typical CTR uplift" />
              <StatCard theme={theme} title="24–48h" subtitle="Fast turnaround" />
            </div>

            <p className={cls("mt-4 max-w-xl", theme === "day" ? "text-black/70" : "text-white/70")}>
              I began as a creator — learning headline hooks, thumbnail formulas and quick landing pages. Today I deliver that same velocity and conversion knowledge to small businesses without agency overhead.
            </p>

            <div className="mt-4 flex gap-3">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={cls("px-4 py-2 rounded-full flex items-center gap-2", theme === "day" ? "bg-black text-white" : "bg-indigo-500 text-white")}>
                <WhatsAppIcon size={16} />
                Chat on WhatsApp
              </a>
              <a href="#contact" className={cls("px-4 py-2 rounded-full border", theme === "day" ? "border-black/10 text-black" : "border-white/10 text-white")}>Start Project</a>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center lg:justify-end">
  <div
    className={cls(
      "rounded-3xl overflow-hidden shadow-2xl p-6 transition-all duration-500",
      theme === "day"
        ? "bg-white/95 border border-black/10"
        : "bg-white/10 border border-white/10 backdrop-blur-md"
    )}
    style={{ maxWidth: 420 }}
  >
    <div className="relative w-full h-64 rounded-xl overflow-hidden group">
      {/* Image without grayscale */}
      <img
        src="https://res.cloudinary.com/dim7qn23t/image/upload/v1764104956/profile_ijg0q9.jpg"
        alt="Aamir cinematic"
        loading="lazy"
        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
      />

      {/* Overlay gradient for cinematic depth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
        aria-hidden
      />

      {/* Text overlay */}
      <div className="absolute bottom-4 left-4 text-white">
        <div className="font-semibold text-lg tracking-wide">
          Aamir — Cinematic Editor
        </div>
        <div className="text-xs opacity-80">
          Creativity • Speed • Conversion
        </div>
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ theme, title, subtitle }) {
  return (
    <div className={cls("rounded-xl p-4", theme === "day" ? "bg-white/95 border border-black/6" : "bg-white/03 border border-white/6")}>
      <div className="font-bold text-lg">{title}</div>
      <div className={cls("text-xs mt-1", theme === "day" ? "text-black/60" : "text-white/60")}>{subtitle}</div>
    </div>
  );
}
/* ---------------- SERVICES (updated again) ---------------- */
function Services({ theme, services, whatsapp }) {
  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Headline + benefit subtext */}
        <div className="text-center mb-10">
          <h2
            className={cls(
              "text-3xl sm:text-4xl font-extrabold tracking-tight",
              theme === "day" ? "text-black" : "text-white"
            )}
          >
            Services — built to win attention & conversions
          </h2>
          <p
            className={cls(
              "mt-3 max-w-2xl mx-auto text-sm sm:text-base",
              theme === "day" ? "text-black/70" : "text-white/70"
            )}
          >
            Three core offers: high-converting video edits, click-magnet thumbnails, and fast,
            conversion-ready websites. Pick what you need — or combine all three.
          </p>
        </div>

        {/* Cards grid (equal height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {services.map((s, i) => (
            <ServiceCard key={s.id} s={s} theme={theme} whatsapp={whatsapp} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center text-xs">
          <span className={cls(theme === "day" ? "text-black/60" : "text-white/60")}>
            30-day support • Fast revisions • Secure delivery
          </span>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ s, theme, whatsapp, index }) {
  // gradient accents per service id
  const gradients = {
    video: "linear-gradient(135deg,#7c3aed 0%,#06b6d4 100%)",
    thumbnail: "linear-gradient(135deg,#06b6d4 0%,#60a5fa 100%)",
    web: "linear-gradient(135deg,#f97316 0%,#f59e0b 100%)",
  };
  const accent = gradients[s.id] || "linear-gradient(135deg,#60a5fa,#a78bfa)";
  const Icon = s.icon;
  const isExternal = s.href && /^(https?:)?\/\//.test(s.href);

  return (
    <article
      className={cls(
        "relative h-full flex flex-col rounded-2xl border p-6 transition-all duration-300 ease-out group",
        theme === "day"
          ? "bg-white/90 border-black/6 shadow-sm hover:shadow-xl"
          : "bg-white/6 border-white/10 hover:border-white/30 hover:shadow-[0_18px_45px_rgba(0,0,0,0.6)]"
      )}
      style={{ transform: "translateZ(0)" }}
      tabIndex={0}
      aria-labelledby={`svc-${s.id}-title`}
    >
      {/* TOP: icon + title + copy (flex-1 to keep equal height) */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
              style={{
                background: accent,
                boxShadow:
                  theme === "day"
                    ? "0 10px 30px rgba(15,23,42,0.10)"
                    : "0 12px 38px rgba(0,0,0,0.65)",
              }}
              aria-hidden
            >
              <Icon style={{ width: 34, height: 34, color: "white" }} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3">
              <h4
                id={`svc-${s.id}-title`}
                className={cls(
                  "text-lg sm:text-xl font-semibold leading-tight",
                  theme === "day" ? "text-black" : "text-white"
                )}
              >
                {s.title}
              </h4>

              {/* micro-badge */}
              <span
                className={cls(
                  "text-[11px] rounded-full px-2 py-1 font-medium whitespace-nowrap",
                  theme === "day" ? "bg-black/5 text-black/80" : "bg-white/10 text-white/80"
                )}
              >
                {s.id === "video"
                  ? "YouTube & Reels"
                  : s.id === "thumbnail"
                  ? "CTR-focused"
                  : "Conversion-ready"}
              </span>
            </div>

            <p
              className={cls(
                "mt-2 text-sm",
                theme === "day" ? "text-black/70" : "text-white/70"
              )}
            >
              {s.lead}
            </p>
          </div>
        </div>

        {/* Quick highlights */}
        <ul
          className={cls(
            "mt-2 grid grid-cols-2 gap-2 text-[11px] sm:text-xs",
            theme === "day" ? "text-black/60" : "text-white/60"
          )}
        >
          {s.id === "video" && (
            <>
              <li>24–48h typical delivery</li>
              <li>Color grade & sound polish</li>
              <li>Vertical & horizontal exports</li>
              <li>Hooks & pacing optimized</li>
            </>
          )}
          {s.id === "thumbnail" && (
            <>
              <li>Thumbnail concepts & variants</li>
              <li>Readable on mobile feeds</li>
              <li>Brand-consistent styling</li>
              <li>Source files on request</li>
            </>
          )}
          {s.id === "web" && (
            <>
              <li>Fast, mobile-first build</li>
              <li>Lead capture & forms</li>
              <li>SEO & basic analytics ready</li>
              <li>Easy future updates</li>
            </>
          )}
        </ul>
      </div>

      {/* BOTTOM: CTAs pinned, same position for all cards */}
      <div className="mt-5 flex flex-wrap gap-3 items-center">
        {/* Primary CTA: WhatsApp / Enquire */}
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cls(
            "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
            theme === "day"
              ? "bg-black text-white focus:ring-black/40"
              : "bg-indigo-500 text-white focus:ring-indigo-400"
          )}
          aria-label={`Enquire about ${s.title} on WhatsApp`}
        >
          <WhatsAppIcon size={14} />
          Enquire
        </a>

        {/* Secondary CTA: View portfolio (stronger than plain text link) */}
        {s.href &&
          (isExternal ? (
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={cls(
                "inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors duration-200",
                theme === "day"
                  ? "border-black/10 text-black/80 hover:bg-black/5"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              )}
              aria-label={`View ${s.title} portfolio`}
            >
              View portfolio
              <span aria-hidden className="ml-1">
                ↗
              </span>
            </a>
          ) : (
            <Link
              href={s.href}
              onClick={(e) => e.stopPropagation()}
              className={cls(
                "inline-flex items-center justify-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium border transition-colors duration-200",
                theme === "day"
                  ? "border-black/10 text-black/80 hover:bg-black/5"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              )}
              aria-label={`View ${s.title} portfolio`}
            >
              View portfolio
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          ))}
      </div>

      {/* subtle bottom accent bar */}
      <div
        aria-hidden
        className={cls(
          "pointer-events-none absolute left-6 right-6 bottom-0 h-0.5 rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300",
          theme === "day" ? "bg-black/10" : "bg-white/25"
        )}
      />

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .group-hover\\:-translate-y-1,
          .group-hover\\:scale-105,
          .hover\\:-translate-y-0\\.5,
          .group-hover\\:scale-x-100 {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </article>
  );
}

/* ---------------- WhatsApp FAB (integrated) ---------------- */
function WhatsAppFab({ theme, whatsapp }) {
  return (
    <>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={cls(
          "fixed z-50 right-5 bottom-6 flex items-center gap-3 rounded-full p-3 pr-4 shadow-2xl transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          "print:hidden"
        )}
        style={{
          background: theme === "day" ? "white" : "#25D366",
          color: theme === "day" ? "black" : "white",
          boxShadow: theme === "day" ? "0 10px 30px rgba(2,6,23,0.08)" : "0 12px 36px rgba(0,0,0,0.5)",
        }}
      >
        <div
          className={cls(
            "flex items-center justify-center w-10 h-10 rounded-full shrink-0"
          )}
          style={{
            background: theme === "day" ? "#25D366" : "white",
            color: "white",
            boxShadow: "inset 0 -4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <WhatsAppIcon size={18} />
        </div>

        <div className="hidden sm:block">
          <div className={cls("text-sm font-semibold", theme === "day" ? "text-black" : "text-white")}>Quick chat</div>
          <div className={cls("text-xs", theme === "day" ? "text-black/60" : "text-white/80")}>Ask about pricing & turnaround</div>
        </div>

        <style jsx>{`
          a:hover { transform: translateY(-4px); }
          @media (prefers-reduced-motion: reduce) {
            a { transition: none !important; transform: none !important; }
          }
        `}</style>
      </a>
    </>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials({ theme, items }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h3 className={cls("text-xl font-bold", theme === "day" ? "text-black" : "text-white")}>Trusted by clients</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((t, i) => (
            <blockquote key={i} className={cls("rounded-2xl p-6", theme === "day" ? "bg-white/95 border border-black/6" : "bg-white/03 border border-white/6")}>
              <p className={cls("italic", theme === "day" ? "text-black/80" : "text-white/80")}>
                “{t.text}”
              </p>
              <footer className={cls("mt-4 text-xs", theme === "day" ? "text-black/60" : "text-white/60")}>
                — {t.who}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CONTACT ---------------- */
function ContactSection({ theme, whatsapp }) {
  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className={cls("rounded-3xl p-8 text-center", theme === "day" ? "bg-white/95 border border-black/6" : "bg-white/03 border border-white/6")}>
          <h3 className={cls("text-2xl font-bold", theme === "day" ? "text-black" : "text-white")}>Ready to start?</h3>
          <p className={cls("mt-2", theme === "day" ? "text-black/70" : "text-white/70")}>Share a brief or drop a WhatsApp message — I usually respond within one business day.</p>

          <ContactForm theme={theme} whatsapp={whatsapp} />
        </div>
      </div>
    </section>
  );
}

function ContactForm({ theme, whatsapp }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Video Editing");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setNotice("Please enter your name and email.");
      return;
    }

    const subject = encodeURIComponent(`New project: ${type} — from ${name}`);
    const body = encodeURIComponent(`${message}\n\nContact email: ${email}`);

    // open default mail client
    const mailto = `mailto:contact@aamir.video?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    setNotice("Opening your mail app... If nothing happens, try the WhatsApp button.");

    // reset
    setName("");
    setEmail("");
    setType("Video Editing");
    setMessage("");

    setTimeout(() => setNotice(""), 5000);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3" aria-label="Contact form">
      <div className="grid grid-cols-2 gap-3">
        <input aria-label="Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="input-focus rounded-lg p-3" />
        <input aria-label="Email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="input-focus rounded-lg p-3" />
      </div>

      <select aria-label="Project type" value={type} onChange={(e) => setType(e.target.value)} className="input-focus rounded-lg p-3">
        <option>Video Editing</option>
        <option>Thumbnail Design</option>
        <option>Website Creation</option>
        <option>Other / Consultation</option>
      </select>

      <textarea aria-label="Project details" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Brief project details (optional)" className="input-focus rounded-lg p-3" />

      <div className="flex items-center justify-center gap-3 mt-2">
        <button type="submit" className={cls("px-6 py-3 rounded-full font-semibold focus:outline-none focus:ring-2", theme === "day" ? "bg-black text-white" : "bg-indigo-500 text-white")}>
          Let’s Build Your Vision Together
        </button>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-full border text-sm flex items-center gap-2">
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
      </div>

      {notice && <div className="text-sm mt-2 opacity-90">{notice}</div>}
    </form>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer({ theme }) {
  return (
    <footer className={cls("py-8 text-center text-sm", theme === "day" ? "text-black/60" : "text-white/60")}>
      © {new Date().getFullYear()} Aamir — Cinematic Video, Thumbnails & Websites
    </footer>
  );
}

/* ---------------- BACKGROUND BLOBS ---------------- */
function BackgroundBlobs({ theme }) {
  return (
    <svg className="absolute -z-10 left-0 top-0 w-full h-full opacity-30" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <filter id="bgBlur"><feGaussianBlur stdDeviation="60" /></filter>
      </defs>
      <g filter="url(#bgBlur)">
        <path d="M0 320 C 240 120 480 480 720 360 C 960 240 1200 220 1440 300 L1440 600 L0 600 Z" fill={theme === "day" ? "#000" : "#fff"} fillOpacity={theme === "day" ? "0.03" : "0.03"} />
        <path d="M0 260 C 200 320 420 180 640 260 C 860 340 1080 420 1440 300 L1440 600 L0 600 Z" fill={theme === "day" ? "#000" : "#fff"} fillOpacity={theme === "day" ? "0.02" : "0.02"} />
      </g>
    </svg>
  );
}

/* ---------------- ICONS ---------------- */
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
    </svg>
  );
}

/* Proper WhatsApp icon used consistently across the app.
   - Uses `currentColor` so you can tint it by setting color on its container.
   - size prop controls width/height.
*/
function WhatsAppIcon({ size = 20, className = "" }) {
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

function VideoIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function ThumbnailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 8.5l3 3 2-2 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WebIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 12h20M12 2v20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
