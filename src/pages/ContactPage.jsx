import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

const ContactPage = () => {
  const { lang } = useLang();
  const t = translations[lang].contact;
  const [settings, setSettings] = useState({
    address: t.labels.officeValue,
    phones: ['+91 92390 18979'],
    emails: ['raaj.2015@yahoo.com']
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await supabase.from('settings').select('*');
        if (data) {
          const phonesRaw = data.find(s => s.key === 'contact_phones')?.value;
          const emailsRaw = data.find(s => s.key === 'contact_emails')?.value;
          setSettings({
            address: data.find(s => s.key === 'contact_address')?.value || t.labels.officeValue,
            phones: phonesRaw ? JSON.parse(phonesRaw) : ['+91 92390 18979'],
            emails: emailsRaw ? JSON.parse(emailsRaw) : ['raaj.2015@yahoo.com']
          });
        }
      } catch (err) {
        console.error('Error fetching contact info:', err);
      }
    };
    fetchSettings();
  }, [t.labels.officeValue]);

  const contactItems = [
    {
      icon: <Phone className="w-8 h-8 text-primary-500" />,
      label: t.labels.phone,
      values: settings.phones.map(p => ({ label: p, href: `tel:${p.replace(/\s+/g, '')}` })),
    },
    {
      icon: <Mail className="w-8 h-8 text-primary-500" />,
      label: t.labels.email,
      values: settings.emails.map(e => ({ label: e, href: `mailto:${e}` })),
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-500" />,
      label: t.labels.office,
      values: [{ label: settings.address, href: null }],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Meta 
        title={t.metaTitle}
        description={t.metaDesc}
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">

        {/* Hero Section */}
        <section className="relative py-32 md:py-48 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-x-0 top-0 bottom-0">
            <img 
              src="/images/contact_hero_bg.png" 
              alt="" 
              role="presentation"
              width="1920"
              height="600"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/80 via-secondary-900/60 to-secondary-900/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/40 via-transparent to-secondary-900/40" />
          </div>
          <div className="container-custom relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-primary-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 px-4 py-1.5 border border-primary-500/20 rounded-full inline-block bg-primary-500/5 backdrop-blur-sm"
            >
              {t.heroBadge}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white leading-tight mb-8"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium"
            >
              {t.heroSubtitle}
            </motion.p>
          </div>
        </section>


        {/* Contact Content - Centered Layout */}
        <section className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          
          <div className="container-custom relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16 md:mb-24">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="text-3xl md:text-5xl font-black text-secondary-900 mb-6"
                >
                  {t.infoTitle}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                  className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
                >
                  {t.infoDesc}
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                {contactItems.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-full -mr-12 -mt-12 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-primary-500 transition-colors duration-500 group-hover:scale-110 shadow-sm border border-slate-100 group-hover:border-primary-400 group-hover:text-white relative z-10">
                      <div className="group-hover:text-white text-primary-500 transition-colors duration-500">
                        {item.icon}
                      </div>
                    </div>
                    
                    <h3 className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4 relative z-10">{item.label}</h3>
                    
                    <div className="space-y-2 relative z-10">
                      {item.values.map((v, idx) => (
                        v.href ? (
                          <a key={idx} href={v.href} className="block text-xl font-bold text-secondary-900 hover:text-primary-600 transition-colors">
                            {v.label}
                          </a>
                        ) : (
                          <p key={idx} className="text-xl font-bold text-secondary-900 leading-tight whitespace-pre-line max-w-[200px]">
                            {v.label}
                          </p>
                        )
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Support Statement */}
              <motion.div 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                className="mt-20 text-center p-8 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-slate-200/50 inline-block w-full"
              >
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   {lang === 'en' ? 'Available 24/7 for Medical Assistance' : 'চিকিৎসা সহায়তার জন্য ২৪/৭ উপলব্ধ'}
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

export default ContactPage;

