import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      const sections = ['home', 'features', 'pricing', 'testimonials']
      for (let section of sections) {
        const element = document.getElementById(section)
        if (element && element.offsetTop - 100 <= window.scrollY) {
          setActiveSection(section)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <div className="relative w-full overflow-hidden bg-white text-gray-900">
      {/* Subtle Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-gradient-to-tr from-gray-50 to-gray-100 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"></div>
              <span className="absolute inset-0 flex items-center justify-center text-white font-black text-lg">MC</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-black text-xl text-gray-900">MeetConnect</p>
              <p className="text-xs text-gray-500">Redefine Communication</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { id: 'home', label: 'Home' },
              { id: 'features', label: 'Features' },
              { id: 'pricing', label: 'Pricing' },
              { id: 'testimonials', label: 'Testimonials' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 relative ${
                  activeSection === item.id
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900 rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300 hover:shadow-lg shadow-gray-900/20"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200/50 animate-in fade-in slide-in-from-top-2">
            <div className="px-6 py-4 space-y-3">
              {[
                { id: 'home', label: 'Home' },
                { id: 'features', label: 'Features' },
                { id: 'pricing', label: 'Pricing' },
                { id: 'testimonials', label: 'Testimonials' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-gray-200/50 space-y-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div 
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-gray-50 backdrop-blur"
            style={{
              animation: 'fadeInDown 0.8s ease-out',
            }}
          >
            <span className="w-2 h-2 bg-gray-900 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-700">Next Generation Communication Platform</span>
          </div>

          {/* Main Headline */}
          <h1 
            className="text-6xl md:text-8xl font-black mb-6 leading-tight text-gray-900"
            style={{
              animation: 'fadeInUp 1s ease-out 0.2s backwards',
            }}
          >
            Connect Globally<br />
            <span className="text-6xl md:text-7xl font-black">Instantly</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{
              animation: 'fadeInUp 1s ease-out 0.4s backwards',
            }}
          >
            Experience crystal-clear meetings with military-grade encryption. Built for the future of work.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            style={{
              animation: 'fadeInUp 1s ease-out 0.6s backwards',
            }}
          >
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl shadow-gray-900/30 hover:scale-105 text-lg"
            >
              Start Meeting Now
            </button>
            <button
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition-all duration-300 text-lg"
            >
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div 
            className="grid grid-cols-3 gap-6 md:gap-12 max-w-2xl mx-auto"
            style={{
              animation: 'fadeInUp 1s ease-out 0.8s backwards',
            }}
          >
            {[
              { number: '50M+', label: 'Active Users' },
              { number: '99.9%', label: 'Uptime' },
              { number: '150+', label: 'Countries' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="group cursor-pointer"
              >
                <p className="text-4xl md:text-5xl font-black text-gray-900 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </p>
                <p className="text-sm md:text-base text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-32 right-10 w-32 h-32 border-2 border-gray-200 rounded-3xl opacity-20 blur-sm animate-float" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-32 left-10 w-24 h-24 border border-gray-300 rounded-full opacity-10 blur-sm animate-float" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-6 border-t border-gray-200/50 bg-gray-50/50 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 
              className="text-5xl md:text-6xl font-black mb-4 text-gray-900"
              style={{
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Everything you need for seamless, secure communication</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎥',
                title: 'Crystal Clear Video',
                desc: '4K resolution with adaptive bitrate streaming for perfect clarity',
              },
              {
                icon: '🔐',
                title: 'End-to-End Encrypted',
                desc: 'Military-grade AES-256 encryption protecting every conversation',
              },
              {
                icon: '👥',
                title: 'Group Meetings',
                desc: 'Connect with up to 1000 participants without any compromise',
              },
              {
                icon: '🎤',
                title: 'AI Audio Processing',
                desc: 'Advanced noise cancellation and intelligent voice enhancement',
              },
              {
                icon: '🖥️',
                title: 'Screen Sharing',
                desc: 'Share, annotate, and collaborate in real-time seamlessly',
              },
              {
                icon: '⚡',
                title: 'Instant Start',
                desc: 'No downloads needed - join meetings in a single click',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative"
                style={{
                  animation: `slideInUp 0.6s ease-out ${0.1 * idx}s backwards`,
                }}
              >
                {/* Card */}
                <div className="relative bg-white border border-gray-200 hover:border-gray-400 rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:translate-y-[-8px] hover:bg-gray-50">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-black mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                  
                  {/* Bottom Accent Line */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-gray-900 group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6 border-t border-gray-200/50 z-10">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 
              className="text-5xl md:text-6xl font-black mb-4 text-gray-900"
              style={{
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-600">Choose the perfect plan for your needs</p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                desc: 'Perfect for getting started',
                features: ['Up to 100 participants', '45-minute group calls', 'Basic screen sharing', 'HD video quality'],
                highlighted: false,
              },
              {
                name: 'Pro',
                price: '$199',
                desc: 'For growing teams',
                features: ['Unlimited participants', 'Unlimited group calls', 'Advanced recording', 'Priority support', 'Custom backgrounds'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'For large organizations',
                features: ['Dedicated support', 'Custom branding', 'SSO integration', 'Advanced analytics', 'SLA guarantee'],
                highlighted: false,
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`group relative ${plan.highlighted ? 'md:scale-105' : ''}`}
                style={{
                  animation: `slideInUp 0.6s ease-out ${0.1 * idx}s backwards`,
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -inset-1 bg-gray-900 rounded-3xl blur opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                )}
                
                <div className={`relative bg-white border ${plan.highlighted ? 'border-gray-900 shadow-2xl' : 'border-gray-200 hover:border-gray-400'} rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-xl`}>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{plan.desc}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-gray-600 text-sm">/month</span>}
                  </div>

                  <button className={`w-full py-3 font-bold rounded-xl mb-8 transition-all duration-300 ${
                    plan.highlighted
                      ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    Choose Plan
                  </button>

                  <ul className="space-y-4">
                    {plan.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-3 text-gray-700">
                        <svg className="w-5 h-5 text-gray-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-32 px-6 border-t border-gray-200/50 bg-gray-50/50 z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 
              className="text-5xl md:text-6xl font-black mb-4 text-gray-900"
              style={{
                animation: 'fadeInUp 0.8s ease-out',
              }}
            >
              Loved by Teams
            </h2>
            <p className="text-lg text-gray-600">See what our users have to say</p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'CEO, TechStart',
                text: 'MeetConnect transformed how our distributed team collaborates. The quality is unmatched and the security is top-notch.',
                avatar: '👩‍💼',
              },
              {
                name: 'Michael Johnson',
                role: 'Director, Global Corp',
                text: 'Best meeting platform we\'ve tried. Security features gave us complete peace of mind and reduced our IT overhead significantly.',
                avatar: '👨‍💼',
              },
              {
                name: 'Emma Rodriguez',
                role: 'Founder, CreativeHub',
                text: 'The ease of use combined with powerful features is exactly what we needed. Our team productivity has increased dramatically.',
                avatar: '👩‍🎨',
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="group relative"
                style={{
                  animation: `slideInUp 0.6s ease-out ${0.1 * idx}s backwards`,
                }}
              >
                <div className="relative bg-white border border-gray-200 hover:border-gray-400 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:translate-y-[-8px]">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl">{testimonial.avatar}</div>
                    <div className="text-left">
                      <p className="font-black text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 px-6 border-t border-gray-200/50 bg-gray-900 text-white z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-5xl md:text-6xl font-black mb-6"
            style={{
              animation: 'fadeInUp 0.8s ease-out',
            }}
          >
            Ready to Transform Your Meetings?
          </h2>
          
          <p 
            className="text-lg text-gray-300 mb-8"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.2s backwards',
            }}
          >
            Join millions of users who are already connecting with MeetConnect.
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-white text-gray-900 font-black rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg shadow-lg"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.4s backwards',
            }}
          >
            Get Started For Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 py-12 px-6 bg-white z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <p className="font-black text-lg text-gray-900 mb-2">MeetConnect</p>
              <p className="text-sm text-gray-600">Connecting the world, one meeting at a time.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Roadmap'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies', 'GDPR'] },
            ].map((col, idx) => (
              <div key={idx}>
                <p className="font-bold text-gray-900 mb-4">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200/50 pt-8">
            <p className="text-center text-sm text-gray-600">
              © 2024 MeetConnect. All rights reserved. Built with ✨
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}