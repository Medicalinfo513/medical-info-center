import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

const COUNTRIES = [
  { name: 'Afghanistan', dial: '+93' },
  { name: 'Albania', dial: '+355' },
  { name: 'Algeria', dial: '+213' },
  { name: 'Andorra', dial: '+376' },
  { name: 'Angola', dial: '+244' },
  { name: 'Argentina', dial: '+54' },
  { name: 'Armenia', dial: '+374' },
  { name: 'Australia', dial: '+61' },
  { name: 'Austria', dial: '+43' },
  { name: 'Azerbaijan', dial: '+994' },
  { name: 'Bahrain', dial: '+973' },
  { name: 'Bangladesh', dial: '+880' },
  { name: 'Belarus', dial: '+375' },
  { name: 'Belgium', dial: '+32' },
  { name: 'Bhutan', dial: '+975' },
  { name: 'Bolivia', dial: '+591' },
  { name: 'Bosnia and Herzegovina', dial: '+387' },
  { name: 'Brazil', dial: '+55' },
  { name: 'Brunei', dial: '+673' },
  { name: 'Bulgaria', dial: '+359' },
  { name: 'Cambodia', dial: '+855' },
  { name: 'Cameroon', dial: '+237' },
  { name: 'Canada', dial: '+1' },
  { name: 'Chile', dial: '+56' },
  { name: 'China', dial: '+86' },
  { name: 'Colombia', dial: '+57' },
  { name: 'Croatia', dial: '+385' },
  { name: 'Cuba', dial: '+53' },
  { name: 'Cyprus', dial: '+357' },
  { name: 'Czech Republic', dial: '+420' },
  { name: 'Denmark', dial: '+45' },
  { name: 'Ecuador', dial: '+593' },
  { name: 'Egypt', dial: '+20' },
  { name: 'Estonia', dial: '+372' },
  { name: 'Ethiopia', dial: '+251' },
  { name: 'Finland', dial: '+358' },
  { name: 'France', dial: '+33' },
  { name: 'Georgia', dial: '+995' },
  { name: 'Germany', dial: '+49' },
  { name: 'Ghana', dial: '+233' },
  { name: 'Greece', dial: '+30' },
  { name: 'Hungary', dial: '+36' },
  { name: 'Iceland', dial: '+354' },
  { name: 'India', dial: '+91' },
  { name: 'Indonesia', dial: '+62' },
  { name: 'Iran', dial: '+98' },
  { name: 'Iraq', dial: '+964' },
  { name: 'Ireland', dial: '+353' },
  { name: 'Israel', dial: '+972' },
  { name: 'Italy', dial: '+39' },
  { name: 'Japan', dial: '+81' },
  { name: 'Jordan', dial: '+962' },
  { name: 'Kazakhstan', dial: '+7' },
  { name: 'Kenya', dial: '+254' },
  { name: 'Kuwait', dial: '+965' },
  { name: 'Kyrgyzstan', dial: '+996' },
  { name: 'Laos', dial: '+856' },
  { name: 'Latvia', dial: '+371' },
  { name: 'Lebanon', dial: '+961' },
  { name: 'Libya', dial: '+218' },
  { name: 'Lithuania', dial: '+370' },
  { name: 'Luxembourg', dial: '+352' },
  { name: 'Malaysia', dial: '+60' },
  { name: 'Maldives', dial: '+960' },
  { name: 'Malta', dial: '+356' },
  { name: 'Mexico', dial: '+52' },
  { name: 'Moldova', dial: '+373' },
  { name: 'Mongolia', dial: '+976' },
  { name: 'Morocco', dial: '+212' },
  { name: 'Mozambique', dial: '+258' },
  { name: 'Myanmar', dial: '+95' },
  { name: 'Nepal', dial: '+977' },
  { name: 'Netherlands', dial: '+31' },
  { name: 'New Zealand', dial: '+64' },
  { name: 'Nigeria', dial: '+234' },
  { name: 'Norway', dial: '+47' },
  { name: 'Oman', dial: '+968' },
  { name: 'Pakistan', dial: '+92' },
  { name: 'Palestine', dial: '+970' },
  { name: 'Peru', dial: '+51' },
  { name: 'Philippines', dial: '+63' },
  { name: 'Poland', dial: '+48' },
  { name: 'Portugal', dial: '+351' },
  { name: 'Qatar', dial: '+974' },
  { name: 'Romania', dial: '+40' },
  { name: 'Russia', dial: '+7' },
  { name: 'Saudi Arabia', dial: '+966' },
  { name: 'Senegal', dial: '+221' },
  { name: 'Serbia', dial: '+381' },
  { name: 'Singapore', dial: '+65' },
  { name: 'Slovakia', dial: '+421' },
  { name: 'Slovenia', dial: '+386' },
  { name: 'Somalia', dial: '+252' },
  { name: 'South Africa', dial: '+27' },
  { name: 'South Korea', dial: '+82' },
  { name: 'Spain', dial: '+34' },
  { name: 'Sri Lanka', dial: '+94' },
  { name: 'Sudan', dial: '+249' },
  { name: 'Sweden', dial: '+46' },
  { name: 'Switzerland', dial: '+41' },
  { name: 'Syria', dial: '+963' },
  { name: 'Taiwan', dial: '+886' },
  { name: 'Tajikistan', dial: '+992' },
  { name: 'Tanzania', dial: '+255' },
  { name: 'Thailand', dial: '+66' },
  { name: 'Tunisia', dial: '+216' },
  { name: 'Turkey', dial: '+90' },
  { name: 'Turkmenistan', dial: '+993' },
  { name: 'Uganda', dial: '+256' },
  { name: 'Ukraine', dial: '+380' },
  { name: 'United Arab Emirates', dial: '+971' },
  { name: 'United Kingdom', dial: '+44' },
  { name: 'United States', dial: '+1' },
  { name: 'Uruguay', dial: '+598' },
  { name: 'Uzbekistan', dial: '+998' },
  { name: 'Venezuela', dial: '+58' },
  { name: 'Vietnam', dial: '+84' },
  { name: 'Yemen', dial: '+967' },
  { name: 'Zimbabwe', dial: '+263' },
];

const GOOGLE_ICON = (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <g clipPath="url(#g2)">
      <path d="M47.532 24.552c0-1.636-.132-3.2-.388-4.698H24.48v8.884h12.971c-.56 2.992-2.24 5.528-4.776 7.228v6.004h7.728c4.52-4.164 7.13-10.3 7.13-17.418z" fill="#4285F4" />
      <path d="M24.48 48c6.48 0 11.916-2.148 15.888-5.832l-7.728-6.004c-2.148 1.44-4.896 2.292-8.16 2.292-6.276 0-11.592-4.236-13.5-9.924H2.988v6.18C6.948 42.9 15.156 48 24.48 48z" fill="#34A853" />
      <path d="M10.98 28.532A14.36 14.36 0 0 1 10.2 24c0-1.572.276-3.096.756-4.532V13.29H2.988A23.95 23.95 0 0 0 .48 24c0 3.876.924 7.548 2.508 10.71l8.0-6.178z" fill="#FBBC05" />
      <path d="M24.48 9.54c3.54 0 6.708 1.212 9.204 3.6l6.888-6.888C36.396 2.364 30.96 0 24.48 0 15.156 0 6.948 5.1 2.988 13.29l7.992 6.178C12.888 13.776 18.204 9.54 24.48 9.54z" fill="#EA4335" />
    </g>
    <defs><clipPath id="g2"><rect width="48" height="48" /></clipPath></defs>
  </svg>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [form, setForm] = useState({
    fullName: '', email: '', country: '', phoneNumber: '', password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  // Get the dial code for the selected country
  const selectedCountry = COUNTRIES.find(c => c.name === form.country);
  const dialCode = selectedCountry ? selectedCountry.dial : '';

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const fullPhone = dialCode ? `${dialCode} ${form.phoneNumber}` : form.phoneNumber;
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          phone: fullPhone,
          country: form.country,
        },
      },
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 50%, #dcfce7 100%)' }}>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center pt-[160px] pb-16 px-4">

        {/* Icon */}
        <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-secondary-900 mb-1">Create an account</h1>
        <p className="text-slate-500 mb-8 text-sm">Join us to easily book and manage your appointments</p>

        {success ? (
          <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-[420px] text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-secondary-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6">
              We sent a confirmation link to <strong>{form.email}</strong>. Please verify to activate your account.
            </p>
            <Link to="/login" className="inline-block bg-primary-500 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-primary-600 transition">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-[440px]">

            {/* Google */}
            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-5">
              {GOOGLE_ICON} Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-grow h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">Or register manually</span>
              <div className="flex-grow h-px bg-slate-200" />
            </div>

            {error && (
              <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input type="text" required value={form.fullName} onChange={set('fullName')}
                  placeholder="John Doe"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" required value={form.email} onChange={set('email')}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition" />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                <select value={form.country} onChange={set('country')} required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition bg-white text-slate-700">
                  <option value="">— Select a country —</option>
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.name} ({c.dial})</option>
                  ))}
                </select>
              </div>

              {/* Phone with auto-filled uneditable dial code */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone / WhatsApp</label>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-primary-400 transition">
                  {/* Dial code — read-only */}
                  <span className="flex items-center justify-center px-3 bg-slate-100 text-slate-600 text-sm font-semibold border-r border-slate-200 min-w-[64px] select-none">
                    {dialCode || '—'}
                  </span>
                  {/* Number — editable */}
                  <input
                    type="tel"
                    value={form.phoneNumber}
                    onChange={set('phoneNumber')}
                    placeholder="XXXX XXXXXX"
                    disabled={!form.country}
                    className="flex-grow px-3 py-3 text-sm outline-none bg-white disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed"
                  />
                </div>
                {!form.country && (
                  <p className="text-xs text-slate-400 mt-1 ml-1">Select a country first to enable this field</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password} onChange={set('password')}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary-400 transition" />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3.5 rounded-xl transition-all text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            {/* Footer link */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-grow h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">Registered already?</span>
              <div className="flex-grow h-px bg-slate-200" />
            </div>

            <Link to="/login"
              className="w-full flex items-center justify-center border border-slate-200 rounded-xl py-3 text-sm font-bold text-secondary-900 hover:bg-slate-50 transition-all">
              Already have an account
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
