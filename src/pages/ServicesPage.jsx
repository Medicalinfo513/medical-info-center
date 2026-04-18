import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hospital, FileText, Plane, Languages, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import Meta from '../components/Meta';

const content = {
  en: {
    metaTitle: "Medical Services in India | Hospital Referrals & Visa Assistance",
    metaDesc: "Explore our complete medical assistance ecosystem: hospital & doctor referrals, medical visa guidance, travel logistics, and dedicated patient coordinators in India.",
    badge: "Our Core Services",
    title: "Comprehensive Care Beyond Borders",
    subtitle: "We provide a holistic ecosystem for international and domestic patients seeking specialized medical treatment.",
    services: [
      {
        title: "Hospital & Doctor Referrals",
        desc: "We match your specific medical needs with the right experts in oncology, cardiology, orthopedics, and more.",
        bullets: ["Top Oncology Specialists", "Cardiology Centers", "Orthopedic Experts"],
        image: "/images/service_hospital_referral.png",
        icon: <Hospital className="w-5 h-5 text-primary-500" />,
        badge: "SERVICE 01",
      },
      {
        title: "Medical Visa Assistance",
        desc: "Hassle-free documentation and guidance for your entry into India.",
        bullets: ["Invitation Letters", "Government Liaison", "Priority Processing"],
        image: "/images/service_visa_assist.png",
        icon: <FileText className="w-5 h-5 text-primary-500" />,
        badge: "SERVICE 02",
        reversed: true,
      },
      {
        title: "Travel & Accommodation",
        desc: "Tailored booking of flights and stays (from budget-friendly to luxury) near your chosen medical facility.",
        bullets: ["Flight Bookings", "Airport Transfers", "Hospital Proximity Stays"],
        image: "/images/service_travel_acc.png",
        icon: <Plane className="w-5 h-5 text-primary-500" />,
        badge: "SERVICE 03",
      },
      {
        title: "Language Interpretation",
        desc: "Removing communication barriers with dedicated translators.",
        bullets: ["Multi-language Support", "Medical Translation", "Live Interpretation"],
        image: "/images/service_language.png",
        icon: <Languages className="w-5 h-5 text-primary-500" />,
        badge: "SERVICE 04",
        reversed: true,
      },
      {
        title: "Post-Treatment Follow-up",
        desc: "Coordinating with your doctors for recovery updates once you return home.",
        bullets: ["Medication Reminders", "Follow-up Consultations", "Recovery Monitoring"],
        image: "/images/service_post_treat.png",
        icon: <HeartPulse className="w-5 h-5 text-primary-500" />,
        badge: "SERVICE 05",
      },
    ],
  },
  bn: {
    metaTitle: "ভারতে চিকিৎসা সেবাসমূহ | হাসপাতাল রেফারেল এবং ভিসা সহায়তা",
    metaDesc: "আমাদের সম্পূর্ণ চিকিৎসা সহায়তা পদ্ধতি সম্পর্কে জানুন: হাসপাতাল ও ডাক্তার রেফারেল, মেডিকেল ভিসা নির্দেশনা এবং রোগীদের জন্য ডেডিকেটেড সহায়তা।",
    badge: "আমাদের প্রধান সেবা",
    title: "সীমানা ছাড়িয়ে সেবার হাত",
    subtitle: "আমরা শুধুমাত্র ডাক্তার দেখানোর মাধ্যম নই, বরং আপনার সম্পূর্ণ চিকিৎসা যাত্রার একটি সহযোগী ইকোসিস্টেম।",
    services: [
      {
        title: "হাসপাতাল ও ডাক্তার রেফারেল",
        desc: "আপনার রোগের ধরণ অনুযায়ী কার্ডিওলজি, অঙ্কোলজি বা অর্থোপেডিকসের সেরা বিশেষজ্ঞ খুঁজে দেওয়া।",
        bullets: ["শীর্ষ অঙ্কোলজি বিশেষজ্ঞ", "কার্ডিওলজি কেন্দ্র", "অর্থোপেডিক বিশেষজ্ঞ"],
        image: "/images/service_hospital_referral.png",
        icon: <Hospital className="w-5 h-5 text-primary-500" />,
        badge: "সেবা ০১",
      },
      {
        title: "মেডিকেল ভিসা সহায়তা",
        desc: "প্রয়োজনীয় কাগজপত্র তৈরি এবং দ্রুত ভিসা পাওয়ার ক্ষেত্রে সঠিক নির্দেশনা।",
        bullets: ["আমন্ত্রণপত্র প্রস্তুতি", "সরকারি সংযোগ", "অগ্রাধিকার প্রক্রিয়াকরণ"],
        image: "/images/service_visa_assist.png",
        icon: <FileText className="w-5 h-5 text-primary-500" />,
        badge: "সেবা ০২",
        reversed: true,
      },
      {
        title: "থাকা ও খাওয়ার সুব্যবস্থা",
        desc: "হাসপাতালের কাছেই আপনার বাজেট অনুযায়ী (বাজেট থেকে লাক্সারি) থাকার সুব্যবস্থা।",
        bullets: ["ফ্লাইট বুকিং", "বিমানবন্দর স্থানান্তর", "হাসপাতালের নিকটবর্তী আবাসন"],
        image: "/images/service_travel_acc.png",
        icon: <Plane className="w-5 h-5 text-primary-500" />,
        badge: "সেবা ০৩",
      },
      {
        title: "ভাষাগত সহায়তা",
        desc: "যোগাযোগের সমস্যা দূর করতে আমাদের দক্ষ দোভাষী বা ইন্টারপ্রেটার সার্ভিস।",
        bullets: ["বহু-ভাষা সমর্থন", "চিকিৎসা অনুবাদ", "লাইভ ইন্টারপ্রিটেশন"],
        image: "/images/service_language.png",
        icon: <Languages className="w-5 h-5 text-primary-500" />,
        badge: "সেবা ০৪",
        reversed: true,
      },
      {
        title: "ফলো-আপ সেবা",
        desc: "চিকিৎসা শেষে বাড়ি ফেরার পরেও ডাক্তারের সাথে নিয়মিত যোগাযোগ বজায় রাখা।",
        bullets: ["ওষুধের রিমাইন্ডার", "ফলো-আপ পরামর্শ", "সুস্থতার পর্যবেক্ষণ"],
        image: "/images/service_post_treat.png",
        icon: <HeartPulse className="w-5 h-5 text-primary-500" />,
        badge: "সেবা ০৫",
      },
    ],
  },
};

const ServiceRow = ({ service }) => (
  <div className={`flex flex-col ${service.reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-14 lg:gap-20 mb-28 last:mb-0`}>
    {/* Image */}
    <motion.div
      initial={{ opacity: 0, x: service.reversed ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full lg:w-1/2 group"
    >
      <div className="overflow-hidden rounded-[2rem] shadow-2xl">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-[320px] md:h-[420px] object-cover
                     transition-transform duration-700 ease-in-out
                     group-hover:scale-110"
        />
      </div>
    </motion.div>

    {/* Text */}
    <motion.div
      initial={{ opacity: 0, x: service.reversed ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full lg:w-1/2"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
          {service.icon}
        </div>
        <span className="text-primary-600 font-bold tracking-widest text-xs uppercase">{service.badge}</span>
      </div>
      <h2 className="text-3xl md:text-4xl font-extrabold text-secondary-900 mb-5 leading-tight">
        {service.title}
      </h2>
      <p className="text-slate-500 leading-relaxed mb-8 text-[15px]">
        {service.desc}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {service.bullets.map((b) => (
          <div key={b} className="flex items-center gap-2.5 text-secondary-800 font-medium text-sm">
            <CheckCircle2 className="text-green-500 w-5 h-5 flex-shrink-0" />
            {b}
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const ServicesPage = () => {
  const { lang } = useLang();
  const c = content[lang];

  return (
    <div className="flex flex-col min-h-screen">
      <Meta 
        title={c.metaTitle}
        description={c.metaDesc}
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">

        {/* Hero */}
        <section className="relative py-28 md:py-40 overflow-hidden">
          {/* Background image */}
          <div className="absolute inset-x-0 top-0 bottom-0">
            <img 
              src="/images/services-hero-v2.png" 
              alt="" 
              role="presentation"
              width="1920"
              height="600"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover" 
            />
            {/* Strong black overlay for text readability */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
          </div>
          <div className="container-custom relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 border border-white/30 rounded-full px-5 py-2 text-white/80 text-xs font-bold uppercase tracking-widest mb-10 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {c.badge}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
            >
              {c.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-xl mx-auto"
            >
              {c.subtitle}
            </motion.p>
          </div>
        </section>

        {/* Services Rows */}
        <section className="section-padding bg-white">
          <div className="container-custom">
            {c.services.map((service, i) => (
              <ServiceRow key={i} service={service} />
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
