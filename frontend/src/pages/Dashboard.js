import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default function Dashboard() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome, Admin!
        </Typography>
        <Typography>
          Use the navigation bar to manage agents, subagents, and upload CSV lists for distribution.
        </Typography>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Agent Management</Typography>
            <Typography variant="body2">
              Add, edit, or remove agents. Assign subagents to agents.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Subagent Management</Typography>
            <Typography variant="body2">
              Add, edit, or remove subagents. View which subagents belong to which agents.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">CSV Upload & Distribution</Typography>
            <Typography variant="body2">
              Upload CSV or XLSX files and distribute leads to agents automatically.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}