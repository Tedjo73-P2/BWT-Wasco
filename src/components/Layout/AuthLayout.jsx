import { Outlet, Link, useLocation } from 'react-router-dom';

const AuthLayout = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at 10% 10%, rgba(0, 180, 216, 0.1) 0%, var(--bg-color) 40%)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{
        position: 'absolute',
        right: '-10%',
        bottom: '-5%',
        width: '60%',
        opacity: 0.2,
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'grayscale(50%) brightness(1.5)'
      }}>
        <img src="/f1-hero.png" alt="" style={{ width: '100%', height: 'auto', maskImage: 'linear-gradient(to top, transparent, black)' }} />
      </div>

      <div style={{ position: 'absolute', top: '2.5rem', left: '3.5rem', zIndex: 10 }}>
        <Link to="/" style={{ color: 'white', fontWeight: 900, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, var(--bwt-pink), var(--bwt-blue))', borderRadius: '8px' }}></div>
          BWT <span className="gradient-text">WASCO</span>
        </Link>
      </div>
      
      <div className="card glass-panel animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: isRegister ? '750px' : '500px', 
        padding: isRegister ? '3rem' : '4rem', 
        position: 'relative', 
        zIndex: 2,
        boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
