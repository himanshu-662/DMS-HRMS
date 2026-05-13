import { useState, useEffect } from 'react';
import {
  Zap, Users, Clock, CalendarDays, DollarSign, UserPlus,
  Target, Package, HelpCircle, BarChart3, Shield,
  CheckCircle2, ArrowRight, Play, Star, Menu, X,
  Smartphone, Workflow,
  Quote, Activity, Fingerprint, Cpu } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const features = [
  { icon: Users, title: 'Employee Profiles', description: 'Manage employee data, documents, and company hierarchy in one central place.' },
  { icon: Clock, title: 'Attendance', description: 'Track employee work hours, check-ins, and attendance reports with ease.' },
  { icon: CalendarDays, title: 'Leaves & Holidays', description: 'Simplify leave requests, approvals, and holiday calendar management.' },
  { icon: DollarSign, title: 'Payroll Management', description: 'Automate salary calculations, tax deductions, and payslip generation.' },
  { icon: UserPlus, title: 'Recruitment', description: 'Manage job postings, track candidates, and streamline your hiring process.' },
  { icon: Target, title: 'Performance', description: 'Set goals, track progress, and conduct performance reviews effortlessly.' },
  { icon: Package, title: 'Asset Management', description: 'Track company equipment, assignments, and maintenance logs.' },
  { icon: HelpCircle, title: 'Help Desk', description: 'Internal support system for employee queries and incident management.' },
  { icon: BarChart3, title: 'Reports & Analytics', description: 'Get deep insights into your workforce with visual reports and data.' },
  { icon: Shield, title: 'Data Security', description: 'Role-based access control and secure data encryption for your organization.' },
  { icon: Workflow, title: 'Workflows', description: 'Automate repetitive HR tasks and approval chains to save time.' },
  { icon: Smartphone, title: 'Mobile Friendly', description: 'Access your HR portal on the go with our fully responsive interface.' }
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
  { value: '50%', label: 'More Productive' },
  { value: '10k+', label: 'Users' }
];

const testimonials = [
  { name: 'Sarah Chen', role: 'HR Manager', company: 'TechFlow', quote: 'DMS HRMS has simplified our daily operations. Our team is much more organized now.' },
  { name: 'Michael Roberts', role: 'Operations Lead', company: 'Global Solutions', quote: 'The cleanest HR tool we have used. It does exactly what it says without any fluff.' },
  { name: 'Emily Watson', role: 'Founder', company: 'InnoLabs', quote: 'The interface is beautiful and intuitive. My employees love using it every day.' }
];

const pricingPlans = [
  {
    name: 'Basic',
    price: 49,
    description: 'Perfect for small teams starting out.',
    features: ['Up to 25 Employees', 'Core HR Features', 'Attendance Tracking', 'Leave Management', 'Standard Reports'],
    popular: false
  },
  {
    name: 'Business',
    price: 99,
    description: 'Advanced tools for growing companies.',
    features: ['Up to 100 Employees', 'All Basic Features', 'Payroll Management', 'Recruitment Tool', 'Custom Workflows'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full capacity for large organizations.',
    features: ['Unlimited Employees', 'Full Analytics Suite', 'API Integration', 'Dedicated Manager', 'Premium Support'],
    popular: false
  }
];

export default function Landing({ onGetStarted }) {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    onGetStarted();
    dispatch({ type: 'SET_SHOW_LANDING', payload: false });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 py-3" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DMS <span className="text-primary-500">HRMS</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_SHOW_LANDING', payload: false })}
              className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Login
            </button>
            <button
              onClick={handleGetStarted}
              className="px-5 py-2 bg-primary-600 text-white text-sm font-bold rounded-xl hover:bg-primary-500 transition-all shadow-lg shadow-primary-900/20 active:scale-95 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-6 animate-fade-in">
            <div className="space-y-4">
              {['Features', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-medium text-zinc-400" onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
              <button
                onClick={handleGetStarted}
                className="w-full py-3 bg-primary-600 text-white text-sm font-bold rounded-xl">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-40">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">Simple & Powerful HR Software</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-8">
            Modern HR Solution <br />
            <span className="text-primary-500">For Your Team</span>
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Manage your entire workforce in one clean, intuitive portal. Designed for growing teams that value simplicity and productivity.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black text-sm font-bold rounded-2xl hover:bg-zinc-200 transition-all shadow-xl active:scale-95 group">
              Start Your Free Trial
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-primary-500 fill-primary-500" /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
              Everything You Need
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              A comprehensive set of tools to manage your HR operations efficiently from any device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-primary-500/50 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 lg:py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">Trusted By Leaders</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-xl">
                <div className="flex items-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-base text-zinc-300 font-medium leading-relaxed italic mb-8">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{testimonial.name}</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">Simple Pricing</h2>
            <p className="text-zinc-500 text-sm font-medium">Choose the plan that fits your business needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={cn(
                  'relative bg-zinc-900 rounded-3xl border-2 p-10 transition-all flex flex-col',
                  plan.popular ? 'border-primary-500 shadow-2xl shadow-primary-900/10 scale-105' : 'border-zinc-800'
                )}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 rounded-full text-[10px] font-bold text-white uppercase tracking-widest shadow-lg">
                    Popular Choice
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-xs text-zinc-500 font-medium mb-8">{plan.description}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold text-white">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</span>
                  {typeof plan.price === 'number' && <span className="text-xs font-bold text-zinc-500">/mo</span>}
                </div>
                
                <ul className="space-y-4 flex-1 mb-10">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-medium text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-primary-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={handleGetStarted}
                  className={cn(
                    'w-full py-4 rounded-xl font-bold text-sm transition-all',
                    plan.popular ? 'bg-primary-600 text-white hover:bg-primary-500' : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  )}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
             <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">DMS <span className="text-primary-500">HRMS</span></span>
                </div>
                <p className="text-sm text-zinc-500 font-medium max-w-sm leading-relaxed mb-8">
                  The complete HR software for modern teams. Simple, fast, and secure.
                </p>
             </div>
             
             <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Product</h4>
                <ul className="space-y-4">
                   {['Features', 'Pricing', 'Security', 'Mobile'].map(item => (
                     <li key={item}><a href="#" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">{item}</a></li>
                   ))}
                </ul>
             </div>
             
             <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Company</h4>
                <ul className="space-y-4">
                   {['About', 'Blog', 'Careers', 'Contact'].map(item => (
                     <li key={item}><a href="#" className="text-xs font-medium text-zinc-500 hover:text-white transition-colors">{item}</a></li>
                   ))}
                </ul>
             </div>
          </div>
          
          <div className="pt-10 border-t border-zinc-900 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] font-medium text-zinc-600">© 2024 DMS HRMS. All rights reserved.</p>
            <div className="flex gap-6">
               {['Privacy Policy', 'Terms of Service'].map(item => (
                 <a key={item} href="#" className="text-[11px] font-medium text-zinc-600 hover:text-white transition-colors">{item}</a>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

