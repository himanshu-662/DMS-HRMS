import { useState, useEffect, useRef } from 'react';
import {
  Zap, Users, Clock, CalendarDays, DollarSign, UserPlus,
  Target, Package, HelpCircle, BarChart3, Shield,
  CheckCircle2, ArrowRight, Play, Star, Menu, X,
  Smartphone, Workflow, MousePointer2,
  Quote, Activity, Fingerprint, Cpu, Layers, Layout,
  Lock, Globe, Sparkles, Check, ChevronRight, ShieldCheck,
  ZapOff, MessageSquare, Bot, LineChart, Database,
  TrendingUp, Settings, Heart, Mail, MapPin, Phone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

const features = [
  { 
    icon: Users, 
    title: 'Employee Management', 
    description: 'Centralize employee records, organizational structures, documents, departments, and workforce data in one place.' 
  },
  { 
    icon: Clock, 
    title: 'Smart Attendance System', 
    description: 'Track attendance with web check-ins, mobile tracking, GPS, biometric integrations, and automated shift management.' 
  },
  { 
    icon: CalendarDays, 
    title: 'Leave & Holiday Management', 
    description: 'Simplify leave approvals, holiday calendars, leave balances, and multi-level approval workflows.' 
  },
  { 
    icon: DollarSign, 
    title: 'Payroll Automation', 
    description: 'Generate accurate payrolls, salary slips, tax calculations, deductions, reimbursements, and compliance-ready reports.' 
  },
  { 
    icon: UserPlus, 
    title: 'Recruitment & ATS', 
    description: 'Manage job postings, candidate pipelines, interviews, onboarding, and hiring workflows effortlessly.' 
  },
  { 
    icon: Target, 
    title: 'Performance Management', 
    description: 'Track employee goals, KPIs, appraisals, feedback cycles, and productivity metrics in real time.' 
  }
];

const highlights = [
  'AI-Powered HR Automation',
  'Smart Attendance Tracking',
  'Payroll & Compliance Ready',
  'Employee Self-Service Portal',
  'Recruitment & Hiring Suite',
  'Advanced Analytics Dashboard',
  'Mobile-First Experience',
  'Enterprise-Grade Security'
];

const whyChooseUs = [
  { title: 'Modern User Experience', desc: 'Clean, responsive, and mobile-first design built for today’s workforce.', icon: Layout },
  { title: 'Built for Scale', desc: 'From startups to enterprises, our infrastructure scales with your business.', icon: TrendingUp },
  { title: 'Enterprise Security', desc: 'Advanced authentication, role-based access, audit logs, and secure cloud architecture.', icon: Lock },
  { title: 'Highly Customizable', desc: 'Configure workflows, permissions, departments, shifts, and policies with ease.', icon: Settings },
  { title: 'Faster HR Operations', desc: 'Automate repetitive tasks and reduce manual HR workload significantly.', icon: Zap },
  { title: 'Seamless Integrations', desc: 'Connect with payroll systems, Slack, Teams, Google Workspace, and biometric devices.', icon: Layers }
];

const testimonials = [
  { 
    name: 'Sarah Chen', 
    role: 'HR Manager', 
    image: '/images/avatars/sarah.png',
    quote: 'DMS HRMS completely transformed how we manage employees and attendance. The automation alone saved our HR team hours every week.' 
  },
  { 
    name: 'Michael Roberts', 
    role: 'Operations Lead', 
    image: '/images/avatars/michael.png',
    quote: 'The UI is incredibly clean and easy to use. Employees adopted it instantly without training.' 
  },
  { 
    name: 'Emily Watson', 
    role: 'Founder', 
    image: '/images/avatars/emily.png',
    quote: 'From payroll to recruitment, everything works seamlessly in one platform.' 
  }
];

export default function Landing({ onGetStarted }) {
  const { state, dispatch } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [rotation, setRotation] = useState(-12);
  const showcaseRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      if (showcaseRef.current) {
        const rect = showcaseRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Calculate progress (0 when at bottom, 1 when at top)
        const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));
        // Map 0-1 progress to -25 to 0 degree rotation (back-slanted)
        const newRotation = -25 * (1 - progress);
        setRotation(newRotation);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    onGetStarted();
    dispatch({ type: 'SET_SHOW_LANDING', payload: false });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary-500/30 selection:text-primary-200 overflow-x-hidden font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6",
        scrolled ? "bg-slate-950/60 backdrop-blur-3xl border-b border-white/5 py-3 shadow-2xl" : "bg-transparent py-6"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <Zap className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">DMS <span className="text-primary-500">HRMS</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            {['Features', 'About', 'Pricing', 'Security'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-black uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => dispatch({ type: 'SET_SHOW_LANDING', payload: false })} className="hidden sm:block text-sm font-black uppercase tracking-widest text-zinc-500 hover:text-white">Login</button>
            <button onClick={handleGetStarted} className="px-6 py-2.5 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-all shadow-xl active:scale-95 flex items-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 glass-executive mx-6 mt-2 p-8 animate-fade-in">
            <div className="space-y-6 text-center">
              {['Features', 'About', 'Pricing', 'Security'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-sm font-black uppercase tracking-widest text-zinc-500" onClick={() => setMobileMenuOpen(false)}>{item}</a>
              ))}
              <button onClick={handleGetStarted} className="w-full py-4 bg-primary-600 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary-500/20">Get Started</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-primary-500/5 border border-primary-500/10 rounded-full mb-8 hover:border-primary-500/20 transition-colors">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-black text-primary-400 uppercase tracking-[0.2em]">Next-Gen HR Automation</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl lg:text-8xl text-executive-header mb-8 uppercase">
            Manage your team <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-indigo-500 to-violet-600">at the speed of light.</span>
          </h1>
          
          <p className="mb-14 text-sm sm:text-base text-zinc-400 font-bold max-w-3xl mx-auto leading-relaxed opacity-80">
            Simplify your entire HR lifecycle from payroll to performance with our AI-powered platform. One intelligent ecosystem built to modernize operations and scale your organization effortlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <button onClick={handleGetStarted} className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-primary-600 to-indigo-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.2)] active:scale-95 group flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-12 py-5 bg-white/5 backdrop-blur-3xl border border-white/10 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 text-primary-500 fill-primary-500" />
              </div>
              Book Demo
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16" />

          <div className="pt-2">
             <p className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] mb-10">Trusted by modern teams, startups, enterprises, and growing organizations.</p>
             <div className="flex flex-wrap justify-center gap-x-12 gap-y-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                {['Meta', 'Microsoft', 'Google', 'Amazon', 'Netflix', 'Salesforce'].map((brand, i) => (
                  <span key={brand} className="text-xl font-black tracking-tighter uppercase text-zinc-500 hover:text-white transition-colors cursor-default">{brand}</span>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section id="dashboard" className="pb-32 pt-20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
             <h2 className="text-3xl sm:text-5xl text-executive-header mb-6 uppercase">
               A Dashboard Your <br />
               <span className="text-indigo-500">HR Team Will Love.</span>
             </h2>
             <p className="text-sm text-zinc-500 font-bold">Visualize your workforce with beautiful dashboards and real-time analytics.</p>
          </div>
          
          <div 
            ref={showcaseRef}
            className="relative group transition-all duration-300 ease-out transform-gpu"
            style={{ 
              perspective: '1000px',
              transform: `rotateX(${rotation}deg) rotateZ(0.001deg) scale(${0.9 + (Math.abs(rotation + 25) / 25) * 0.1})`,
              opacity: 0.5 + (Math.abs(rotation + 25) / 25) * 0.5,
              backfaceVisibility: 'hidden',
              willChange: 'transform',
              boxShadow: `0 ${20 + (Math.abs(rotation + 25) / 25) * 40}px ${50 + (Math.abs(rotation + 25) / 25) * 50}px -12px rgba(0, 0, 0, 0.8)`
            }}
          >
            <div className="absolute inset-0 bg-indigo-500/20 rounded-[3rem] blur-[140px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative p-1.5 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden group-hover:scale-[1.01] transition-all duration-700">
               <img 
                 src="/images/dashboard-preview-2.png" 
                 alt="Dashboard Showcase" 
                 className="w-full h-auto rounded-[2.5rem] brightness-90 group-hover:brightness-100 transition-all duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
            </div>
          </div>
          
          <div className="text-center mt-12">
             <p className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em]">Everything is designed to be fast, intuitive, and actionable.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 relative z-10 border-t border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-8 text-primary-500">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-5xl text-executive-header mb-10">
                One Platform for Your <br />
                <span className="text-primary-500">Entire Workforce.</span>
              </h2>
              <div className="space-y-6 text-sm text-zinc-500 font-bold leading-relaxed">
                <p>
                  DMS HRMS is built to eliminate manual HR operations and fragmented tools. Manage employees, automate repetitive tasks, track attendance, process payroll, and improve employee engagement — all from a single unified platform.
                </p>
                <p>
                  Whether you're a startup with 10 employees or an enterprise with thousands, DMS HRMS scales with your organization. Our architecture is designed for high availability and enterprise-grade performance.
                </p>
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-primary-500/10 blur-[100px] rounded-full animate-pulse" />
               <div className="relative p-12 glass-executive !rounded-[3rem] shadow-2xl">
                  <div className="space-y-8">
                     {[
                       { l: 'Automate repetitive tasks', i: Zap },
                       { l: 'Unified employee data', i: Database },
                       { l: 'Scale with confidence', i: TrendingUp }
                     ].map((item, i) => (
                       <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:-translate-y-1 transition-all group luminous-stroke">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform"><item.i className="w-6 h-6 text-primary-500" strokeWidth={1.5} /></div>
                          <span className="text-sm font-black uppercase tracking-widest text-zinc-300">{item.l}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { t: 'Employee Centric', d: 'Focus on employee experience and growth with personalized portals.', i: Heart },
               { t: 'Data Driven', d: 'Make informed decisions with real-time HR analytics and insights.', i: LineChart },
               { t: 'Compliance Ready', d: 'Stay compliant with local labor laws and tax regulations automatically.', i: ShieldCheck }
             ].map((benefit, i) => (
               <div key={i} className="p-10 glass-executive transition-all hover:-translate-y-2 luminous-stroke">
                  <benefit.i className="w-10 h-10 text-primary-500 mb-6" strokeWidth={1.5} />
                  <h4 className="text-base font-black text-white uppercase tracking-widest mb-4">{benefit.t}</h4>
                  <p className="text-sm text-zinc-600 font-bold leading-relaxed">{benefit.d}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative z-10 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-3xl sm:text-6xl text-executive-header mb-8">
              Powerful Features <br />
              <span className="text-primary-500">Built for Modern HR.</span>
            </h2>
            <p className="text-sm text-zinc-600 font-bold uppercase tracking-widest opacity-80">Every tool you need to manage people efficiently.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((f, i) => (
              <div key={i} className="flex gap-8 p-8 glass-executive rounded-[2rem] transition-all duration-500 hover:-translate-y-2 group luminous-stroke">
                <div className="w-16 h-16 rounded-[1.25rem] bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-all duration-500 shadow-2xl shadow-black/40">
                  <f.icon className="w-7 h-7 text-primary-500 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                   <h3 className="text-lg font-black text-white mb-3 tracking-tighter uppercase leading-tight">{f.title}</h3>
                   <p className="text-sm text-zinc-500 font-bold leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Why Choose Us */}
      <section id="why" className="py-32 relative z-10 bg-slate-950 border-t border-white/5 overflow-hidden">
        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24">
            <div className="max-w-xl">
               <h2 className="text-3xl sm:text-5xl text-executive-header mb-8">
                 Why Organizations <br />
                 <span className="text-primary-500">Choose DMS HRMS.</span>
               </h2>
            </div>
            <div className="h-0.5 bg-zinc-900 flex-1 hidden lg:block mb-6 ml-10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="flex gap-8 group luminous-stroke p-6 rounded-2xl transition-all hover:-translate-y-2">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-all duration-500 shadow-xl shadow-black/20">
                  <item.icon className="w-7 h-7 text-zinc-600 group-hover:text-white transition-colors" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase tracking-widest mb-3">{item.title}</h4>
                  <p className="text-sm text-zinc-600 font-bold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* AI Section */}
      <section id="ai" className="py-32 relative z-10 bg-black border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-600/20">
              <Bot className="w-10 h-10 text-white" strokeWidth={1.5} />
           </div>
           <h2 className="text-3xl sm:text-5xl text-executive-header mb-8">
             AI-Powered <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 uppercase">HR Intelligence.</span>
           </h2>
           <p className="text-sm text-zinc-500 font-bold max-w-2xl mx-auto mb-20 leading-relaxed">
             DMS HRMS uses intelligent automation to help HR teams work smarter. Turn HR data into business decisions with zero effort.
           </p>
           
           <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {['Attendance anomaly detection', 'Automated workflow approvals', 'Resume screening', 'Employee sentiment analysis', 'Predictive attrition insights', 'AI HR assistant'].map((cap, i) => (
                <div key={i} className="p-6 glass-executive rounded-2xl text-sm font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:border-indigo-500/50 hover:-translate-y-1 transition-all cursor-default luminous-stroke">
                  {cap}
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 relative z-10 overflow-hidden">
        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-24">
              <p className="text-sm font-black text-primary-500 uppercase tracking-[0.4em] mb-6">Testimonials</p>
              <h2 className="text-3xl sm:text-4xl text-executive-header uppercase">What Teams Say.</h2>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <div key={i} className="p-10 glass-executive rounded-[2.5rem] relative group hover:-translate-y-2 transition-all duration-500 luminous-stroke flex flex-col h-full">
                   <Quote className="w-12 h-12 text-white/5 absolute top-10 right-10 group-hover:text-primary-500/20 transition-colors" strokeWidth={1} />
                   
                   <div className="flex items-center gap-1 mb-8">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                   </div>
                   
                   <p className="text-sm font-bold text-zinc-300 mb-10 leading-relaxed italic opacity-80 flex-1">"{t.quote}"</p>
                   
                   <div className="pt-8 border-t border-white/5 flex items-center gap-5">
                      <div className="relative shrink-0">
                         <div className="absolute inset-0 bg-primary-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                         <img 
                           src={t.image} 
                           alt={t.name} 
                           className="w-14 h-14 rounded-full border-2 border-white/10 object-cover relative z-10 group-hover:border-primary-500/50 transition-colors shadow-2xl" 
                         />
                      </div>
                      <div>
                         <p className="text-sm font-black text-white uppercase tracking-widest">{t.name}</p>
                         <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">{t.role}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative z-10 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-24">
              <h2 className="text-3xl sm:text-5xl text-executive-header uppercase mb-6">Flexible Plans.</h2>
              <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Choose the plan that fits your organization.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { 
                  name: 'Starter', 
                  desc: 'Perfect for startups and small teams.', 
                  price: 'Free',
                  features: ['Up to 10 Employees', 'Basic Attendance', 'Employee Directory', 'Leave Management', 'Community Support']
                },
                { 
                  name: 'Professional', 
                  desc: 'Advanced HR automation for growing businesses.', 
                  price: '$99', 
                  popular: true,
                  features: ['Unlimited Employees', 'AI-Powered Attendance', 'Automated Payroll', 'Performance Tracking', 'Priority Support', 'Mobile App Access']
                },
                { 
                  name: 'Enterprise', 
                  desc: 'Custom workflows, security, and analytics.', 
                  price: 'Custom',
                  features: ['Custom Workflows', 'SAML/SSO Integration', 'Advanced Analytics', 'Dedicated Manager', 'Custom Compliance', 'API Access']
                }
              ].map((plan, i) => (
                <div key={i} className={cn(
                  "p-12 rounded-[2.5rem] border flex flex-col relative transition-all duration-500 hover:-translate-y-3 luminous-stroke",
                  plan.popular ? "bg-gradient-to-b from-primary-600 to-indigo-700 border-white/20 shadow-[0_40px_80px_rgba(37,99,235,0.3)] scale-105 z-20" : "glass-executive z-10"
                )}>
                  {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full shadow-2xl">Recommended</div>}
                  <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">{plan.name}</h3>
                  <p className={cn("text-xs font-bold mb-10 opacity-70", plan.popular ? "text-white" : "text-zinc-500")}>{plan.desc}</p>
                  <div className="text-4xl font-black mb-10">{plan.price} <span className="text-xs font-bold opacity-50">{plan.price !== 'Custom' ? '/mo' : ''}</span></div>
                  <div className="flex-1 space-y-4 mb-12">
                     {plan.features.map((feature, j) => (
                       <div key={j} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-80">
                          <Check className={cn("w-4 h-4", plan.popular ? "text-white" : "text-primary-500")} strokeWidth={1.5} /> {feature}
                       </div>
                     ))}
                  </div>
                  <button onClick={handleGetStarted} className={cn(
                    "w-full py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all",
                    plan.popular ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white hover:bg-zinc-700"
                  )}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 relative z-10 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-10 text-emerald-500">
                    <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
                 </div>
                 <h2 className="text-3xl sm:text-5xl text-executive-header mb-10 uppercase">
                   Enterprise-Grade <br />
                   <span className="text-emerald-500">Security & Compliance.</span>
                 </h2>
                 <p className="text-sm text-zinc-500 font-bold mb-12 leading-relaxed">
                   Your employee data is protected with industry-leading security practices. We build with a "security-first" mindset.
                 </p>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                    {[
                      'End-to-End Encryption', 'Role-Based Permissions',
                      'Audit Logs', 'Secure Cloud Infrastructure',
                      'Multi-Factor Authentication', 'Automated Backups',
                      'Compliance-Ready Architecture'
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4 text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                         {s}
                      </div>
                    ))}
                 </div>
              </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[140px] rounded-full" />
                  <div className="relative p-16 text-center glass-executive !rounded-[3rem] shadow-2xl luminous-stroke">
                     <Lock className="w-20 h-20 text-emerald-500/50 mx-auto mb-10" strokeWidth={1} />
                     <div className="h-1 w-full bg-white/5 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full animate-pulse" />
                     </div>
                     <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">System fully encrypted</p>
                  </div>
               </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-48 relative z-10 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
               {/* Left: Content */}
               <div className="text-left">
                  <h2 className="text-4xl sm:text-6xl text-executive-header mb-10 uppercase">
                    Ready to modernize <br />
                    <span className="text-primary-500">Your HR Operations?</span>
                  </h2>
                  <p className="text-base text-zinc-500 font-bold mb-16 max-w-xl leading-relaxed">
                    Streamline attendance, payroll, recruitment, performance, and employee management with one powerful HRMS platform built for scale.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-8 mb-20">
                    <button onClick={handleGetStarted} className="w-full sm:w-auto px-16 py-6 bg-white text-black text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl active:scale-95 shadow-white/10">
                      Start Free Trial
                    </button>
                    <button className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
                      Schedule a Demo
                    </button>
                  </div>

                  <div className="flex items-center gap-8 opacity-40">
                     {['ISO 27001', 'GDPR', 'SOC2'].map(badge => (
                       <span key={badge} className="text-sm font-black uppercase tracking-[0.3em] text-white border-r border-white/20 pr-8 last:border-0">{badge}</span>
                     ))}
                  </div>
               </div>

               {/* Right: Enterprise Form */}
               <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/10 blur-[120px] rounded-full" />
                  <div className="relative p-10 glass-executive !rounded-[3rem] shadow-2xl luminous-stroke">
                     <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Enterprise Inquiry</h3>
                     <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-10">Get a custom solution for your team.</p>
                     
                     <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                           <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:border-primary-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Work Email</label>
                           <input type="email" placeholder="john@company.com" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:border-primary-500 outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Company Size</label>
                              <select className="w-full px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-sm focus:border-primary-500 outline-none transition-all appearance-none">
                                 <option>10-50</option>
                                 <option>50-250</option>
                                 <option>250-1000</option>
                                 <option>1000+</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Industry</label>
                              <input type="text" placeholder="Tech" className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:border-primary-500 outline-none transition-all" />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">How can we help?</label>
                           <textarea rows={3} placeholder="Tell us about your requirements..." className="w-full px-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-sm focus:border-primary-500 outline-none transition-all resize-none"></textarea>
                        </div>
                        <button className="w-full py-6 bg-gradient-to-r from-primary-600 to-indigo-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-primary-500/20 active:scale-[0.98]">
                           Submit Request
                        </button>
                     </form>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-24 border-t border-white/5">
               {[
                 { t: 'Email Us', v: 'hello@dmshrms.com', i: Mail },
                 { t: 'Call Us', v: '+1 (555) 000-0000', i: Phone },
                 { t: 'Office', v: 'San Francisco, CA', i: MapPin }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500"><item.i className="w-5 h-5" strokeWidth={1.5} /></div>
                    <p className="text-sm font-black text-zinc-600 uppercase tracking-widest">{item.t}</p>
                    <p className="text-sm font-bold text-white uppercase tracking-tighter">{item.v}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-32 z-10 relative bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-16 mb-24">
             <div className="col-span-2">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">DMS <span className="text-primary-500">HRMS</span></span>
                </div>
                <p className="text-sm text-zinc-600 font-black uppercase tracking-widest leading-relaxed mb-10 opacity-70">
                  Simplifying HR for <br /> Modern Organizations.
                </p>
             </div>
             
             {[
               { t: 'Product', l: ['Features', 'Pricing', 'Integrations', 'Security', 'Updates'] },
               { t: 'Company', l: ['About Us', 'Careers', 'Contact', 'Blog'] },
               { t: 'Resources', l: ['Help Center', 'Documentation', 'API Docs', 'Support'] },
               { t: 'Legal', l: ['Privacy Policy', 'Terms & Conditions', 'Compliance'] }
             ].map((group, i) => (
               <div key={i}>
                  <h4 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-10">{group.t}</h4>
                  <ul className="space-y-6">
                     {group.l.map(item => (
                       <li key={item}><a href="#" className="text-sm font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-widest">{item}</a></li>
                     ))}
                  </ul>
               </div>
             ))}
          </div>
          
          <div className="pt-16 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-sm font-black text-zinc-800 uppercase tracking-[0.4em]">© 2024 DMS HRMS. CRAFTED FOR EXCELLENCE.</p>
            <div className="flex gap-10">
               {['Dribbble', 'Twitter', 'LinkedIn'].map(item => (
                 <a key={item} href="#" className="text-sm font-black text-zinc-800 hover:text-white transition-colors uppercase tracking-[0.3em]">{item}</a>
               ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

