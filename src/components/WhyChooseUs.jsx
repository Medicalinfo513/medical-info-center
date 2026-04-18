import React from 'react';
import { motion } from 'framer-motion';
import { Network, Truck, Wallet, Headphones, CheckCircle2, Building2, Globe, CreditCard, HeartHandshake } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';

const WhyChooseUs = () => {
  const { lang } = useLang();
  const t = translations[lang].whyChooseUs;

  const features = [
    {
      id: '01',
      title: t.features[0].title,
      description: t.features[0].description,
      image: "/images/medical_network-bht82yu3.png",
      icon: <Network className="text-primary-500 w-5 h-5" />,
      floatingIcon: <Building2 className="text-primary-500 w-5 h-5" />,
      floatingLabel: t.features[0].floatingLabel,
      floatingSub: t.features[0].floatingSub,
      badge: lang === 'en' ? "FEATURE 01" : "বৈশিষ্ট্য ০১",
      bullets: t.features[0].bullets,
    },
    {
      id: '02',
      title: t.features[1].title,
      description: t.features[1].description,
      image: "/images/logistics-dgslmfug.png",
      icon: <Truck className="text-primary-500 w-5 h-5" />,
      floatingIcon: <Globe className="text-primary-500 w-5 h-5" />,
      floatingLabel: t.features[1].floatingLabel,
      floatingSub: t.features[1].floatingSub,
      badge: lang === 'en' ? "FEATURE 02" : "বৈশিষ্ট্য ০২",
      bullets: t.features[1].bullets,
      reversed: true,
    },
    {
      id: '03',
      title: t.features[2].title,
      description: t.features[2].description,
      image: "/images/pricing-5ail3ii7.png",
      icon: <Wallet className="text-primary-500 w-5 h-5" />,
      floatingIcon: <CreditCard className="text-primary-500 w-5 h-5" />,
      floatingLabel: t.features[2].floatingLabel,
      floatingSub: t.features[2].floatingSub,
      badge: lang === 'en' ? "FEATURE 03" : "বৈশিষ্ট্য ০৩",
      bullets: t.features[2].bullets,
    },
    {
      id: '04',
      title: t.features[3].title,
      description: t.features[3].description,
      image: "/images/support-d_f-yx2m.png",
      icon: <Headphones className="text-primary-500 w-5 h-5" />,
      floatingIcon: <HeartHandshake className="text-primary-500 w-5 h-5" />,
      floatingLabel: t.features[3].floatingLabel,
      floatingSub: t.features[3].floatingSub,
      badge: lang === 'en' ? "FEATURE 04" : "বৈশিষ্ট্য ০৪",
      bullets: t.features[3].bullets,
      reversed: true,
    },
  ];

  return (
    <section id="network" className="section-padding bg-white overflow-hidden">
      <div className="container-custom">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-600 font-bold uppercase tracking-[0.2em] text-xs mb-4"
          >
            {t.sectionBadge}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-secondary-900 mb-5"
          >
            {t.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            {t.sectionSubtitle}
          </motion.p>
        </div>

        {/* Feature Rows */}
        <div className="flex flex-col mt-10">
          {features.map((feature, index) => (
            <FeatureRow key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureRow = ({ feature, index }) => {
  const isEven = index % 2 !== 0; // even index = right-aligned on mobile (0-based: 1,3 → right)

  return (
    <div className={`flex flex-col ${feature.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-14 lg:gap-20 mb-28 last:mb-0`}>

      {/* Image Side */}
      <motion.div
        initial={{ opacity: 0, x: feature.reversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 relative group"
      >
        {/* Image with zoom on hover */}
        <div className="overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            src={feature.image}
            alt={feature.title}
            width="800"
            height="500"
            loading="lazy"
            decoding="async"
            className="w-full h-[340px] md:h-[440px] object-cover
                       transition-transform duration-700 ease-in-out
                       group-hover:scale-110"
          />
        </div>

        {/* Floating Card — lifts up on hover */}
        <div className="absolute bottom-5 right-5 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 min-w-[180px]
                        transition-transform duration-500 ease-in-out group-hover:-translate-y-2 group-hover:shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
            {feature.floatingIcon}
          </div>
          <div>
            <p className="text-sm font-bold text-secondary-900 leading-tight">{feature.floatingLabel}</p>
            <p className="text-xs text-slate-400">{feature.floatingSub}</p>
          </div>
        </div>
      </motion.div>

      {/* Text Side */}
      <motion.div
        initial={{ opacity: 0, x: feature.reversed ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`w-full lg:w-1/2 ${isEven ? 'text-right items-end' : 'text-left items-start'} flex flex-col lg:text-left lg:items-start`}
      >
        {/* Badge */}
        <div className={`flex items-center gap-2 mb-5 ${isEven ? 'flex-row-reverse lg:flex-row' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
            {feature.icon}
          </div>
          <span className="text-primary-600 font-bold tracking-widest text-xs uppercase">{feature.badge}</span>
        </div>

        <h3 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-5 leading-tight">
          {feature.title}
        </h3>

        <p className="text-slate-500 leading-relaxed mb-8 text-[15px]">
          {feature.description}
        </p>

        {/* Checkmark bullets */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 w-full`}>
          {feature.bullets.map((bullet) => (
            <div key={bullet} className={`flex items-center gap-2.5 text-secondary-800 font-medium text-sm ${isEven ? 'flex-row-reverse lg:flex-row' : ''}`}>
              <CheckCircle2 className="text-primary-500 w-5 h-5 flex-shrink-0" />
              {bullet}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WhyChooseUs;

