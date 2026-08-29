import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { quizAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, HelpCircle, Eye, EyeOff, Check, X, ShieldAlert, ArrowLeft, LogOut, Award, LayoutDashboard, Users, Layers, BookOpen } from 'lucide-react';

const AdminQuizzesPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showQuizModal, setShowQuizModal] = useState(searchParams.get('action') === 'create');
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [activeQuizForQuestions, setActiveQuizForQuestions] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Quiz form state
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizCategory, setQuizCategory] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizDuration, setQuizDuration] = useState(15);
  const [quizPassingScore, setQuizPassingScore] = useState(60);

  // Question form state
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');

  useEffect(() => {
    fetchQuizzesAndCategories();
  }, []);

  const fetchQuizzesAndCategories = async () => {
    setLoading(true);
    try {
      const [qRes, cRes] = await Promise.all([
        quizAPI.getQuizzes({ publishedOnly: 'false', limit: 100 }),
        categoryAPI.getCategories()
      ]);
      setQuizzes(qRes.data.quizzes || []);
      setCategories(cRes.data || []);
      if (cRes.data.length > 0 && !quizCategory) {
        setQuizCategory(cRes.data[0].name);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateQuizModal = () => {
    setEditingQuiz(null);
    setQuizTitle('');
    setQuizDesc('');
    setQuizDifficulty('Medium');
    setQuizDuration(15);
    setQuizPassingScore(60);
    setShowQuizModal(true);
  };

  const openEditQuizModal = (quiz) => {
    setEditingQuiz(quiz);
    setQuizTitle(quiz.title);
    setQuizDesc(quiz.description);
    setQuizCategory(quiz.category);
    setQuizDifficulty(quiz.difficulty);
    setQuizDuration(quiz.duration);
    setQuizPassingScore(quiz.passingScore);
    setShowQuizModal(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: quizTitle,
        description: quizDesc,
        category: quizCategory,
        difficulty: quizDifficulty,
        duration: Number(quizDuration),
        passingScore: Number(quizPassingScore)
      };

      if (editingQuiz) {
        await quizAPI.updateQuiz(editingQuiz._id, data);
      } else {
        await quizAPI.createQuiz(data);
      }

      setShowQuizModal(false);
      fetchQuizzesAndCategories();
    } catch (err) {
      console.error(err);
      alert('Error saving quiz');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz permanently?')) {
      try {
        await quizAPI.deleteQuiz(id);
        fetchQuizzesAndCategories();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleTogglePublish = async (quiz) => {
    try {
      await quizAPI.updateQuiz(quiz._id, { published: !quiz.published });
      fetchQuizzesAndCategories();
    } catch (err) {
      console.error(err);
    }
  };

  // Question Management Functions
  const openManageQuestionsModal = (quiz) => {
    setActiveQuizForQuestions(quiz);
    setEditingQuestion(null);
    resetQuestionForm();
    setShowQuestionModal(true);
  };

  const resetQuestionForm = () => {
    setQText('');
    setOptA('');
    setOptB('');
    setOptC('');
    setOptD('');
    setCorrectAnswer(0);
    setExplanation('');
  };

  const editQuestionClick = (question) => {
    setEditingQuestion(question);
    setQText(question.questionText);
    setOptA(question.options[0] || '');
    setOptB(question.options[1] || '');
    setOptC(question.options[2] || '');
    setOptD(question.options[3] || '');
    setCorrectAnswer(question.correctAnswer);
    setExplanation(question.explanation || '');
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!activeQuizForQuestions) return;

    const questionData = {
      questionText: qText,
      options: [optA, optB, optC, optD],
      correctAnswer: Number(correctAnswer),
      explanation
    };

    try {
      if (editingQuestion) {
        await quizAPI.updateQuestion(activeQuizForQuestions._id, editingQuestion._id, questionData);
      } else {
        await quizAPI.addQuestion(activeQuizForQuestions._id, questionData);
      }

      // Refresh active quiz
      const updatedQuizRes = await quizAPI.getQuizById(activeQuizForQuestions._id);
      setActiveQuizForQuestions(updatedQuizRes.data);
      setEditingQuestion(null);
      resetQuestionForm();
      fetchQuizzesAndCategories();
    } catch (err) {
      console.error(err);
      alert('Error saving question.');
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Delete this question?')) {
      try {
        await quizAPI.deleteQuestion(activeQuizForQuestions._id, questionId);
        const updatedQuizRes = await quizAPI.getQuizById(activeQuizForQuestions._id);
        setActiveQuizForQuestions(updatedQuizRes.data);
        fetchQuizzesAndCategories();
      } catch (err) {
        console.error(err);
      }
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
              <Link to="/admin/quizzes" className="sidebar-item active">
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

      {/* Main Container */}
      <main className="dashboard-main">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Quiz Management
            </h1>
            <p style={{ color: '#64748B' }}>Create, update, publish quizzes, and construct question banks.</p>
          </div>

          <button className="btn btn-primary" onClick={openCreateQuizModal}>
            <Plus size={18} /> Create New Quiz
          </button>
        </div>

        {/* Quizzes Table */}
        <div className="card">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>Loading quizzes...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Quiz Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Questions</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id}>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{quiz.title}</td>
                      <td><span className="badge badge-primary">{quiz.category}</span></td>
                      <td><span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span></td>
                      <td style={{ fontWeight: 600 }}>{quiz.questions?.length || 0} Questions</td>
                      <td>{quiz.duration} Mins</td>
                      <td>
                        <button
                          className={`badge ${quiz.published ? 'badge-easy' : 'badge-hard'}`}
                          style={{ border: 'none', cursor: 'pointer' }}
                          onClick={() => handleTogglePublish(quiz)}
                        >
                          {quiz.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Manage Questions"
                            onClick={() => openManageQuestionsModal(quiz)}
                          >
                            <HelpCircle size={16} /> Questions ({quiz.questions?.length || 0})
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Edit Quiz"
                            onClick={() => openEditQuizModal(quiz)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            title="Delete Quiz"
                            onClick={() => handleDeleteQuiz(quiz._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CREATE / EDIT QUIZ MODAL */}
        {showQuizModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                  {editingQuiz ? 'Edit Quiz Settings' : 'Create New Quiz'}
                </h3>
                <button onClick={() => setShowQuizModal(false)}><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveQuiz}>
                <div className="form-group">
                  <label className="form-label">Quiz Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Modern React & Hooks Masterclass"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Detailed explanation of what this quiz evaluates..."
                    value={quizDesc}
                    onChange={(e) => setQuizDesc(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="form-input"
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                      required
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select
                      className="form-input"
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value)}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={1}
                      className="form-input"
                      value={quizDuration}
                      onChange={(e) => setQuizDuration(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passing Score (%)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      className="form-input"
                      value={quizPassingScore}
                      onChange={(e) => setQuizPassingScore(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowQuizModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Quiz
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* QUESTION BUILDER MODAL */}
        {showQuestionModal && activeQuizForQuestions && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Question Builder</h3>
                  <p style={{ color: '#64748B', fontSize: '0.85rem' }}>{activeQuizForQuestions.title}</p>
                </div>
                <button onClick={() => setShowQuestionModal(false)}><X size={20} /></button>
              </div>

              {/* Form to Add / Edit Question */}
              <form onSubmit={handleSaveQuestion} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h4>

                <div className="form-group">
                  <label className="form-label">Question Text</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter full question text here..."
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Option A</label>
                    <input type="text" className="form-input" value={optA} onChange={(e) => setOptA(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option B</label>
                    <input type="text" className="form-input" value={optB} onChange={(e) => setOptB(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option C</label>
                    <input type="text" className="form-input" value={optC} onChange={(e) => setOptC(e.target.value)} required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Option D</label>
                    <input type="text" className="form-input" value={optD} onChange={(e) => setOptD(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-input"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(Number(e.target.value))}
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Explanation Note</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Why is this answer correct?"
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  {editingQuestion && (
                    <button type="button" className="btn btn-secondary" onClick={() => { setEditingQuestion(null); resetQuestionForm(); }}>
                      Cancel Edit
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </form>

              {/* Questions List preview */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                Existing Questions ({activeQuizForQuestions.questions?.length || 0})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeQuizForQuestions.questions?.map((q, qIdx) => (
                  <div key={q._id || qIdx} style={{ background: '#ffffff', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>Q{qIdx + 1}: {q.questionText}</div>
                      <div style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, marginTop: '0.2rem' }}>
                        Correct: Option {String.fromCharCode(65 + q.correctAnswer)} ({q.options[q.correctAnswer]})
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => editQuestionClick(q)}><Edit size={14} /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteQuestion(q._id)}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminQuizzesPage;
