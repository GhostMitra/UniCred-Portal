import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../common/Layout';
import UniversityDashboard from './UniversityDashboard';
import CredentialManagement from './CredentialManagement';
import StudentDirectory from './StudentDirectory';
import UniversitySettings from './UniversitySettings';
import { User } from '../../types';

interface UniversityPortalProps {
  user: User;
  onLogout: () => void;
}

const UniversityPortal: React.FC<UniversityPortalProps> = ({ user, onLogout }) => {
  return (
    <Layout user={user} onLogout={onLogout} title="University Admin Portal">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UniversityDashboard user={user} />} />
        <Route path="credentials" element={<CredentialManagement user={user} />} />
        <Route path="directory" element={<StudentDirectory user={user} />} />
        <Route path="settings" element={<UniversitySettings user={user} />} />
      </Routes>
    </Layout>
  );
};

export default UniversityPortal;