import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        toast.success(data.message || 'Registered successfully! Please login.');
        navigate('/login');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '50px auto', padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label><br />
          <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{width: '100%', padding: '8px'}} />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Email</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width: '100%', padding: '8px'}} />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength="6" required style={{width: '100%', padding: '8px'}} />
        </div>
        <button type="submit" style={{ marginTop: 20, width: '100%', padding: '10px' }}>Register</button>
      </form>
      <p style={{ marginTop: 10 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;