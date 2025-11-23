import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';

// Next.js single-file homepage (pages/index.jsx)
// Improvements: consistent spacing, responsive-optimized layout, accessible controls,
// evenly-spaced sections, and clear visual hierarchy for all screen sizes.

export default function Home() {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919905689072';
  const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi Aamir, I'm interested in your services — thumbnails, video editing, or website work. Could you share pricing and turnaround?"
  );
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

  const services = [
    {
      id: 'thumbnail',
      title: 'Thumbnail Design',
      desc: 'Data-driven thumbnails that increase CTR and session time.',
      href: '/portfolio',
      accent: 'from-[#FF7A59] to-[#FFD56B]',
      icon: ThumbnailSVG,
    },
    {
      id: 'video',
      title: 'Video Production',
      desc: 'Cinematic storytelling optimized for YouTube, Reels, Shorts.',
      href: '/portfoliovideo',
      accent: 'from-[#6D5CFF] to-[#8BE5FF]',
      icon: VideoSVG,
    },
    {
      id: 'web',
      title: 'Website Development',
      desc: 'Fast, SEO-friendly websites built for conversion.',
      href: 'https://weburone.com',
      accent: 'from-[#00C6A7] to-[#0077FF]',
      icon: WebSVG,
    },
  ];

  const uniques = [
    { k: 'Results-first', v: 'Design & video made to move measurable metrics.', icon: RocketSVG, color: 'from-[#FF7A59] to-[#FFD56B]' },
    { k: 'Transparent Pricing', v: 'Clear packages & milestone-based timelines.', icon: DollarSVG, color: 'from-[#6D5CFF] to-[#8BE5FF]' },
    { k: 'Fast Turnaround', v: 'Optimized workflows — fast & reliable delivery.', icon: ClockSVG, color: 'from-[#00C6A7] to-[#0077FF]' },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Head>
        <title>Aamir — Creative Design, Video & Web</title>
        <meta name="description" content="Creative solutions in design, video and web development." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900">
        {/* NAV */}
        <nav className={`fixed inset-x-0 top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all ${scrolled ? 'backdrop-blur-sm bg-white/70 shadow' : ''}`} aria-label="Main navigation">
          <div className="flex items-center justify-between gap-4 rounded-2xl p-3">
            <a href="/" className="flex items-center gap-3 no-underline">
              <div className="h-10 w-10 rounded-md bg-gradient-to-tr from-[#FF7A59] to-[#FFB86B] flex items-center justify-center text-white font-bold shadow">A</div>
              <div className="hidden sm:block">
                <div className="font-semibold leading-tight text-gray-900">Aamir</div>
                <div className="text-xs text-gray-500">Creative • Video • Web</div>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <a href="#services" className="hover:text-gray-900">Services</a>
              <a href="#unique" className="hover:text-gray-900">Why Us</a>
              <a href="#contact" className="hover:text-gray-900">Contact</a>
            </div>

            <div className="flex items-center gap-3">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4F4F] text-white font-semibold shadow transform hover:-translate-y-0.5">Start Your Project</a>

              <button onClick={() => setMobileOpen(s => !s)} aria-expanded={mobileOpen} aria-label="Toggle menu" className="md:hidden inline-flex items-center justify-center p-2 rounded-md bg-white/90 shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-700"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="mt-3 md:hidden bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg">
              <ul className="flex flex-col gap-3 text-sm">
                <li><a href="#services" onClick={() => setMobileOpen(false)} className="block">Services</a></li>
                <li><a href="#unique" onClick={() => setMobileOpen(false)} className="block">Why Us</a></li>
                <li><a href="#contact" onClick={() => setMobileOpen(false)} className="block">Contact</a></li>
                <li><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex w-full items-center justify-center px-4 py-2 rounded-full bg-[#FF4F4F] text-white font-semibold">Start Your Project</a></li>
              </ul>
            </div>
          )}
        </nav>

        {/* HERO */}
        <header className="pt-28 lg:pt-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">Creative Design, Video & Web — built to perform</h1>
                <p className="text-lg text-gray-700 max-w-2xl mb-6">Visuals and websites designed for attention and conversion. Fast delivery, clear pricing and international standards.</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-[#FF4F4F] text-white font-semibold shadow-md transition-transform hover:-translate-y-1">Start Your Project</a>
                  <a href="#services" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-gray-200 text-sm">Our Services</a>
                </div>

                <div className="text-xs text-gray-500">Transparent pricing • International delivery • 30-day support</div>
              </div>

              <div className="lg:col-span-5">
                <LayeredTrustPanel whatsapp={WHATSAPP_LINK} />
              </div>
            </div>
          </div>
        </header>

        {/* Spacer between hero and services */}
        <div className="h-12 sm:h-20 lg:h-28" aria-hidden="true" />

        {/* OUR SERVICES - generous spacing, responsive grid, consistent card height */}
        <section id="services" className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">Clear packages that make it easy to choose — designed to get results quickly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {services.map((s) => (
                <ServiceCardResponsive key={s.id} s={s} whatsapp={WHATSAPP_LINK} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-tr from-[#6D5CFF] to-[#8BE5FF] text-white font-semibold shadow-lg">Get a quick quote</a>
            </div>
          </div>
        </section>

        {/* WHAT MAKES US UNIQUE - clear 3-column layout with spacing */}
                {/* Spacer between services and what makes us unique */}
        <div className="h-12 sm:h-20 lg:h-28" aria-hidden="true" />

        <section id="unique" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold">What Makes Us Unique</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mt-2">Short, measurable strengths you can verify on day one.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {uniques.map((u) => (
                <UniqueResponsiveCard key={u.k} u={u} />
              ))}
            </div>
          </div>
        </section>

        {/* DELIVERY TIMELINE - kept compact and evenly spaced */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-6">How We Deliver</h3>
            <TimelineResponsive />
          </div>
        </section>

        {/* CLIENT CARE */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-6">Client Care</h3>
            <ClientCare />
          </div>
        </section>

        {/* TRUST GRID */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-bold mb-6">Trust & Compliance</h3>
            <TrustGrid />
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl p-8 text-center shadow-lg bg-white border border-gray-100">
              <h3 className="text-2xl font-bold mb-3">Let’s build something extraordinary together—wherever you are.</h3>
              <p className="text-sm text-gray-600 mb-6">From thumbnails and video to full-stack web development, we combine creativity, speed, and reliability.</p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#FF4F4F] text-white font-semibold shadow-md">👉 Work With Us</a>
            </div>
          </div>
        </section>

        <footer className="py-10 text-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} Aamir — Thumbnails • Video • Websites</div>
        </footer>

        {/* Styles: small helper styles, mobile-first */}
        <style jsx>{`
          /* Card interactions with reduced-motion respect */
          @media (prefers-reduced-motion: no-preference) {
            .interactive-card { transition: transform 240ms cubic-bezier(.2,.9,.3,1), box-shadow 240ms; }
            .interactive-card:hover { transform: translateY(-6px); }
          }

          /* Keep gradient backgrounds from bleeding into dark text on older browsers */
          .gradient-bg { background-image: linear-gradient(135deg,var(--tw-gradient-from),var(--tw-gradient-to)); }
        `}</style>
      </main>
    </>
  );
}

// ---------------- Components ----------------

function ServiceCardResponsive({ s, whatsapp }) {
  const Icon = s.icon;
  return (
    <article className="interactive-card flex flex-col rounded-2xl p-6 bg-white shadow-sm border border-gray-50 h-full">
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white bg-gradient-to-tr ${s.accent} flex-shrink-0`} style={{ boxShadow: '0 12px 30px rgba(16,24,40,0.06)' }}>
          <Icon className="w-7 h-7" />
        </div>

        <div className="flex-1">
          <h4 className="font-semibold text-lg">{s.title}</h4>
          <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
        </div>
      </div>

      <div className="mt-6 mt-auto flex items-center justify-between gap-3">
        {s.href && s.href.startsWith('http') ? (
          <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-sm font-semibold">Visit site</a>
        ) : (
          <Link href={s.href} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-sm font-semibold">View portfolio</Link>
        )}

        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500">Ask price</a>
      </div>
    </article>
  );
}

function UniqueResponsiveCard({ u }) {
  const Icon = u.icon;
  return (
    <div className="rounded-2xl p-5 bg-white shadow-sm border border-gray-50 flex gap-4 items-start">
      <div className={`w-12 h-12 rounded-md flex items-center justify-center text-white bg-gradient-to-tr ${u.color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="font-semibold">{u.k}</div>
        <div className="text-sm text-gray-600 mt-1">{u.v}</div>
      </div>
    </div>
  );
}

function TimelineResponsive() {
  const steps = [
    { t: '01', title: 'Discovery', desc: 'Understand goals, audiences, and KPIs.' },
    { t: '02', title: 'Plan', desc: 'Wireframes, scripts, and production plan.' },
    { t: '03', title: 'Create', desc: 'Design, shoot, code and iterate.' },
    { t: '04', title: 'Deliver', desc: 'Hand-offs, QA and launch.' },
  ];

  return (
    <div className="space-y-6">
      {steps.map((s) => (
        <div key={s.t} className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow font-semibold">{s.t}</div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 w-full">
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-600">{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LayeredTrustPanel({ whatsapp }) {
  return (
    <div className="relative w-full">
      <div className="rounded-3xl p-6 shadow-lg bg-white border border-gray-100">
        <h4 className="font-bold mb-2">Trusted by clients worldwide</h4>
        <p className="text-sm text-gray-700 mb-4">Quality, speed & innovation — delivered with care and transparency.</p>
        <a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4F4F] text-white font-semibold shadow-sm">Contact</a>
      </div>
    </div>
  );
}

function ClientCare() {
  const quotes = [
    { who: 'Marta — Spain', text: 'They treated our project like their own. Highly recommended.' },
    { who: 'Jun — Korea', text: 'Fast, respectful communication and outstanding final videos.' },
    { who: 'Amélie — France', text: 'Transparent process and clear milestones. A safe long-term partner.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quotes.map((q, idx) => (
        <blockquote key={idx} className="rounded-xl p-6 bg-white shadow-sm border border-gray-50">
          <p className="text-sm text-gray-700 italic">“{q.text}”</p>
          <footer className="mt-4 text-xs text-gray-500">— {q.who}</footer>
        </blockquote>
      ))}
    </div>
  );
}

function TrustGrid() {
  const logos = ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'React', 'Node.js'];
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center">
        {logos.map((l) => (
          <div key={l} className="rounded-xl p-3 bg-white shadow-sm text-center text-xs font-semibold">{l}</div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold">Data Processing Agreement</div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold">ISO 9001</div>
        <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold">GDPR Ready</div>
      </div>
    </div>
  );
}

// ---------------- SVG ICONS ----------------

function ThumbnailSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><rect x="3" y="4" width="18" height="14" rx="2" stroke="white" strokeWidth="1.5"/><path d="M7 8.5l3 3 2-2 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}

function VideoSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><rect x="2" y="4" width="16" height="14" rx="2" stroke="white" strokeWidth="1.5"/><path d="M20 8v8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 10l4 2-4 2V10z" fill="white"/></svg>
  );
}

function WebSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><circle cx="12" cy="12" r="8" stroke="white" strokeWidth="1.5"/><path d="M2 12h20M12 2v20" stroke="white" strokeWidth="1" strokeLinecap="round"/></svg>
  );
}

function RocketSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 2c1.5 0 3.2.6 4.4 1.8 1.2 1.2 1.8 2.9 1.8 4.4 0 2.3-1 4.7-2.8 7.2L12 22l-3.4-6.6C6.9 14 6 11.6 6 9.3c0-1.5.6-3.2 1.8-4.4C9 3.2 10.5 2 12 2z" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}

function DollarSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><path d="M12 1v22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M17 7H9.5a2 2 0 000 4H16a2 2 0 010 4H7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}

function ClockSVG(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5"/><path d="M12 7v6l4 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
  );
}
