import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Lock, EyeOff, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';

const PrivacyPage = () => {
  const { lang } = useLang();
  const t = translations[lang].privacy;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Meta 
        title={t.heroTitle}
        description="Read the Privacy Policy of Medical Information Center. We treat your medical data with the highest level of confidentiality."
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">
        
        {/* Header Section */}
        <section className="bg-white border-b border-slate-100 py-20 pb-16">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-8"
            >
              <Shield size={32} className="text-primary-500" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-500 font-medium mb-10 max-w-2xl"
            >
              {t.heroSubtitle}
            </motion.p>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
               <Clock size={14} />
               {t.lastUpdated}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20 md:py-28">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 gap-12">
                {t.sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col md:flex-row gap-8 items-start bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center shrink-0">
                       {idx === 0 && <Lock className="text-primary-500" size={24} />}
                       {idx === 1 && <EyeOff className="text-primary-500" size={24} />}
                       {idx === 2 && <Shield className="text-primary-500" size={24} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-4">{section.title}</h2>
                      <p className="text-slate-500 leading-relaxed text-[17px]">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="mt-20 p-8 rounded-[32px] bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-emerald-900 font-black text-lg mb-1">
                    {lang === 'bn' ? 'আমরা আপনার তথ্যের গোপনীয়তাকে সম্মান করি' : 'We respect your data privacy'}
                  </h3>
                  <p className="text-emerald-700 font-medium text-sm">
                    {lang === 'bn' ? 'আপনার ব্যক্তিগত বা মেডিকেল তথ্য কখনোই কোনো থার্ড পার্টির কাছে বিক্রি করা হয় না।' : 'Your personal or medical information is never sold to third parties for marketing purposes.'}
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
