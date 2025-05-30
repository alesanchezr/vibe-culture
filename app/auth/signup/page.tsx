'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // Supabase handles email confirmation by default.
        // You might want to redirect to a page informing the user to check their email.
      });

      if (error) {
        setError(error.message);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        // This can happen if email confirmation is required and the user already exists but is not confirmed.
        setMessage("User already exists but is not confirmed. Please check your email to confirm your account or try logging in.");
        setError(null); // Clear any previous error
      } else if (data.user) {
        setMessage("Signup successful! Please check your email to confirm your account.");
        // router.push('/auth/confirm-email'); // Optional: redirect to a page to inform user
      } else {
        // Fallback for unexpected response
         setMessage("Signup process initiated. Please check your email for a confirmation link.");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during signup.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h1>
      <form onSubmit={handleSignup}>
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
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Supabase default minimum password length
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginBottom: '15px' }}>{message}</p>}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p style={{marginTop: '10px'}}>Already have an account? <a href="/auth/login" style={{color: '#0070f3'}}>Login</a></p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#1a1a1a', color: 'white' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign Up</h1>
        <p style={{ textAlign: 'center' }}>Loading...</p>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
} 