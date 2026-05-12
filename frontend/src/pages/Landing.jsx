import { useState } from 'react';
import {
  Zap, Users, Clock, CalendarDays, DollarSign, UserPlus,
  Target, Package, HelpCircle, BarChart3, Shield,
  CheckCircle2, ArrowRight, Play, Star, Menu, X, Moon, Sun,
  Smartphone, Workflow,
  Quote } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const features = [
{ icon: Users, title: 'Employee Management', description: 'Complete employee lifecycle management with profiles, documents, and organizational hierarchy.' },
{ icon: Clock, title: 'Attendance Tracking', description: 'Real-time attendance with web check-in, GPS tracking, biometric integration, and overtime management.' },
{ icon: CalendarDays, title: 'Leave Management', description: 'Configurable leave policies, multi-level approvals, balance tracking, and holiday calendar.' },
{ icon: DollarSign, title: 'Payroll Processing', description: 'Automated salary calculations, tax compliance, payslip generation, and bank transfers.' },
{ icon: UserPlus, title: 'Recruitment & ATS', description: 'Job posting, candidate pipeline, interview scheduling, and offer management.' },
{ icon: Target, title: 'Performance Management', description: 'Goal tracking, OKRs, 360° feedback, appraisals, and continuous performance reviews.' },
{ icon: Package, title: 'Asset Management', description: 'Track company assets, assignments, maintenance schedules, and audit trails.' },
{ icon: HelpCircle, title: 'HR Help Desk', description: 'Ticketing system for HR queries with SLA tracking and priority management.' },
{ icon: BarChart3, title: 'Analytics & Reports', description: 'Real-time dashboards, custom reports, and data-driven HR insights.' },
{ icon: Shield, title: 'Security & Compliance', description: 'Role-based access, audit logs, GDPR compliance, and data encryption.' },
{ icon: Workflow, title: 'Workflow Automation', description: 'Automate approvals, notifications, onboarding tasks, and HR processes.' },
{ icon: Smartphone, title: 'Mobile-First', description: 'Full-featured mobile app and PWA for on-the-go HR management.' }];


const stats = [
{ value: '99.9%', label: 'Uptime SLA' },
{ value: '< 2s', label: 'Page Load' },
{ value: '70%', label: 'HR Task Reduction' },
{ value: '1M+', label: 'Employees Supported' }];


const testimonials = [
{ name: 'Sarah Chen', role: 'HR Director', company: 'TechCorp Inc.', image: '', quote: 'DMS HRMS transformed our HR operations. We reduced onboarding time by 60% and employee satisfaction improved significantly.' },
{ name: 'Michael Roberts', role: 'CEO', company: 'GrowthStart', image: '', quote: 'The best HR platform we\'ve used. The automation features alone saved us 20+ hours per week.' },
{ name: 'Emily Watson', role: 'People Operations', company: 'InnovateLabs', image: '', quote: 'Finally, an HRMS that\'s intuitive and powerful. Our team adopted it within days, not weeks.' }];


const pricingPlans = [
{
  name: 'Starter',
  price: 4,
  description: 'Perfect for small teams getting started',
  features: ['Up to 25 employees', 'Core HR features', 'Attendance tracking', 'Leave management', 'Basic reports', 'Email support'],
  popular: false
},
{
  name: 'Professional',
  price: 8,
  description: 'For growing companies with advanced needs',
  features: ['Up to 100 employees', 'Everything in Starter', 'Payroll management', 'Performance reviews', 'Recruitment module', 'Custom workflows', 'Priority support'],
  popular: true
},
{
  name: 'Enterprise',
  price: 'Custom',
  description: 'For large organizations with complex requirements',
  features: ['Unlimited employees', 'Everything in Professional', 'Advanced analytics', 'API access', 'Custom integrations', 'Dedicated account manager', '24/7 phone support', 'On-premise option'],
  popular: false
}];






export default function Landing({ onGetStarted }) {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleGetStarted = () => {
    onGetStarted();
    dispatch({ type: 'SET_SHOW_LANDING', payload: false });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  return (
    <div className={cn('min-h-screen', state.darkMode ? 'dark bg-gray-900' : 'bg-white')}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">DMS HRMS</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">Testimonials</a>
              <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">Documentation</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors">
                
                {state.darkMode ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={() => dispatch({ type: 'SET_SHOW_LANDING', payload: false })}
                className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 transition-colors">
                
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25">
                
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center">
                
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen &&
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-4 px-4 animate-slide-in">
            <div className="space-y-3">
              <a href="#features" className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Features</a>
              <a href="#pricing" className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Pricing</a>
              <a href="#testimonials" className="block py-2 text-sm font-medium text-gray-600 dark:text-gray-300">Testimonials</a>
              <button
              onClick={handleGetStarted}
              className="w-full py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl">
              
                Get Started
              </button>
            </div>
          </div>
        }
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5 dark:opacity-10" />
        <div className="absolute inset-0 pattern-overlay" />
        
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Trusted by 500+ companies worldwide</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              The Modern{' '}
              <span className="gradient-text">HR Platform</span>
              {' '}for Growing Teams
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Streamline HR operations with our all-in-one platform. From hiring to retiring, 
              manage your entire workforce with automation, analytics, and exceptional employee experience.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white text-base font-semibold rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 hover:shadow-2xl hover:shadow-primary-600/40 hover:-translate-y-0.5">
                
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-base font-semibold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) =>
            <div key={idx} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Everything you need to manage HR
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              A comprehensive suite of tools designed to streamline every aspect of human resource management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) =>
            <div
              key={idx}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300">
              
                <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">Testimonials</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Loved by HR teams everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) =>
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) =>
                <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                )}
                </div>
                <Quote className="w-8 h-8 text-primary-200 dark:text-primary-800 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-violet-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Simple, transparent pricing</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, idx) =>
            <div
              key={idx}
              className={cn(
                'relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 transition-all',
                plan.popular ? 'border-primary-500 shadow-xl scale-105' : 'border-gray-100 dark:border-gray-700'
              )}>
              
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}</span>
                  {typeof plan.price === 'number' && <span className="text-gray-500">/user/month</span>}
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature, i) =>
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-primary-500" />
                      {feature}
                    </li>
                )}
                </ul>
                <button
                onClick={handleGetStarted}
                className={cn(
                  'mt-8 w-full py-3 rounded-xl font-semibold',
                  plan.popular ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                )}>
                
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">DMS HRMS</span>
          </div>
          <p className="text-sm text-gray-500">© 2024 DMS HRMS. All rights reserved.</p>
        </div>
      </footer>
    </div>);

}