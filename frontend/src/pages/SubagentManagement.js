import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import {
  Box, Typography, Button, TextField, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, IconButton, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getRole } from '../utils/auth';

export default function SubagentManagement() {
  const [subagents, setSubagents] = useState([]);
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', mobile: '', manager: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', mobile: '', manager: '' });
  const isAdmin = getRole() === 'admin';

  const fetchSubagents = () => api.get('/users/subagents').then(res => setSubagents(res.data));
  const fetchAgents = () => api.get('/users/agents').then(res => setAgents(res.data));

  useEffect(() => {
  fetchSubagents();
  if (isAdmin) fetchAgents();
}, [isAdmin]);

  const handleAdd = async (e) => {
    e.preventDefault();
    await api.post('/users/subagents', form);
    setForm({ name: '', email: '', password: '', mobile: '', manager: '' });
    fetchSubagents();
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/subagents/${id}`);
    fetchSubagents();
  };

  const handleEditInit = (subagent) => {
    setEditId(subagent._id);
    setEditForm({
      name: subagent.name,
      email: subagent.email,
      password: '',
      mobile: subagent.mobile,
      manager: subagent.manager || ''
    });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditForm({ name: '', email: '', password: '', mobile: '', manager: '' });
  };

  const handleEditSave = async (id) => {
    await api.put(`/users/subagents/${id}`, editForm);
    setEditId(null);
    fetchSubagents();
  };

  return (
    <Box p={4}>
      <Typography variant="h4">Subagent Management</Typography>
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <TextField label="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
          <TextField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          {isAdmin && (
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Manager</InputLabel>
              <Select
                label="Manager"
                value={form.manager}
                onChange={e => setForm({ ...form, manager: e.target.value })}
                required
              >
                {agents.map(agent => (
                  <MenuItem value={agent._id} key={agent._id}>{agent.name} ({agent.email})</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button type="submit" variant="contained">Add Subagent</Button>
        </form>
      </Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>Password</TableCell>
            {isAdmin && <TableCell>Manager</TableCell>}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subagents.map(subagent => (
            <TableRow key={subagent._id}>
              {editId === subagent._id ? (
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
                  {isAdmin && (
                    <TableCell>
                      <Select
                        value={editForm.manager}
                        onChange={e => setEditForm({ ...editForm, manager: e.target.value })}
                        sx={{ minWidth: 180 }}
                      >
                        {agents.map(agent => (
                          <MenuItem value={agent._id} key={agent._id}>{agent.name} ({agent.email})</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                  )}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditSave(subagent._id)}><SaveIcon /></IconButton>
                    <IconButton color="error" onClick={handleEditCancel}><CancelIcon /></IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{subagent.name}</TableCell>
                  <TableCell>{subagent.email}</TableCell>
                  <TableCell>{subagent.mobile}</TableCell>
                  <TableCell>••••••</TableCell>
                  {isAdmin && <TableCell>{subagent.manager?.name || '-'}</TableCell>}
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditInit(subagent)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(subagent._id)}><DeleteIcon /></IconButton>
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