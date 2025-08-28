import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../common/Layout';
import RecruiterDashboard from './RecruiterDashboard';
import CredentialVerification from './CredentialVerification';
import RecruiterSettings from './RecruiterSettings';
import { User } from '../../types';

interface RecruiterPortalProps {
  user: User;
  onLogout: () => void;
}

const RecruiterPortal: React.FC<RecruiterPortalProps> = ({ user, onLogout }) => {
  return (
    <Layout user={user} onLogout={onLogout} title="Recruiter Portal">
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RecruiterDashboard user={user} />} />
        <Route path="verification" element={<CredentialVerification user={user} />} />
        <Route path="settings" element={<RecruiterSettings user={user} />} />
      </Routes>
    </Layout>
  );
};

export default RecruiterPortal;