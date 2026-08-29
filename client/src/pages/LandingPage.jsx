import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, BookOpen, CheckCircle, Clock, 
  HelpCircle, Star, Zap, Code, Terminal, Database, Cpu, ChevronDown 
} from 'lucide-react';
import { quizAPI, categoryAPI } from '../services/api';
import heroImg from '../assets/hero_illustration.jpg';

const LandingPage = () => {
  const [popularQuizzes, setPopularQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await quizAPI.getQuizzes({ limit: 4, sort: 'popular' });
        setPopularQuizzes(quizRes.data.quizzes || []);

        const catRes = await categoryAPI.getCategories();
        setCategories((catRes.data || []).slice(0, 8));
      } catch (err) {
        console.error('Error fetching landing data:', err);
      }
    };
    fetchData();
  }, []);

  const faqs = [
    {
      q: 'How does Quizify work?',
      a: 'Choose a category or search for your desired topic, click "Start Quiz", answer the timed multiple-choice questions, and submit to view instant scores, explanations, and detailed performance analytics.'
    },
    {
      q: 'Are quizzes timed?',
      a: 'Yes, each quiz has a specific duration set by the instructors or admins. A live timer counts down during the quiz, and your progress is auto-submitted when the timer reaches zero.'
    },
    {
      q: 'Can I retake quizzes to improve my score?',
      a: 'Absolutely! You can retake any quiz as many times as you like. Your highest score will be recorded on your profile and count towards leaderboard ranks.'
    },
    {
      q: 'How do achievement badges work?',
      a: 'Badges are automatically unlocked as you hit milestones like completing your first quiz, achieving 100% scores, or ranking in the top global leaderboard.'
    }
  ];

  return (
    <div style={{ overflowX: 'hidden' }}>
      
      {/* HERO SECTION */}
      <section style={{ padding: '5rem 0 4rem', background: 'linear-gradient(180deg, #F8FAFC 0%, #EEF2FF 100%)', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge badge-primary" style={{ marginBottom: '1.25rem' }}>
              <Zap size={14} /> Next-Gen Learning Platform
            </div>

            <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, color: '#0F172A', marginBottom: '1.25rem' }}>
              Test Your Knowledge. <br />
              <span className="gradient-text">Improve Your Skills.</span>
            </h1>

            <p style={{ fontSize: '1.15rem', color: '#475569', marginBottom: '2rem', maxWidth: '520px', lineHeight: 1.6 }}>
              Explore thousands of curated quizzes across programming, databases, AI, and reasoning. Track performance with AI analytics and compete globally.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/quizzes" className="btn btn-primary btn-lg">
                Explore Quizzes <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started
              </Link>
            </div>

            {/* Quick Metrics Banner */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #CBD5E1' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>500+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Available Quizzes</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>10K+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Active Students</div>
              </div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-600)' }}>50K+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Quiz Attempts</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <img 
              src={heroImg} 
              alt="Quizify Study Illustration" 
              style={{ 
                width: '100%', 
                maxWidth: '480px', 
                borderRadius: '28px', 
                boxShadow: 'var(--shadow-xl)', 
                border: '1px solid #E2E8F0',
                objectFit: 'cover'
              }} 
            />
          </motion.div>

        </div>
      </section>

      {/* POPULAR QUIZZES */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                Popular Quizzes
              </h2>
              <p style={{ color: '#64748B' }}>Discover top-rated quizzes taken by thousands of students.</p>
            </div>
            <Link to="/quizzes" className="btn btn-outline">View All Quizzes</Link>
          </div>

          <div className="grid-4">
            {popularQuizzes.map((quiz) => (
              <div key={quiz._id} className="card quiz-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span className="badge badge-primary">{quiz.category}</span>
                    <span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
                    {quiz.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {quiz.description.slice(0, 85)}...
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <HelpCircle size={14} /> {quiz.questions?.length || 10} Questions
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {quiz.duration} mins
                    </span>
                  </div>

                  <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Start Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section style={{ padding: '5rem 0', background: 'var(--neutral-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Explore Categories
            </h2>
            <p style={{ color: '#64748B' }}>Master skills across domain-specific learning tracks.</p>
          </div>

          <div className="grid-4">
            {categories.map((cat) => (
              <Link 
                to={`/quizzes?category=${encodeURIComponent(cat.name)}`} 
                key={cat._id}
                className="card"
                style={{ textAlign: 'center', padding: '1.75rem', cursor: 'pointer' }}
              >
                <div style={{ width: 56, height: 56, borderRadius: '16px', background: cat.color || '#4F46E5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <BookOpen size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>{cat.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{cat.quizCount || 5}+ Quizzes</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              How Quizify Works
            </h2>
            <p style={{ color: '#64748B' }}>Simple 4-step path to level up your knowledge.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { num: '01', title: 'Create Account', desc: 'Sign up in seconds and build your personalized learner profile.' },
              { num: '02', title: 'Select a Quiz', desc: 'Filter quizzes by topic, difficulty level, or duration.' },
              { num: '03', title: 'Take the Test', desc: 'Answer interactive questions under a timed environment.' },
              { num: '04', title: 'Review & Rank', desc: 'Analyze deep answer breakdowns and unlock achievements.' }
            ].map((step, idx) => (
              <div key={idx} className="card" style={{ position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-200)', marginBottom: '0.5rem' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ SECTION */}
      <section style={{ padding: '5rem 0', background: '#ffffff' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: '#64748B' }}>Everything you need to know about taking quizzes on Quizify.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.05rem', color: '#0F172A' }}>
                  <span>{faq.q}</span>
                  <ChevronDown size={20} style={{ transform: activeFaq === i ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </div>
                {activeFaq === i && (
                  <p style={{ marginTop: '0.85rem', color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
