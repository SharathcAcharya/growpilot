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
      <nav className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                🚀
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">GrowPilot</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-200"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200"
              >
                Get Started Free →
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-8 animate-fade-in">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-medium text-blue-300">Powered by AI & DeepSeek</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-slide-in">
            <span className="bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Marketing Automation
            </span>
            <br />
            <span className="text-white">That Actually Works</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in">
            Stop wasting time on repetitive marketing tasks. Let AI handle content creation, 
            campaigns, SEO, and influencer outreach while you focus on growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-scale-in">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-200 group"
            >
              Start Free Trial
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button 
              onClick={() => router.push('/login')}
              className="px-8 py-4 rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur text-white text-lg font-semibold hover:border-purple-400 hover:bg-white/10 transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in">
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '1M+', label: 'Content Pieces' },
              { value: '500K+', label: 'Campaigns' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Everything You Need</h2>
          <p className="text-xl text-gray-300">All your marketing tools in one intelligent platform</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group ${
                activeFeature === i ? 'ring-2 ring-purple-400' : ''
              }`}
              onMouseEnter={() => setActiveFeature(i)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium">
                <span>⚡</span>
                <span>{feature.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="glass border border-border/50 rounded-3xl p-12 backdrop-blur-xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 gradient-text">See It In Action</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Watch how GrowPilot can generate a complete marketing campaign in under 60 seconds.
                </p>
                
                <div className="space-y-4">
                  {['Content Generation', 'Campaign Setup', 'Performance Analytics'].map((step, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-background/50 border border-border/50">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {i + 1}
                      </div>
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-2xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border/50 backdrop-blur-xl">
                  <div className="text-6xl">▶️</div>
                </div>
                <div className="absolute -bottom-6 -right-6 px-6 py-3 rounded-xl bg-success text-white font-semibold shadow-xl">
                  ⚡ 60 sec setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Loved by Marketers</h2>
          <p className="text-xl text-muted-foreground">Join thousands of teams growing faster with GrowPilot</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="p-8 rounded-2xl glass border border-border/50 hover:border-primary/50 transition-all duration-300 card-hover">
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              
              <p className="text-muted-foreground mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">Simple Pricing</h2>
          <p className="text-xl text-muted-foreground">Start free, scale as you grow</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              className={`p-8 rounded-2xl glass border transition-all duration-300 card-hover ${
                plan.popular
                  ? 'border-primary ring-2 ring-primary/20 scale-105'
                  : 'border-border/50 hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="inline-block px-4 py-1 rounded-full bg-linear-to-r from-primary to-secondary text-white text-sm font-medium mb-4">
                  ⭐ Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                {plan.price !== 'Free' && <span className="text-muted-foreground">/month</span>}
              </div>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              
              <button
                onClick={() => router.push('/dashboard')}
                className={`w-full py-3 rounded-xl font-semibold mb-6 transition-all duration-200 ${
                  plan.popular
                    ? 'bg-linear-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105'
                    : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {plan.cta}
              </button>
              
              <div className="space-y-3">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <span className="text-success">✓</span>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center p-16 rounded-3xl bg-linear-to-r from-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to 10x Your Marketing?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 10,000+ businesses using AI to grow faster and smarter.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 rounded-xl bg-white text-primary text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-200"
            >
              Get Started Free - No Credit Card Required
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold gradient-text">GrowPilot</span>
              </div>
              <p className="text-muted-foreground text-sm">
                AI-powered marketing automation for modern businesses.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>API</div>
                <div>Integrations</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Privacy</div>
                <div>Terms</div>
                <div>Security</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 GrowPilot. Built with ❤️ for marketers everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
