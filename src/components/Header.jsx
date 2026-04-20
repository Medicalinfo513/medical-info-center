import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MessageSquare, Globe, ChevronDown, Menu, X, CalendarClock, LogOut, User, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const t = translations[lang].nav;
  const langRef = useRef(null);
  const [phone, setPhone] = useState('+91 92390 18979');

  // Auth state listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Click-outside for dropdowns
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const { data } = await supabase.from('settings').select('*').eq('key', 'contact_phones').single();
        if (data?.value) {
          const phones = JSON.parse(data.value);
          if (phones.length > 0) setPhone(phones[0]);
        }
      } catch (err) {
        console.error('Error fetching dynamic contact:', err);
      }
    };
    fetchContact();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: t.home, to: '/' },
    { name: t.services, to: '/services' },
    { name: t.about, to: '/about' },
    { name: t.contact, to: '/contact' },
  ];

  return (
    <header className="fixed w-full z-50 transition-all duration-300 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#1e293b] text-white h-[34px] md:h-[32px] px-2 sm:px-4 flex items-center">
        <div className="container-custom flex justify-between items-center text-[13px] sm:text-[14px] font-medium w-full leading-none">
          <div className="flex items-center gap-2.5 sm:gap-6">
            <a href={`tel:${phone.replace(/\s+/g, '')}`}
              aria-label="Call Medical Information Center"
              className="flex items-center gap-1 hover:text-primary-400 transition-colors shrink-0">
              <Phone className="text-primary-400 w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span>{phone}</span>
            </a>
            <Link to="/contact"
              aria-label="Go to contact page"
              className="flex items-center gap-1 hover:text-primary-400 transition-colors shrink-0">
              <MessageSquare className="text-primary-400 w-2.5 h-2.5 sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">{t.contact}</span>
            </Link>
          </div>
          <div ref={langRef} className="relative flex items-center gap-1 cursor-pointer hover:text-primary-400 transition-colors shrink-0" onClick={() => setLangDropdown(!langDropdown)}>
            <Globe className="text-primary-400 w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>{lang === 'en' ? 'English' : 'বাংলা'}</span>
            <ChevronDown className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
            {langDropdown && (
              <div className="absolute top-full right-0 mt-2 bg-white text-slate-700 rounded-xl shadow-xl overflow-hidden min-w-[120px] z-50 border border-slate-100">
                <button onClick={() => { setLang('en'); setLangDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 transition-colors ${lang === 'en' ? 'text-primary-600 bg-primary-50' : ''}`}>
                  English
                </button>
                <button onClick={() => { setLang('bn'); setLangDropdown(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-primary-50 hover:text-primary-600 transition-colors ${lang === 'bn' ? 'text-primary-600 bg-primary-50' : ''}`}>
                  বাংলা
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`bg-white transition-all duration-300 border-b border-slate-100 flex items-center w-full ${isScrolled ? 'h-[64px] shadow-md' : 'h-[63px]'}`}>
        <div className="container-custom flex justify-between items-center w-full">
          {/* Logo */}
          <Link to="/" aria-label="Medical Information Center Home" className="flex items-center gap-2 group cursor-pointer">
            <img 
              src="/images/logo-mic.png" 
              alt="Medical Info Center Logo"
              width="40"
              height="40"
              className={`transition-all duration-300 w-auto ${isScrolled ? 'h-9' : 'h-10'}`} 
            />
            <span className="text-[1.35rem] font-bold text-slate-900">
              Medical Info<span className="text-primary-500">Center</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to}
                className={`text-[16px] font-medium transition-colors ${location.pathname === link.to ? 'text-primary-600' : 'text-slate-500 hover:text-secondary-900'}`}>
                {link.name}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-2">
              {user ? (
                <>
                  <Link to="/appointment"
                    className="flex items-center gap-2 bg-[#1e293b] hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-[15px] transition-all shadow-md h-[42px]">
                    <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor">
                      <rect x="1" y="1" width="6" height="6" rx="1.2" />
                      <rect x="9" y="1" width="6" height="6" rx="1.2" />
                      <rect x="1" y="9" width="6" height="6" rx="1.2" />
                      <rect x="9" y="9" width="6" height="6" rx="1.2" />
                    </svg>
                    {t.appointment}
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/appointment" className="bg-[#1e293b] hover:bg-black text-white px-6 py-2 rounded-full font-bold text-[16px] transition-all shadow-md h-[42px] flex items-center justify-center">
                    {t.appointment}
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden text-secondary-900 p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-white transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <img src="/images/logo-mic.png" alt="Logo" className="h-9" />
              <span className="text-xl font-bold text-slate-900">Medical Info<span className="text-primary-500">Center</span></span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-secondary-900">
              <X size={28} />
            </button>
          </div>

          <div className="flex flex-col gap-6 items-center text-center">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                className={`text-2xl font-bold transition-colors ${location.pathname === link.to ? 'text-primary-600' : 'text-secondary-900 hover:text-primary-600'}`}>
                {link.name}
              </Link>
            ))}

            {user ? (
              <>
                <Link to="/appointment" onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 w-full bg-primary-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary-500/20 text-center flex items-center justify-center gap-2">
                  <CalendarClock size={20} />
                  {t.appointment}
                </Link>
                {user?.email === 'raaj.2015@yahoo.com' && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 text-center flex items-center justify-center gap-2">
                    <LayoutDashboard size={20} />
                    {lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Go to Admin Panel'}
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/appointment" onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-4 w-full bg-[#1e293b] text-white py-4 rounded-xl font-bold text-lg text-center flex items-center justify-center gap-2">
                  <CalendarClock size={20} />
                  {t.appointment}
                </Link>
              </>
            )}
          </div>

          <div className="mt-auto pt-10 border-t text-center text-slate-500">
            <div className="flex justify-center gap-8 mb-4">
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors">
                <Phone className="text-primary-500" size={20} />
              </Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}
                className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center hover:bg-primary-100 transition-colors">
                <Mail className="text-primary-500" size={20} />
              </Link>
            </div>
            <p className="text-sm">World Class Medical Assistance</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

