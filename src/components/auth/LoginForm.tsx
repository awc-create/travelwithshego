// src/components/auth/LoginForm.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import Link from 'next/link';
import styles from './LoginForm.module.scss';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const authError = searchParams.get('error');

  let errorMessage: string | null = null;
  if (localError) {
    errorMessage = localError;
  } else if (authError === 'CredentialsSignin') {
    errorMessage = 'Incorrect email or password. Please try again.';
  } else if (authError === 'OAuthAccountNotLinked') {
    errorMessage = 'Please sign in with the same method you used originally.';
  } else if (authError) {
    errorMessage = 'Something went wrong while signing in. Please try again.';
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);

    try {
      if (!email || !password) {
        setLocalError('Please enter both email and password.');
        setSubmitting(false);
        return;
      }

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result) {
        setLocalError('Unexpected auth error. Please try again.');
        setSubmitting(false);
        return;
      }

      if (result.error) {
        setLocalError('Invalid email or password.');
        setSubmitting(false);
        return;
      }

      // ✅ Signed in – go to admin (NextAuth will also redirect based on callbackUrl if given)
      router.push('/admin');
    } catch (err) {
      console.error('[LOGIN_ERROR]', err);
      setLocalError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.logoCircle}>
            <span className={styles.logoText}>Shego</span>
          </div>
          <div>
            <h1 className={styles.title}>Admin sign in</h1>
            <p className={styles.subtitle}>
              Secure access to manage the Baraawe project, auctions, and donations.
            </p>
          </div>
        </header>

        <form className={styles.card} onSubmit={handleSubmit}>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}

          <label className={styles.field}>
            <span className={styles.label}>Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="admin@travelwithshego.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className={styles.helpText}>
            Having trouble? <Link href="/contact">Contact the site owner</Link>.
          </p>
        </form>

        <p className={styles.footerNote}>
          You&apos;re accessing the <span className={styles.highlight}>secure admin area</span>.
        </p>
      </div>
    </div>
  );
}
