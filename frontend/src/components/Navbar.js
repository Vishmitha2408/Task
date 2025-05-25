import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getRole, logout } from '../utils/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Task Management App
        </Typography>
        <Box>
          {/* Show based on role */}
          {!role && (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </>
          )}
          {role === 'admin' && (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <Button color="inherit" component={Link} to="/admin-agents">Agent Management</Button>
              <Button color="inherit" component={Link} to="/subagent-management">Subagent Management</Button>
              <Button color="inherit" component={Link} to="/csv-upload">CSV Upload</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
          {role === 'agent' && (
            <>
              <Button color="inherit" component={Link} to="/agent">Agent Panel</Button>
              <Button color="inherit" component={Link} to="/subagent-management">Subagent Management</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
          {role === 'subagent' && (
            <>
              <Button color="inherit" component={Link} to="/subagent">Tasks</Button>
              <Button color="inherit" component={Link} to="/profile">Profile</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}