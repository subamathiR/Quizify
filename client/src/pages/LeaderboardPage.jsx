import React, { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import { Trophy, Award, Crown, Star, Flame } from 'lucide-react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeFrame, setTimeFrame] = useState('all');
  const [loading, setLoading] = useState(true);

  const renderInitialAvatar = (name, size = 42, fontSize = '1.1rem', borderStyle = '2px solid #ffffff') => {
    const initial = (name || 'U').charAt(0).toUpperCase();
    const colors = [
      'linear-gradient(135deg, #4F46E5, #6366F1)', // Indigo
      'linear-gradient(135deg, #10B981, #34D399)', // Green
      'linear-gradient(135deg, #F59E0B, #FBBF24)', // Amber
      'linear-gradient(135deg, #EC4899, #F472B6)', // Pink
      'linear-gradient(135deg, #8B5CF6, #A78BFA)', // Purple
      'linear-gradient(135deg, #06B6D4, #22D3EE)', // Cyan
      'linear-gradient(135deg, #EF4444, #F87171)', // Red
      'linear-gradient(135deg, #3B82F6, #60A5FA)'  // Blue
    ];
    const charCode = initial.charCodeAt(0) || 0;
    const gradient = colors[charCode % colors.length];

    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: gradient,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: fontSize,
        border: borderStyle,
        boxShadow: 'var(--shadow-sm)',
        margin: '0 auto'
      }}>
        {initial}
      </div>
    );
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeFrame]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard(timeFrame);
      setLeaderboard(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const topThree = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  return (
    <div style={{ padding: '3.5rem 0 5rem', background: 'var(--neutral-50)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            <Trophy size={14} /> Global Hall of Fame
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Leaderboard Rankings
          </h1>
          <p style={{ color: '#64748B' }}>
            Compete with learners around the world and climb the leaderboard by completing quizzes.
          </p>

          {/* Timeframe Filter Buttons */}
          <div style={{ display: 'inline-flex', background: '#ffffff', border: '1px solid #E2E8F0', padding: '0.35rem', borderRadius: '12px', marginTop: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            {['weekly', 'monthly', 'all'].map((tf) => (
              <button
                key={tf}
                className={`btn btn-sm ${timeFrame === tf ? 'btn-primary' : 'btn-secondary'}`}
                style={{ border: 'none', textTransform: 'capitalize' }}
                onClick={() => setTimeFrame(tf)}
              >
                {tf === 'all' ? 'All Time' : tf}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
            <h2>Loading leaderboard rankings...</h2>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Cards */}
            {topThree.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '1.5rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
                
                {/* Rank 2 */}
                {topThree[1] && (
                  <div className="card" style={{ width: '260px', textAlign: 'center', padding: '2rem 1.25rem', border: '2px solid #CBD5E1', order: 1 }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                      {renderInitialAvatar(topThree[1].user?.name, 76, '2rem', '4px solid #94A3B8')}
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', color: '#94A3B8' }}>
                        <Crown size={28} fill="#94A3B8" />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{topThree[1].user?.name}</h3>
                    <p style={{ color: 'var(--primary-600)', fontWeight: 800, fontSize: '1.2rem', margin: '0.5rem 0' }}>{topThree[1].points} Pts</p>
                    <span className="badge badge-primary">Avg: {topThree[1].averageScore}%</span>
                  </div>
                )}

                {/* Rank 1 (Gold Winner Center) */}
                {topThree[0] && (
                  <div className="card" style={{ width: '290px', textAlign: 'center', padding: '2.5rem 1.5rem', border: '3px solid #F59E0B', background: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)', boxShadow: 'var(--shadow-xl)', order: 0 }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                      {renderInitialAvatar(topThree[0].user?.name, 90, '2.4rem', '4px solid #F59E0B')}
                      <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', color: '#F59E0B' }}>
                        <Crown size={34} fill="#F59E0B" />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>{topThree[0].user?.name}</h3>
                    <p style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.4rem', margin: '0.5rem 0' }}>{topThree[0].points} Pts</p>
                    <span className="badge badge-medium">1st Place • Avg: {topThree[0].averageScore}%</span>
                  </div>
                )}

                {/* Rank 3 */}
                {topThree[2] && (
                  <div className="card" style={{ width: '260px', textAlign: 'center', padding: '2rem 1.25rem', border: '2px solid #D97706', order: 2 }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                      {renderInitialAvatar(topThree[2].user?.name, 76, '2rem', '4px solid #D97706')}
                      <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', color: '#D97706' }}>
                        <Crown size={28} fill="#D97706" />
                      </div>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>{topThree[2].user?.name}</h3>
                    <p style={{ color: 'var(--primary-600)', fontWeight: 800, fontSize: '1.2rem', margin: '0.5rem 0' }}>{topThree[2].points} Pts</p>
                    <span className="badge badge-primary">Avg: {topThree[2].averageScore}%</span>
                  </div>
                )}

              </div>
            )}

            {/* Remaining Ranking Table */}
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Rank</th>
                    <th>Learner</th>
                    <th>Quizzes Attempted</th>
                    <th>Average Score</th>
                    <th>Best Score</th>
                    <th style={{ textAlign: 'right' }}>Total Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row) => (
                    <tr key={row.user?._id || row.rank}>
                      <td style={{ fontWeight: 800, color: row.rank <= 3 ? 'var(--primary-600)' : '#64748B' }}>
                        #{row.rank}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {renderInitialAvatar(row.user?.name, 36, '1rem', '2px solid #ffffff')}
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{row.user?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{row.user?.bio?.slice(0, 30)}</div>
                          </div>
                        </div>
                      </td>
                      <td>{row.totalQuizzes}</td>
                      <td>{row.averageScore}%</td>
                      <td>{row.highestScore}%</td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--primary-600)' }}>
                        {row.points} pts
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default LeaderboardPage;
