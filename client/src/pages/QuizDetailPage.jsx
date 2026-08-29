import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import { Clock, HelpCircle, Award, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

const QuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizAPI.getQuizById(id);
        setQuiz(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
        <h2>Loading quiz details...</h2>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>Quiz not found</h2>
        <Link to="/quizzes" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Quizzes</Link>
      </div>
    );
  }

  const getCategoryTheme = (cat) => {
    const defaultTheme = { bg: '#EEF2FF', color: '#4F46E5', char: '📚' };
    const themes = {
      'Programming': { bg: '#EEF2FF', color: '#4F46E5', char: '💻' },
      'JavaScript': { bg: '#FFFDF0', color: '#EAB308', char: 'JS' },
      'Python': { bg: '#EFF6FF', color: '#3B82F6', char: '🐍' },
      'Java': { bg: '#FEF2F2', color: '#EF4444', char: '☕' },
      'Data Structures': { bg: '#ECFDF5', color: '#10B981', char: '📊' },
      'Database & SQL': { bg: '#F0FDFA', color: '#0D9488', char: '🗄️' },
      'Web Development': { bg: '#FFF5F5', color: '#F87171', char: '🌐' },
      'Artificial Intelligence': { bg: '#F5F3FF', color: '#8B5CF6', char: '🤖' },
      'Aptitude': { bg: '#FDF2F8', color: '#EC4899', char: '🧮' },
      'Reasoning': { bg: '#FFFBEB', color: '#D97706', char: '🧠' },
      'General Knowledge': { bg: '#ECFEFF', color: '#0891B2', char: '🌍' }
    };
    return themes[cat] || defaultTheme;
  };

  const theme = getCategoryTheme(quiz.category);

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: 'var(--neutral-50)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        <Link to="/quizzes" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={18} /> Back to Quizzes
        </Link>

        {/* Header Title Card Block */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: theme.bg,
            color: theme.color,
            fontSize: '2.2rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            border: `1px solid ${theme.color}22`
          }}>
            {theme.char}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>{quiz.title}</h1>
            <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.5 }}>{quiz.description}</p>
          </div>
        </div>

        {/* Two Column Specifications & Statistics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Details & Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Specs Card */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>Quiz Specifications</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Category</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{quiz.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Difficulty</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>
                    <span className={`badge badge-${quiz.difficulty.toLowerCase()}`} style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem' }}>{quiz.difficulty}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Questions</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{quiz.questions?.length || 0} Questions</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Time Limit</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{quiz.duration} Mins</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Passing Score</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>{quiz.passingScore}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Rating</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#EAB308', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    ★ {quiz.averageRating || 4.5}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>Instructions</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem', color: '#475569' }}>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span>The quiz contains {quiz.questions?.length || 0} multiple-choice questions.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span>Each question has 4 options; only one option is correct.</span>
                </li>
                <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                  <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span>No negative marks apply. You can skip questions or mark them for review.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Statistics & Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: '340px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>Your Statistics</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Best Score</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>90%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Average Score</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>75%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Total Attempts</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>3 attempts</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B', fontSize: '0.9rem' }}>Last Attempt</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>20 May 2026</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/quiz/${quiz._id}/take`)}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              >
                Start Quiz
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default QuizDetailPage;
