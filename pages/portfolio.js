import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ---------- Small, reusable progressive image component ----------
function ProgressiveImage({
  src,
  srcSet,
  sizes,
  placeholder,
  alt = '',
  className = '',
  eager = false,
  fetchPriority = 'auto',
  fit = 'cover' // 'cover' | 'contain' | 'auto'
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

  // compute style depending on fit
  const imgStyle = {
    width: '100%',
    height: fit === 'auto' ? 'auto' : '100%',
    objectFit: fit === 'auto' ? 'contain' : fit,
    transition: 'opacity 420ms cubic-bezier(.2,.9,.2,1), transform 420ms',
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(6px)'
  };

  return (
    <div ref={imgRef} className={`progressive-image ${className}`} aria-busy={!loaded} style={{ position: 'relative', overflow: 'hidden' }}>
      {placeholder && (
        <img
          src={placeholder}
          alt={alt}
          aria-hidden
          className="progressive-placeholder"
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(8px) saturate(0.9)',
            transform: 'scale(1.02)',
            transition: 'opacity 420ms ease'
          }}
        />
      )}

      {inView && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={`progressive-main ${loaded ? 'is-loaded' : ''}`}
          onLoad={() => setLoaded(true)}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={fetchPriority}
          style={imgStyle}
        />
      )}

      <style jsx>{`
        .progressive-image { display:block; }
        .progressive-placeholder{ position:absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:0 }
        .progressive-main{ position:relative; z-index:1; display:block }
      `}</style>
    </div>
  );
}

// --------------------- Helper utilities ---------------------
const DEFAULT_WHATSAPP_NUMBER = '919905689072';
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
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const coreValue = 'I specialize in crafting high-CTR thumbnails that help creators like you stand out and grow faster.';

  useEffect(() => {
    try {
      const saved = localStorage.getItem('portfolio-theme');
      if (saved) {
        setTheme(saved);
      } else {
        // Default to light mode (day), but respect system preference for dark
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setTheme('dark');
        } else {
          setTheme('light');
        }
      }
    } catch (e) {}
  }, []);
  useEffect(() => { try { localStorage.setItem('portfolio-theme', theme); } catch (e) {} }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const getRidFromLocation = () => {
    if (typeof window === 'undefined') return null;
    try { const params = new URLSearchParams(window.location.search); return params.get('rid'); } catch { return null; }
  };

  // NOTE: Click tracking is handled by api/r.js BEFORE redirect to this page
  // The old system's api/r.js calls Google Apps Script with action=track&rid=XXX&via=vercel
  // which triggers the click notification. No need to call /api/logClick here.

  // load images either from env or fallback array (full list included)
  useEffect(() => {
    const cloudinaryImages = process.env.NEXT_PUBLIC_CLOUDINARY_IMAGES || process.env.NEXT_PUBLIC_PORTFOLIO_IMAGES || '';
    if (cloudinaryImages) {
      const imageUrls = cloudinaryImages.split(',').map(url => url.trim()).filter(Boolean);
      setImages(imageUrls);
    } else {
      setImages([
        'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556256/Charge_On_Th_go_cf86ck.jpg',
       'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556238/3_Tony_pro_ghoqae.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556240/3.1_Upgrade_u1au8z.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556241/4.1_segway2_isszi6.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556242/5.2_Chian_saw_fkyi0o.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556244/20_Anthony_Arillotta_huhuds.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556245/9_Alpha_vs_Warrior_qqpvja.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556247/7_Peter_Pasta_hzhhyt.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556247/8_Phillip_Crawford_Jr_aw8pv9.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556250/12_Motor_Reveal_red_mhl6lc.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556251/28.3_Quality_Scale_New_ijxz2r.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556251/28.4_Bad_Good_cvh0wo.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556252/28.2_Is_It_Enough_ebznfh.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556251/29.1_King_New_vsfdgu.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556252/29.4_Dominated_2_gnlpee.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556251/26.3_Lawn_Mower_isiafd.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556253/29.2_Ai_Recommended_v2_ninsph.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556253/30.2_13_Millionv2_d4fuqg.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556254/42_All_the_bosses_men_lidsw0.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556254/30.3_Library_2_updq5p.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556256/24.3_AI_glasses_thumbnail_swlh96.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556254/30.4_Meter_New_znoai2.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556256/24.1_Ai_thumbnail_omhxm7.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556255/62_Anthony_Arilotta_unleased_vugmn5.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556254/43_all_the_bosses_men_enhanced_npn7yr.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556255/9_GOTTI_JR_VS_SAMMY_zr7bge.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556258/tony_natasi_king_pimp_of_ny_uhgf64.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556254/44_Gene_Gotti_zapxim.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556256/Did_He_Win_2_nbxoke.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556262/69.1_Dominic_Chicale_poster_noo_ttxt_acupt0.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556259/44_No_more_bills_for_lewis_1_imj9en.png',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556259/2_This_is_the_one_kw6cwf.jpg',
'https://res.cloudinary.com/dim7qn23t/image/upload/v1763556259/no_car_no_blur_jnjbyu.jpg'
      ]);
    }
  }, []);

  // transform Cloudinary URL helper
  const transformUrl = (url, w = 800) => {
    try { if (!url.includes('/upload/')) return url; return url.replace('/upload/', `/upload/w_${w},q_auto,f_auto/`); } catch { return url; }
  };

  // prefetch small set of images for quick paint
  useEffect(() => {
    if (!images.length) return;
    const prefetchCount = 4;
    for (let i = 0; i < Math.min(prefetchCount, images.length); i++) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = transformUrl(images[i], 1200);
      document.head.appendChild(link);
    }
  }, [images]);

  const galleryImgError = (index) => (e) => {
    e.currentTarget.src = `https://via.placeholder.com/1200x800/111827/9CA3AF?text=Image+${index + 1}`;
  };

  const openLightbox = useCallback((index) => setActiveIndex(index), []);
  const pitchMessage = (name = 'Creator', cta = 'Recent Work: [link]') => `Hi ${name},\n\n${coreValue} ${cta}\n\nWould you like to try a thumbnail that increases CTR for your next video?`;
  const copyToClipboard = async (text) => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch (e) { alert('Unable to copy'); } };

  const rootClass = theme === 'dark' ? 'dark-mode' : 'light-mode';
  const variantNames = ['Thumnsil', 'Thubail', 'Thumnail'];

  // explicit srcset for the first hero image
  const heroSrcSet = `https://res.cloudinary.com/dim7qn23t/image/upload/w_400,q_auto,f_auto/v1763556256/Charge_On_Th_go_cf86ck.jpg 400w, https://res.cloudinary.com/dim7qn23t/image/upload/w_800,q_auto,f_auto/v1763556256/Charge_On_Th_go_cf86ck.jpg 800w, https://res.cloudinary.com/dim7qn23t/image/upload/w_1400,q_auto,f_auto/v1763556256/Charge_On_Th_go_cf86ck.jpg 1400w`;

  return (
    <>
      <Head>
        <title>Aamir — Thumbnail Designer | Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Aamir — Premium thumbnail design that increases CTR and viewer engagement." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
        {images[0] && <link rel="preload" as="image" href={transformUrl(images[0], 1400)} />}
      </Head>

      <div className={`${rootClass} min-h-screen bg-tiles`}>
        <nav className="sticky top-0 z-50 backdrop-blur-sm bg-black/12 border-b border-white/6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <a href="/" className="flex items-center gap-3 no-underline">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-[#ff3b3b] to-[#ff9b3b] flex items-center justify-center font-extrabold text-lg ring-2 ring-white/6 transform-gpu transition-all duration-300 logo-bounce">A</div>
                  <div className="hidden sm:block">
                    <div className="font-extrabold leading-none" style={{fontFamily:'Bebas Neue,system-ui', color:'var(--text)'}}>Aamir</div>
                    <div className="text-[11px] tracking-wide uppercase muted-strong">Thumbnail Designer</div>
                  </div>
                </a>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <a href="#gallery" className="nav-link">Work</a>
                <a href="#about" className="nav-link">About</a>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={toggleTheme} aria-label="Toggle theme" className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full muted-bg hover:muted-bg-hover transition">
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

                <button onClick={() => setMenuOpen(m => !m)} aria-expanded={menuOpen} aria-label="Toggle menu" className="md:hidden p-2 rounded-full muted-bg hover:muted-bg-hover transition">
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

        {/* HERO */}
        <header className="relative py-12 overflow-hidden">
          <div aria-hidden className="absolute -left-32 -top-36 w-[760px] h-[760px] pointer-events-none z-0">{/* decorative SVG omitted for brevity */}</div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full muted-bg border muted-border text-xs muted-strong">
                  <span className="inline-block h-4 w-6 -mt-[2px]">
                    <svg viewBox="0 0 24 24" className="block h-full w-full"><rect x="1" y="4" width="22" height="16" rx="4" fill="#FF0000"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="#fff"/></svg>
                  </span>
                  Aamir • <span className="muted-strong">Thumbnail Designer</span>
                </div>

                <div className="relative mt-4">
                  <h1 className="mt-0 text-4xl md:text-5xl lg:text-6xl leading-tight font-extrabold heading-layer">Thumbnails that Stop The Scroll</h1>
                  <p className="mt-4 text-lg muted-strong"><strong style={{color:'var(--accent)'}}> {coreValue} </strong></p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full bg-[var(--accent)] text-sm font-semibold shadow-lg hover:translate-y-[-1px] transition">Get a quote</a>
                    <a href="#gallery" className="px-4 py-3 rounded-full border muted-border text-sm hover:muted-bg-hover transition">See work</a>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                    <div className="stat text-card"><div className="num">+250</div><div className="lbl">Thumbnails delivered</div></div>
                    <div className="stat text-card"><div className="num">+35%</div><div className="lbl">Average CTR uplift</div></div>
                    <div className="stat text-card"><div className="num">48h</div><div className="lbl">Fast turnaround</div></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 hero-thumb card-bg border muted-border text-card" style={{minHeight: '320px'}}>
                  {images[0] ? (
                    <div style={{width:'100%', height:'100%'}}>
                      <ProgressiveImage
                        src={transformUrl(images[0], 1400)}
                        srcSet={heroSrcSet}
                        sizes="100vw"
                        placeholder={transformUrl(images[0], 60)}
                        alt="Featured thumbnail"
                        className="w-full h-full"
                        eager={true}
                        fetchPriority="high"
                        fit="auto" // show full image, scale by width (no zoom/crop)
                      />
                    </div>
                  ) : (
                    <div className="w-full h-[320px] card-bg" />
                  )}

                  <div className="absolute right-6 bottom-6 flex items-center gap-3">
                    <div className="mini-thumbs flex gap-2">
                      {images.slice(1,4).map((s,i) => (
                        <div key={i} style={{width:64, height:40, overflow:'hidden', borderRadius:8}}>
                          <ProgressiveImage
                            src={transformUrl(s, 800)}
                            srcSet={`${transformUrl(s,240)} 240w, ${transformUrl(s,400)} 400w`}
                            sizes="80px"
                            placeholder={transformUrl(s,40)}
                            alt={`mini-${i}`}
                            className="w-full h-full"
                            fit="cover"
                          />
                        </div>
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

        {/* GALLERY */}
        <main id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold">Selected thumbnails</h2>
            <div className="text-sm muted-strong">Creator-focused • High-CTR • Fast revisions</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((src, i) => (
              <button key={i} onClick={() => openLightbox(i)} className="group relative block w-full rounded-xl overflow-hidden card-bg hover:scale-[1.02] transition will-change-transform" aria-label={`Open image ${i+1}`}>
                <ProgressiveImage
                  src={transformUrl(src, 800)}
                  srcSet={`${transformUrl(src,320)} 320w, ${transformUrl(src,640)} 640w, ${transformUrl(src,800)} 800w`}
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  placeholder={transformUrl(src, 40)}
                  alt={`thumb-${i+1}`}
                  className="w-full h-52 object-cover group-hover:brightness-110 transition"
                  eager={i === 0}
                  fit="cover"
                />

                <div className="tile-overlay" />
                <div className="tile-title">{`${variantNames[i % variantNames.length]} ${i+1}`}</div>
              </button>
            ))}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="case p-6 rounded-2xl modern-case text-card"><div className="font-bold text-lg modern-case-title">Gaming Channel</div><div className="text-sm muted-text mt-2 modern-case-desc">32% CTR uplift after 4 thumbnails — focused on facial expression + bold text.</div></div>
            <div className="case p-6 rounded-2xl modern-case text-card"><div className="font-bold text-lg modern-case-title">Tech Reviews</div><div className="text-sm muted-text mt-2 modern-case-desc">Click-through improved by 28% with bright accent colors and simplified visual hierarchy.</div></div>
            <div className="case p-6 rounded-2xl modern-case text-card"><div className="font-bold text-lg modern-case-title">Lifestyle Vlogs</div><div className="text-sm muted-text mt-2 modern-case-desc">Double-tap style thumbnails and consistent branding led to faster viewer recognition.</div></div>
          </div>
        </main>

        {/* ABOUT */}
        <section id="about" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-[var(--card-bg)] border muted-border rounded-2xl p-8 modern-about-card text-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold">About Aamir</h3>
                <p className="mt-2 text-sm muted-text">I design high-impact YouTube thumbnails focused on clear faces, bold titles, and contrast-first composition to increase CTR and long-term channel growth. I work with creators across gaming, tech and lifestyle niches — fast revisions, brand consistency, and pixel-perfect exports.</p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-sm muted-strong">Services</div>
                <div className="text-sm service-pills"><span className="pill">Thumbnail Design</span><span className="pill">Batch Packages</span></div>
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-2 px-4 py-2 rounded-full bg-[var(--accent)] text-sm font-semibold">Contact</a>
              </div>
            </div>
          </div>
        </section>

        {/* LIGHTBOX */}
        {activeIndex !== null && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setActiveIndex(null)}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur" />
            <div className="relative max-w-5xl w-full rounded-xl overflow-hidden z-10">
              <img src={transformUrl(images[activeIndex], 1400)} alt={`open-${activeIndex+1}`} className="w-full h-auto max-h-[85vh] object-contain bg-black" decoding="async"/>
            </div>
          </div>
        )}

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="muted-text mb-4">Let's craft thumbnails that make people click.</div>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="px-7 py-3 rounded-full bg-[var(--accent)] text-sm font-semibold shadow-xl">Book a slot on WhatsApp</a>
        </footer>

        <style jsx>{`
          :root { --accent:#ff3b3b; }

          /* Theme variables + shadow tokens for easy tweaking */
          .light-mode {
            --bg:#ffffff;
            --text:#0b0b0d;
            --muted:#334155;
            --card-bg: rgba(255,255,255,0.9);
            --card-border: rgba(0,0,0,0.06);
            --muted-strong: rgba(0,0,0,0.76);
            --card-shadow: 0 12px 30px rgba(0,0,0,0.10);
            --text-shadow: rgba(0,0,0,0.14);
          }
          .dark-mode {
            --bg: #07070a;
            --text: #f8fafc;
            --muted:#94a3b8;
            --card-bg: rgba(255,255,255,0.03);
            --card-border: rgba(255,255,255,0.04);
            --muted-strong: rgba(255,255,255,0.82);
            --card-shadow: 0 12px 30px rgba(255,255,255,0.06);
            --text-shadow: rgba(255,255,255,0.10);
          }

          /* base layout + transitions for smooth switching */
          .light-mode, .dark-mode {
            color: var(--text);
            background: var(--bg);
            transition: background-color 360ms cubic-bezier(.2,.9,.2,1), color 260ms cubic-bezier(.2,.9,.2,1);
          }

          .bg-tiles { background: radial-gradient(1000px 300px at 20% -10%, rgba(255,59,59,0.10), transparent 40%), radial-gradient(1000px 300px at 110% 10%, rgba(255,184,107,0.06), transparent 40%), var(--bg); }

          :global(body) { font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }

          /* Heading layer gets subtle text-shadow for depth — uses token */
          .heading-layer { font-family: 'Bebas Neue', system-ui; letter-spacing:.6px; color:var(--text); text-shadow: 0 1px 0 var(--text-shadow); transition: color 240ms ease, text-shadow 240ms ease; }
          h1,h2,h3{ -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale }

          .muted-text{ color:var(--muted); transition: color 240ms ease; }
          .muted-strong{ color:var(--muted-strong); transition: color 240ms ease; }

          /* Text cards — any block that primarily contains text should use .text-card */
          .text-card{
            color: var(--text);
            text-shadow: 0 1px 0 var(--text-shadow);
            box-shadow: var(--card-shadow);
            transition: box-shadow 360ms cubic-bezier(.2,.9,.2,1), color 240ms ease, text-shadow 240ms ease, transform 240ms ease;
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
          }

          /* stat / tile / case styles that rely on text-card tokens */
          .stat { border-radius:14px; padding:14px; }
          .stat .num { font-weight:800; font-size:22px; color:var(--text); }
          .stat .lbl { font-weight:600; font-size:11px; color:var(--muted); margin-top:6px; text-transform:uppercase; letter-spacing:.4px; }

          .hero-thumb{ position:relative; }

          /* make title tile use the card-shadow token */
          .tile-title{ position:absolute; left:12px; bottom:12px; font-weight:800; font-size:14px; padding:8px 12px; border-radius:12px; letter-spacing:0.6px; box-shadow: var(--card-shadow); backdrop-filter: blur(6px) saturate(120%); transition: transform .18s ease, box-shadow .18s ease, color .18s ease; }
          .light-mode .tile-title{ background: rgba(255,255,255,0.95); color: #0b0b0d; }
          .dark-mode .tile-title{ background: rgba(0,0,0,0.72); color: #fff; }
          .group:hover .tile-title{ transform: translateY(-6px) scale(1.02); }

          .modern-case{ position:relative; overflow:hidden; }
          .modern-case::before{ content:''; position:absolute; inset:-40% -20%; background: linear-gradient(120deg, rgba(255,59,59,0.06), rgba(255,140,80,0.02)); transform: rotate(-8deg); }
          .modern-case-title{ color: var(--text); font-size:18px; font-weight:700; transition: color 240ms ease, background 240ms ease; }

          .progressive-placeholder{ transition: opacity 420ms ease; }
          .progressive-main{ display:block; }

          .tile-overlay{ position:absolute; inset:0; background: radial-gradient(400px 120px at 90% 100%, rgba(255,59,59,0.08), transparent 40%); opacity:.95; mix-blend-mode: overlay; pointer-events:none; }

          /* shine effect preserved */
          .shine{ position:absolute; inset:0; background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 60%); transform: translateX(-120%); animation: shine 4s ease-in-out infinite; pointer-events:none; mix-blend-mode:screen; }
          @keyframes shine{ 0%{transform:translateX(-120%);} 60%{transform:translateX(120%);} 100%{transform:translateX(120%);} }

          /* Additional utility classes */
          .muted-bg { background: var(--card-bg); }
          .muted-bg-hover { background: rgba(0,0,0,0.08); }
          .muted-border { border: 1px solid var(--card-border); }

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

          .logo-bounce { transform-origin:center; transition: transform .18s ease; }
          .logo-bounce:hover { transform: translateY(-3px) scale(1.02); }

          .service-pills { display: flex; gap: 8px; flex-wrap: wrap; }
          .service-pills .pill {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            font-size: 12px;
            color: var(--muted-strong);
          }

          .modern-about-card { position: relative; }

          .modern-case-desc { color: var(--muted); }

          @media (max-width:1024px){ .heading-layer{font-size:44px;} }
          @media (max-width:640px){ .heading-layer{font-size:36px;} }
        `}</style>
      </div>
    </>
  );
}

