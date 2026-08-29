import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, ShieldAlert, BookOpen, Layers, LogOut, Award, LayoutDashboard, Users } from 'lucide-react';

const AdminCategoriesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form modal
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('#4F46E5');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCat(null);
    setCatName('');
    setCatDesc('');
    setCatColor('#4F46E5');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setCatColor(cat.color || '#4F46E5');
    setShowModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCat) {
        await categoryAPI.updateCategory(editingCat._id, { name: catName, description: catDesc, color: catColor });
      } else {
        await categoryAPI.createCategory({ name: catName, description: catDesc, color: catColor });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Error saving category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        await categoryAPI.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard-layout">
      
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
              <Link to="/admin/users" className="sidebar-item">
                <Users size={20} /> Registered Users
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="sidebar-item active">
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

      <main className="dashboard-main">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Quiz Categories
            </h1>
            <p style={{ color: '#64748B' }}>Add, edit, and organize quiz topic categories.</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateModal}>
            <Plus size={18} /> Add Category
          </button>
        </div>

        <div className="grid-3">
          {categories.map((cat) => (
            <div key={cat._id} className="card" style={{ borderLeft: `6px solid ${cat.color || '#4F46E5'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>{cat.name}</h3>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(cat)}><Edit size={14} /></button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat._id)}><Trash2 size={14} /></button>
                </div>
              </div>

              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                {cat.description || 'No description provided.'}
              </p>

              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                {cat.quizCount || 0} Quizzes Active
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                {editingCat ? 'Edit Category' : 'Add New Category'}
              </h3>

              <form onSubmit={handleSaveCategory}>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Theme Color</label>
                  <input
                    type="color"
                    style={{ width: '100%', height: '40px', cursor: 'pointer', border: 'none' }}
                    value={catColor}
                    onChange={(e) => setCatColor(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminCategoriesPage;
