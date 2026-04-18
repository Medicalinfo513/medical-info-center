import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const Hero = () => {
  const { lang } = useLang();
  const t = translations[lang].hero;

  return (
    <section className="relative h-[80vh] sm:h-[85vh] md:min-h-screen flex items-start md:items-center pt-40 sm:pt-40 md:pt-28 pb-20 overflow-hidden rounded-b-[35px] md:rounded-b-[60px]">
      {/* Background Image */}
      <div className="absolute inset-x-0 top-0 bottom-0 z-0">
        <img 
          src="/images/hero-bg-v2.png" 
          alt="" 
          role="presentation"
          loading="eager"
          decoding="async"
          width="1920"
          height="1080"
          className="w-full h-full object-cover object-center" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-[#0f172a]/30 md:from-[#0f172a] md:via-[#0f172a]/40 md:to-transparent backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 w-full px-5 sm:px-6">
        <div className="max-w-4xl flex flex-col items-start text-left md:ml-0 md:-ml-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md border border-[#ffffff20] px-4 py-1.5 rounded-full text-primary-400 font-medium text-xs md:text-[13px] mb-4 md:mb-8"
          >
            <ShieldCheck size={14} className="text-primary-500" />
            <span className="tracking-wide">{t.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[28px] sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] mb-3 md:mb-6 tracking-tight"
          >
            {t.title1} <br className="hidden sm:block" />
            <span className="text-primary-400">{t.title2}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base md:text-xl font-bold text-slate-200 mb-3 md:mb-6"
          >
            {t.subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-sm md:text-base text-slate-300 md:text-slate-400 mb-10 md:mb-10 leading-relaxed max-w-xl"
          >
            {t.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-5 sm:gap-4 w-full sm:w-auto"
          >
            <Link to="/contact" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-9 py-4 rounded-full font-bold text-[17px] transition-all shadow-xl shadow-primary-500/20 flex items-center justify-center gap-3">
              {t.btnPrimary}
              <ArrowRight size={18} />
            </Link>
            <Link to="/services" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-9 py-4 rounded-full font-bold text-[17px] transition-all flex items-center justify-center">
              {t.btnSecondary}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Shapes / Decor */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-primary-400/10 blur-[100px] rounded-full"></div>
    </section>
  );
};

export default Hero;

