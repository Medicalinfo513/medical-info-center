import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Plane, CreditCard, ChevronDown, Plus, Minus, Search } from 'lucide-react';
import { Footer } from '../components/Footer';
import Header from '../components/Header';
import { useLang } from '../context/LanguageContext';
import { translations } from '../lib/translations';
import Meta from '../components/Meta';

const FAQItem = ({ question, answer, isOpen, onClick }) => (
  <div className={`mb-4 rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'bg-primary-50/50 border-primary-100 shadow-lg shadow-primary-500/5' : 'bg-white border-slate-100 hover:border-primary-100'}`}>
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left group"
    >
      <span className={`text-[15px] font-bold transition-colors ${isOpen ? 'text-primary-700' : 'text-slate-700 group-hover:text-primary-600'}`}>
        {question}
      </span>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary-500 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500'}`}>
        <ChevronDown size={18} />
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="px-6 pb-6 pt-0">
            <p className="text-slate-500 text-sm leading-relaxed border-t border-primary-100 pt-4">
              {answer}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FAQPage = () => {
  const { lang } = useLang();
  const t = translations[lang].faq;
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const ICON_MAP = { HelpCircle, Plane, CreditCard };

  const filteredQuestions = t.questions.filter(q => {
    const matchesSearch = q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || q.cat === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Meta 
        title={t.metaTitle}
        description={t.metaDesc}
      />
      <Header />
      <main className="flex-grow pt-[93px] md:pt-[90px]">
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-50/30 to-transparent pointer-events-none" />
          <div className="container-custom relative z-10">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              >
                <HelpCircle size={14} />
                {t.heroBadge}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight"
              >
                {t.heroTitle}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg text-slate-500 leading-relaxed"
              >
                {t.heroSubtitle}
              </motion.p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
              
              {/* Sidebar Filters */}
              <aside className="w-full lg:w-1/3">
                <div className="sticky top-28">
                  {/* Search */}
                  <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" 
                      placeholder={lang === 'bn' ? 'প্রশ্ন খুঁজুন...' : 'Search questions...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Categories */}
                  <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 px-2">{lang === 'bn' ? 'বিভাগ' : 'Categories'}</h3>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setActiveCategory('All')}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === 'All' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        <HelpCircle size={16} />
                        {lang === 'bn' ? 'সব' : 'All'}
                      </button>
                      {t.categories.map((cat) => {
                        const Icon = ICON_MAP[cat.icon] || HelpCircle;
                        return (
                          <button 
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat.name ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:bg-slate-50'}`}
                          >
                            <Icon size={16} />
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>

              {/* FAQ List */}
              <div className="w-full lg:w-2/3">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeCategory + searchQuery}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((item, idx) => (
                        <FAQItem 
                          key={idx}
                          question={item.q}
                          answer={item.a}
                          isOpen={openIndex === idx}
                          onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                        />
                      ))
                    ) : (
                      <div className="bg-white border border-dashed border-slate-200 rounded-[32px] py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                           <Search size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{lang === 'bn' ? 'কোনো ফল পাওয়া যায়নি' : 'No results found'}</h3>
                        <p className="text-slate-500 text-sm">{lang === 'bn' ? 'অন্য কোনো কীওয়ার্ড দিয়ে চেষ্টা করুন।' : 'Try searching with different keywords.'}</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
