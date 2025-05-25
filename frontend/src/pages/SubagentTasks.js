import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import TaskTable from '../components/TaskTable';
import { Typography, Box } from '@mui/material';

export default function SubagentTasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    api.get('/tasks/my').then(res => setTasks(res.data));
  }, []);
  return (
    <Box p={4}>
      <Typography variant="h4">My Tasks</Typography>
      <TaskTable tasks={tasks} />
    </Box>
  );
}