import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Award, Rocket, Target, BookOpen, Trophy, Zap, Edit, Check, LayoutDashboard, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const availableBadges = [
    { id: 'first_step', name: 'First Steps 🚀', description: 'Completed your very first quiz!', icon: Rocket },
    { id: 'perfect_score', name: 'Perfect Score 🎯', description: 'Scored 100% on a quiz!', icon: Target },
    { id: 'quiz_enthusiast', name: 'Quiz Enthusiast 📚', description: 'Completed 5 quizzes!', icon: BookOpen },
    { id: 'quiz_master', name: 'Quiz Master 🏆', description: 'Completed 10 quizzes!', icon: Trophy },
    { id: 'speed_demon', name: 'Speed Solver ⚡', description: 'Completed a quiz under 50% allotted time!', icon: Zap },
    { id: 'knowledge_champion', name: 'Knowledge Champion 👑', description: 'Ranked in the top 3 on Global Leaderboard!', icon: Award }
  ];

  const unlockedBadgeIds = new Set((user?.badges || []).map(b => b.id));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, bio, avatar, password: password || undefined });
      setIsEditing(false);
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid #1f2937', marginBottom: '1.5rem' }}>
            <div className="logo-icon" style={{ width: 36, height: 36 }}>
              <Award size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Quizify</span>
          </div>

          <ul className="sidebar-menu">
            <li>
              <Link to="/dashboard" className="sidebar-item">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/quizzes" className="sidebar-item">
                <BookOpen size={20} /> Explore Quizzes
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className="sidebar-item">
                <Trophy size={20} /> Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="sidebar-item active">
                <User size={20} /> Profile & Badges
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            className="sidebar-item"
            style={{ width: '100%', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'none', border: 'none', textAlign: 'left' }}
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        {/* Dashboard Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              My Profile
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Manage your personal settings, tagline, bio, and review earned badges.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.15rem',
                border: '2px solid #ffffff',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Profile Card Header */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-600))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '2.8rem',
              border: '4px solid var(--primary-500)',
              boxShadow: 'var(--shadow-md)'
            }}>
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A' }}>{user?.name}</h1>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit size={16} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>

              <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.25rem 0 0.75rem' }}>{user?.email}</p>
              <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>{user?.bio || 'Enthusiastic Learner 🚀'}</p>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleProfileSubmit} style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>Update Profile Info</h3>
              
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>
          )}
        </div>

        {/* Gamified Achievements & Badges Gallery */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Achievement Badges
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Unlock badges by taking quizzes, scoring high marks, and competing on the global leaderboard.
            </p>
          </div>

          <div className="grid-3">
            {availableBadges.map((badge) => {
              const isUnlocked = unlockedBadgeIds.has(badge.id);
              const BadgeIcon = badge.icon;

              return (
                <div 
                  key={badge.id}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: isUnlocked ? '2px solid var(--primary-500)' : '1px dashed #CBD5E1',
                    background: isUnlocked ? 'var(--primary-50)' : '#F8FAFC',
                    opacity: isUnlocked ? 1 : 0.6,
                    textAlign: 'center',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: isUnlocked ? 'var(--primary-600)' : '#CBD5E1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    boxShadow: isUnlocked ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                  }}>
                    <BadgeIcon size={26} />
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
                    {badge.name}
                  </h4>

                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.4 }}>
                    {badge.description}
                  </p>

                  <div style={{ marginTop: '1rem' }}>
                    {isUnlocked ? (
                      <span className="badge badge-easy" style={{ fontSize: '0.75rem' }}>
                        <Check size={12} /> Unlocked
                      </span>
                    ) : (
                      <span className="badge" style={{ background: '#E2E8F0', color: '#64748B', fontSize: '0.75rem' }}>
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
