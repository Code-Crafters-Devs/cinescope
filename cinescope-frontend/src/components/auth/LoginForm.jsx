import React, { useState } from "react";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password });
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#1a1a2e',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#e50914',
        marginBottom: '1.5rem'
      }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            marginTop: '1.5rem',
            backgroundColor: '#e50914',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#f40612')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#e50914')}
        >
          Login
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#aaa'
        }}>
          Don't have an account?{' '}
          <a
            href="/register"
            style={{
              color: '#e50914',
              fontWeight: 'bold',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;