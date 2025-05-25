import React, { useRef, useState, useEffect } from 'react';
import api from '../utils/api';
import { Box, Typography, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export default function CsvUpload() {
  const fileRef = useRef();
  const [message, setMessage] = useState('');
  const [lists, setLists] = useState([]);

  const fetchLists = () => api.get('/upload/distributed').then(res => setLists(res.data));
  useEffect(() => { fetchLists(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');
    const file = fileRef.current.files[0];
    if (!file) return setMessage('Please select a file');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/upload/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Upload and distribution successful!');
      fetchLists();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4">Upload CSV/XLSX and Distribute</Typography>
      <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
        <form onSubmit={handleUpload}>
          <input type="file" ref={fileRef} accept=".csv,.xlsx,.xls" />
          <Button type="submit" variant="contained" sx={{ ml: 2 }}>Upload</Button>
        </form>
        {message && <Typography color={message.startsWith('Upload') ? "success.main" : "error"}>{message}</Typography>}
      </Paper>
      {lists.map(l => (
        <Paper sx={{ p: 2, mt: 2 }} key={l._id}>
          <Typography variant="h6">Agent: {l.agent?.name} ({l.agent?.email})</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>FirstName</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {l.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.FirstName}</TableCell>
                  <TableCell>{item.Phone}</TableCell>
                  <TableCell>{item.Notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ))}
    </Box>
  );
}