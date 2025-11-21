
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