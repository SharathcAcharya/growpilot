'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: '🎨',
      title: 'AI Content Creation',
      description: 'Generate blogs, social posts, and ad copy in seconds with GPT-4',
      gradient: 'from-purple-500 to-pink-500',
      stats: '10,000+ pieces generated',
    },
    {
      icon: '📊',
      title: 'Smart Analytics',
      description: 'Real-time campaign performance tracking with predictive insights',
      gradient: 'from-blue-500 to-cyan-500',
      stats: '99.9% accuracy',
    },
    {
      icon: '🚀',
      title: 'Auto Campaigns',
      description: 'Launch Facebook, Instagram, and Google ads with one click',
      gradient: 'from-orange-500 to-red-500',
      stats: '5x faster setup',
    },
    {
      icon: '🎯',
      title: 'Influencer Intel',
      description: 'AI-powered influencer discovery and outreach automation',
      gradient: 'from-green-500 to-emerald-500',
      stats: '100K+ influencers',
    },
    {
      icon: '🔍',
      title: 'SEO Optimizer',
      description: 'Automated SEO audits and content optimization recommendations',
      gradient: 'from-indigo-500 to-purple-500',
      stats: '10+ ranking factors',
    },
    {
      icon: '🤖',
      title: 'AI Copilot',
      description: 'Your 24/7 marketing assistant powered by GPT-4',
      gradient: 'from-pink-500 to-rose-500',
      stats: 'Always available',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Founder, TechStart',
      image: '👩‍💼',
      quote: 'GrowPilot reduced our marketing costs by 70% while tripling our reach.',
      rating: 5,
    },
    {
      name: 'Michael Roberts',
      role: 'CMO, GrowthCo',
      image: '👨‍💼',
      quote: 'The AI content quality is indistinguishable from our human writers.',
      rating: 5,
    },
    {
      name: 'Emily Zhang',
      role: 'Marketing Director',
      image: '👩‍💻',
      quote: 'Went from 2 hours to 5 minutes for campaign setup. Mind-blowing!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                🚀
              </div>
              <span className="text-lg sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GrowPilot</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-3 sm:px-5 py-2 sm:py-2.5 text-sm sm:text-base rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
              >
                <span className="hidden sm:inline">Get Started Free →</span>
                <span className="sm:hidden">Start Free</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 md:pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6 sm:mb-8 animate-fade-in">
            <span className="text-xl sm:text-2xl">✨</span>
            <span className="text-xs sm:text-sm font-medium text-blue-300">Powered by AI & DeepSeek</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 sm:mb-8 leading-tight animate-slide-in px-2">
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Marketing Automation
            </span>
            <br />
            <span className="text-white">That Actually Works</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in px-4">
            Stop wasting time on repetitive marketing tasks. Let AI handle content creation, 
            campaigns, SEO, and influencer outreach while you focus on growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 animate-scale-in px-4">
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 group"
            >
              Start Free Trial
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur text-white text-base sm:text-lg font-semibold hover:border-purple-400 hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto animate-fade-in px-4">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '1M+', label: 'Content Pieces' },
              { value: '500K+', label: 'Campaigns' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-4">Everything You Need</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">All your marketing tools in one intelligent platform</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${
                activeFeature === i ? 'ring-2 ring-purple-400' : ''
              }`}
              onMouseEnter={() => setActiveFeature(i)}
              onClick={() => setActiveFeature(i)}
            >
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium">
                <span>⚡</span>
                <span>{feature.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">See It In Action</h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
                  Watch how GrowPilot can generate a complete marketing campaign in under 60 seconds.
                </p>
                
                <div className="space-y-3 sm:space-y-4">
                  {['Content Generation', 'Campaign Setup', 'Performance Analytics'].map((step, i) => (
                    <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm sm:text-base font-bold">
                        {i + 1}
                      </div>
                      <span className="font-medium text-white text-sm sm:text-base">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-6 lg:mt-0">
                <div className="aspect-video rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 backdrop-blur-xl">
                  <div className="text-4xl sm:text-5xl md:text-6xl">▶️</div>
                </div>
                <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl bg-green-500 text-white text-sm sm:text-base font-semibold shadow-xl">
                  ⚡ 60 sec setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-4">Loved by Marketers</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">Join thousands of teams growing faster with GrowPilot</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg sm:text-xl">★</span>
                ))}
              </div>
              
              <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl sm:text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-4">Simple Pricing</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 px-4">Start free, scale as you grow</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {[
            {
              name: 'Starter',
              price: 'Free',
              description: 'Perfect for trying out GrowPilot',
              features: ['5 campaigns/month', '100 AI-generated pieces', 'Basic analytics', 'Email support'],
              cta: 'Start Free',
              popular: false,
            },
            {
              name: 'Pro',
              price: '$49',
              description: 'For growing businesses',
              features: ['Unlimited campaigns', 'Unlimited AI content', 'Advanced analytics', 'Priority support', 'Custom integrations'],
              cta: 'Start Free Trial',
              popular: true,
            },
            {
              name: 'Business',
              price: '$199',
              description: 'For established companies',
              features: ['Everything in Pro', 'White-label option', 'Dedicated account manager', 'Custom AI training', 'SLA guarantee'],
              cta: 'Contact Sales',
              popular: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? 'border-purple-400 ring-2 ring-purple-400/20 sm:scale-105'
                  : 'border-white/10 hover:border-purple-400/50'
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-3 sm:px-4 py-1 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  ⭐ Most Popular
                </div>
              )}
              
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="mb-3 sm:mb-4">
                <span className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{plan.price}</span>
                {plan.price !== 'Free' && <span className="text-gray-400 text-sm sm:text-base">/month</span>}
              </div>
              <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">{plan.description}</p>
              
              <button
                onClick={() => router.push('/register')}
                className={`w-full py-2.5 sm:py-3 text-sm sm:text-base rounded-xl font-semibold mb-5 sm:mb-6 transition-all duration-200 ${
                  plan.popular
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'border-2 border-purple-400 text-purple-300 hover:bg-purple-600 hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
              
              <div className="space-y-2 sm:space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start space-x-2 sm:space-x-3">
                    <span className="text-green-400 text-sm sm:text-base mt-0.5">✓</span>
                    <span className="text-xs sm:text-sm text-gray-300 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center p-8 sm:p-12 md:p-16 rounded-2xl sm:rounded-3xl bg-linear-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to 10x Your Marketing?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 px-4">
              Join 10,000+ businesses using AI to grow faster and smarter.
            </p>
            <button
              onClick={() => router.push('/register')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg rounded-xl bg-white text-purple-600 font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              <span className="hidden sm:inline">Get Started Free - No Credit Card Required</span>
              <span className="sm:hidden">Get Started Free</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                  🚀
                </div>
                <span className="text-lg sm:text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GrowPilot</span>
              </div>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                AI-powered marketing automation for modern businesses. Grow faster with intelligent campaigns.
              </p>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Product</h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <a href="#features" className="block text-gray-400 hover:text-purple-300 transition-colors">Features</a>
                <a href="#pricing" className="block text-gray-400 hover:text-purple-300 transition-colors">Pricing</a>
                <a href="/dashboard" className="block text-gray-400 hover:text-purple-300 transition-colors">Dashboard</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">API Docs</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Integrations</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Company</h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">About Us</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Contact</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Press Kit</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Legal</h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <a href="/privacy" className="block text-gray-400 hover:text-purple-300 transition-colors">Privacy Policy</a>
                <a href="/terms" className="block text-gray-400 hover:text-purple-300 transition-colors">Terms of Service</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Cookie Policy</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Security</a>
                <a href="#" className="block text-gray-400 hover:text-purple-300 transition-colors">Compliance</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between text-gray-400 text-xs sm:text-sm space-y-3 md:space-y-0">
            <p className="text-center md:text-left">&copy; 2025 GrowPilot. Built with ❤️ for marketers everywhere.</p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
              <span className="text-gray-500">Powered by</span>
              <span className="text-purple-400 font-semibold">DeepSeek AI</span>
              <span className="text-gray-500">•</span>
              <span className="text-blue-400 font-semibold">OpenRouter</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
