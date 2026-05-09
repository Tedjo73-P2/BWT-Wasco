import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { 
  FiHome, FiFileText, FiDollarSign, FiAlertCircle, 
  FiUsers, FiSettings, FiLogOut, FiPieChart, FiActivity
} from 'react-icons/fi';

const DashboardLayout = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getSidebarLinks = () => {
    if (role === 'customer') return [
      { path: '/customer', label: 'Overview', icon: FiHome },
      { path: '/customer/bills', label: 'My Bills', icon: FiFileText },
      { path: '/customer/pay', label: 'Pay Bill', icon: FiDollarSign },
      { path: '/customer/history', label: 'Payments', icon: FiActivity },
      { path: '/customer/report-leakage', label: 'Report Leak', icon: FiAlertCircle },
      { path: '/customer/my-leakages', label: 'My Reports', icon: FiFileText },
    ];
    if (role === 'admin') return [
      { path: '/admin', label: 'Dashboard', icon: FiHome },
      { path: '/admin/customers', label: 'Users', icon: FiUsers },
      { path: '/admin/bills', label: 'Billing', icon: FiFileText },
      { path: '/admin/rates', label: 'Rates', icon: FiSettings },
      { path: '/admin/payments', label: 'Payments', icon: FiDollarSign },
      { path: '/admin/leakages', label: 'Leakages', icon: FiAlertCircle },
    ];
    if (role === 'manager') return [
      { path: '/manager', label: 'Strategic Overview', icon: FiPieChart },
      { path: '/manager/leakages', label: 'Leakages', icon: FiAlertCircle },
    ];
    return [];
  };

  const links = getSidebarLinks();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'white' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '280px', 
        backgroundColor: 'rgba(5, 5, 8, 0.4)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ padding: '2.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--bwt-pink), var(--bwt-blue))', borderRadius: '8px' }}></div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '1px' }}>
              BWT <span className="gradient-text">WASCO</span>
            </h2>
          </div>
          <p style={{ color: 'var(--bwt-blue)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginTop: '0.5rem', letterSpacing: '2px' }}>
            {role} PORTAL
          </p>
        </div>
        
        <nav style={{ padding: '2rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '0.85rem 1.25rem', borderRadius: '12px',
                color: isActive ? 'white' : 'var(--text-muted)',
                backgroundColor: isActive ? 'rgba(0, 180, 216, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 180, 216, 0.3)' : '1px solid transparent',
                transition: 'var(--transition)',
                boxShadow: isActive ? '0 0 20px rgba(0, 180, 216, 0.1)' : 'none'
              }}>
                <Icon size={18} style={{ color: isActive ? 'var(--bwt-blue)' : 'inherit' }} />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '2rem 1.25rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem',
              width: '100%', padding: '0.85rem 1.25rem',
              background: 'rgba(255, 0, 122, 0.05)', border: '1px solid rgba(255, 0, 122, 0.1)', 
              borderRadius: '12px', color: 'var(--bwt-pink)',
              textAlign: 'left', fontWeight: 600
            }}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Topbar */}
        <header style={{ 
          backgroundColor: 'rgba(5, 5, 8, 0.6)', 
          backdropFilter: 'blur(15px)',
          padding: '1.25rem 2.5rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>
              Welcome, <span className="gradient-text">{user?.name || 'Commander'}</span>
            </h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
             <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>{user?.email}</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--bwt-blue)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Online Session</p>
             </div>
            <div style={{ 
              width: '42px', height: '42px', borderRadius: '12px', 
              background: 'linear-gradient(135deg, var(--bwt-blue), var(--bwt-pink))',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: '2.5rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
