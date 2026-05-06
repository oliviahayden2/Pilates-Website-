import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Instagram, 
  Youtube, 
  Facebook, 
  MapPin, 
  Star, 
  Flame,
  Menu,
  X,
  Phone,
  Clock,
  ExternalLink,
  Target,
  Zap,
  Cpu,
  Mail,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect, ReactNode, FormEvent } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// --- Assets ---
const HERO_IMG = "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=2000";
const CLASS_FOUNDATIONS = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1000";
const CLASS_SCULPT = "https://images.unsplash.com/photo-1599447421416-3414500d1f35?auto=format&fit=crop&q=80&w=1000";
const CLASS_POWER = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000";
const ABOUT_STUDIO = "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=1500";

// --- Types ---
type Page = 'home' | 'locations' | 'memberships' | 'classes' | 'about';

// --- Components ---

const BookingModal = ({ isOpen, onClose, title }: { isOpen: boolean, onClose: () => void, title?: string }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  const handleNext = (e: FormEvent) => {
    e.preventDefault();
    if (email) setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/90 backdrop-blur-md z-[200]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg bg-surface p-8 md:p-16 z-[201] shadow-[0_50px_100px_-20px_rgba(46,2,8,0.5)] border border-primary/10 rounded-sm"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-primary hover:rotate-90 transition-transform">
              <X size={24} />
            </button>
            
            {step === 1 ? (
              <div className="text-center">
                <span className="text-label-caps text-secondary-container bg-primary px-3 py-1 inline-block mb-6">Booking for: {title || "Initial Session"}</span>
                <h3 className="text-display text-3xl font-bold text-primary mb-4 leading-tight">Ignite Your Potential</h3>
                <p className="text-on-surface-variant mb-10 font-sans">
                  Enter your email to receive our exclusive new member starter pack and priority booking windows.
                </p>
                <form className="space-y-4" onSubmit={handleNext}>
                  <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-surface-container-low border border-primary/10 pl-16 pr-6 py-5 text-primary outline-none focus:border-primary transition-all font-sans"
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-primary text-on-primary w-full py-5 text-label-caps font-bold shadow-lg"
                  >
                    Send Invitation
                  </motion.button>
                </form>
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-primary/40 uppercase tracking-widest font-bold">
                  <ShieldCheck size={12} /> Encrypted & Private
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="text-primary animate-bounce" size={40} />
                </div>
                <h3 className="text-display text-3xl font-bold text-primary mb-4">Invitation Sent</h3>
                <p className="text-on-surface-variant mb-10 font-sans">
                  Check your inbox for <strong>{email}</strong>. Your journey to heat-infused transformation begins now.
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="border-2 border-primary text-primary w-full py-5 text-label-caps font-bold"
                >
                  Return to Studio
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Nav = ({ currentPage, setPage, onBook }: { currentPage: Page, setPage: (p: Page) => void, onBook: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string, id: Page }[] = [
    { label: 'Classes', id: 'classes' },
    { label: 'Memberships', id: 'memberships' },
    { label: 'Locations', id: 'locations' },
    { label: 'About', id: 'about' }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-surface/90 backdrop-blur-md py-4 shadow-sm border-b border-primary/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <motion.button 
          onClick={() => setPage('home')}
          whileHover={{ scale: 1.02 }}
          className="text-primary flex flex-col leading-none"
        >
          <span className="font-display font-black text-2xl tracking-tighter">HOT CORE</span>
          <span className="text-label-caps text-[10px] tracking-[0.4em] mt-1 text-secondary">Pilates Studio</span>
        </motion.button>
        
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <motion.button 
              key={item.label} 
              onClick={() => setPage(item.id)}
              whileHover={{ y: -2 }}
              className={`text-label-caps transition-colors border-b-2 pb-1 text-[11px] font-bold ${
                currentPage === item.id ? 'text-primary border-primary' : 'text-on-surface-variant border-transparent hover:border-primary hover:text-primary'
              }`}
            >
              {item.label}
            </motion.button>
          ))}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBook}
            className="bg-primary text-on-primary px-8 py-3 text-label-caps text-[11px] font-bold hover:bg-primary-container transition-all shadow-md active:shadow-sm"
          >
            Start Today
          </motion.button>
        </div>

        <motion.button 
          whileTap={{ scale: 0.8 }}
          className="md:hidden text-primary" 
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-surface z-[300] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="text-primary flex flex-col leading-none">
                <span className="font-display font-black text-2xl tracking-tighter">HOT CORE</span>
                <span className="text-label-caps text-[10px] tracking-[0.4em] mt-1 text-secondary">Pilates Studio</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-primary p-2">
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navItems.map((item) => (
                <motion.button 
                  key={item.label} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => { setPage(item.id); setMobileMenuOpen(false); }}
                  className="text-5xl font-display font-bold text-primary text-left tracking-tighter flex items-center justify-between group"
                >
                  {item.label}
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </motion.button>
              ))}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={() => { onBook(); setMobileMenuOpen(false); }}
                className="bg-primary text-on-primary py-8 text-2xl font-display font-bold mt-8 shadow-2xl"
              >
                Book Session
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Home Components ---

const Hero = ({ onBook, setPage }: { onBook: () => void, setPage: (p: Page) => void }) => (
  <section className="relative h-[95vh] flex items-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <motion.img 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        src={HERO_IMG} 
        alt="Hot Core Pilates Studio" 
        className="w-full h-full object-cover grayscale-[30%] brightness-[40%] scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <span className="text-label-caps text-secondary-fixed tracking-[0.6em] mb-8 block md:text-sm font-bold opacity-80">Forged in Infrared Heat</span>
        <h1 className="text-display-xl text-on-primary mb-8 leading-[0.85]">
          BEYOND<br /><span className="text-secondary-fixed">LIMITS.</span>
        </h1>
        <p className="text-subheading-serif text-on-primary/70 mb-12 max-w-lg text-lg md:text-xl">
          A high-intensity, boutique reformer experience designed to sculpt, strengthen, and ignite your inner glow.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <motion.button 
            whileHover={{ scale: 1.05, x: 10, backgroundColor: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBook}
            className="bg-secondary-fixed text-primary px-12 py-6 text-label-caps font-bold transition-all shadow-2xl"
          >
            Claim Intro Offer
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, x: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setPage('classes')}
            className="border border-on-primary text-on-primary px-12 py-6 text-label-caps font-bold hover:bg-on-primary/10 transition-all backdrop-blur-sm"
          >
            The Methodology
          </motion.button>
        </div>
      </motion.div>
    </div>

    <motion.div 
      initial={{ opacity: 0, rotate: 10, x: 100 }}
      animate={{ opacity: 1, rotate: 0, x: 0 }}
      whileHover={{ y: -10, rotate: -2 }}
      transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      onClick={onBook}
      className="absolute bottom-12 right-12 hidden md:block bg-surface-container/10 backdrop-blur-3xl p-10 border border-on-primary/10 cursor-pointer group shadow-2xl rounded-sm"
    >
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-primary/40 rounded-full flex items-center justify-center border border-secondary-fixed/30 group-hover:bg-primary transition-colors">
          <Flame className="text-secondary-fixed group-hover:animate-pulse" size={32} />
        </div>
        <div>
          <span className="text-[10px] text-on-primary/60 uppercase tracking-[0.3em] block mb-1 font-bold">Ambient Intensity</span>
          <p className="text-headline-lg text-2xl text-on-primary font-black">98.6° CORE</p>
        </div>
      </div>
    </motion.div>
  </section>
);

// --- Classes Components ---

const ClassesPreview = ({ onBook }: { onBook: (t: string) => void }) => (
  <section className="py-24 md:py-32 bg-surface">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
        <div className="max-w-2xl">
          <span className="text-label-caps text-secondary tracking-[0.4em] mb-6 block font-bold">The Collective</span>
          <h2 className="text-headline-lg text-primary text-5xl md:text-7xl">Precision Performance.</h2>
        </div>
        <p className="text-on-surface-variant max-w-sm pb-2 italic text-lg leading-relaxed">
          Master the reformer in a meticulously curated atmosphere where intensity meets architectural grace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { title: "Hot Foundations", desc: "For those mastering core principles in 95° infrared heat. Focus on alignment and control.", img: CLASS_FOUNDATIONS, icon: <Target className="text-primary" /> },
          { title: "Hot Sculpt", desc: "A high-intensity, 50-minute athletic session utilizing resistance and tempo to define muscle.", img: CLASS_SCULPT, highlight: true, icon: <Zap className="text-primary" /> },
          { title: "Hot Power Flow", desc: "Advanced athletic flow bridging pilates and functional strength. Expect sweat and stamina.", img: CLASS_POWER, icon: <Flame className="text-primary" /> }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className={`flex flex-col group ${item.highlight ? 'md:-translate-y-8' : ''}`}
          >
            <div className="aspect-[4/5] mb-8 overflow-hidden bg-primary shadow-sm hover:shadow-2xl transition-all duration-700 rounded-sm">
              <motion.img 
                whileHover={{ scale: 1.1 }}
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
              />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-3xl font-display font-black text-primary tracking-tight">{item.title}</h3>
            </div>
            <p className="text-on-surface-variant mb-8 text-lg font-sans leading-relaxed">{item.desc}</p>
            <motion.button 
              onClick={() => onBook(item.title)}
              whileHover="hover"
              className="inline-flex items-center gap-3 text-label-caps text-primary font-bold group border-b-2 border-transparent hover:border-primary pb-1 w-fit transition-all uppercase tracking-widest text-xs"
            >
              Book Session
              <motion.span variants={{ hover: { x: 5 } }} transition={{ type: "spring", stiffness: 300 }}>
                <ChevronRight size={16} />
              </motion.span>
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- New Pages ---

const ClassesPage = ({ onBook }: { onBook: (t: string) => void }) => {
  const classes = [
    { title: "Hot Foundations", level: "Beginner/Intro", temp: "95°F", duration: "50m", img: CLASS_FOUNDATIONS, longDesc: "Master the fundamental principles of reformer pilates in a controlled, warm environment. This class focuses on breath-work, core activation, and corrective alignment, setting the stage for high-intensity progression." },
    { title: "Hot Sculpt & Define", level: "Intermediate", temp: "98°F", duration: "50m", img: CLASS_SCULPT, longDesc: "Our signature high-repetition series. We utilize hand weights, balls, and bands combined with progressive reformer resistance to fatigue every muscle group. Designed for muscle lengthening and dynamic toning." },
    { title: "Advanced Power Flow", level: "Advanced", temp: "100°F", duration: "60m", img: CLASS_POWER, longDesc: "For the experienced practitioner. This fast-paced athletic flow bridges the gap between traditional pilates and high-octane functional strength training. Intense transitions and complex movements." },
    { title: "Hyper-Core 30", level: "All Levels", temp: "98°F", duration: "30m", img: HERO_IMG, longDesc: "A condensed, ultra-high intensity session focused exclusively on abdominal and pelvic floor strength. Perfect for a quick, efficient burn that leaves you glowing for the rest of the day." }
  ];

  return (
    <div className="pt-32 pb-24 bg-surface-container-low min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24 text-center"
        >
          <span className="text-label-caps text-secondary tracking-[0.5em] mb-4 block font-bold">Class Options</span>
          <h1 className="text-display-xl text-primary text-6xl md:text-8xl mb-8">Choose Your Burn.</h1>
          <p className="text-subheading-serif text-primary/60 max-w-2xl mx-auto italic text-xl">
            From foundational control to explosive power, find the intensity that matches your ambition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-24">
          {classes.map((cls, i) => (
            <motion.div 
              key={cls.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[16/10] overflow-hidden rounded-sm bg-primary shadow-xl">
                <img src={cls.img} alt={cls.title} className="w-full h-full object-cover opacity-90" />
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex gap-4 mb-8">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2">{cls.temp}</span>
                  <span className="bg-secondary-container text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2">{cls.duration}</span>
                  <span className="border border-primary text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-2">{cls.level}</span>
                </div>
                <h2 className="text-5xl font-display font-black text-primary mb-6 tracking-tight">{cls.title}</h2>
                <p className="text-on-surface-variant text-xl font-sans leading-relaxed mb-10 opacity-80">
                  {cls.longDesc}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onBook(cls.title)}
                    className="bg-primary text-on-primary px-12 py-5 text-label-caps font-bold shadow-lg"
                  >
                    Reserve Now
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-primary text-primary px-12 py-5 text-label-caps font-bold"
                  >
                    View Schedule
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembershipsPage = ({ onBook }: { onBook: (t: string) => void }) => {
  const tiers = [
    { name: "Lite Heat", classes: "4 Classes", price: "129", features: ["Valid at all locations", "14-Day Booking window", "2 Guest Passes / Year", "Complimentary towel service"] },
    { name: "Devotion", classes: "8 Classes", price: "219", features: ["Valid at all locations", "21-Day Booking window", "4 Guest Passes / Year", "10% Boutique discount", "Early access to workshops"], popular: true },
    { name: "Total Glow", classes: "Unlimited", price: "349", features: ["Valid at all locations", "30-Day Booking window", "Unlimited Guest Passes", "20% Boutique discount", "1 Monthly Private session"] },
    { name: "Founding Core", classes: "Annual Pass", price: "2999", features: ["Unlimited everything", "Private locker", "Founding member events", "Personalized workout tracking"] }
  ];

  return (
    <div className="pt-32 pb-24 bg-primary text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-24"
        >
          <span className="text-label-caps text-secondary-fixed tracking-[0.6em] mb-4 block font-bold">The Exclusive Collective</span>
          <h1 className="text-display-xl text-white text-6xl md:text-8xl mb-6">Invest in Yourself.</h1>
          <p className="text-subheading-serif text-on-primary/60 max-w-2xl mx-auto italic text-xl">
            Elevated membership tiers designed for consistency, results, and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, i) => (
            <motion.div 
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-10 flex flex-col items-center text-center transition-all border ${
                tier.popular ? 'bg-white text-primary border-transparent scale-105 z-10 shadow-3xl' : 'border-white/10 bg-primary-container/20 group hover:border-white/40'
              }`}
            >
              {tier.popular && (
                <div className="bg-secondary text-on-secondary px-6 py-2 text-label-caps font-black text-[10px] mb-8 -mt-16 transform shadow-lg">
                  Most Preferred
                </div>
              )}
              <h3 className="text-3xl font-display font-black mb-2 tracking-tighter">{tier.name}</h3>
              <p className="text-label-caps opacity-60 mb-10 text-[10px] tracking-widest">{tier.classes} / MONTH</p>
              <div className="text-7xl font-display font-black mb-12">
                <span className="text-3xl align-top mr-1 font-sans opacity-40">$</span>{tier.price}
              </div>
              <ul className="space-y-5 mb-14 text-sm flex-grow w-full text-left font-sans">
                {tier.features.map(f => (
                  <li key={f} className="flex items-start gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${tier.popular ? 'text-primary' : 'text-secondary-fixed'}`} />
                    <span className="leading-tight">{f}</span>
                  </li>
                ))}
              </ul>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onBook(tier.name)}
                className={`w-full py-5 text-label-caps font-black text-xs tracking-widest transition-all ${
                  tier.popular ? 'bg-primary text-white' : 'bg-white text-primary hover:bg-secondary-fixed'
                }`}
              >
                Join Now
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LocationsPage = ({ onBook }: { onBook: (t: string) => void }) => {
  const locations = [
    { city: "San Francisco", area: "Design District", address: "888 Burn Street, Suite 100", hours: "6AM - 9PM", lat: 37.768, lng: -122.401, phone: "+1 415-555-CORE" },
    { city: "Los Angeles", area: "West Hollywood", address: "42 Heat Avenue, Level 2", hours: "5:30AM - 10PM", lat: 34.090, lng: -118.384, phone: "+1 310-555-CORE" },
    { city: "New York", area: "SoHo", address: "110 Core Lane", hours: "6AM - 9:30PM", lat: 40.723, lng: -73.999, phone: "+1 212-555-CORE" },
    { city: "Austin", area: "South Congress", address: "12 Glow Road", hours: "6AM - 8:30PM", lat: 30.245, lng: -97.751, phone: "+1 512-555-CORE" }
  ];

  const [activeLoc, setActiveLoc] = useState(locations[0]);

  return (
    <div className="pt-32 pb-24 bg-surface-container overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-center md:text-left"
        >
          <span className="text-label-caps text-secondary tracking-[0.5em] mb-4 block font-bold">The Network</span>
          <h1 className="text-display-xl text-primary text-6xl md:text-8xl mb-8 leading-[0.85]">Find Your Studio.</h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* List */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            {locations.map((loc) => (
              <motion.button 
                key={loc.area}
                onClick={() => setActiveLoc(loc)}
                whileHover={{ x: 10 }}
                className={`p-8 text-left transition-all border ${
                  activeLoc.area === loc.area ? 'bg-primary text-white border-transparent shadow-xl' : 'bg-white text-primary border-primary/5 hover:border-primary/20'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${activeLoc.area === loc.area ? 'text-secondary-fixed' : 'text-secondary'}`}>{loc.city}</p>
                  <MapPin size={16} className={activeLoc.area === loc.area ? 'text-secondary-fixed' : 'text-primary/20'} />
                </div>
                <h3 className="text-3xl font-display font-black tracking-tight mb-4">{loc.area}</h3>
                <p className="text-sm opacity-60 font-sans mb-6">{loc.address}</p>
                <motion.button 
                   whileHover={{ x: 5 }}
                   onClick={(e) => { e.stopPropagation(); onBook(`${loc.city} - ${loc.area}`); }}
                  className={`text-label-caps text-[10px] tracking-widest font-bold flex items-center gap-2 ${activeLoc.area === loc.area ? 'text-white' : 'text-primary'}`}
                >
                  Book Here <ChevronRight size={14} />
                </motion.button>
              </motion.button>
            ))}
          </div>

          {/* Map Section */}
          <div className="w-full lg:w-2/3 flex flex-col gap-8">
            <div className="h-[500px] md:h-[600px] bg-primary shadow-2xl relative overflow-hidden rounded-sm group">
               {!hasValidKey ? (
                  <div className="absolute inset-0 bg-primary-container flex items-center justify-center p-12 text-center text-white">
                    <div>
                      <Target size={48} className="mx-auto mb-6 text-secondary-fixed animate-pulse" />
                      <h3 className="text-2xl font-display font-bold mb-4">Interactive Network Mapping</h3>
                      <p className="text-on-primary/60 max-w-sm mb-8 font-sans">
                        Experience our global studio locations in full high-definition precision.
                      </p>
                      <div className="p-8 border border-white/10 bg-white/5 backdrop-blur-md rounded-sm text-left">
                        <p className="text-label-caps text-secondary-fixed text-[10px] mb-4 tracking-widest">Administrator Setup Required</p>
                        <p className="text-sm font-sans mb-2">1. Register a Google Maps Platform API Key</p>
                        <p className="text-sm font-sans">2. Set <span className="text-secondary-fixed">GOOGLE_MAPS_PLATFORM_KEY</span> in AI Studio</p>
                      </div>
                    </div>
                  </div>
               ) : (
                 <APIProvider apiKey={API_KEY} version="weekly">
                    <Map
                      center={{lat: activeLoc.lat, lng: activeLoc.lng}}
                      zoom={14}
                      mapId="STUDIO_LOCATOR_MAP"
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      style={{width: '100%', height: '100%'}}
                    >
                      {locations.map(loc => (
                        <AdvancedMarker 
                          key={loc.area} 
                          position={{lat: loc.lat, lng: loc.lng}}
                          onClick={() => setActiveLoc(loc)}
                        >
                          <Pin background={activeLoc.area === loc.area ? "#c6797d" : "#2e0208"} borderColor="#fff" glyphColor="#fff" />
                        </AdvancedMarker>
                      ))}
                    </Map>
                 </APIProvider>
               )}
            </div>
            
            <div className="bg-white p-12 shadow-md border border-primary/5 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2 block">Direct Line</span>
                <p className="text-2xl font-display font-black text-primary">{activeLoc.phone}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mb-2 block">Base Hours</span>
                <p className="text-2xl font-display font-black text-primary">{activeLoc.hours}</p>
              </div>
              <div className="flex items-end">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onBook(`${activeLoc.city} - ${activeLoc.area}`)}
                  className="w-full bg-primary text-white py-5 text-label-caps font-black text-[10px] tracking-widest"
                >
                  Join Waitlist
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24 bg-surface min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <span className="text-label-caps text-secondary tracking-[0.5em] mb-4 block font-bold">The Standard</span>
          <h1 className="text-display-xl text-primary text-6xl md:text-8xl mb-12 max-w-4xl leading-[0.85]">Movement,<br />Manifested.</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="relative">
            <div className="aspect-square bg-primary shadow-2xl overflow-hidden rounded-sm relative z-10">
              <img src={ABOUT_STUDIO} alt="Core Philosophy" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary-container -z-0 hidden md:block" />
          </div>
          <div className="space-y-12">
            <h2 className="text-5xl font-display font-black text-primary tracking-tight leading-none italic">"Heat is the catalyst; precision is the cure."</h2>
            <p className="text-2xl text-on-surface-variant font-sans leading-relaxed opacity-80">
              Founded in 2022, Hot Core Pilates was built on a singular obsession: to push the boundaries of traditional reformer training through architectural precision and temperature-controlled intensity.
            </p>
            <div className="grid grid-cols-2 gap-12">
              <div>
                <Cpu className="text-primary mb-6" size={32} />
                <h4 className="text-label-caps font-black text-primary mb-2 text-xs">Infrared Tech</h4>
                <p className="text-sm text-on-surface-variant opacity-70">Penetrating heat for deeper muscle detox and recovery.</p>
              </div>
               <div>
                <Target className="text-primary mb-6" size={32} />
                <h4 className="text-label-caps font-black text-primary mb-2 text-xs">Anatomical Focus</h4>
                <p className="text-sm text-on-surface-variant opacity-70">Meticulous cueing for maximal neurological activation.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-primary p-16 md:p-32 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(198,121,125,0.1),transparent)]" />
          <h3 className="text-4xl md:text-7xl font-display font-black mb-12 max-w-3xl mx-auto tracking-tighter leading-none relative z-10">Join the pursuit of aesthetic strength.</h3>
          <motion.button 
             whileHover={{ scale: 1.1, backgroundColor: "#ffffff", color: "#2e0208" }}
             className="bg-secondary-fixed text-primary px-16 py-8 text-label-caps font-black tracking-[0.2em] relative z-10 shadow-2xl"
          >
            Studio Directory
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// --- Testimonials ---

const Testimonials = () => (
  <section className="py-32 bg-surface overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-between mb-24">
        <h2 className="text-subheading-serif text-primary text-4xl md:text-6xl italic">The Resonance.</h2>
        <div className="flex gap-2">
           <div className="w-12 h-1 bg-secondary-fixed" />
           <div className="w-4 h-1 bg-primary/10" />
           <div className="w-4 h-1 bg-primary/10" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { 
            name: "Sasha K.", 
            since: "Member since 2022", 
            text: "The heat adds a layer of focus I've never found in traditional pilates. It's challenging, but the instructors are incredibly skilled.",
            img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
          },
          { 
            name: "Marcus R.", 
            since: "Member since 2023", 
            text: "Hot Core isn't just a workout; it's a sanctuary. I leave every session feeling physically exhausted but mentally revitalized.", 
            highlight: true,
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200"
          },
          { 
            name: "Elena V.", 
            since: "Founding Member", 
            text: "The attention to detail—from the heat levels to the playlists—is unmatched. Best studio in the city.",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
          }
        ].map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className={`p-12 relative flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all border ${t.highlight ? 'bg-primary text-white border-transparent md:translate-y-12' : 'bg-white border-primary/5'}`}
          >
            <div className="mb-12">
              <div className="flex gap-1 mb-8">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" className={t.highlight ? "text-secondary-fixed" : "text-primary"} />)}
              </div>
              <p className={`italic leading-relaxed text-xl md:text-2xl font-serif ${t.highlight ? 'text-white' : 'text-primary'}`}>"{t.text}"</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary-fixed/30 shadow-lg">
                <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className={`text-label-caps font-black mb-1 ${t.highlight ? 'text-white' : 'text-primary'}`}>{t.name}</p>
                <p className={`text-[10px] uppercase font-bold tracking-widest ${t.highlight ? 'text-white/40' : 'text-primary/40'}`}>{t.since}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Newsletter = () => (
  <section className="relative py-40 overflow-hidden bg-primary">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 5, 0] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 z-0 opacity-20"
    >
      <img src={HERO_IMG} alt="Bg" className="w-full h-full object-cover mix-blend-overlay" />
    </motion.div>
    
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
      <motion.h2 
        initial={{ opacity:0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-display-xl text-5xl md:text-9xl text-on-primary mb-12 tracking-tighter"
      >
        JOIN THE <span className="text-secondary-fixed">CORE.</span>
      </motion.h2>
      <p className="text-on-primary/80 mb-16 text-xl md:text-2xl max-w-2xl mx-auto font-sans leading-relaxed">
        Exclusive studio updates, priority class drops, and wellness methodology delivered to your sanctuary.
      </p>
      <form className="flex flex-col md:flex-row gap-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="SECURE EMAIL ADDRESS" 
          className="flex-grow bg-white/5 border border-white/20 px-8 py-6 text-on-primary placeholder:text-on-primary/40 focus:border-white focus:bg-white/10 outline-none transition-all font-sans text-lg"
        />
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "#ffffff", color: "#2e0208" }}
          whileTap={{ scale: 0.95 }}
          className="bg-secondary-fixed text-primary px-16 py-6 text-label-caps font-black tracking-widest transition-all shadow-2xl"
        >
          Subscribe
        </motion.button>
      </form>
    </div>
  </section>
);

// --- Main Layout Components ---

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => (
  <footer className="bg-primary pt-40 pb-16 rounded-t-[50px] md:rounded-t-[150px] mt-20 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary-fixed/5 pointer-events-none -skew-x-12" />
    
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 mb-32 relative z-10">
      <div className="md:col-span-1">
        <motion.button 
          onClick={() => setPage('home')}
          className="text-primary-container flex flex-col leading-none mb-10"
        >
          <span className="font-display font-black text-4xl tracking-tighter text-secondary-fixed">HOT CORE</span>
          <span className="text-label-caps text-[10px] tracking-[0.4em] mt-1 text-white/40">Studio Network</span>
        </motion.button>
        <p className="text-on-primary/50 max-w-xs leading-relaxed text-sm mb-12 font-sans italic">
          "The pursuit of physical excellence is a high-intensity commitment. We provide the tools; you provide the fire."
        </p>
        <div className="flex gap-4">
           <motion.div whileHover={{ y: -5 }} className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full cursor-pointer hover:bg-white hover:text-primary transition-all">
            <Instagram size={18} />
           </motion.div>
           <motion.div whileHover={{ y: -5 }} className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full cursor-pointer hover:bg-white hover:text-primary transition-all">
            <Youtube size={18} />
           </motion.div>
           <motion.div whileHover={{ y: -5 }} className="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full cursor-pointer hover:bg-white hover:text-primary transition-all">
            <Facebook size={18} />
           </motion.div>
        </div>
      </div>
      
      <div className="text-left">
        <h4 className="text-label-caps text-secondary-fixed mb-10 font-black text-xs tracking-[0.3em]">Directory</h4>
        <div className="flex flex-col gap-6">
          {[
            {label: 'Signature Classes', id: 'classes' as Page}, 
            {label: 'Membership Access', id: 'memberships' as Page}, 
            {label: 'Studio Locations', id: 'locations' as Page}, 
            {label: 'Our Philosphy', id: 'about' as Page}
          ].map(item => (
            <motion.button 
              key={item.label} 
              onClick={() => setPage(item.id)}
              whileHover={{ x: 10, color: "#ffffff" }}
              className="text-on-primary/60 transition-colors text-left font-sans text-base"
            >
              {item.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-left">
        <h4 className="text-label-caps text-secondary-fixed mb-10 font-black text-xs tracking-[0.3em]">Support</h4>
        <div className="flex flex-col gap-6">
          {['Booking Portal', 'Technical FAQs', 'Privacy Protocol', 'Account Policy'].map(item => (
            <motion.a 
              key={item} 
              href="#" 
              whileHover={{ x: 10, color: "#ffffff" }}
              className="text-on-primary/60 transition-colors font-sans text-base"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>

      <div className="text-left">
        <h4 className="text-label-caps text-secondary-fixed mb-10 font-black text-xs tracking-[0.3em]">HQ STUDIO</h4>
        <div className="space-y-8">
          <div className="flex gap-4 text-on-primary/60 text-base font-sans">
            <MapPin size={20} className="text-secondary-fixed shrink-0" />
            <p className="leading-snug">Design District SF<br />888 Burn Street, Suite 100<br />California, 90210</p>
          </div>
          <div className="flex gap-4 text-on-primary/60 text-base font-sans">
            <Phone size={20} className="text-secondary-fixed shrink-0" />
            <p>+1 (415) 555-0123</p>
          </div>
          <div className="flex gap-4 text-on-primary/60 text-base font-sans font-bold">
             <Clock size={20} className="text-secondary-fixed shrink-0" />
             <p>Member Support: 24/7</p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
      <p className="text-on-primary/20 text-[10px] font-black uppercase tracking-[0.4em]">
        © 2024 HOT CORE PILATES. ALL RIGHTS RESERVED.
      </p>
      <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-on-primary/30">
        <a href="#" className="hover:text-white transition-colors">GDPR</a>
        <a href="#" className="hover:text-white transition-colors">SECURITY</a>
        <a href="#" className="hover:text-white transition-colors">CREDITS</a>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [booking, setBooking] = useState<{ open: boolean, title?: string }>({ open: false });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleBook = (title?: string) => {
    setBooking({ open: true, title });
  };

  return (
    <div className="min-h-screen bg-background selection:bg-secondary-fixed selection:text-primary font-sans text-on-surface overflow-x-hidden">
      <Nav currentPage={page} setPage={setPage} onBook={() => handleBook("General Booking")} />
      
      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero onBook={() => handleBook("Intro Class")} setPage={setPage} />
              <ClassesPreview onBook={handleBook} />
              <MembershipsPage onBook={handleBook} />
              <Testimonials />
              <Newsletter />
            </motion.div>
          )}
          {page === 'classes' && (
            <motion.div 
              key="classes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <ClassesPage onBook={handleBook} />
            </motion.div>
          )}
          {page === 'memberships' && (
             <motion.div 
              key="memberships"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <MembershipsPage onBook={handleBook} />
            </motion.div>
          )}
          {page === 'locations' && (
            <motion.div 
              key="locations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <LocationsPage onBook={handleBook} />
            </motion.div>
          )}
          {page === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <AboutPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />

      <BookingModal 
        isOpen={booking.open} 
        onClose={() => setBooking({ open: false })} 
        title={booking.title}
      />
    </div>
  );
}
