import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { attemptAPI } from '../services/api';
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, HelpCircle, BookOpen } from 'lucide-react';

const AnswerReviewPage = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'correct', 'incorrect'
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await attemptAPI.getAttemptById(id);
        setAttempt(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id]);

  if (loading || !attempt) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
        <h2>Loading answer review...</h2>
      </div>
    );
  }

  const quiz = attempt.quiz;
  const questions = quiz.questions || [];

  const filteredQuestions = questions.filter((q, idx) => {
    const ans = attempt.answers[idx];
    if (filter === 'correct') return ans?.isCorrect;
    if (filter === 'incorrect') return !ans?.isCorrect;
    return true;
  });

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: 'var(--neutral-50)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        <Link to={`/result/${attempt._id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', fontWeight: 600, marginBottom: '1.5rem' }}>
          <ArrowLeft size={18} /> Back to Result Summary
        </Link>

        {/* Header Summary Box */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F172A' }}>Detailed Answer Review</h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>{attempt.quizTitle} • Score: {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)</p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setFilter('all'); setActiveIdx(0); }}
            >
              All ({questions.length})
            </button>
            <button
              className={`btn btn-sm ${filter === 'correct' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setFilter('correct'); setActiveIdx(0); }}
            >
              Correct ({attempt.correctAnswers})
            </button>
            <button
              className={`btn btn-sm ${filter === 'incorrect' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => { setFilter('incorrect'); setActiveIdx(0); }}
            >
              Incorrect ({attempt.wrongAnswers + attempt.unanswered})
            </button>
          </div>
        </div>

        {/* Side-by-Side Content Grid */}
        {filteredQuestions.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
            
            {/* Left Column: Navigator list */}
            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '550px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Question List</h4>
              {filteredQuestions.map((q, idx) => {
                const originalIdx = questions.findIndex(orig => orig._id === q._id);
                const userAns = attempt.answers[originalIdx];
                const isCorrect = userAns?.isCorrect;
                const isUnanswered = userAns?.selectedOption === null || userAns?.selectedOption === undefined;
                const isActive = activeIdx === idx;

                return (
                  <button
                    key={q._id}
                    onClick={() => setActiveIdx(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      background: isActive ? 'var(--primary-50)' : '#ffffff',
                      border: isActive ? '1px solid var(--primary-350)' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s'
                    }}
                  >
                    {isCorrect ? (
                      <CheckCircle size={18} style={{ color: '#10B981', flexShrink: 0 }} />
                    ) : isUnanswered ? (
                      <AlertCircle size={18} style={{ color: '#64748B', flexShrink: 0 }} />
                    ) : (
                      <XCircle size={18} style={{ color: '#F43F5E', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary-800)' : '#334155' }}>
                      Q{originalIdx + 1}: {q.questionText.slice(0, 20)}...
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Detailed review area */}
            <div className="card" style={{ padding: '2.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Active Question details */}
                {(() => {
                  const activeQuestion = filteredQuestions[activeIdx] || filteredQuestions[0];
                  if (!activeQuestion) return null;
                  const originalIdx = questions.findIndex(orig => orig._id === activeQuestion._id);
                  const userAns = attempt.answers[originalIdx];
                  const isCorrect = userAns?.isCorrect;
                  const isUnanswered = userAns?.selectedOption === null || userAns?.selectedOption === undefined;

                  return (
                    <div>
                      {/* Status header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--primary-600)', fontSize: '1.1rem' }}>
                          Question {originalIdx + 1}
                        </span>

                        {isCorrect ? (
                          <span className="badge" style={{ background: '#ECFDF5', color: '#065F46' }}>
                            <CheckCircle size={16} /> Correct (+1)
                          </span>
                        ) : isUnanswered ? (
                          <span className="badge" style={{ background: '#F1F5F9', color: '#475569' }}>
                            <AlertCircle size={16} /> Unanswered
                          </span>
                        ) : (
                          <span className="badge" style={{ background: '#FEF2F2', color: '#991B1B' }}>
                            <XCircle size={16} /> Incorrect
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.5, marginBottom: '2rem' }}>
                        {activeQuestion.questionText}
                      </h3>

                      {/* Options */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                        {activeQuestion.options.map((opt, optIdx) => {
                          const isUserSelected = userAns?.selectedOption === optIdx;
                          const isCorrectOpt = activeQuestion.correctAnswer === optIdx;

                          let borderCol = '#E2E8F0';
                          let bgCol = '#ffffff';
                          let textCol = '#0F172A';

                          if (isCorrectOpt) {
                            borderCol = '#10B981';
                            bgCol = '#F0FDF4';
                          } else if (isUserSelected && !isCorrect) {
                            borderCol = '#F43F5E';
                            bgCol = '#FEF2F2';
                          }

                          return (
                            <div
                              key={optIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '1rem 1.25rem',
                                border: `2px solid ${borderCol}`,
                                background: bgCol,
                                borderRadius: '12px',
                                color: textCol,
                                fontSize: '0.95rem'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontWeight: 700 }}>{String.fromCharCode(65 + optIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                              {isCorrectOpt && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Correct Answer</span>}
                              {isUserSelected && !isCorrectOpt && <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F43F5E', background: '#FEF2F2', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Your Choice</span>}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      <div style={{ background: '#F8FAFC', borderLeft: '4px solid var(--primary-500)', padding: '1.25rem', borderRadius: '0 12px 12px 0' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-700)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <BookOpen size={18} /> Explanation
                        </h4>
                        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                          {activeQuestion.explanation || 'No explanation available.'}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        ) : (
          <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B' }}>
            No questions found matching the filter.
          </div>
        )}

      </div>
    </div>
  );
};

export default AnswerReviewPage;
