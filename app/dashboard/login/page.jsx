'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const username = e.target.username.value.trim();
    const password = e.target.password.value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') {
        throw new Error(data.error || 'Invalid username or password');
      }
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="login-view">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">
          <img src="/images/01_NavaDishe_emblem_icon.png" alt="" />
          <div className="brand-word login-brand">Nava Dishe</div>
        </div>
        <p className="login-sub">Staff dashboard — sign in to continue.</p>

        {error && <div className="form-status error">{error}</div>}

        <div className="field">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" autoComplete="username" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" autoComplete="current-password" required />
        </div>

        <button type="submit" className="btn btn-primary login-btn" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        <div className="login-partner">
          <img src="/images/02_News1st_logo.png" alt="News First" />
          <span>presented by News First</span>
        </div>
      </form>
    </div>
  );
}
