import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, Typography } from '@mui/material';

export default function TaskTable({ tasks, title }) {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      {title && <Typography variant="h6" gutterBottom>{title}</Typography>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks && tasks.length > 0 ? tasks.map(task => (
            <TableRow key={task._id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.assignedTo?.name || "Me"}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>{task.dueDate && new Date(task.dueDate).toLocaleDateString()}</TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={5} align="center">No tasks found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}