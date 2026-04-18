import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, HeartHandshake, Award, CheckCircle2, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { CTA, Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';

const msmeImages = [
  '/certificates/msme/msme_page-0001.jpg',
  '/certificates/msme/msme_page-0002.jpg',
  '/certificates/msme/msme_page-0003.jpg',
  '/certificates/msme/msme_page-0004.jpg',
];

const MsmeCarousel = ({ pageLabel }) => {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);

  const prev = () => { setDir(-1); setIdx((i) => (i - 1 + msmeImages.length) % msmeImages.length); };
  const next = () => { setDir(1); setIdx((i) => (i + 1) % msmeImages.length); };

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-inner">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.img
            key={idx}
            src={msmeImages[idx]}
            alt={`MSME Certificate Page ${idx + 1}`}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? -60 : 60 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="w-full h-auto object-contain"
          />
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-600 hover:text-primary-500 transition-colors border border-slate-100 z-10"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-600 hover:text-primary-500 transition-colors border border-slate-100 z-10"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {msmeImages.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-primary-500' : 'w-2 bg-slate-300'}`}
          />
        ))}
      </div>
      <p className="text-xs text-slate-400 mt-2">{pageLabel} {idx + 1} of {msmeImages.length}</p>
    </div>
  );
};

const AboutPage = () => {
  const { lang } = useLang();
  const t = translations[lang].about;

  const stats = [
    { value: "10k+", label: t.stats[0].label },
    { value: "50+", label: t.stats[1].label },
    { value: "24/7", label: t.stats[2].label },
  ];

  const valueIcons = [
    <HeartHandshake className="w-6 h-6 text-primary-500" />,
    <Building2 className="w-6 h-6 text-primary-500" />,
    <Award className="w-6 h-6 text-primary-500" />,
    <Star className="w-6 h-6 text-primary-500" />,
  ];

  const values = t.valuesList.map((v, i) => ({
    ...v,
    icon: valueIcons[i],
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Meta 
        title={t.metaTitle}
        description={t.metaDesc}
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">

        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-x-0 top-0 bottom-0">
            <img 
              src="/images/about-hero-v2.png" 
              alt="" 
              role="presentation"
              width="1920"
              height="600"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/70 via-secondary-900/60 to-secondary-900/80" />
          </div>
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-primary-400 font-bold uppercase tracking-[0.2em] text-xs mb-4">
                {t.heroBadge}
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
                {t.heroTitle}
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto mb-6">
                {t.heroSubtitle1}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                {t.heroSubtitle2}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-secondary-900">
          <div className="container-custom">
            <div className="grid grid-cols-3 gap-8 text-center">
              {stats.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <p className="text-4xl md:text-5xl font-extrabold text-primary-400 mb-2">{stat.value}</p>
                  <p className="text-slate-400 font-medium text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2">
                <img 
                  src="/images/about-content-v2.png" 
                  alt="Medical Professional Assistance"
                  width="800"
                  height="400"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-[400px] object-cover rounded-[2rem] shadow-2xl" 
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full lg:w-1/2">
                <p className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.valuesBadge}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-10">{t.valuesTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {values.map((v, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">{v.icon}</div>
                      <div>
                        <h4 className="font-bold text-secondary-900 mb-1">{v.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-slate-50">
          <div className="container-custom">
            <div className="text-center mb-14">
              <p className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.certBadge}</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-4">{t.certTitle}</h2>
              <p className="text-slate-500 max-w-xl mx-auto">{t.certDesc}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

              {/* MIC Registration - single image */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2 className="text-primary-500 w-5 h-5 flex-shrink-0" />
                  <h3 className="font-bold text-secondary-900">{t.micReg}</h3>
                </div>
                <img
                  src="/certificates/registration-certificate.jpg"
                  alt="MIC Registration Certificate"
                  className="w-full object-contain rounded-xl border border-slate-100 shadow-sm"
                />
              </motion.div>

              {/* MSME - 4 page carousel */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-5">
                  <CheckCircle2 className="text-primary-500 w-5 h-5 flex-shrink-0" />
                  <h3 className="font-bold text-secondary-900">{t.msmeReg}</h3>
                </div>
                <MsmeCarousel pageLabel={t.pageLabel} />
              </motion.div>

            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;

