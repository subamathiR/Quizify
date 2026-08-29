import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, attemptAPI } from '../services/api';
import { Clock, Bookmark, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const QuizTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [markedForReview, setMarkedForReview] = useState({}); // { [questionIndex]: boolean }
  const [visited, setVisited] = useState({ 0: true });

  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchQuiz();
    return () => clearInterval(timerRef.current);
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await quizAPI.getQuizById(id);
      const quizData = res.data;
      setQuiz(quizData);

      // Set initial duration in seconds
      const initialSeconds = (quizData.duration || 15) * 60;
      setTimeLeft(initialSeconds);

      // Start Countdown Timer
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit(quizData);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex
    }));
  };

  const handleClearChoice = () => {
    setUserAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentIndex];
      return copy;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
    setVisited((prev) => ({ ...prev, [index]: true }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      goToQuestion(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  };

  const calculateUnansweredCount = () => {
    if (!quiz) return 0;
    let count = 0;
    quiz.questions.forEach((_, idx) => {
      if (userAnswers[idx] === undefined || userAnswers[idx] === null) {
        count++;
      }
    });
    return count;
  };

  const handleFinalSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const res = await attemptAPI.submitAttempt({
        quizId: quiz._id,
        userAnswers,
        timeTaken: timeSpent
      });

      navigate(`/result/${res.data.attempt._id}`, { state: { attemptData: res.data } });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting quiz attempt. Please try again.');
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = async (quizData) => {
    console.log('Timer expired! Auto submitting quiz...');
    const timeSpent = (quizData.duration || 15) * 60;
    try {
      const res = await attemptAPI.submitAttempt({
        quizId: quizData._id,
        userAnswers,
        timeTaken: timeSpent
      });
      navigate(`/result/${res.data.attempt._id}`, { state: { attemptData: res.data } });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !quiz) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
        <h2>Loading quiz environment...</h2>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const unansweredCount = calculateUnansweredCount();
  const isTimeLow = timeLeft < 120; // Under 2 mins warning

  return (
    <div style={{ minHeight: '90vh', background: 'var(--neutral-50)', paddingBottom: '4rem' }}>
      
      {/* QUIZ HEADER BAR */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '1rem 0', position: 'sticky', top: 0, zIndex: 90 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{quiz.title}</h2>
            <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Question {currentIndex + 1} of {quiz.questions.length}</span>
          </div>

          {/* Countdown Timer Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.25rem',
            borderRadius: '999px',
            background: isTimeLow ? '#FEE2E2' : 'var(--primary-50)',
            color: isTimeLow ? '#B91C1C' : 'var(--primary-700)',
            fontWeight: 800,
            fontSize: '1.1rem',
            border: isTimeLow ? '1px solid #FCA5A5' : '1px solid var(--primary-200)'
          }}>
            <Clock size={20} className={isTimeLow ? 'animate-pulse' : ''} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                navigate('/quizzes');
              }
            }}
          >
            Exit Quiz
          </button>

        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          {/* LEFT: QUESTION & CHOICES AREA */}
          <div>
            
            {/* Question Box Card */}
            <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <span className="badge badge-primary">Q{currentIndex + 1}</span>
                {markedForReview[currentIndex] && (
                  <span className="badge badge-medium">
                    <Bookmark size={14} /> Marked for Review
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.5, marginBottom: '2rem' }}>
                {currentQ.questionText}
              </h3>

              {/* 4 Option Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentQ.options.map((optText, optIdx) => {
                  const isSelected = userAnswers[currentIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectOption(optIdx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '1rem',
                        padding: '1.1rem 1.5rem',
                        border: isSelected ? '2px solid #10B981' : '2px solid #E2E8F0',
                        background: isSelected ? '#F0FDF4' : '#ffffff',
                        color: '#0F172A',
                        borderRadius: '12px',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Checkbox circle indicator */}
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        border: isSelected ? '6px solid #10B981' : '2px solid #CBD5E1',
                        background: '#ffffff',
                        boxSizing: 'border-box',
                        flexShrink: 0
                      }} />
                      
                      <span style={{ fontSize: '1rem', fontWeight: isSelected ? 600 : 500 }}>
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Navigation & Action Bar */}
            <div className="card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button
                  className="btn btn-outline"
                  onClick={toggleMarkForReview}
                >
                  <Bookmark size={18} /> {markedForReview[currentIndex] ? 'Unmark' : 'Mark for Review'}
                </button>
                {userAnswers[currentIndex] !== undefined && (
                  <button
                    className="btn btn-secondary"
                    onClick={handleClearChoice}
                    style={{ fontSize: '0.85rem' }}
                  >
                    Clear Answer
                  </button>
                )}
              </div>

              <div>
                {currentIndex === quiz.questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Finish & Submit
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleNext}
                  >
                    Next Question <ChevronRight size={18} />
                  </button>
                )}
              </div>

            </div>

          </div>

          {/* RIGHT: QUESTION NAVIGATOR PALETTE */}
          <div>
            <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
              
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.25rem' }}>
                Question Navigator
              </h4>

              {/* Palette Grid */}
              <div className="palette-grid" style={{ marginBottom: '1.5rem' }}>
                {quiz.questions.map((_, idx) => {
                  const isCurrent = currentIndex === idx;
                  const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
                  const isMarked = markedForReview[idx];
                  const isVis = visited[idx];

                  let btnClass = 'unvisited';
                  if (isAnswered) btnClass = 'answered';
                  else if (isMarked) btnClass = 'marked';
                  else if (!isVis) btnClass = 'unvisited';

                  return (
                    <button
                      key={idx}
                      className={`palette-btn ${btnClass} ${isCurrent ? 'current' : ''}`}
                      onClick={() => goToQuestion(idx)}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Palette Legend */}
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--accent-emerald)' }}></span>
                  <span>Answered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--accent-amber)' }}></span>
                  <span>Marked for Review</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, background: '#F1F5F9', border: '1px solid #CBD5E1' }}></span>
                  <span>Not Visited</span>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1.5rem' }}
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Quiz
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* CONFIRMATION SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <AlertTriangle size={48} color="var(--accent-amber)" style={{ margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>Ready to Submit?</h3>
              {unansweredCount > 0 ? (
                <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
                  You still have <strong style={{ color: '#B91C1C' }}>{unansweredCount} unanswered questions</strong> out of {quiz.questions.length}.
                </p>
              ) : (
                <p style={{ color: '#64748B', marginTop: '0.5rem' }}>
                  Great job! You have answered all {quiz.questions.length} questions.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
              >
                Continue Quiz
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleFinalSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuizTakingPage;
