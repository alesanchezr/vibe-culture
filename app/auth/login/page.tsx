'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/'); // Redirect to home page after successful login
        router.refresh(); // Refresh server components
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{marginTop: '10px'}}>Don't have an account? <a href="/auth/signup" style={{color: '#0070f3'}}>Sign up</a></p>
    </div>
  );
} 