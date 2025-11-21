// Real Estate Video Editing Portfolio — Tailwind + Next.js
// Single-file guide + code snippets for a professional portfolio website tailored for realtors.
// Save pieces into your Next.js project. TailwindCSS is used for all styling.

/*
PROJECT FILE STRUCTURE (suggested)

/my-portfolio/
├─ package.json
├─ tailwind.config.js
├─ postcss.config.js
├─ styles/globals.css
├─ pages/_app.js
├─ pages/index.jsx            // main Services page
├─ pages/services/[slug].jsx  // dynamic service pages (Dynamic Montages, Cinematic Walkthroughs, Viral Shorts, Aerial Highlights)
├─ components/Header.jsx
├─ components/Footer.jsx
├─ components/VideoEmbed.jsx
├─ data/services.js           // service content + showcase URLs (paste your YouTube/Shorts links here)
└─ public/images/             // hero and gallery placeholders


1) INSTALLATION & TAILWIND SETUP

- Install dependencies (Next.js + Tailwind):

  npm init -y
  npm install next react react-dom
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p

- tailwind.config.js (example):

module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ff3b3b'
      }
    }
  },
  plugins: []
}

- styles/globals.css

@tailwind base;
@tailwind components;
@tailwind utilities;

/* small helper styles */
:root{ --accent: #ff3b3b }

body{ @apply bg-white text-gray-900 }


2) DATA: data/services.js

// Edit this file to paste your YouTube / Shorts links into the `showcase` arrays.
export const SERVICES = [
  {
    slug: 'dynamic-montages',
    title: 'Dynamic Home Tours & Montages',
    hero: 'Dynamic Home Tours & Montages — Make buyers fall in love at first click',
    sub: 'Fast-paced montages that highlight a property’s best selling points for listings and social.',
    description: 'Curated 60s–2m home tour videos highlighting flow, light and design. Deliverables include full-length MP4 and social crops.',
    features: [
      'Fast 24–72 hour turnaround',
      'Color grading optimized for interiors',
      'MLS-safe exports (H.264 MP4)',
      'Social cuts (1:1, 9:16) included'
    ],
    showcase: [
      // paste YouTube/watch?v links or youtube.com/shorts/ links here
      // 'https://www.youtube.com/watch?v=VIDEO_ID',
    ]
  },
  {
    slug: 'cinematic-walkthroughs',
    title: 'Cinematic Walkthroughs',
    hero: 'Cinematic Walkthroughs — Show the story of the house',
    sub: 'Slow, cinematic edits ideal for luxury and premium listings.',
    description: '4K-ready edits with stabilization, cinematic color grades, and optional VO to tell a home’s story.',
    features: ['4K-ready edits', 'Stabilization & motion smoothing', 'Professional LUTs and grade', 'Optional voiceover'],
    showcase: []
  },
  {
    slug: 'viral-shorts',
    title: 'Viral Shorts (Reels / TikTok)',
    hero: 'Viral Shorts — Hook viewers fast and generate leads',
    sub: '15–60s hook-first edits that drive DMs and showings on social platforms.',
    description: 'Vertical-first edits with animated captions, CTA overlays, and trending sounds to maximize shareability.',
    features: ['Hook-first editing (0–3s)', 'Animated captions & CTAs', 'Beat-synced cuts', 'Versioning for Reels & TikTok'],
    showcase: []
  },
  {
    slug: 'aerial-highlights',
    title: 'Aerial Neighborhood & Lifestyle Highlights',
    hero: 'Aerial Highlights — Sell the location, not just the house',
    sub: 'Drone edits that show neighborhood, approach shots, and lifestyle elements.',
    description: 'Drone edit packages with location callouts, transitions between aerial and ground shots, and ad-ready short versions.',
    features: ['Drone stabilization & grade', 'Location callouts & animated maps', 'Smooth aerial-to-ground transitions', '30s & 60s ad-ready versions'],
    showcase: []
  }
]


3) COMPONENT: components/Header.jsx

import Link from 'next/link';

export default function Header(){
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-red-500 to-orange-300 flex items-center justify-center text-white font-bold">A</div>
              <div className="hidden sm:block">
                <div className="font-extrabold">Aamir</div>
                <div className="text-xs text-gray-500">Real Estate Video Editor</div>
              </div>
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#services"><a className="text-gray-700 hover:text-gray-900">Services</a></Link>
            <Link href="#showcase"><a className="text-gray-700 hover:text-gray-900">Showcase</a></Link>
            <Link href="#why"><a className="text-gray-700 hover:text-gray-900">Why Choose Me</a></Link>
            <a href="https://wa.me/1555" className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-accent text-white font-semibold">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  )
}


4) COMPONENT: components/Footer.jsx

export default function Footer(){
  return (
    <footer className="mt-20 border-t bg-white/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Aamir — Real Estate Video Editing • Quick delivery • Realtor‑first
      </div>
    </footer>
  )
}


5) COMPONENT: components/VideoEmbed.jsx

// Simple component: embeds watch?v= links, makes shorts open in new tab.
export default function VideoEmbed({ url, title = 'Showcase video' }){
  if(!url) return null;
  try{
    const u = new URL(url);
    const path = u.pathname;
    if(u.hostname.includes('youtube.com')){
      if(path.startsWith('/shorts/')){
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-accent">Open Shorts</a>
        )
      }
      const id = u.searchParams.get('v');
      if(id){
        return (
          <div className="aspect-w-16 aspect-h-9">
            <iframe src={`https://www.youtube.com/embed/${id}`} title={title} frameBorder="0" allowFullScreen className="w-full h-full rounded-lg" />
          </div>
        )
      }
    }
  }catch(e){ /* fallback */ }
  return <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block underline text-accent">Open Video</a>
}


6) PAGE: pages/index.jsx  (Main Services Page)

import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { SERVICES } from '../data/services'
import VideoEmbed from '../components/VideoEmbed'

export default function Home(){
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">Video Editing for Realtors — Sell Homes Faster</h1>
            <p className="mt-4 text-lg text-gray-600">I edit property videos that shorten time on market: dynamic montages, cinematic walkthroughs, viral shorts, and aerial neighborhood highlights. Fast delivery, realtor-focused edits, and social-ready deliverables.</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://wa.me/1555" className="inline-flex items-center px-5 py-3 rounded-full bg-accent text-white font-semibold">Get a quote</a>
              <a href="#services" className="inline-flex items-center px-4 py-3 rounded-full border text-gray-700">See services</a>
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-4">
              <li className="text-center">
                <div className="text-2xl font-bold">48-72h</div>
                <div className="text-sm text-gray-500">Typical delivery</div>
              </li>
              <li className="text-center">
                <div className="text-2xl font-bold">Realtor‑First</div>
                <div className="text-sm text-gray-500">Templated for listings</div>
              </li>
              <li className="text-center">
                <div className="text-2xl font-bold">US Editors</div>
                <div className="text-sm text-gray-500">Timezone-friendly</div>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6">
            <img src="/images/hero-property.jpg" alt="Hero property" className="rounded-xl object-cover w-full h-80" />
          </div>
        </div>

        {/* Services summary */}
        <section id="services" className="mt-20">
          <h2 className="text-2xl font-bold">Services</h2>
          <p className="text-gray-600 mt-2">Four focused services tailored for property marketing. Click "Learn more" to open each dedicated page.</p>

          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(s => (
              <div key={s.slug} className="p-6 rounded-2xl border bg-white shadow-sm">
                <h3 className="font-semibold text-lg">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{s.sub}</p>
                <ul className="mt-4 text-sm text-gray-600 space-y-1">
                  {s.features.slice(0,3).map((f,i) => <li key={i}>• {f}</li>)}
                </ul>
                <div className="mt-4 flex items-center justify-between">
                  <Link href={`/services/${s.slug}`}>
                    <a className="text-accent font-semibold">Learn more →</a>
                  </Link>
                  <a href={`#${s.slug}`} className="text-sm text-gray-400">Showcase</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Why Choose Me */}
        <section id="why" className="mt-20">
          <h2 className="text-2xl font-bold">Why Choose Me</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold">Quick Delivery</h4>
              <p className="text-sm text-gray-500 mt-2">48–72h standard; rush options available.</p>
            </div>
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold">Realtor‑First Expertise</h4>
              <p className="text-sm text-gray-500 mt-2">Editing optimized to highlight salable features.</p>
            </div>
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold">Flexible Pricing</h4>
              <p className="text-sm text-gray-500 mt-2">Per-edit, bundle, and subscription options.</p>
            </div>
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold">US‑Based Editors</h4>
              <p className="text-sm text-gray-500 mt-2">Fast, timezone-friendly communication.</p>
            </div>
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold">100% Satisfaction</h4>
              <p className="text-sm text-gray-500 mt-2">Revisions until you’re happy.</p>
            </div>
          </div>
        </section>

        {/* Showcase preview */}
        <section id="showcase" className="mt-20">
          <h2 className="text-2xl font-bold">Showcase</h2>
          <p className="text-gray-600 mt-2">Selected edits. Add links to data/services.js to embed videos here.</p>

          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2">
            {SERVICES.map(s => (
              <div key={`short-${s.slug}`} className="p-6 rounded-2xl border">
                <h4 className="font-semibold mb-3">{s.title}</h4>
                <div className="space-y-4">
                  {s.showcase.length === 0 ? (
                    <div className="text-sm text-gray-500">No links yet. Paste YouTube/Shorts links into <code>data/services.js</code>.</div>
                  ) : (
                    s.showcase.slice(0,2).map((u,i) => (
                      <VideoEmbed key={i} url={u} title={`${s.title} demo ${i+1}`} />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}


7) PAGE: pages/services/[slug].jsx (dynamic service page)

import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { SERVICES } from '../../data/services'
import VideoEmbed from '../../components/VideoEmbed'

export default function ServicePage(){
  const router = useRouter();
  const { slug } = router.query;
  const service = SERVICES.find(s => s.slug === slug);

  if(!service) return (
    <div>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-28 text-center">
        <h2 className="text-xl font-semibold">Service not found</h2>
        <p className="mt-4">Please go back to the <a href="/" className="text-accent">services page</a>.</p>
      </main>
      <Footer />
    </div>
  )

  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-extrabold">{service.hero}</h1>
            <p className="mt-4 text-gray-600">{service.sub}</p>

            <section className="mt-8">
              <h3 className="font-semibold">About this service</h3>
              <p className="mt-2 text-gray-600">{service.description}</p>

              <div className="mt-4">
                <h4 className="font-semibold">Key features</h4>
                <ul className="mt-2 list-disc list-inside text-gray-600">
                  {service.features.map((f,i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <a href="https://wa.me/1555" className="inline-flex items-center px-4 py-2 bg-accent text-white rounded-md">Request this edit</a>
                <a href="#pricing" className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700">See pricing</a>
              </div>
            </section>

          </div>

          <aside className="p-6 rounded-2xl border bg-white">
            <h4 className="font-semibold mb-3">Showcase</h4>
            <div className="space-y-4">
              {service.showcase.length === 0 ? (
                <div className="text-sm text-gray-500">No links yet. Add YouTube/Shorts links into <code>data/services.js</code>.</div>
              ) : (
                service.showcase.map((u,i) => <VideoEmbed key={i} url={u} title={`${service.title} ${i+1}`} />)
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}


8) TAILWIND UTILITIES: Aspect-ratio helper

Install @tailwindcss/aspect-ratio plugin or use CSS to preserve 16:9 ratio for iframes.

Example plugin usage:

// tailwind.config.js plugins: [require('@tailwindcss/aspect-ratio')]

Then in JSX: <div className="aspect-w-16 aspect-h-9">...iframe...</div>


9) HOW TO ADD YOUR VIDEO LINKS

- Open data/services.js and paste each YouTube / Shorts link into the correct service's `showcase` array.
- Standard YouTube watch?v= links will show inline embeds. Shorts links will open in a new tab.


10) DESIGN NOTES & NAVIGATION

- The site uses a single top navigation with anchor links and dynamic service pages for deeper SEO and shareability.
- Services page is the primary landing for agents searching for property video services in search results.
- Keep hero images bright and natural to showcase interiors; include before/after color grades in the Showcase for credibility.


11) NEXT STEPS I CAN IMPLEMENT NOW (choose any):
- Add pricing card and downloadable PDF packages.
- Wire a contact form that posts to Google Sheets or sends an email via serverless function.
- Add SEO meta tags and JSON-LD VideoObject for each embedded video.
- Create a lightweight CMS (JSON file or Airtable) to update showcase links without code.


---
End of file.
