import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, Clock, HelpCircle, Star, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { quizAPI, categoryAPI } from '../services/api';

const QuizzesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [search, category, difficulty, sort, page]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getCategories();
      setCategories([{ name: 'All' }, ...res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await quizAPI.getQuizzes({
        search,
        category: category === 'All' ? '' : category,
        difficulty: difficulty === 'All' ? '' : difficulty,
        sort,
        page,
        limit: 9
      });
      setQuizzes(res.data.quizzes || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (catName) => {
    setCategory(catName);
    setPage(1);
    setSearchParams(catName === 'All' ? {} : { category: catName });
  };

  const getPageNumbers = () => {
    const range = [];
    const delta = 1;
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta) ||
        (page <= delta + 1 && i <= delta + 2) ||
        (page >= totalPages - delta && i >= totalPages - delta - 1)
      ) {
        range.push(i);
      }
    }

    const result = [];
    let last = 0;
    for (const i of range) {
      if (last) {
        if (i - last === 2) {
          result.push(last + 1);
        } else if (i - last > 2) {
          result.push('...');
        }
      }
      result.push(i);
      last = i;
    }
    return result;
  };

  return (
    <div style={{ padding: '3rem 0 5rem', background: 'var(--neutral-50)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Page Title Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            Explore Quizzes
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem' }}>
            Challenge your mind across multiple topics, programming languages, and analytical reasoning.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Search quizzes by title or keyword..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select 
                className="form-input" 
                value={category} 
                onChange={(e) => handleCategorySelect(e.target.value)}
              >
                {categories.map((c, i) => (
                  <option key={i} value={c.name}>{c.name} Category</option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select 
                className="form-input" 
                value={difficulty} 
                onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <select 
                className="form-input" 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="latest">Sort: Latest Added</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="rating">Sort: Highest Rated</option>
                <option value="title">Sort: Title (A-Z)</option>
              </select>
            </div>

          </div>

          {/* Quick Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
            {categories.map((c, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${category === c.name ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleCategorySelect(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748B' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading quizzes...</div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <BookOpen size={48} style={{ color: '#94A3B8', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>No Quizzes Found</h3>
            <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Try adjusting your search criteria or category filters.</p>
            <button className="btn btn-primary" onClick={() => { setSearch(''); setCategory('All'); setDifficulty('All'); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid-3">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="card quiz-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span className="badge badge-primary">{quiz.category}</span>
                    <span className={`badge badge-${quiz.difficulty.toLowerCase()}`}>{quiz.difficulty}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem', color: '#0F172A' }}>
                    {quiz.title}
                  </h3>

                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {quiz.description}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <HelpCircle size={15} /> {quiz.questions?.length || 0} Questions
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={15} /> {quiz.duration} Mins
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#EAB308', fontWeight: 700 }}>
                      <Star size={15} fill="#EAB308" /> {quiz.averageRating || 4.5}
                    </span>
                  </div>

                  <Link to={`/quizzes/${quiz._id}`} className="btn btn-primary" style={{ width: '100%' }}>
                    Start Quiz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              className="pagination-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizzesPage;
