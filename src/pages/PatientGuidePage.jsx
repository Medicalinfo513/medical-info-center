import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Stethoscope, Plane, UserCheck, Activity, HeartPulse, ChevronRight } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';

const StepCard = ({ step, index, total }) => {
  const ICON_MAP = { FileText, Stethoscope, Plane, UserCheck, Activity, HeartPulse };
  const Icon = ICON_MAP[step.icon] || Activity;

  return (
    <div className="relative group">
      {/* Connector Line */}
      {index < total - 1 && (
        <div className="hidden lg:block absolute top-[44px] left-[calc(50%+44px)] w-[calc(100%-88px)] h-0.5 bg-slate-100 group-hover:bg-primary-100 transition-colors z-0" />
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 group-hover:border-primary-200 group-hover:shadow-2xl group-hover:shadow-primary-500/10 transition-all duration-500 group-hover:-translate-y-2">
           <div className="w-16 h-16 md:w-20 md:h-20 rounded-[24px] bg-primary-50 flex items-center justify-center transition-colors group-hover:bg-primary-500">
             <Icon className="text-primary-500 group-hover:text-white transition-colors" size={32} />
           </div>
           
           {/* Step number badge */}
           <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center border-4 border-white">
              {index + 1}
           </div>
        </div>
        
        <h3 className="text-xl font-extrabold text-slate-900 mb-3 px-4">{step.title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto opacity-80 group-hover:opacity-100 transition-opacity">
          {step.desc}
        </p>
      </motion.div>
    </div>
  );
};

const PatientGuidePage = () => {
  const { lang } = useLang();
  const t = translations[lang].guide;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Meta 
        title={t.metaTitle}
        description={t.metaDesc}
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">
        
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-slate-900">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full" />
          </div>
          
          <div className="container-custom relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full text-white/70 text-xs font-bold uppercase tracking-widest mb-10"
            >
              <ChevronRight size={14} className="text-primary-400" />
              {t.heroBadge}
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 max-w-2xl mx-auto font-medium"
            >
              {t.heroSubtitle}
            </motion.p>
          </div>
        </section>

        {/* Roadmap Grid */}
        <section className="py-24 md:py-32 bg-slate-50/50">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-12 relative">
               {t.steps.map((step, idx) => (
                 <StepCard key={idx} step={step} index={idx} total={t.steps.length} />
               ))}
            </div>
            
            {/* CTA Section */}
            <motion.div 
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="mt-32 p-12 md:p-16 rounded-[48px] bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden text-center shadow-2xl shadow-primary-500/30"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                  {lang === 'bn' ? 'যাত্রা শুরু করতে প্রস্তুত?' : 'Ready to start your journey?'}
                </h2>
                <p className="text-primary-100 mb-10 text-lg max-w-xl font-medium">
                  {lang === 'bn' ? 'আমাদের বিশেষজ্ঞ দল আপনার প্রতিটি পদক্ষেপে পাশে থাকবে।' : 'Our team of experts is ready to guide you at every single step of your medical travel.'}
                </p>
                <a href="/contact" className="bg-white text-primary-600 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                  {lang === 'bn' ? 'ফ্রি কনসালটেশন নিন' : 'Get Free Consultation'}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default PatientGuidePage;
