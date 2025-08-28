import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../common/Layout';
import StudentDashboard from './StudentDashboard';
import CredentialWallet from './CredentialWallet';
import StudentSettings from './StudentSettings';
import { User } from '../../types';

interface StudentPortalProps {
  user: User;
  onLogout: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ user, onLogout }) => {
  return (
    <Layout user={user} onLogout={onLogout} title="Student Portal">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard user={user} />} />
        <Route path="credentials" element={<CredentialWallet user={user} />} />
        <Route path="settings" element={<StudentSettings user={user} />} />
      </Routes>
    </Layout>
  );
};

export default StudentPortal;