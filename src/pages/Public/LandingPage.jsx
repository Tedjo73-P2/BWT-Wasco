import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiZap, FiTarget, FiCpu, FiGlobe, FiLayers, FiMenu, FiX, FiGithub, FiTwitter, FiInstagram, FiDroplet, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

const HERO_IMAGES = [
  { url: '/f1-hero.png', title: 'Strategic Command', sub: 'National Grid Deployment' },
  { url: '/f1-car.png', title: 'Absolute Velocity', sub: 'Precision Billing Engine' }
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const districts = ['Maseru', 'Leribe', 'Berea', 'Mafeteng', 'Mohale\'s Hoek', 'Quthing', 'Qacha\'s Nek', 'Mokhotlong', 'Thaba-Tseka', 'Butha-Buthe'];
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Sleek Hamburger Nav Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100px',
        padding: '0 6%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        background: 'linear-gradient(to bottom, rgba(10,10,15,0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, var(--bwt-pink), var(--bwt-blue))', borderRadius: '10px', boxShadow: '0 0 20px var(--bwt-pink-glow)' }}></div>
          <span style={{ fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-1.5px' }}>BWT <span className="gradient-text">WASCO</span></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/login" style={{ color: 'white', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Login</Link>
          <button 
            onClick={toggleMenu}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', 
              color: 'white', 
              width: '56px', 
              height: '56px', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Hamburger Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '100%',
              maxWidth: '500px',
              height: '100vh',
              background: 'rgba(5, 5, 8, 0.98)',
              backdropFilter: 'blur(30px)',
              zIndex: 2000,
              padding: '120px 80px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.8)',
              borderLeft: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <button onClick={toggleMenu} style={{ position: 'absolute', top: '40px', right: '40px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><FiX size={32} /></button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               {[
                 { label: 'Network Grid', href: '#nodes' },
                 { label: 'Technology', href: '#technology' },
                 { label: 'Citizen Portal', href: '/login' },
                 { label: 'Node Registration', href: '/register' }
               ].map((item, i) => (
                 item.href.startsWith('#') ? (
                   <motion.a
                     key={i}
                     href={item.href}
                     onClick={() => setIsMenuOpen(false)}
                     style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', textDecoration: 'none', letterSpacing: '-1.5px', display: 'block' }}
                     whileHover={{ x: 20, color: 'var(--bwt-blue)' }}
                   >
                     {item.label}
                   </motion.a>
                 ) : (
                   <Link
                     key={i}
                     to={item.href}
                     onClick={() => setIsMenuOpen(false)}
                     style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', textDecoration: 'none', letterSpacing: '-1.5px', display: 'block' }}
                   >
                     <motion.span 
                       style={{ display: 'block' }}
                       whileHover={{ x: 20, color: 'var(--bwt-blue)' }}
                     >
                       {item.label}
                     </motion.span>
                   </Link>
                 )
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with 3D Tilt Pop */}
      <section 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          position: 'relative', 
          height: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          overflow: 'hidden',
          paddingTop: '100px',
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 180, 216, 0.05) 0%, var(--bg-color) 70%)'
        }}
      >
        
        {/* Floating 3D Tilt Image */}
        <div style={{
          position: 'absolute',
          right: '5%',
          width: '60%',
          height: '80%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '1000px',
          zIndex: 5
        }}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1, y: -50 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
                position: 'relative'
              }}
            >
               {/* Reflection/Glow behind the car */}
               <div style={{ 
                 position: 'absolute', 
                 inset: '10%', 
                 background: 'radial-gradient(circle, var(--bwt-blue-glow) 0%, transparent 70%)',
                 filter: 'blur(40px)',
                 zIndex: -1,
                 transform: 'translateZ(-50px)'
               }}></div>

               <img 
                src={HERO_IMAGES[currentSlide].url} 
                alt="BWT Car" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.8))',
                  borderRadius: '30px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)',
                  maskImage: 'radial-gradient(circle, black 70%, transparent 100%)'
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 8%', maxWidth: '850px' }}>
          <motion.div
            key={currentSlide + '-text'}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
               <div style={{ height: '3px', width: '60px', background: 'var(--bwt-blue)', boxShadow: '0 0 10px var(--bwt-blue)' }}></div>
               <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--bwt-blue)', letterSpacing: '6px', textTransform: 'uppercase' }}>
                 {HERO_IMAGES[currentSlide].sub}
               </span>
            </div>

            <h1 style={{ fontSize: '7rem', fontWeight: 900, lineHeight: 0.85, marginBottom: '2.5rem', letterSpacing: '-6px' }}>
              Strategic <br/>
              <span className="gradient-text">{HERO_IMAGES[currentSlide].title}.</span>
            </h1>
            
            <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4rem', lineHeight: 1.5, maxWidth: '550px', fontWeight: 500 }}>
              The Kingdom's elite water infrastructure. BWT F1 precision for the national grid.
            </p>

            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              <Link to="/login" className="btn-primary" style={{ padding: '1.8rem 5rem', fontSize: '1.25rem', borderRadius: '24px', boxShadow: '0 20px 50px var(--bwt-blue-glow)' }}>
                Access Terminal
              </Link>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {HERO_IMAGES.map((_, i) => (
                  <div key={i} style={{ 
                    width: i === currentSlide ? '50px' : '12px', 
                    height: '12px', 
                    borderRadius: '6px', 
                    background: i === currentSlide ? 'var(--bwt-blue)' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}></div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* National Service Grid Section - Required for Unregistered Users */}
      <section id="services" style={{ padding: '12rem 8%', background: 'var(--bg-color)', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
           <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--bwt-blue)', letterSpacing: '6px', textTransform: 'uppercase' }}>Public Service Registry</span>
           <h2 style={{ fontSize: '4.5rem', fontWeight: 900, marginTop: '1rem', letterSpacing: '-3px' }}>Operational <span className="gradient-text">Capabilities.</span></h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
           <motion.div whileHover={{ y: -10 }} className="card glass-panel" style={{ padding: '4rem', borderTop: '4px solid var(--bwt-blue)' }}>
              <FiDroplet size={48} color="var(--bwt-blue)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Water <span className="gradient-text">Services</span></h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {['Domestic Grid Supply', 'Industrial High-Pressure Nodes', 'Prepaid Infrastructure Deployment', 'Water Quality Auditing', 'Grid Leakage Detection'].map((s, i) => (
                   <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                      <FiCheck color="var(--bwt-blue)" /> {s}
                   </li>
                 ))}
              </ul>
           </motion.div>

           <motion.div whileHover={{ y: -10 }} className="card glass-panel" style={{ padding: '4rem', borderTop: '4px solid var(--bwt-pink)' }}>
              <FiZap size={48} color="var(--bwt-pink)" style={{ marginBottom: '2rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Sewerage <span className="gradient-text">Infrastructure</span></h3>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                 {['Urban Network Expansion', 'Industrial Waste Processing', 'National Sanitation Protocols', 'Infrastructure Lifecycle Management', 'Grid Maintenance & Repair'].map((s, i) => (
                   <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem' }}>
                      <FiCheck color="var(--bwt-pink)" /> {s}
                   </li>
                 ))}
              </ul>
           </motion.div>
        </div>
      </section>

      {/* Grid Status Section */}
      <section id="nodes" style={{ padding: '12rem 8%', background: 'var(--bwt-deep)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '2.5rem', letterSpacing: '-3px' }}>
              National <br/> <span className="gradient-text">Command Nodes.</span>
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '3rem' }}>
              {districts.map(d => (
                <motion.div 
                  key={d} 
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 180, 216, 0.1)' }}
                  style={{ padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}
                >
                  {d.toUpperCase()}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="card glass-panel" style={{ padding: '4rem' }}>
             <h3 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Node Status</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {['Maseru Hub', 'Leribe Fragment', 'National Engine'].map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <div style={{ width: '10px', height: '10px', background: '#00FFC2', borderRadius: '50%', boxShadow: '0 0 15px #00FFC2' }}></div>
                       <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>{n}</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--bwt-blue)' }}>ONLINE</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '10rem 8%', textAlign: 'center', background: 'var(--bwt-deep)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
         <h2 style={{ fontSize: '5rem', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-4px' }}>Strategic <span className="gradient-text">Deployment.</span></h2>
         <Link to="/register" className="btn-primary" style={{ padding: '2rem 6rem', fontSize: '1.5rem', borderRadius: '30px' }}>
            Initialize Your Node
         </Link>
         <div style={{ marginTop: '8rem', display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
           <span>&copy; 2026 BWT WASCO | LESOTHO COMMAND</span>
           <span>MISSION CRITICAL SYSTEM v2.4</span>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
