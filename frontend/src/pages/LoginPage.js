import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role);
      localStorage.setItem('userId', res.data.user._id);
      if (res.data.user.role === 'admin') navigate('/dashboard');
      else if (res.data.user.role === 'agent') navigate('/agent');
      else navigate('/subagent');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}
        <Typography sx={{ mt: 2 }}>Don't have an account? <Link to="/signup">Sign up</Link></Typography>
      </Paper>
    </Box>
  );
}