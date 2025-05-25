import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Box, Typography, Button, TextField, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AgentManagement() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', mobile: '' });

  const fetchAgents = () => api.get('/users/agents').then(res => setAgents(res.data));
  useEffect(() => { fetchAgents(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/users/agents', form);
    setForm({ name: '', email: '', password: '', mobile: '' });
    fetchAgents();
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/agents/${id}`);
    fetchAgents();
  };

  const handleEditInit = (agent) => {
    setEditId(agent._id);
    setEditForm({ name: agent.name, email: agent.email, password: '', mobile: agent.mobile });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ name: '', email: '', password: '', mobile: '' });
  };

  const handleEditSave = async (id) => {
    await api.put(`/users/agents/${id}`, editForm);
    setEditId(null);
    fetchAgents();
  };

  return (
    <Box p={4}>
      <Typography variant="h4">Agent Management</Typography>
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
          <TextField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <Button type="submit" variant="contained">Add Agent</Button>
        </form>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Password</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {agents.map(agent => (
            <TableRow key={agent._id}>
              {editId === agent._id ? (
                <>
                  <TableCell>
                    <TextField value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  </TableCell>
                  <TableCell>
                    <TextField value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                  </TableCell>
                  <TableCell>
                    <TextField value={editForm.mobile} onChange={e => setEditForm({ ...editForm, mobile: e.target.value })} />
                  </TableCell>
                  <TableCell>
                    <TextField type="password" placeholder="Leave blank to keep" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditSave(agent._id)}><SaveIcon /></IconButton>
                    <IconButton color="error" onClick={handleEditCancel}><CancelIcon /></IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{agent.name}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.mobile}</TableCell>
                  <TableCell>••••••</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditInit(agent)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(agent._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}