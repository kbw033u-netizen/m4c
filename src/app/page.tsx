'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Check, HeartHandshake, Globe2, ShieldCheck, Users, MessageSquareText, HandCoins, Menu, X, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { label: 'About M4C', href: '#about' },
  { label: 'Vision & Values', href: '#values' },
  { label: 'Get Involved', href: '#involve' },
  { label: 'Contact', href: '#contact' },
];

const values = [
  {
    title: 'Peace',
    description: 'Promoting peaceful coexistence and non-violent approaches.',
    icon: ShieldCheck,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Unity',
    description: 'Bringing people and communities together around shared aspirations.',
    icon: Users,
    color: 'bg-yellow-100 text-yellow-600',
  },
  {
    title: 'Integrity',
    description: 'Upholding honesty, accountability and ethical conduct.',
    icon: Check,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Respect',
    description: 'Recognizing the dignity, rights and perspectives of every person.',
    icon: HeartHandshake,
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Inclusivity',
    description: 'Creating space for people from diverse backgrounds to participate.',
    icon: Globe2,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Dialogue',
    description: 'Encouraging communication, listening and constructive engagement.',
    icon: MessageSquareText,
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    title: 'Service',
    description: 'Putting communities and the common good at the heart of our work.',
    icon: HandCoins,
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const counties = [
  'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita-Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit',
  'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
  'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo-Marakwet',
  'Nandi', 'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga',
  'Bungoma', 'Busia', 'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi',
];

const stats = [
  { number: '1000+', label: 'Peace Ambassadors', icon: '🕊️' },
  { number: '47', label: 'Counties Engaged', icon: '🗺️' },
  { number: '15K+', label: 'Citizens Mobilized', icon: '👥' },
  { number: '500+', label: 'Community Leaders', icon: '🎯' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    county: '',
    interest: '',
    email: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormMessage('');

    try {
      const response = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus('success');
        setFormMessage('✓ Thank you! Welcome to M4C. Check your WhatsApp for next steps!');
        setFormData({ fullName: '', phoneNumber: '', county: '', interest: '', email: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setFormMessage(data.message || 'Failed to register. Please try again.');
      }
    } catch (error) {
      setFormStatus('error');
      setFormMessage('Network error. Please check your connection.');
    }
  };

  return (
    <main className="bg-gradient-to-b from-white via-[#f8f9fa] to-[#f0f1f3] text-slate-800">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur shadow-lg' : 'bg-white/80 backdrop-blur'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative h-12 w-12 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-yellow-500 opacity-90" />
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-black bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">M4C</span>
              </div>
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-blue-600 group-hover:text-blue-700">M4C</div>
              <div className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-semibold">Peace Movement</div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-blue-600 hover:underline underline-offset-4">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="hidden rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 md:inline-flex hover:bg-slate-100"
            >
              {language === 'en' ? '🇸🇪 SW' : '🇬🇧 EN'}
            </button>
            <button className="hidden sm:inline-flex rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition hover:from-blue-700 hover:to-blue-800">
              Join Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex rounded-lg border border-slate-200 p-2 lg:hidden hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="px-2 py-2 text-sm font-medium text-slate-700 hover:text-blue-600">
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-yellow-300/20 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-3xl -z-10" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Kenya's Premier Peace Movement
            </div>

            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="text-slate-900">Promoting Peace, Unity & </span>
                <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-yellow-500 bg-clip-text text-transparent">Constructive Dialogue</span>
                <span className="text-slate-900"> Across Kenya</span>
              </h1>

              <p className="mt-6 text-lg md:text-xl leading-relaxed text-slate-600 max-w-2xl">
                Movement for Change (M4C) unites citizens, communities, and leaders to build a peaceful, inclusive, and harmonious nation through grassroots mobilization and civic engagement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl transition hover:from-blue-700 hover:to-blue-800">
                Become a Peace Ambassador
                <ArrowRight className="h-5 w-5" />
              </button>

              <button className="inline-flex items-center justify-center rounded-full border-2 border-slate-300 bg-white px-8 py-4 text-base font-bold text-slate-800 transition hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50">
                Learn More
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              {['✓ Community-Led', '✓ 47 Counties', '✓ Transparent'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Image Card */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-yellow-400/10 rounded-3xl" />
            <div className="relative w-full aspect-square rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-yellow-500 p-1 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-yellow-500 opacity-20 blur-xl -z-10" />
              <div className="w-full h-full bg-white rounded-[26px] flex flex-col items-center justify-center p-8 space-y-6">
                <div className="text-6xl font-black text-transparent bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text">M4C</div>
                <div className="text-center space-y-2">
                  <p className="text-xs uppercase tracking-widest font-black text-blue-600">Movement for Change</p>
                  <p className="text-sm font-semibold text-slate-600">Kenya's Path to Peace</p>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
                <div className="grid grid-cols-2 gap-4 w-full text-center text-xs font-bold">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xl font-black text-blue-600">1K+</p>
                    <p className="text-slate-600">Ambassadors</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-xl font-black text-yellow-600">47</p>
                    <p className="text-slate-600">Counties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-md border border-slate-200 hover:shadow-lg transition text-center">
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-2xl md:text-3xl font-black text-blue-600">{stat.number}</p>
              <p className="text-xs md:text-sm font-semibold text-slate-600 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-xs font-black text-blue-600 uppercase tracking-widest mb-4">About M4C</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">
            Our Vision & <span className="text-transparent bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text">Mission</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-xl">
            <p className="text-xs uppercase tracking-widest font-black text-blue-100 mb-4">Who We Are</p>
            <h3 className="text-2xl font-black mb-4">United for Kenya</h3>
            <p className="text-blue-50 leading-relaxed">
              A dynamic movement of citizens, youth, women, faith leaders, and community advocates strengthening national cohesion and peaceful participation.
            </p>
          </div>

          <div className="lg:col-span-1 rounded-2xl bg-white p-8 shadow-xl border-2 border-blue-200">
            <p className="text-xs uppercase tracking-widest font-black text-blue-600 mb-4">Vision</p>
            <h3 className="text-xl font-black text-slate-900 mb-4">A Peaceful Kenya</h3>
            <p className="text-slate-600 leading-relaxed">
              A peaceful, united and inclusive Kenya where every person lives with dignity, participates meaningfully in society, and contributes to a just, prosperous and harmonious nation.
            </p>
          </div>

          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 text-slate-900 shadow-xl">
            <p className="text-xs uppercase tracking-widest font-black text-yellow-900 mb-4">Mission</p>
            <h3 className="text-xl font-black mb-4">Peace in Action</h3>
            <p className="text-yellow-900 leading-relaxed font-semibold">
              To promote peace, national unity, and social cohesion through community empowerment, responsible citizenship, and peaceful solutions to societal challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Core Values</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              The <span className="text-transparent bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text">Principles</span> Guiding Our Work
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {values.map(({ title, description, icon: Icon, color }) => (
              <div key={title} className="group rounded-2xl bg-white p-6 shadow-md border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${color} group-hover:scale-110 transition`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Form Section */}
      <section id="involve" className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-yellow-500 p-8 lg:p-16 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-10" />
          
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
            <div className="text-white space-y-6">
              <span className="inline-block px-4 py-2 rounded-full bg-white/20 text-xs font-black text-white uppercase tracking-widest">Get Involved</span>
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">
                Join the Movement for Peace & Unity
              </h2>
              <p className="text-lg text-blue-50 leading-relaxed">
                Help mobilize communities, strengthen civic participation, and promote constructive dialogue across Kenya. Become a Peace Ambassador today.
              </p>
              <div className="flex items-center gap-3 pt-4">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">No experience necessary</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">WhatsApp community support</span>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="rounded-2xl bg-white p-8 shadow-2xl space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleFormChange}
                  placeholder="+254 712 345 678"
                  required
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">County *</label>
                  <select
                    name="county"
                    value={formData.county}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 outline-none text-sm transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select County</option>
                    {counties.map((county) => (
                      <option key={county} value={county}>
                        {county}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-800">Role *</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleFormChange}
                    required
                    className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-3 outline-none text-sm transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Select Role</option>
                    <option>Community Mobilizer</option>
                    <option>Youth Leader</option>
                    <option>Women Leader</option>
                    <option>Dialogue Facilitator</option>
                    <option>Faith Leader</option>
                    <option>General Volunteer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-800">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="your.email@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {formStatus === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-green-700">{formMessage}</p>
                </div>
              )}

              {formStatus === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-red-700">{formMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'loading'}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-base font-bold text-white shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'loading' ? 'Registering...' : 'Join M4C Now'}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-900 text-slate-600 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-yellow-500" />
                  <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-black bg-gradient-to-r from-blue-600 to-yellow-500 bg-clip-text text-transparent">M4C</span>
                  </div>
                </div>
                <div>
                  <p className="font-black text-slate-900">M4C</p>
                  <p className="text-[10px] text-slate-500">Peace Movement</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Promoting peace, unity, and constructive dialogue across Kenya through citizen-led action and community empowerment.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-blue-600 transition">About M4C</a></li>
                <li><a href="#values" className="hover:text-blue-600 transition">Values</a></li>
                <li><a href="#involve" className="hover:text-blue-600 transition">Get Involved</a></li>
                <li><a href="#contact" className="hover:text-blue-600 transition">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-4">Connect With Us</h3>
              <ul className="space-y-2 text-sm">
                <li>📱 <a href="#" className="hover:text-blue-600 transition">WhatsApp Community</a></li>
                <li>𝕏 <a href="#" className="hover:text-blue-600 transition">Twitter/X</a></li>
                <li>🎵 <a href="#" className="hover:text-blue-600 transition">TikTok</a></li>
                <li>f <a href="#" className="hover:text-blue-600 transition">Facebook</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-4">Contact Info</h3>
              <ul className="space-y-3 text-sm">
                <li className="text-slate-900 font-semibold">hello@m4c.or.ke</li>
                <li className="text-slate-900 font-semibold">+254 (0) XXX XXX XXX</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-slate-600">© 2025 Movement for Change (M4C). All rights reserved.</p>
            <div className="flex gap-6 text-slate-600">
              <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-blue-600 transition">Impact Report</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}