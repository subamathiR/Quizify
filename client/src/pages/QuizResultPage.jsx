import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { attemptAPI } from '../services/api';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle, XCircle, Clock, RotateCcw, BookOpen, ArrowRight, Award } from 'lucide-react';

const QuizResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [attempt, setAttempt] = useState(location.state?.attemptData?.attempt || null);
  const [quizDetails, setQuizDetails] = useState(location.state?.attemptData?.quizDetails || null);
  const [loading, setLoading] = useState(!attempt);

  useEffect(() => {
    if (!attempt) {
      fetchAttempt();
    } else {
      if (attempt.status === 'Pass') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [id]);

  const fetchAttempt = async () => {
    try {
      const res = await attemptAPI.getAttemptById(id);
      setAttempt(res.data);
      setQuizDetails(res.data.quiz);
      if (res.data.status === 'Pass') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !attempt) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748B' }}>
        <h2>Loading quiz result...</h2>
      </div>
    );
  }

  const isPass = attempt.status === 'Pass';
  const minsTaken = Math.floor(attempt.timeTaken / 60);
  const secsTaken = attempt.timeTaken % 60;

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: 'var(--neutral-50)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Two Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.5rem', alignItems: 'stretch', marginBottom: '2rem' }}>
          
          {/* Left Column: Progress Ring & Rating */}
          <div className="card" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <svg width="150" height="150" viewBox="0 0 150 150">
                <circle cx="75" cy="75" r="65" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle cx="75" cy="75" r="65" fill="none" stroke={isPass ? "#10B981" : "#F43F5E"} strokeWidth="10"
                  strokeDasharray={408}
                  strokeDashoffset={408 - (408 * attempt.percentage) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 75 75)"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
                <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="2rem" fontWeight="800" fill="#0F172A">
                  {attempt.percentage}%
                </text>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: isPass ? '#10B981' : '#F43F5E', marginBottom: '0.5rem' }}>
              {isPass ? 'Passed! 🎉' : 'Failed ❌'}
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748B', fontWeight: 500, lineHeight: 1.5 }}>
              {isPass 
                ? "Excellent! You've successfully passed the quiz. Great job!" 
                : "Don't give up! Review your answers and try again to improve your score."}
            </p>
          </div>

          {/* Right Column: Performance Summary */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '1.5rem' }}>Performance Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Total Questions</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{attempt.totalQuestions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Correct Answers</span>
                <span style={{ fontWeight: 700, color: '#10B981' }}>{attempt.correctAnswers}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Incorrect Answers</span>
                <span style={{ fontWeight: 700, color: '#F43F5E' }}>{attempt.wrongAnswers}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Score</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{attempt.correctAnswers} / {attempt.totalQuestions}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Time Taken</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{minsTaken}m {secsTaken}s</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Status</span>
                <span style={{ 
                  fontWeight: 800, 
                  color: isPass ? '#065F46' : '#991B1B',
                  background: isPass ? '#ECFDF5' : '#FEF2F2',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontSize: '0.85rem'
                }}>{attempt.status}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Navigation Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          <Link to={`/review/${attempt._id}`} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            Review Answers
          </Link>
          <Link to={`/quiz/${attempt.quiz._id || attempt.quiz}/take`} className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
            Retake Quiz
          </Link>
          <Link to="/dashboard" className="btn btn-outline" style={{ padding: '0.75rem 2rem' }}>
            Back to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

export default QuizResultPage;
