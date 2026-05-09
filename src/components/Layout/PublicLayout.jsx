import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-color)' 
    }}>
      {/* 
        NOTE: Nav and Footer are now integrated into individual public pages 
        (like LandingPage) for maximum design flexibility and BWT F1 branding.
      */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
