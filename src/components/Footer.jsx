import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const CTA = () => {
  const { lang } = useLang();
  const t = translations[lang].footer;
  const [phone, setPhone] = useState('+91 92390 18979');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await supabase.from('settings').select('*').eq('key', 'contact_phones').single();
        if (data?.value) {
          const phones = JSON.parse(data.value);
          if (phones.length > 0) setPhone(phones[0]);
        }
      } catch (err) {
        console.error('Error fetching CTA contact:', err);
      }
    };
    fetchContact();
  }, []);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden mx-4 md:mx-0">
      <div className="container-custom">
        <div className="relative z-10 bg-secondary-900 rounded-[3rem] overflow-hidden shadow-2xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-x-0 top-0 bottom-0 opacity-40">
            <img 
              src="/images/cta-bg.jpg" 
              alt="" 
              role="presentation"
              loading="lazy"
              width="1920"
              height="600"
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-900 via-secondary-900/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 px-8 py-16 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                {t.ctaTitle}
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                {t.ctaSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                <Link to="/contact" className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/30 transition-all flex items-center justify-center gap-3 group">
                  {t.ctaBtn}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-slate-400">{lang === 'en' ? 'Call anytime' : 'যেকোনো সময় কল করুন'}</p>
                    <p className="text-lg font-bold">{phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  const { lang } = useLang();
  const tNav = translations[lang].nav;
  const isBn = lang === 'bn';

  const quickLinks = [
    { label: tNav.home, to: '/' },
    { label: tNav.services, to: '/services' },
    { label: tNav.about, to: '/about' },
    { label: tNav.contact, to: '/contact' }
  ];

  const supportLinks = [
    { label: isBn ? 'সাধারণ প্রশ্নাবলী' : 'FAQ', to: '/faq' },
    { label: isBn ? 'সেবার শর্তাবলী' : 'Terms of Service', to: '/terms' },
    { label: isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy', to: '/privacy' },
    { label: isBn ? 'রোগী গাইড' : 'Patient Guide', to: '/guide' },
    { label: tNav.sitemap, to: '/sitemap' }
  ];

  const [settings, setSettings] = useState({
    socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' },
    address: 'Bagbazar Road, Kolkata, WB, 700003 India',
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
            socials: {
              facebook: data.find(s => s.key === 'social_facebook')?.value || '#',
              twitter: data.find(s => s.key === 'social_twitter')?.value || '#',
              instagram: data.find(s => s.key === 'social_instagram')?.value || '#',
              linkedin: data.find(s => s.key === 'social_linkedin')?.value || '#'
            },
            address: data.find(s => s.key === 'contact_address')?.value || 'Bagbazar Road, Kolkata, WB, 700003 India',
            phones: phonesRaw ? JSON.parse(phonesRaw) : ['+91 92390 18979'],
            emails: emailsRaw ? JSON.parse(emailsRaw) : ['raaj.2015@yahoo.com']
          });
        }
      } catch (err) {
        console.error('Error fetching footer mapping details:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer id="contact" className="bg-white pt-16 pb-8 border-t border-slate-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Column 1: Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <img 
                src="/images/logo-mic.png" 
                alt="MIC Logo" 
                width="40"
                height="40"
                className="h-10 w-10 object-contain" 
              />
              <span className="text-[18px] font-bold text-secondary-900">
                Medical Info<span className="text-primary-500">Center</span>
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm">
              {isBn
                ? 'চিকিৎসা যাত্রার জটিলতা সহজ করা। ভারতে বিশ্বমানের চিকিৎসার জন্য আপনার বিশ্বস্ত অংশীদার।'
                : 'Simplifying the complexities of medical travel. Your trusted partner for world-class healthcare in India.'}
            </p>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, href: settings.socials.facebook, label: 'Facebook' },
                  { icon: Twitter, href: settings.socials.twitter, label: 'Twitter' },
                  { icon: Instagram, href: settings.socials.instagram, label: 'Instagram' },
                  { icon: Linkedin, href: settings.socials.linkedin, label: 'LinkedIn' }
                ].map((social, idx) => (
                  <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-primary-500 hover:text-white transition-all duration-300">
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-secondary-900 mb-5 uppercase tracking-wider">
              {isBn ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-500 hover:text-primary-600 transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-sm font-bold text-secondary-900 mb-5 uppercase tracking-wider">
              {isBn ? 'সহায়তা' : 'Support'}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-slate-500 hover:text-primary-600 transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-sm font-bold text-secondary-900 mb-5 uppercase tracking-wider">
              {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
            </h4>
              <ul className="space-y-4">
                <li className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all">
                    <MapPin size={18} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {settings.address}
                  </p>
                </li>
                {settings.phones.map((p, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <Phone size={18} />
                    </div>
                    <a href={`tel:${p.replace(/\s+/g, '')}`} className="text-sm text-slate-400 hover:text-primary-400 font-medium transition-colors">{p}</a>
                  </li>
                ))}
                {settings.emails.map((e, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-primary-400 shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-all">
                      <Mail size={18} />
                    </div>
                    <a href={`mailto:${e}`} className="text-sm text-slate-400 hover:text-primary-400 font-medium transition-colors">{e}</a>
                  </li>
                ))}
              </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            {isBn ? '© ২০২৬ মেডিকেল ইনফর্মেশন সেন্টার। সর্বস্বত্ব সংরক্ষিত।' : '© 2026 Medical Information Center. All rights reserved.'}
          </p>
          <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
            {isBn ? 'বিশ্বাস ও শ্রেষ্ঠত্বের জন্য নির্মিত' : 'Designed for Trust & Excellence'}
          </p>
        </div>
      </div>
    </footer>
  );
};


