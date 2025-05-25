import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, MenuItem } from '@mui/material';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '', role: 'agent' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/signup', form);
      setSuccess('Signup successful! You can now log in.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ padding: 4, minWidth: 350 }}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Name" fullWidth margin="normal" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" fullWidth margin="normal" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Mobile" fullWidth margin="normal" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <TextField select label="Role" fullWidth margin="normal" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
            <MenuItem value="subagent">Subagent</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
        </form>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        <Typography sx={{ mt: 2 }}>Already have an account? <Link to="/login">Login</Link></Typography>
      </Paper>
    </Box>
  );
}