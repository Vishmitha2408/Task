import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import TaskTable from '../components/TaskTable';
import { Typography, Box } from '@mui/material';

export default function AgentPanel() {
  const [myTasks, setMyTasks] = useState([]);
  const [subagentTasks, setSubagentTasks] = useState([]);

  useEffect(() => {
    api.get('/tasks/my').then(res => setMyTasks(res.data));
    api.get('/tasks/subagents').then(res => setSubagentTasks(res.data));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4">Agent Panel</Typography>
      <TaskTable tasks={myTasks} title="My Tasks" />
      <TaskTable tasks={subagentTasks} title="Subagents' Tasks" />
    </Box>
  );
}