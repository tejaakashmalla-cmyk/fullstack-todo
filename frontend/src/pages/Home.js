import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✦ Free &amp; Open Source</div>
          <h1 className="hero-title">
            Organize your work,<br />
            <span className="hero-accent">clear your mind.</span>
          </h1>
          <p className="hero-subtitle">
            TaskFlow is a simple, powerful task manager that helps you stay focused,
            hit your goals, and get things done — one task at a time.
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start for free →
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-preview">
            <div className="preview-header">
              <span className="preview-dot red"></span>
              <span className="preview-dot yellow"></span>
              <span className="preview-dot green"></span>
              <span className="preview-title">My Tasks — Today</span>
            </div>
            <div className="preview-tasks">
              {[
                { text: 'Review project proposal', done: true, p: 'high' },
                { text: 'Team standup at 10am', done: true, p: 'medium' },
                { text: 'Deploy backend to Render', done: false, p: 'high' },
                { text: 'Update API documentation', done: false, p: 'medium' },
                { text: 'Write unit tests', done: false, p: 'low' },
              ].map((t, i) => (
                <div key={i} className={`preview-task ${t.done ? 'preview-done' : ''}`}>
                  <span className={`preview-check ${t.done ? 'checked' : ''}`}>
                    {t.done ? '✓' : ''}
                  </span>
                  <span className="preview-task-text">{t.text}</span>
                  <span className={`preview-priority p-${t.p}`}>{t.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2 className="features-title">Everything you need. Nothing you don't.</h2>
        <div className="features-grid">
          {[
            {
              icon: '🔐',
              title: 'Secure Auth',
              desc: 'JWT-based login and registration. Your tasks stay private, always.',
            },
            {
              icon: '⚡',
              title: 'Instant Updates',
              desc: 'Create, edit, complete, and delete tasks with immediate feedback.',
            },
            {
              icon: '🎯',
              title: 'Priority Levels',
              desc: 'Mark tasks as Low, Medium, or High priority to focus on what matters.',
            },
            {
              icon: '📱',
              title: 'Responsive Design',
              desc: 'Looks great on desktop, tablet, and mobile. Work from anywhere.',
            },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to get things done?</h2>
        <p>Join thousands of productive people using TaskFlow.</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create free account →
        </Link>
      </section>
    </div>
  );
};

export default Home;
