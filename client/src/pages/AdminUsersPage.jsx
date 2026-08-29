import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Award, Mail, Calendar, LogOut, LayoutDashboard, BookOpen, Layers } from 'lucide-react';

const AdminUsersPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await userAPI.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      
      {/* Sidebar */}
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
              <Link to="/admin" className="sidebar-item">
                <LayoutDashboard size={20} /> Dashboard Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/quizzes" className="sidebar-item">
                <BookOpen size={20} /> Quiz Management
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="sidebar-item active">
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

      {/* Main Area */}
      <main className="dashboard-main">
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
            Registered Users & Students
          </h1>
          <p style={{ color: '#64748B' }}>Monitor platform user accounts, roles, and attempt histories.</p>
        </div>

        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading users...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Quizzes Attempted</th>
                    <th>Best Score</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img src={u.avatar} alt={u.name} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-hard' : 'badge-primary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{u.totalQuizzesAttempted || 0}</td>
                      <td style={{ fontWeight: 600 }}>{u.bestScorePercentage || 0}%</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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

export default AdminUsersPage;
