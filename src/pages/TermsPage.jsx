import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, AlertCircle, Scale, Ban } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';

const TermsPage = () => {
  const { lang } = useLang();
  const t = translations[lang].terms;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Meta 
        title={t.heroTitle}
        description="Review the Terms of Service for Medical Information Center. Understanding our role as your medical facilitation partner."
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">
        
        {/* Header Section */}
        <section className="bg-white border-b border-slate-100 py-20 pb-16">
          <div className="container-custom">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-8"
            >
              <FileText size={32} className="text-orange-500" />
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
            <div className="max-w-4xl mx-auto lg:mx-0">
              <div className="grid grid-cols-1 gap-12">
                {t.sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row gap-8 items-start bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                       {idx === 0 && <AlertCircle className="text-orange-500" size={24} />}
                       {idx === 1 && <Scale className="text-orange-500" size={24} />}
                       {idx === 2 && <Ban className="text-orange-500" size={24} />}
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

              {/* Disclaimer */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="mt-20 p-10 rounded-[32px] bg-slate-900 text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <AlertCircle size={100} />
                </div>
                <h3 className="text-xl font-black mb-4">
                  {lang === 'bn' ? 'গুরুত্বপূর্ণ সতর্কতা' : 'Important Note'}
                </h3>
                <p className="text-slate-400 font-medium leading-relaxed">
                  {lang === 'bn' 
                    ? 'আমাদের পরিষেবা গ্রহণ করার মাধ্যমে আপনি স্বীকার করছেন যে আপনি এই শর্তাবলীতে সম্মত। আমরা চিকিৎসা সংক্রান্ত কোনো গ্যারান্টি বা ওয়ারেন্টি প্রদান করি না।' 
                    : 'By using our services, you acknowledge that you have read and agreed to these terms. We do not provide architectural or engineering guarantees on medical outcomes.'}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
