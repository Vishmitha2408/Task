import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AgentPanel from './pages/AgentPanel';
import SubagentTasks from './pages/SubagentTasks';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

import AgentManagement from './pages/AgentManagement';
import SubagentManagement from './pages/SubagentManagement';
import CsvUpload from './pages/CsvUpload';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
         <Route path="/dashboard" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        } /> 
        <Route path="/agent" element={
          <ProtectedRoute requiredRoles={["agent"]}>
            <AgentPanel />
          </ProtectedRoute>
        } />
        <Route path="/subagent" element={
          <ProtectedRoute requiredRoles={["subagent"]}>
            <SubagentTasks />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRoles={["admin", "agent", "subagent"]}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin-agents" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AgentManagement />
          </ProtectedRoute>
        } />
        <Route path="/subagent-management" element={
          <ProtectedRoute requiredRoles={["admin", "agent"]}>
            <SubagentManagement />
          </ProtectedRoute>
        } />
        <Route path="/csv-upload" element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <CsvUpload />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}