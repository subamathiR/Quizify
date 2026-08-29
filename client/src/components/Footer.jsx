import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#0F172A', color: '#94A3B8', padding: '4rem 0 2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Col 1 */}
          <div>
            <div className="logo" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <div className="logo-icon">
                <Award size={24} />
              </div>
              <span>Quizify</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              Empowering learners worldwide with interactive, real-time quizzes and intelligent analytics. Test your knowledge today!
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/quizzes" style={{ color: 'inherit' }}>Explore Quizzes</Link></li>
              <li><Link to="/leaderboard" style={{ color: 'inherit' }}>Global Leaderboard</Link></li>
              <li><Link to="/register" style={{ color: 'inherit' }}>Get Started</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/quizzes?category=JavaScript" style={{ color: 'inherit' }}>JavaScript & React</Link></li>
              <li><Link to="/quizzes?category=Python" style={{ color: 'inherit' }}>Python & Machine Learning</Link></li>
              <li><Link to="/quizzes?category=Data+Structures" style={{ color: 'inherit' }}>Data Structures & Algorithms</Link></li>
              <li><Link to="/quizzes?category=Database+%26+SQL" style={{ color: 'inherit' }}>Database & SQL</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1rem' }}>Connect</h4>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <a href="#" style={{ color: '#94A3B8' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: '#94A3B8' }}><Github size={20} /></a>
              <a href="#" style={{ color: '#94A3B8' }}><Linkedin size={20} /></a>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #1E293B', paddingTop: '1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
          <p>© {new Date().getFullYear()} Quizify Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
