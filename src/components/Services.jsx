import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, Plane, Hospital, HeartPulse, ShieldCheck, Languages, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';

export default function Services() {
  const { lang } = useLang();
  const t = translations[lang].services;

  const icons = [
    <FileText size={32} className="text-primary-500" />,
    <Plane size={32} className="text-primary-500" />,
    <Hospital size={32} className="text-primary-500" />,
    <HeartPulse size={32} className="text-primary-500" />,
    <ShieldCheck size={32} className="text-primary-500" />,
    <Languages size={32} className="text-primary-500" />,
  ];

  const images = [
    "/images/service_visa_assist.png",
    "/images/service_travel_acc.png",
    "/images/service_hospital_referral.png",
    "/images/service_post_treat.png",
    "/images/about_us_hero.png",
    "/images/service_language.png",
  ];

  const services = t.list.map((s, i) => ({
    ...s,
    icon: icons[i],
    image: images[i],
  }));

  const TOTAL = services.length;
  const AUTO_MS = 3200;

  const [active, setActive] = useState(0);
  const timer = useRef(null);
  const touchStartX = useRef(null);

  const resetTimer = useCallback((newActive) => {
    clearInterval(timer.current);
    timer.current = setInterval(() => setActive((p) => (p + 1) % TOTAL), AUTO_MS);
    if (newActive !== undefined) setActive(newActive);
  }, [TOTAL]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timer.current);
  }, [resetTimer]);

  const prev = () => resetTimer((active - 1 + TOTAL) % TOTAL);
  const next = () => resetTimer((active + 1) % TOTAL);

  const getOffset = (i) => {
    let d = i - active;
    if (d > TOTAL / 2) d -= TOTAL;
    if (d < -TOTAL / 2) d += TOTAL;
    return d;
  };

  return (
    <section id="services" className="section-padding bg-slate-50 overflow-hidden">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6 text-center md:text-left">
          <div>
            <p className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.sectionBadge}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-secondary-900 leading-tight">
              {t.sectionTitle1}<br className="hidden md:block" /> {t.sectionTitle2}
            </h2>
          </div>
          {/* Arrows — desktop only */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-primary-500 hover:text-primary-500 transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next}
              className="w-11 h-11 rounded-full bg-primary-500 border-2 border-primary-500 flex items-center justify-center text-white hover:bg-primary-600 transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel Track — swipe on mobile */}
        <div
          className="relative flex items-center justify-center"
          style={{ height: 480 }}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (diff > 40) next();
            else if (diff < -40) prev();
            touchStartX.current = null;
          }}
        >
          {services.map((service, i) => {
            const offset = getOffset(i);
            const isCenter = offset === 0;
            const isVisible = offset >= -1 && offset <= 1;

            const translateX = offset * 105;
            const scale = isCenter ? 1 : 0.78;
            const opacity = isCenter ? 1 : 0.45;
            const blur = isCenter ? 0 : 5;
            const zIndex = isCenter ? 20 : 10;

            return (
              <div
                key={i}
                onClick={() => !isCenter && resetTimer(i)}
                style={{
                  position: 'absolute',
                  width: '100%',
                  maxWidth: 360,
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  opacity: isVisible ? opacity : 0,
                  filter: `blur(${blur}px)`,
                  zIndex: isVisible ? zIndex : 0,
                  pointerEvents: isVisible ? 'auto' : 'none',
                  transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease, filter 0.55s ease',
                  cursor: isCenter ? 'default' : 'pointer',
                }}
              >
                <div
                  className="bg-white rounded-3xl overflow-hidden flex flex-col h-full"
                  style={{
                    boxShadow: isCenter
                      ? '0 25px 50px -12px rgba(14,165,233,0.18), 0 8px 32px rgba(0,0,0,0.12)'
                      : '0 4px 16px rgba(0,0,0,0.06)',
                    height: 440,
                    border: isCenter ? '1.5px solid rgba(14,165,233,0.18)' : '1px solid #f1f5f9',
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ height: 220, flexShrink: 0 }}>
                    <img
                      src={service.image}
                      alt={service.title}
                      width="360"
                      height="220"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      style={{
                        transition: 'transform 0.6s ease',
                        transform: isCenter ? 'scale(1.04)' : 'scale(1)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />

                    {/* Icon */}
                    <div className="absolute bottom-4 left-5">
                      <div className="p-3 bg-white rounded-2xl shadow-lg"
                        style={{ transition: 'transform 0.4s ease', transform: isCenter ? 'translateY(0)' : 'translateY(8px)' }}>
                        {service.icon}
                      </div>
                    </div>

                    {/* Active badge */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 bg-primary-500 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                        {t.featuredBadge}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6 pt-7">
                    <h3 className="font-bold text-secondary-900 mb-3 text-lg leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed flex-grow"
                      style={{ opacity: isCenter ? 1 : 0, transition: 'opacity 0.3s ease' }}>
                      {service.description}
                    </p>
                    {isCenter && (
                      <Link to="/services"
                        className="mt-5 text-primary-600 font-bold flex items-center gap-2 hover:gap-5 transition-all text-sm w-fit">
                        {t.learnMore}
                        <span className="inline-block w-6 h-px bg-primary-500 transition-all" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {services.map((_, i) => (
            <button key={i} onClick={() => resetTimer(i)}
              style={{ transition: 'width 0.3s ease, background 0.3s ease' }}
              className={`h-2 rounded-full ${active === i ? 'w-7 bg-primary-500' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 text-center md:hidden">
          <Link to="/services" className="inline-block w-full bg-primary-500 text-white py-4 rounded-xl font-bold">
            {t.viewAll}
          </Link>
        </div>

      </div>
    </section>
  );
}

