import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import Services from './components/Services';
import { CTA, Footer } from './components/Footer';
import Meta from './components/Meta';
import ProtectedRoute from './components/ProtectedRoute';
import { useLang } from './context/LanguageContext';
import { translations } from './lib/translations';
import { supabase } from './lib/supabase';
import { useState, useEffect } from 'react';

// Lazy load non-critical pages for performance optimization
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const PatientGuidePage = lazy(() => import('./pages/PatientGuidePage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-primary-100 rounded-full border-t-primary-500 animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 bg-primary-500/10 rounded-full animate-pulse"></div>
      </div>
    </div>
    <p className="mt-4 text-slate-400 font-medium animate-pulse">Loading Excellence...</p>
  </div>
);

const HomePage = () => {
  const { lang } = useLang();
  const t = translations[lang]?.hero || translations['en'].hero;
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
        console.error('Error fetching Schema contact:', err);
      }
    };
    fetchContact();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Meta 
        title={t.metaTitle}
        description={t.metaDesc}
        schema={{
          "@context": "https://schema.org",
          "@type": "MedicalWebPage",
          "name": "Medical Information Center",
          "description": "Premium medical facilitation and assistance service for international patients seeking world-class treatment in India.",
          "url": "https://medicalinfocentre.com",
          "medicalSpecialty": ["Oncology", "Cardiology", "Orthopedics", "Transplant"],
          "audience": "International Patients",
          "mainEntity": {
            "@type": "Organization",
            "name": "Medical Information Center",
            "url": "https://medicalinfocentre.com",
            "logo": "https://medicalinfocentre.com/images/logo-mic.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": phone,
              "contactType": "customer service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Bengali"]
            }
          }
        }}
      />
      <Header />
      <main className="flex-grow">
        <Hero />
        <WhyChooseUs />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/appointment" element={
              <ProtectedRoute>
                <AppointmentPage />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanelPage />
              </ProtectedRoute>
            } />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/guide" element={<PatientGuidePage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/sitemap" element={<SitemapPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
