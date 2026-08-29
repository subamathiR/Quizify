import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, HelpCircle, Award, Plus, FolderPlus, Layers, LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await adminAPI.getStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
        <h2>Loading admin dashboard metrics...</h2>
      </div>
    );
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4'];

  return (
    <div className="dashboard-layout">
      
      {/* Admin Sidebar */}
      <aside className="sidebar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.5rem 1.5rem', borderBottom: '1px solid #1f2937', marginBottom: '1.5rem' }}>
            <div className="logo-icon" style={{ width: 36, height: 36 }}>
              <Award size={20} />
            </div>
            <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Quizify</span>
            <span className="badge badge-hard" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>Admin</span>
          </div>

          <ul className="sidebar-menu">
            <li>
              <Link to="/admin" className="sidebar-item active">
                <LayoutDashboard size={20} /> Dashboard Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/quizzes" className="sidebar-item">
                <BookOpen size={20} /> Quiz Management
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="sidebar-item">
                <Users size={20} /> Registered Users
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="sidebar-item">
                <Layers size={20} /> Manage Categories
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

      {/* Main Admin Area */}
      <main className="dashboard-main">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#64748B' }}>Manage quizzes, questions, categories, and review student performance.</p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/admin/quizzes?action=create" className="btn btn-primary">
              <Plus size={18} /> Create New Quiz
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalUsers}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Students</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalQuizzes}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Quizzes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
              <HelpCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalQuestions}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Questions</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalAttempts}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Attempts</div>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
              Quiz Attempts Over Time
            </h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={stats.attemptsTrend}>
                  <XAxis dataKey="month" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="attempts" stroke="var(--primary-600)" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
              Category Distribution
            </h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.categoryDistribution} dataKey="attempts" nameKey="name" cx="50%" cy="50%" outerRadius={85}>
                    {stats.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Platform Attempts */}
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
            System-Wide Recent Quiz Attempts
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Quiz Title</th>
                  <th>Category</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Attempt Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentAttempts.map((att) => (
                  <tr key={att._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src={att.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={att.user?.name} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                        <span style={{ fontWeight: 600 }}>{att.user?.name || 'User'}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: '#0F172A' }}>{att.quizTitle}</td>
                    <td><span className="badge badge-primary">{att.category || 'General'}</span></td>
                    <td>{att.score}/{att.totalQuestions} ({att.percentage}%)</td>
                    <td>
                      <span className={`badge ${att.status === 'Pass' ? 'badge-easy' : 'badge-hard'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{new Date(att.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboardPage;
