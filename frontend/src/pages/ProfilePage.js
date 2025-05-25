import React from 'react';
import { Typography, Box } from '@mui/material';
import { getRole } from '../utils/auth';

export default function ProfilePage() {
  // Extend as needed to show/change profile info
  return (
    <Box p={4}>
      <Typography variant="h5">Profile</Typography>
      <Typography>Role: {getRole()}</Typography>
      {/* Add name, email, mobile, change password, etc. */}
    </Box>
  );
}