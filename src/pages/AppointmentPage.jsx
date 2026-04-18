import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarPlus, History, Settings, Search, MapPin, ArrowRight,
  Clock, ChevronRight, ChevronLeft, ChevronDown, Phone, Globe, Shield, FileText, Pencil,
  Building2, Stethoscope, UserCheck, ClipboardList, CreditCard,
  CheckCircle2, Star, Pill, HeartPulse, LogOut, User,
  UserCircle2, LayoutDashboard, Heart, Brain, Bone, Activity, Baby, Eye, Users,
  Sparkles, ShieldCheck, Microscope, Syringe, Scissors, Droplets, Smile, Waves, HeartPulse as HeartPulseIcon,
  Bandage, Dna, Hospital, Thermometer, BriefcaseMedical
} from 'lucide-react';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import Meta from '../components/Meta';

const COUNTRY_DATA = [
  { name: "India", code: "+91" },
  { name: "Bangladesh", code: "+880" },
  { name: "USA", code: "+1" },
  { name: "UK", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Japan", code: "+81" },
  { name: "UAE", code: "+971" },
  { name: "Singapore", code: "+65" },
  { name: "Malaysia", code: "+60" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Nepal", code: "+977" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Bhutan", code: "+975" },
  { name: "Oman", code: "+968" },
  { name: "Qatar", code: "+974" },
  { name: "Kuwait", code: "+965" },
  { name: "Bahrain", code: "+973" },
  { name: "Thailand", code: "+66" },
  { name: "Indonesia", code: "+62" },
  { name: "Vietnam", code: "+84" },
  { name: "Philippines", code: "+63" },
  { name: "Egypt", code: "+20" },
  { name: "South Africa", code: "+27" },
  { name: "Nigeria", code: "+234" },
  { name: "Brazil", code: "+55" },
  { name: "Russia", code: "+7" },
  { name: "China", code: "+86" },
  { name: "Italy", code: "+39" },
  { name: "Spain", code: "+34" },
  { name: "Turkey", code: "+90" },
  { name: "Other", code: "" }
].sort((a, b) => a.name.localeCompare(b.name));


const TRANSLATIONS = {
  en: {
    portalLabel: "Appointment Portal",
    nav: {
      book: "Book",
      history: "History",
      profile: "Settings",
      admin: "Go to Admin Pannel"
    },
    steps: {
      branch: "Branch",
      specialty: "Specialty",
      doctor: "Doctor",
      form: "Form",
      pay: "Pay"
    },
    common: {
      back: "Back",
      select: "Select",
      loading: "Loading...",
      signOut: "Sign Out",
      editProfile: "Edit Profile",
      saveChanges: "Save Changes",
      saving: "Saving...",
      cancel: "Cancel",
      notSet: "Not Set",
      notProvided: "Not provided"
    },
    step1: {
      title: "Select Hospital Branch",
      desc: "Choose a facility to start your booking.",
      placeholder: "Search hospital or city..."
    },
    step2: {
      title: "Select Department",
      desc: "Browse medical specialties at this branch.",
      placeholder: "Search specialty or keyword..."
    },
    step3: {
      title: "Pick a Doctor",
      desc: "Select your preferred specialist.",
      placeholder: "Search doctor name, specialty or location...",
      available: "Available",
      unavailable: "Unavailable"
    },
    step4: {
      title: "Appointment Request Form",
      desc: "Please fill out the details below, and our medical coordinator will contact you within 4 hours.",
      patientInfo: "Patient Information",
      fullName: "Full Name",
      country: "Country",
      phone: "Phone/WhatsApp Number",
      concern: "Primary Medical Concern",
      concernPlaceholder: "e.g. Cardiac, Neuro, Wellness Check",
      appDetails: "Appointment Details",
      preferredCity: "Hospital",
      preferredDate: "Preferred Date",
      email: "Email Address",
      emailPlaceholder: "e.g. name@example.com",
      button: "Pay Advance"
    }
  },
  bn: {
    portalLabel: "অ্যাপয়েন্টমেন্ট পোর্টাল",
    nav: {
      book: "অ্যাপয়েন্টমেন্ট বুক করুন",
      history: "পূর্ববর্তী অ্যাপয়েন্টমেন্ট",
      profile: "প্রোফাইল সেটিংস",
      admin: "অ্যাডমিন প্যানেলে যান"
    },
    steps: {
      branch: "শাখা",
      specialty: "বিশেষত্ব",
      doctor: "ডাক্তার",
      form: "ফরম",
      pay: "পেমেন্ট"
    },
    common: {
      back: "ফিরে যান",
      select: "নির্বাচন করুন",
      loading: "লোড হচ্ছে...",
      signOut: "সাইন আউট",
      editProfile: "প্রোফাইল সম্পাদন",
      saveChanges: "পরিবর্তন সংরক্ষণ",
      saving: "সংরক্ষণ হচ্ছে...",
      cancel: "বাতিল",
      notSet: "সেট করা নেই",
      notProvided: "প্রদান করা হয়নি"
    },
    step1: {
      title: "হাসপাতালের শাখা নির্বাচন করুন",
      desc: "আপনার বুকিং শুরু করতে একটি শাখা বেছে নিন।",
      placeholder: "হাসপাতাল বা শহর খুঁজুন..."
    },
    step2: {
      title: "বিভাগ নির্বাচন করুন",
      desc: "এই শাখার মেডিকেল বিশেষত্বগুলো দেখুন।",
      placeholder: "বিশেষত্ব বা কীওয়ার্ড খুঁজুন..."
    },
    step3: {
      title: "একজন ডাক্তার বেছে নিন",
      desc: "আপনার পছন্দের বিশেষজ্ঞ নির্বাচন করুন।",
      placeholder: "ডাক্তারের নাম, বিশেষত্ব বা স্থান খুঁজুন...",
      available: "উপলব্ধ",
      unavailable: "অনুপলব্ধ"
    },
    step4: {
      title: "অ্যাপয়েন্টমেন্ট অনুরোধ ফরম",
      desc: "অনুগ্রহ করে নিচের বিবরণগুলো পূরণ করুন, এবং আমাদের মেডিকেল কোঅর্ডিনেটর ৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।",
      patientInfo: "রোগীর তথ্য",
      fullName: "পুরো নাম",
      country: "দেশ",
      phone: "ফোন/হোয়াটসঅ্যাপ নম্বর",
      concern: "প্রধান চিকিৎসা উদ্বেগ",
      concernPlaceholder: "যেমন: কার্ডিয়াক, নিউরো, ওয়েলনেস চেক",
      appDetails: "অ্যাপয়েন্টমেন্ট বিবরণ",
      preferredCity: "হাসপাতাল",
      preferredDate: "পছন্দের তারিখ",
      email: "ইমেল ঠিকানা",
      emailPlaceholder: "যেমন: name@example.com",
      button: "অগ্রিম পেমেন্ট করুন"
    }
  }
};

/* ══════════════════════════════════════════════════════════
   SHARED DATA
══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   ICONS MAPPING
══════════════════════════════════════════════════════════ */
const ICON_MAP = {
  Heart, Brain, Bone, Activity, Baby, Eye, Pill, Stethoscope, Building2, UserCheck, ClipboardList, CreditCard,
  Sparkles, ShieldCheck, Microscope, Syringe, Scissors, Droplets, Smile, Waves,
  Bandage, Dna, Hospital, Thermometer, BriefcaseMedical
};

/* ══════════════════════════════════════════════════════════
   STEPPER
══════════════════════════════════════════════════════════ */
const STEPS = [
  { id: 1, label: 'Branch', icon: Building2 },
  { id: 2, label: 'Specialty', icon: Stethoscope },
  { id: 3, label: 'Doctor', icon: UserCheck },
  { id: 4, label: 'Form', icon: ClipboardList },
  { id: 5, label: 'Pay', icon: CreditCard },
];

function Stepper({ current }) {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const currentSteps = [
    { id: 1, label: t.steps.branch, icon: Building2 },
    { id: 2, label: t.steps.specialty, icon: Stethoscope },
    { id: 3, label: t.steps.doctor, icon: UserCheck },
    { id: 4, label: t.steps.form, icon: ClipboardList },
    { id: 5, label: t.steps.pay, icon: CreditCard },
  ];

  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {currentSteps.map((step, idx) => {
        const done = current > step.id;
        const active = current === step.id;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                ${active ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : ''}
                ${done ? 'bg-primary-100 border-primary-300 text-primary-600' : ''}
                ${!active && !done ? 'bg-white border-slate-200 text-slate-400' : ''}
              `}>
                {done ? <CheckCircle2 size={15} /> : step.id}
              </div>
              <span className={`text-[11px] font-semibold tracking-wide whitespace-nowrap ${active ? 'text-primary-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-5 mx-1 rounded-full transition-all duration-300 ${current > step.id ? 'bg-primary-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   BOOK APPOINTMENT
══════════════════════════════════════════════════════════ */
function BookAppointment({ onComplete, user, profile }) {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({ hospital: null, specialty: null, doctor: null });
  const [form, setForm] = useState({ name: '', email: '', date: '', country: '', phone: '', concern: '', city: '' });
  const [billingType, setBillingType] = useState('domestic'); // 'domestic' or 'international'
  const [booked, setBooked] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  
  // Dynamic Data States
  const [hospitals, setHospitals] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [fees, setFees] = useState({ domestic: 500, international: 30 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingData(true);
      try {
        const [hRes, sRes, dRes, fRes] = await Promise.all([
          supabase.from('branches').select('*').eq('is_active', true),
          supabase.from('specialties').select('*').eq('is_active', true),
          supabase.from('doctors').select('*, branches(branch_name, city)').eq('is_active', true),
          supabase.from('settings').select('*')
        ]);

        setHospitals(hRes.data || []);
        setSpecialties(sRes.data || []);
        setDoctors(dRes.data || []);
        
        if (fRes.data) {
          setFees({ 
            domestic: parseInt(fRes.data.find(s => s.key === 'advance_booking_fee_domestic')?.value || 500), 
            domestic_gateway: parseInt(fRes.data.find(s => s.key === 'gateway_charges_domestic')?.value || 0),
            international: parseInt(fRes.data.find(s => s.key === 'advance_booking_fee_international')?.value || 30),
            international_gateway: parseInt(fRes.data.find(s => s.key === 'gateway_charges_international')?.value || 0)
          });
        }
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  // Auto-redirect to history after booking
  useEffect(() => {
    if (booked && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [booked, onComplete]);

  // Load Razorpay Script (Disabled for testing)
  /*
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  */

  const handlePayment = async () => {
    setLoadingPayment(true);
    
    // Simulating API/Payment delay for testing
    setTimeout(async () => {
      // Create the appointment record in Supabase
      const bookingId = 'APT' + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      const { error } = await supabase
        .from('appointments')
        .insert({
          booking_id: bookingId,
          user_id: user?.id,
          full_name: form.name,
          country: form.country,
          phone: form.phone,
          medical_concern: form.concern,
          preferred_date: form.date,
          email: form.email,
          department: selected.specialty?.name || form.concern,
          payment_status: 'Paid',
          booking_status: 'Pending',
          advance_paid: billingType === 'domestic' ? fees.domestic : fees.international,
          branch_id: selected.hospital?.id,
          doctor_id: selected.doctor?.id,
        });

      if (error) {
        console.error('Error saving appointment:', error);
        alert('Payment processed but failed to save appointment. Please contact support.');
      } else {
        setBooked(true);
      }
      setLoadingPayment(false);
    }, 1200);
  };


  const filteredHospitals = hospitals.filter(h =>
    h.branch_name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );
  const filteredSpecialties = specialties.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.subtitle && s.subtitle.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredDoctors = doctors.filter(d => {
    // 1. Progress Filter: Doctor must belong to the selected branch and have the selected specialization
    const matchesBranch = selected.hospital 
      ? (d.branch_id === selected.hospital.id || (Array.isArray(d.branch_ids) && d.branch_ids.includes(selected.hospital.id)))
      : true;
      
    const matchesSpecialty = selected.specialty 
      ? (d.specialization || '').toLowerCase().includes(selected.specialty.name.toLowerCase())
      : true;

    // 2. Search Filter
    const matchesSearch = d.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
                         d.specialization.toLowerCase().includes(search.toLowerCase()) ||
                         (d.branches?.city && d.branches.city.toLowerCase().includes(search.toLowerCase()));

    return matchesBranch && matchesSpecialty && matchesSearch;
  });

  const goToNextStep = (data) => {
    setSelected(s => {
      const updated = { ...s, ...data };
      // Auto-fill form fields based on selection
      setForm(f => ({
        ...f,
        ...(data.hospital ? { city: data.hospital.branch_name } : {}),
        ...(data.specialty ? { concern: data.specialty.name } : {}),
      }));
      return updated;
    });
    setSearch('');
    setStep(s => s + 1);
  };

  if (booked) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-lg">
          <CheckCircle2 size={46} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Appointment Booked!</h2>
        <p className="text-slate-500 mb-8 max-w-md">Your appointment has been confirmed. Redirecting to your history...</p>
        <button onClick={() => { if (onComplete) onComplete(); }}
          className="bg-primary-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/25">
          View My Appointments
        </button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <AnimatePresence>
          {step > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary-600 transition-colors mb-4 group"
            >
              <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-primary-300 group-hover:bg-primary-50 transition-all">
                <ChevronLeft size={16} className="text-slate-400 group-hover:text-primary-500" />
              </span>
              {t.common.back}
            </motion.button>
          )}
        </AnimatePresence>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-1">
          {step === 1 && t.step1.title}
          {step === 2 && t.step2.title}
          {step === 3 && t.step3.title}
          {step === 4 && t.step4.title}
        </h1>
        <p className="text-slate-400 text-sm">
          {step === 1 && t.step1.desc}
          {step === 2 && t.step2.desc}
          {step === 3 && t.step3.desc}
          {step === 4 && t.step4.desc}
        </p>
      </div>

      <Stepper current={step} />

      <AnimatePresence mode="wait">
        {/* ── Step 1: Branch ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
            <h2 className="text-xl font-extrabold text-slate-900 mb-1">Select Hospital Branch</h2>
            <p className="text-sm text-slate-400 mb-5">Choose a facility to start your booking.</p>
            <div className="relative mb-5">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.step1.placeholder}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-300 transition shadow-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredHospitals.map(h => (
                <motion.div key={h.id}
                  whileHover={{ y: -8, scale: 1.01 }}
                  onClick={() => goToNextStep({ hospital: h })}
                  className="group relative cursor-pointer flex flex-col h-full bg-white rounded-[32px] overflow-hidden border border-slate-100/80 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-400 ease-out">
                  
                  {/* Premium Image Container */}
                  <div className="relative h-56 sm:h-60 overflow-hidden flex-shrink-0">
                    <img src={h.image_url} alt={h.branch_name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
                    
                    {/* Rich gradient for cinematic effect & text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-black/10 transition-opacity duration-300" />
                    
                    {/* Glassmorphic city badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-sm transition-all duration-300">
                      <MapPin size={12} className="text-white" strokeWidth={2.5} />
                      <span className="text-xs font-extrabold text-white tracking-wide">{h.city}</span>
                    </div>

                    {/* Integrated title with slight parallax effect */}
                    <div className="absolute bottom-0 left-0 w-full p-6 pt-12 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                       <h3 className="font-black text-white text-xl sm:text-2xl leading-tight mb-0.5 drop-shadow-lg">{h.branch_name}</h3>
                       <p className="text-white/80 font-bold text-xs sm:text-sm drop-shadow-md line-clamp-1">{h.subline}</p>
                    </div>
                  </div>

                  {/* Clean, minimalist body */}
                  <div className="p-6 flex flex-col flex-1 bg-white relative">
                    {/* Address Section */}
                    <div className="mb-6 mt-1 flex gap-3">
                       <div className="mt-0.5 w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                         <MapPin size={14} />
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Address</p>
                         <p className="text-xs font-bold text-slate-600 leading-relaxed group-hover:text-slate-800 transition-colors pr-2">
                           {h.city}{h.sub_location ? `, ${h.sub_location}` : ''}
                         </p>
                       </div>
                    </div>

                    {/* Elevated interactive selector */}
                    <div className="mt-auto">
                      <div className="w-full flex items-center justify-between p-1.5 pl-5 rounded-[20px] bg-slate-50 border border-slate-100 group-hover:border-primary-100 group-hover:bg-primary-50 transition-all duration-300 relative overflow-hidden">
                        {/* Hover gleam effect */}
                        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out" />
                        <span className="text-sm font-extrabold text-slate-600 group-hover:text-primary-600 transition-colors relative z-10">Select Facility</span>
                        <div className="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:bg-primary-500 text-slate-400 group-hover:text-white transition-all duration-300 relative z-10">
                           <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Specialty ── */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Select Department</h2>
            <p className="text-sm text-slate-400 mb-5">Browse medical specialties at this branch.</p>
            <div className="relative mb-6">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.step2.placeholder}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-300 transition shadow-sm" />
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-7">
              {filteredSpecialties.map(sp => {
                let finalIconName = sp.icon_name;
                let finalColor = sp.color;
                
                if (!finalIconName || !finalColor) {
                  const name = (sp.name || '').toLowerCase();
                  const mapping = [
                    { keywords: ['cardio', 'heart'], icon: 'Heart', color: '#ef4444' },
                    { keywords: ['neuro', 'brain', 'nerve'], icon: 'Brain', color: '#8b5cf6' },
                    { keywords: ['ortho', 'bone', 'joint'], icon: 'Bone', color: '#f97316' },
                    { keywords: ['derm', 'skin', 'beauty'], icon: 'Sparkles', color: '#ec4899' },
                    { keywords: ['pedia', 'child', 'baby'], icon: 'Baby', color: '#10b981' },
                    { keywords: ['eye', 'ophth', 'vision'], icon: 'Eye', color: '#06b6d4' },
                    { keywords: ['dent', 'teeth', 'smile', 'oral'], icon: 'Smile', color: '#3b82f6' },
                    { keywords: ['phar', 'medicine', 'drug'], icon: 'Pill', color: '#14b8a6' },
                    { keywords: ['surg', 'operat'], icon: 'Scissors', color: '#f43f5e' },
                    { keywords: ['urol', 'kidney', 'nephro', 'fluid'], icon: 'Droplets', color: '#3b82f6' },
                    { keywords: ['general', 'checkup', 'wellness'], icon: 'ShieldCheck', color: '#6366f1' },
                    { keywords: ['gast', 'stomach', 'digest'], icon: 'Activity', color: '#f59e0b' },
                    { keywords: ['patho', 'lab', 'blood', 'dna'], icon: 'Dna', color: '#ef4444' },
                    { keywords: ['emergency', 'trauma'], icon: 'Hospital', color: '#dc2626' },
                    { keywords: ['fever', 'infect'], icon: 'Thermometer', color: '#f97316' },
                    { keywords: ['wound', 'burn'], icon: 'Bandage', color: '#f59e0b' }
                  ];

                  const matched = mapping.find(m => m.keywords.some(k => name.includes(k)));
                  
                  if (matched) {
                    if (!finalIconName) finalIconName = matched.icon;
                    if (!finalColor) finalColor = matched.color;
                  } else {
                    const fallbacks = ['BriefcaseMedical', 'Stethoscope', 'Microscope', 'Syringe', 'Waves'];
                    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1'];
                    let hash = 0;
                    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
                    hash = Math.abs(hash);
                    if (!finalIconName) finalIconName = fallbacks[hash % fallbacks.length];
                    if (!finalColor) finalColor = colors[hash % colors.length];
                  }
                }
                
                const Icon = ICON_MAP[finalIconName] || Activity;
                const isSelected = selected.specialty?.id === sp.id;
                
                return (
                  <motion.button key={sp.id}
                    whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => goToNextStep({ specialty: sp })}
                    className="group relative flex flex-col items-center bg-white border border-slate-50 rounded-[32px] pt-8 pb-7 px-5 transition-all duration-300 shadow-sm hover:border-primary-100">

                    {/* Image / Icon Container */}
                    <div className="w-[68px] h-[68px] rounded-[24px] flex items-center justify-center mb-5 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 overflow-hidden"
                      style={!sp.image_url ? { backgroundColor: finalColor + '12' } : {}}>
                      {sp.image_url ? (
                         <img src={sp.image_url} alt={sp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                         <Icon size={28} style={{ color: finalColor }} strokeWidth={2.2} />
                      )}
                    </div>

                    {/* Text content */}
                    <h3 className="text-[16px] font-extrabold text-slate-900 mb-1 leading-tight text-center">{sp.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mb-6 tracking-wide text-center">{sp.subtitle}</p>

                    {/* Bottom arrow circle */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border
                      ${isSelected
                        ? 'bg-primary-500 border-primary-500 shadow-lg shadow-primary-500/40 translate-y-1'
                        : 'bg-slate-50 border-slate-100 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:shadow-lg group-hover:shadow-primary-500/30 group-hover:translate-y-1'}`}>
                      <ChevronRight size={16} className={isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'} strokeWidth={3} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Doctor ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Pick a Doctor</h2>
            <p className="text-sm text-slate-400 mb-5">Select your preferred specialist.</p>
            <div className="relative mb-6">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder={t.step3.placeholder}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-300 transition shadow-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map(doc => (
                  <motion.div key={doc.id}
                    whileHover={doc.is_active ? { x: 6, boxShadow: '8px 8px 30px rgba(0,0,0,0.04)' } : {}}
                    onClick={() => {
                      if (!doc.is_active) return;
                      goToNextStep({ doctor: doc });
                    }}
                    className={`bg-white border rounded-2xl p-3.5 transition-all group flex items-center gap-4 shadow-sm
                      ${doc.is_active ? 'border-slate-100 cursor-pointer hover:border-primary-100' : 'border-slate-100 opacity-60 cursor-not-allowed grayscale-[0.5]'}`}>

                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                      {doc.image_url ? (
                        <img src={doc.image_url} alt={doc.doctor_name} className={`w-16 h-16 rounded-[14px] object-cover ring-2 ring-slate-50 ring-offset-1 transition-transform ${doc.is_active ? 'group-hover:scale-105' : ''}`} />
                      ) : (
                        <div className="w-16 h-16 rounded-[14px] bg-slate-50 flex items-center justify-center ring-2 ring-slate-50 ring-offset-1">
                          <User size={26} className="text-slate-200" />
                        </div>
                      )}
                      {/* Status indicator */}
                      <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full shadow-sm ${doc.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>

                    {/* Main Content Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-extrabold text-slate-900 text-[15px] group-hover:text-primary-600 transition-colors truncate">{doc.doctor_name}</h4>
                        <div className={`flex items-center bg-primary-50 px-2 py-0.5 rounded-full ${doc.is_active ? 'bg-emerald-50' : 'bg-slate-100'}`}>
                          <span className={`text-[9px] font-bold uppercase tracking-tighter ${doc.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {doc.is_active ? t.step3.available : t.step3.unavailable}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Stethoscope size={11} className="text-primary-400 flex-shrink-0" />
                          <span className="text-[11px] font-bold text-slate-500 truncate">
                            {(() => {
                              const specs = (doc.specialization || '').split(',').map(s => s.trim()).filter(Boolean);
                              if (specs.length <= 2) return doc.specialization;
                              return `${specs.slice(0, 2).join(', ')} +${specs.length - 2}`;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={11} className="text-orange-400 flex-shrink-0" />
                          <span className="text-[11px] font-bold text-slate-500 truncate">{doc.branches?.city || 'Facility'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-primary-500 flex items-center justify-center transition-all shadow-sm">
                      <ChevronRight size={15} className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[40px] text-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 text-slate-300 border border-slate-100">
                    <BriefcaseMedical size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">No Specialists Found</h3>
                  <p className="text-sm text-slate-500 max-w-[280px] mt-2 leading-relaxed">We couldn't find any doctors matching your current combination of branch and department.</p>
                  <button onClick={() => setStep(2)} className="mt-6 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-primary-500 hover:bg-primary-50 hover:border-primary-200 transition-all">
                    Change Department
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Form ── */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }} className="flex flex-col items-center">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1 text-center">{t.step4.title}</h2>
            <p className="text-sm text-slate-400 mb-8 text-center">{t.step4.desc}</p>

            <form onSubmit={e => { e.preventDefault(); setStep(5); }} className="space-y-8 max-w-2xl w-full mx-auto">

              {/* Patient Information */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                    <User size={18} className="text-primary-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{t.step4.patientInfo}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.fullName}</label>
                    <input type="text" required value={form.name}
                      onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                      placeholder="e.g. Aman Das"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.country}</label>
                    <div className="relative">
                      <select required value={form.country || ''}
                        onChange={e => {
                          const val = e.target.value;
                          const selectedCountry = COUNTRY_DATA.find(c => c.name === val);
                          setForm(v => ({
                            ...v,
                            country: val,
                            phone: selectedCountry?.code ? (v.phone.startsWith('+') ? selectedCountry.code + ' ' + v.phone.split(' ').slice(1).join(' ') : selectedCountry.code + ' ') : v.phone
                          }));
                        }}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition appearance-none cursor-pointer">
                        <option value="" disabled>{lang === 'bn' ? 'দেশ নির্বাচন করুন' : 'Select Country'}</option>
                        {COUNTRY_DATA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.phone}</label>
                    <input type="tel" required value={form.phone || ''}
                      onChange={e => setForm(v => ({ ...v, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.concern}</label>
                    <input type="text" required disabled value={form.concern || ''}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-100/50 text-slate-500 text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.email}</label>
                    <input type="email" required value={form.email || ''}
                      onChange={e => setForm(v => ({ ...v, email: e.target.value }))}
                      placeholder={t.step4.emailPlaceholder}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition" />
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <CalendarPlus size={18} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">{t.step4.appDetails}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.preferredCity}</label>
                    <input type="text" required disabled value={form.city || ''}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-100/50 text-slate-500 text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">{t.step4.preferredDate}</label>
                    <input type="date" required value={form.date}
                      onChange={e => setForm(v => ({ ...v, date: e.target.value }))}
                      className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 text-sm outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition" />
                  </div>

                </div>
              </div>

              <div className="flex justify-center">
                <button type="submit"
                  className="px-12 bg-primary-500 text-white py-4 rounded-2xl font-extrabold text-base hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 group">
                  {t.step4.button} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Step 5: Pay ── */}
        {step === 5 && (
          <motion.div 
            key="s5" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -30 }} 
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} 
            className="flex flex-col items-center"
          >
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.9 }} 
                animate={{ scale: 1 }} 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4"
              >
                <Shield size={13} className="text-primary-500" />
                <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">Secure Checkout</span>
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Review &amp; Confirm</h2>
              <p className="text-base text-slate-400 max-w-md mx-auto">Please verify your booking details before proceeding to the secure payment portal.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full max-w-6xl mx-auto">
              
              {/* Left Column: Booking Summary */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                  {/* Decorative background element */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-xl font-bold text-slate-900">Appointment Details</h3>
                      <button onClick={() => setStep(4)} className="text-xs font-bold text-primary-500 hover:text-primary-700 transition-colors flex items-center gap-1">
                        <Pencil size={12} /> Edit Details
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      {[
                        { label: lang === 'bn' ? 'হাসপাতাল' : 'Hospital', value: selected.hospital?.name, icon: Building2, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: lang === 'bn' ? 'প্রধান উদ্বেগ' : 'Medical Concern', value: form.concern || 'General Consulting', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: lang === 'bn' ? 'ডাক্তার' : 'Doctor', value: selected.doctor?.name, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: lang === 'bn' ? 'তারিখ' : 'Date', value: form.date, icon: CalendarPlus, color: 'text-orange-500', bg: 'bg-orange-50' },
                      ].map((item) => (
                        <div key={item.label} className="relative group/item">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">{item.label}</p>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover/item:scale-110 transition-transform duration-300`}>
                              <item.icon size={18} />
                            </div>
                            <span className="font-extrabold text-slate-900 text-sm leading-tight">{item.value || 'Not specified'}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="h-px bg-slate-100/60 my-10" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Patient Email</p>
                        <div className="bg-slate-50/50 rounded-2xl p-4 flex items-center gap-3 group/contact">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover/contact:text-primary-500 group-hover/contact:border-primary-100 transition-colors">
                            <Globe size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 truncate">{form.email || 'Email not provided'}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2">Phone Number</p>
                        <div className="bg-slate-50/50 rounded-2xl p-4 flex items-center gap-3 group/contact">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 group-hover/contact:text-primary-500 group-hover/contact:border-primary-100 transition-colors">
                            <Phone size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-700 truncate">{form.phone || 'Phone not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Cost Details & Action */}
              <div className="lg:col-span-5">
                <div className="sticky top-28 bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-primary-900/20 overflow-hidden relative">
                  {/* Glass highlight */}
                  <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                        <CreditCard size={20} className="text-primary-400" />
                      </div>
                      <h3 className="text-xl font-bold">Billing Summary</h3>
                    </div>

                    {/* Residency Selector */}
                    <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 mb-10">
                      <button 
                        onClick={() => setBillingType('domestic')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${billingType === 'domestic' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                      >
                        Domestic (India)
                      </button>
                      <button 
                        onClick={() => setBillingType('international')}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${billingType === 'international' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                      >
                        International (Global)
                      </button>
                    </div>

                    <div className="space-y-6 mb-12">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Consultation Fee</span>
                        <span className="font-bold">
                          {billingType === 'domestic' ? `₹${fees.domestic}` : `$${fees.international}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Gateway & Service</span>
                        <div className="flex flex-col items-end">
                          <span className={`${billingType === 'domestic' && fees.domestic_gateway === 0 ? 'text-emerald-400' : 'text-white'} font-bold`}>
                            {billingType === 'domestic' 
                              ? (fees.domestic_gateway === 0 ? 'Free' : `₹${fees.domestic_gateway}`) 
                              : `$${fees.international_gateway}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="h-px bg-white/10 my-2" />
                      
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Payable</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-black text-white">
                            {billingType === 'domestic' 
                              ? `₹${Number(fees.domestic) + Number(fees.domestic_gateway)}` 
                              : `$${Number(fees.international) + Number(fees.international_gateway)}`}
                          </span>
                          <span className="text-xs text-slate-500 font-bold">incl. charges</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button 
                        onClick={handlePayment}
                        disabled={loadingPayment}
                        className="w-full bg-primary-500 hover:bg-primary-400 disabled:bg-slate-700 disabled:cursor-wait text-white py-5 rounded-[22px] font-black text-lg transition-all shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 group relative overflow-hidden"
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        <span className="relative z-10">{loadingPayment ? 'Initializing...' : 'Pay & Confirm'}</span>
                        {!loadingPayment && <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />}
                      </button>
                      
                      <p className="mt-6 text-[10px] text-slate-500 text-center flex items-center justify-center gap-2">
                        <Shield size={10} className="text-emerald-500" /> 
                        Encrypted 256-bit Secure Transaction
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Trust Card */}
                <div className="mt-6 bg-white border border-slate-100 rounded-[28px] p-6 flex items-center justify-around shadow-sm">
                  <div className="flex flex-col items-center gap-1">
                    <HeartPulse size={20} className="text-pink-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Trusted Care</span>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="flex flex-col items-center gap-1">
                    <History size={20} className="text-blue-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Fast Booking</span>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  <div className="flex flex-col items-center gap-1">
                    <UserCheck size={20} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Verified Doc</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PREVIOUS APPOINTMENTS
══════════════════════════════════════════════════════════ */
function PreviousAppointments({ onBookNew, user }) {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [search, setSearch] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors (doctor_name, specialization, image_url),
        branches (branch_name, city)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      setAppointments(data || []);
    }
    setLoading(false);
  };

  const filtered = appointments.filter(app => {
    const s = search.toLowerCase();
    return (
      app.doctors?.doctor_name?.toLowerCase().includes(s) ||
      app.department?.toLowerCase().includes(s) ||
      app.booking_id?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="pb-20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">{t.nav.history}</h1>
          <p className="text-slate-400 text-sm">{lang === 'bn' ? 'আপনার আসন্ন এবং পূর্ববর্তী চিকিৎসার ভিজিট ট্র্যাক করুন।' : 'Track your upcoming and previous medical visits.'}</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBookNew}
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all whitespace-nowrap flex-shrink-0 mt-1 ml-4">
          {t.nav.book} <ArrowRight size={15} />
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={lang === 'bn' ? 'ডাক্তার বা বিভাগ অনুযায়ী খুঁজুন...' : "Search by doctor or department..."}
          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary-300 transition shadow-sm" />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4" />
          <p className="text-slate-400 text-sm font-medium">{t.common.loading}</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-[40px] p-16 flex flex-col items-center text-center shadow-xl shadow-slate-200/50">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <ClipboardList size={40} className="text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{lang === 'bn' ? 'কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি' : 'No appointments found'}</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-8">
            {lang === 'bn' ? 'আপনি এখনো কোন অ্যাপয়েন্টমেন্ট বুক করেননি। একবার আপনি এটি করলে আপনার রেকর্ড এখানে প্রদর্শিত হবে।' : "You haven't booked any appointments yet. Once you do, your records will appear here."}
          </p>
          <button onClick={onBookNew}
            className="bg-primary-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-xl shadow-primary-500/25">
            {lang === 'bn' ? 'এখনই বুক করুন' : 'Book Now'}
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(app => (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                        {app.doctors?.image_url ? (
                          <img src={app.doctors.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-500">
                            <UserCheck size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">{app.doctors?.doctor_name || 'Assigned Specialist'}</h4>
                        <p className="text-[9px] font-bold text-primary-500 uppercase tracking-widest mt-0.5">{app.department || 'General'}</p>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ${
                      app.booking_status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {app.booking_status || 'Pending'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:block sm:space-y-3.5 mb-5 sm:mb-6">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <CalendarPlus size={14} className="text-primary-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                        <span className="text-[11px] font-bold text-slate-800">{new Date(app.preferred_date).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <Clock size={14} className="text-slate-300 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                        <span className="text-[11px] font-semibold text-slate-500">{new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 sm:pt-1 truncate">
                      <User size={13} className="text-slate-300 shrink-0" />
                      <span className="text-[11px] font-bold truncate">{app.doctors?.doctor_name || 'Simulated Doctor'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600 truncate">
                      <Building2 size={13} className="text-slate-300 shrink-0" />
                      <span className="text-[11px] font-bold truncate">{app.branches?.branch_name || 'Main Medical Center'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0.5">Booking ID</p>
                      <p className="text-[10px] sm:text-[11px] font-black text-slate-800 uppercase tabular-nums tracking-tighter">#{app.booking_id?.slice(0, 8)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-0.5">Payment</p>
                      <p className="text-[10px] sm:text-[11px] font-black text-emerald-500 uppercase tracking-tighter">{app.payment_status}</p>
                    </div>
                  </div>
                </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROFILE SETTINGS
══════════════════════════════════════════════════════════ */
function ProfileSettings({ user, profile: initialProfile, onUpdate, onSignOut }) {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', phone: '', country: '' });
  const navigate = useNavigate();

  // Sync draft when editing starts or profile changes
  useEffect(() => {
    if (!editing) {
      const baseName = initialProfile?.full_name || user?.user_metadata?.full_name || 'User';
      setDraft({
        name: (baseName === 'Guest User' || baseName === 'Gest User' || baseName === 'gest user') ? 'User' : baseName,
        email: initialProfile?.email || user?.email || '',
        phone: initialProfile?.phone || '',
        country: initialProfile?.country || user?.user_metadata?.country || '',
      });
    }
  }, [initialProfile, user, editing]);

  const save = async () => {
    setIsSaving(true);
    const success = await onUpdate({
      full_name: draft.name,
      phone: draft.phone,
      country: draft.country,
    });
    setIsSaving(false);
    if (success) setEditing(false);
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900">{t.nav.profile}</h1>
        <button
          disabled={isSaving}
          onClick={() => editing ? save() : setEditing(true)}
          className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t.common.saving}
            </span>
          ) : (
            <>
              <Pencil size={14} />
              {editing ? t.common.saveChanges : t.common.editProfile}
            </>
          )}
        </button>
      </div>

      <motion.div layout className="bg-white border border-slate-100 rounded-3xl p-6 mb-5 shadow-sm max-w-2xl">
        <div className="flex items-center gap-5 pb-5 mb-5 border-b border-slate-100">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
            <User size={32} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                value={draft.name}
                onChange={e => setDraft(v => ({ ...v, name: e.target.value }))}
                className="font-bold text-slate-900 text-lg w-full border-b border-primary-200 outline-none pb-0.5 bg-transparent"
                placeholder="Full Name"
              />
            ) : (
              <p className="font-bold text-slate-900 text-lg truncate">{draft.name}</p>
            )}
            <p className="text-sm text-slate-400 truncate">{draft.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center gap-4">
            <Phone size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mobile Number</p>
              {editing ? (
                <input
                  type="tel"
                  value={draft.phone}
                  onChange={e => setDraft(v => ({ ...v, phone: e.target.value }))}
                  className="text-sm font-semibold text-slate-900 bg-transparent outline-none w-full border-b border-primary-200 pb-0.5"
                  placeholder={lang === 'bn' ? 'ফোন নম্বর লিখুন' : 'Enter phone number'}
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900">{draft.phone || t.common.notProvided}</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl px-5 py-4 flex items-center gap-4">
            <Globe size={16} className="text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t.step4.country}</p>
              {editing ? (
                <div className="relative">
                  <select
                    value={draft.country}
                    onChange={e => {
                      const val = e.target.value;
                      const selectedCountry = COUNTRY_DATA.find(c => c.name === val);
                      setDraft(v => ({
                        ...v,
                        country: val,
                        phone: selectedCountry?.code ? (v.phone.startsWith('+') ? selectedCountry.code + ' ' + v.phone.split(' ').slice(1).join(' ') : selectedCountry.code + ' ') : v.phone
                      }));
                    }}
                    className="text-sm font-semibold text-slate-900 bg-transparent outline-none w-full appearance-none cursor-pointer pr-6"
                  >
                    <option value="" disabled>Select Country</option>
                    {COUNTRY_DATA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              ) : (
                <p className="text-sm font-semibold text-slate-900">{draft.country || t.common.notSet}</p>
              )}
            </div>
          </div>
        </div>

        {editing && (
          <div className="flex gap-3 mt-6">
            <button onClick={save} disabled={isSaving}
              className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition-all shadow-md shadow-primary-500/20 disabled:opacity-50">
              {isSaving ? t.common.saving : t.common.saveChanges}
            </button>
            <button onClick={() => setEditing(false)} disabled={isSaving}
              className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
              {t.common.cancel}
            </button>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mb-10">
        {[
          { icon: Shield, label: lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy', color: '#6366f1', desc: lang === 'bn' ? 'আমরা কীভাবে আপনার তথ্য ব্যবহার করি' : 'How we protect your data', path: '/privacy' },
          { icon: FileText, label: lang === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions', color: '#f59e0b', desc: lang === 'bn' ? 'আমাদের ব্যবহারের নির্দেশিকা' : 'Service rules & guidelines', path: '/terms' },
        ].map((item) => (
          <motion.button
            key={item.label}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className="group bg-white border border-slate-100 rounded-[32px] p-6 text-left shadow-sm hover:shadow-xl hover:shadow-primary-500/5 hover:border-primary-100 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6"
                style={{ backgroundColor: item.color + '15' }}>
                <item.icon size={22} style={{ color: item.color }} />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                <ChevronRight size={16} className="text-slate-300 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            <h3 className="font-bold text-slate-900 text-[15px] mb-1">{item.label}</h3>
            <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">{item.desc}</p>
          </motion.button>
        ))}
      </div>

      <div className="lg:hidden">
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 bg-white border border-red-100 text-red-500 py-4 rounded-2xl font-bold text-sm shadow-sm hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR NAV ITEMS
══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'book', label: 'Book Appointment', icon: CalendarPlus },
  { id: 'history', label: 'Previous Appointments', icon: History },
  { id: 'profile', label: 'Profile Settings', icon: Settings },
];

/* ══════════════════════════════════════════════════════════
   ROOT PAGE
══════════════════════════════════════════════════════════ */
export default function AppointmentPage() {
  const { lang } = useLang();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('book');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // No profile found, maybe create one from metadata
      const { data: newUser } = await supabase.auth.getUser();
      if (newUser.user) {
        const { data: created } = await supabase
          .from('users')
          .insert({
            id: userId,
            full_name: newUser.user.user_metadata?.full_name || '',
            email: newUser.user.email,
          })
          .select()
          .single();
        if (created) setProfile(created);
      }
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleUpdateProfile = async (updatedData) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('users')
      .update(updatedData)
      .eq('id', user.id)
      .select()
      .single();

    if (data) {
      setProfile(data);
      return { success: true };
    }
    return { success: false, error };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const rawName = profile?.full_name || user?.user_metadata?.full_name || 'User';
  const displayName = (rawName === 'Guest User' || rawName === 'Gest User' || rawName === 'gest user') ? 'User' : rawName;
  const emailShort = user?.email ? (user.email.length > 18 ? user.email.slice(0, 16) + '…' : user.email) : '';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Header height: topbar 27px + main nav 63px = 90px
  const HEADER_H = 90;

  const isAdmin = user?.email === 'raaj.2015@yahoo.com';
  const visibleNavItems = isAdmin
    ? [...NAV_ITEMS, { id: 'admin', label: 'Go to Admin Pannel', icon: LayoutDashboard }]
    : NAV_ITEMS;

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f6f9]">
      <Meta 
        title="Patient Portal | Schedule Appointments & Manage Records"
        description="Securely book medical appointments with top specialists, view consultation history, and manage your health records through the MIC patient portal."
      />
      <Header />

      {/* Below header */}
      <div className="flex flex-1" style={{ paddingTop: HEADER_H }}>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:flex flex-col w-[220px] xl:w-[240px] flex-shrink-0 bg-white border-r border-slate-100/80 shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
          style={{ minHeight: `calc(100vh - ${HEADER_H}px)`, position: 'sticky', top: HEADER_H, height: `calc(100vh - ${HEADER_H}px)` }}>

          {/* Sidebar header label */}
          <div className="px-5 pt-6 pb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">{t.portalLabel}</p>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-2 px-3 flex-1 overflow-y-auto py-2">
            {visibleNavItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button key={item.id}
                  onClick={() => {
                    if (item.id === 'admin') {
                      navigate('/admin');
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 text-sm font-semibold w-full overflow-hidden
                    ${isActive ? 'text-primary-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>

                  {/* Active gradient background */}
                  {isActive && (
                    <motion.div layoutId="sidebar-bg"
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg,#e0f2fe 0%,#f0f9ff 100%)' }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}

                  {/* Icon container */}
                  <div className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${isActive ? 'bg-primary-500 shadow-md shadow-primary-500/30' : 'bg-slate-100'}`}>
                    <Icon size={15}
                      className={isActive ? 'text-white' : 'text-slate-400'}
                      strokeWidth={2} />
                  </div>

                  <span className="relative z-10 leading-tight text-[13px]">{t.nav[item.id] || item.label}</span>

                  {/* Active right arrow indicator */}
                  {isActive && (
                    <ChevronRight size={14} className="relative z-10 ml-auto text-primary-400" />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Divider */}
          <div className="mx-5 my-2 h-px bg-slate-100" />

          {/* User card footer */}
          <div className="p-4">
            <div className="bg-slate-50 rounded-2xl p-3.5">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9,#0369a1)' }}>
                  {user ? initials : <User size={16} className="text-white" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{displayName}</p>
                  {emailShort && <p className="text-[10px] text-slate-400 truncate mt-0.5">{emailShort}</p>}
                </div>
              </div>
              {/* Sign out */}
              <button onClick={handleSignOut}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition-colors w-full px-1">
                <LogOut size={13} />
                {t.common.signOut}
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 xl:p-10 min-w-0 pb-28 lg:pb-10">
          <AnimatePresence mode="wait">
            {activeTab === 'book' && (
              <motion.div key="book" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <BookAppointment onComplete={() => setActiveTab('history')} user={user} profile={profile} />
              </motion.div>
            )}
            {activeTab === 'history' && (
              <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <PreviousAppointments onBookNew={() => setActiveTab('book')} user={user} />
              </motion.div>
            )}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                <ProfileSettings user={user} profile={profile} onUpdate={handleUpdateProfile} onSignOut={handleSignOut} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

      </div>

      {/* ── Mobile Bottom Nav Bar (hidden on lg+) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-5 pointer-events-none">
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45, type: 'spring', stiffness: 220, damping: 24 }}
          className="pointer-events-auto flex items-center gap-1 px-2.5 py-2 rounded-[28px]"
          style={{
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.13), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {visibleNavItems.filter(item => item.id !== 'admin').map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const mobileLabel = t.nav[item.id];
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  if (item.id === 'admin') {
                    navigate('/admin');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                whileTap={{ scale: 0.91 }}
                className="relative flex flex-col items-center gap-1 px-5 py-2 rounded-[22px] min-w-[72px] transition-all duration-200"
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 rounded-[22px]"
                    style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.18)' }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-primary-500' : 'text-slate-400'}`}
                />
                <span className={`relative z-10 text-[10px] font-bold tracking-wide transition-colors duration-200 ${isActive ? 'text-primary-600' : 'text-slate-400'}`}>
                  {mobileLabel}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>

    </div>
  );
}
