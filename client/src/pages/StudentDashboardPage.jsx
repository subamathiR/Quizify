import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, CheckCircle, HelpCircle, ArrowRight, LayoutDashboard, User, BarChart2, BookOpen, Clock, LogOut } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const StudentDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await userAPI.getDashboardStats();
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
        <h2>Loading your dashboard analytics...</h2>
      </div>
    );
  }

  const pieData = [
    { name: 'Passed', value: stats.recentAttempts.filter(a => a.status === 'Pass').length, color: '#10B981' },
    { name: 'Failed', value: stats.recentAttempts.filter(a => a.status === 'Fail').length, color: '#F43F5E' }
  ];

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
              <Link to="/dashboard" className="sidebar-item active">
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
              <Link to="/profile" className="sidebar-item">
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

      {/* Main Content Area */}
      <main className="dashboard-main">
        
        {/* Dashboard Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Dashboard
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
              Welcome back, <strong style={{ color: '#0F172A' }}>{user?.name}</strong> 👋 Track your progress and improve your performance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button style={{ position: 'relative', color: '#64748B', padding: '0.4rem', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--neutral-200)', cursor: 'pointer' }}>
              <span style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, background: 'var(--accent-rose)', borderRadius: '50%' }} />
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
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

        {/* Top Overview Cards */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalAttempts}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Quizzes Attempted</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <Award size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.averageScore}%</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Average Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
              <Trophy size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.bestScore}%</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Best Score</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>
              <HelpCircle size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.totalQuestionsAnswered}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Questions Answered</div>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* Performance Overview (Area Chart) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
              Performance Overview
            </h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={stats.recentTrend?.length > 0 ? stats.recentTrend : [{ name: 'Week 1', score: 60 }, { name: 'Week 2', score: 75 }, { name: 'Week 3', score: 85 }]}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-600)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary-600)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="var(--primary-600)" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Correct vs Incorrect (Donut Chart) */}
          <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', alignSelf: 'flex-start' }}>
              Correct vs Incorrect
            </h3>
            <div style={{ width: '100%', height: 180, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Correct', value: stats.totalQuestionsAnswered ? Math.round(stats.totalQuestionsAnswered * (stats.averageScore / 100)) : 70, color: '#10B981' },
                      { name: 'Incorrect', value: stats.totalQuestionsAnswered ? Math.round(stats.totalQuestionsAnswered * ((100 - stats.averageScore) / 100)) : 30, color: '#F43F5E' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#10B981" />
                    <Cell fill="#F43F5E" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {/* Donut Center Label */}
              <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A' }}>{stats.averageScore}%</span>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Correct</span>
              </div>
            </div>
            {/* Donut Legend */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                <span style={{ color: '#0F172A' }}>Correct</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F43F5E' }} />
                <span style={{ color: '#0F172A' }}>Incorrect</span>
              </div>
            </div>
          </div>

          {/* Category Performance (Radar Chart) */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
              Category Performance
            </h3>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.categoryPerformance?.length > 0 ? stats.categoryPerformance : [{ category: 'JS', averageScore: 80 }, { category: 'Python', averageScore: 65 }, { category: 'SQL', averageScore: 70 }]}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="category" stroke="#64748B" fontSize={10} fontWeight={600} />
                  <Radar name="Accuracy" dataKey="averageScore" stroke="var(--primary-500)" fill="var(--primary-500)" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Attempts Table */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>Recent Quiz Attempts</h3>
            <Link to="/quizzes" className="btn btn-outline btn-sm">Take New Quiz</Link>
          </div>

          {stats.recentAttempts?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748B' }}>
              You haven't attempted any quizzes yet. Start taking quizzes to see your history!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAttempts.map((att) => (
                    <tr key={att._id}>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{att.quizTitle}</td>
                      <td><span className="badge badge-primary">{att.category || 'General'}</span></td>
                      <td>{att.score}/{att.totalQuestions}</td>
                      <td style={{ fontWeight: 700 }}>{att.percentage}%</td>
                      <td>
                        <span className={`badge ${att.status === 'Pass' ? 'badge-easy' : 'badge-hard'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td>{new Date(att.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link to={`/result/${att._id}`} className="btn btn-secondary btn-sm">
                          View Result
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default StudentDashboardPage;
