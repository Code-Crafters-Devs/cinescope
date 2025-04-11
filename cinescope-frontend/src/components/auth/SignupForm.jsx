import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: ""
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      navigate('/home'); // Redirect after successful signup
    }
  };

  return (
    <div className="signup-form-container" style={{
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
      }}>Create Your Account</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.firstName ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
          {errors.firstName && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.firstName}</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.lastName ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
          {errors.lastName && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.lastName}</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.email ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
          {errors.email && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.email}</p>}
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
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.password ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
          {errors.password && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.password}</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.confirmPassword ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          />
          {errors.confirmPassword && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.confirmPassword}</p>}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            color: '#fff'
          }}>Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '4px',
              border: errors.country ? '1px solid #e50914' : '1px solid #333',
              backgroundColor: '#2c2c44',
              color: '#fff'
            }}
          >
            <option value="">Select Country</option>
            <option value="South Africa">South Africa</option>
            <option value="United States">United States</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && <p style={{ color: '#e50914', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.country}</p>}
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
          Sign Up
        </button>

        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#aaa'
        }}>
          Already have an account?{' '}
          <span
            style={{
              color: '#e50914',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignupForm;