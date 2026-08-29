import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, LayoutDashboard, LogOut, ShieldAlert, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">
            <Award size={24} />
          </div>
          <span>Quizify</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}>
              Quizzes
            </Link>
          </li>
          <li>
            <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
              Leaderboard
            </Link>
          </li>
          {user && user.role === 'admin' && (
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                Admin Panel
              </Link>
            </li>
          )}
        </ul>

        {/* Auth Action Buttons or User Dropdown */}
        <div className="nav-actions">
          {user ? (
            <div style={{ position: 'relative' }}>
              <div 
                className="user-menu-trigger" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {/* Initial Avatar Badge */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  border: '2px solid #ffffff',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
              </div>

              {dropdownOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '210px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--neutral-200)',
                    padding: '0.5rem',
                    zIndex: 200
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="sidebar-item" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="sidebar-item" 
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={18} />
                    <span>My Profile</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="sidebar-item" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ShieldAlert size={18} />
                      <span>Admin Control</span>
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--neutral-200)', margin: '0.3rem 0' }} />
                  <button 
                    onClick={() => { setDropdownOpen(false); logout(); navigate('/'); }}
                    className="sidebar-item"
                    style={{ width: '100%', color: 'var(--accent-rose)', textAlign: 'left' }}
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.5rem' }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/quizzes" onClick={() => setMobileMenuOpen(false)}>Quizzes</Link>
            </li>
            <li>
              <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>Leaderboard</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                </li>
                <li>
                  <button onClick={() => { setMobileMenuOpen(false); logout(); }}>Logout</button>
                </li>
              </>
            ) : (
              <li style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
