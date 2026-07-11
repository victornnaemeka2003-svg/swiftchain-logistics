import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>⚡ SwiftChain Logistics</h1>
          <p>Admin Portal</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@swiftchain.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo credentials: admin@swiftchain.com / Admin@123456</p>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }

        .login-box {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px rgba(0,0,0,0.15);
          width: 100%;
          max-width: 400px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-header h1 {
          font-size: 1.5rem;
          color: #2563eb;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: #6b7280;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .btn-login-submit {
          width: 100%;
          padding: 0.75rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-login-submit:hover {
          background: #1e40af;
        }

        .btn-login-submit:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .error-banner {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 0.375rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #ef4444;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

export default Login;
