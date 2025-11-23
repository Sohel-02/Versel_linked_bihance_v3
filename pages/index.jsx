
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
                  <Link href={`/services/${s.slug}`} className="text-accent font-semibold">
                    Learn more →
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