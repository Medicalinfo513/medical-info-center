import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';
import { 
  Home, 
  Info, 
  Stethoscope, 
  Phone, 
  LogIn, 
  UserPlus, 
  Calendar, 
  Lock, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

const SitemapPage = () => {
  const { lang } = useLang();
  const t = translations[lang]?.nav || translations['en'].nav;
  const isBn = lang === 'bn';

  const sections = [
    {
      title: isBn ? "মূল পেজ" : "Main Pages",
      links: [
        { name: t.home, to: "/", icon: <Home className="w-5 h-5" /> },
        { name: t.about, to: "/about", icon: <Info className="w-5 h-5" /> },
        { name: t.services, to: "/services", icon: <Stethoscope className="w-5 h-5" /> },
        { name: t.contact, to: "/contact", icon: <Phone className="w-5 h-5" /> },
      ]
    },
    {
      title: isBn ? "রোগী ও চিকিৎসা" : "Patient & Treatment",
      links: [
        { name: t.appointment, to: "/appointment", icon: <Calendar className="w-5 h-5" /> },
        { name: isBn ? "রোগী গাইড" : "Patient Guide", to: "/guide", icon: <BookOpen className="w-5 h-5" /> },
        { name: isBn ? "সাধারণ প্রশ্নাবলী" : "FAQ", to: "/faq", icon: <HelpCircle className="w-5 h-5" /> },
      ]
    },
    {
      title: isBn ? "অ্যাকাউন্ট" : "Account",
      links: [
        { name: t.login, to: "/login", icon: <LogIn className="w-5 h-5" /> },
        { name: t.signup, to: "/signup", icon: <UserPlus className="w-5 h-5" /> },
      ]
    },
    {
      title: isBn ? "আইনগত ও নীতি" : "Legal & Privacy",
      links: [
        { name: isBn ? "গোপনীয়তা নীতি" : "Privacy Policy", to: "/privacy", icon: <ShieldCheck className="w-5 h-5" /> },
        { name: isBn ? "সেবার শর্তাবলী" : "Terms of Service", to: "/terms", icon: <FileText className="w-5 h-5" /> },
        { name: t.sitemap, to: "/sitemap", icon: <Lock className="w-5 h-5" /> },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Meta 
        title={t.sitemapMetaTitle}
        description={t.sitemapMetaDesc}
      />
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold tracking-wide uppercase mb-4">
                {t.sitemap}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                {isBn ? "সম্পূর্ণ সাইটম্যাপ" : "Complete Site Directory"}
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {isBn 
                  ? "আমাদের ওয়েবসাইটের সমস্ত পেজ এবং সেবার একটি বিস্তারিত তালিকা এখানে খুঁজে পাবেন।" 
                  : "A comprehensive overview of all pages and services available on our platform."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sections.map((section, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
                    {section.title}
                  </h2>
                  <div className="grid gap-4">
                    {section.links.map((link, lIdx) => (
                      <Link 
                        key={lIdx} 
                        to={link.to}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-primary-50 border border-transparent hover:border-primary-100 group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary-500 shadow-sm transition-colors">
                            {link.icon}
                          </div>
                          <span className="font-semibold text-slate-700 group-hover:text-primary-700 transition-colors">
                            {link.name}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Info Card */}
            <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-primary-500/30 transition-colors"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    {isBn ? "সাহায্য প্রয়োজন?" : "Need Personalized Guidance?"}
                  </h3>
                  <p className="text-slate-400">
                    {isBn 
                      ? "আমাদের টিম প্রতিটি পদক্ষেপে আপনাকে সাহায্য করতে প্রস্তুত।" 
                      : "Our care coordinators are ready to help you navigate your journey."}
                  </p>
                </div>
                <Link to="/contact" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-black/20">
                  {isBn ? "যোগাযোগ করুন" : "Get in Touch"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SitemapPage;
