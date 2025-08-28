import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentPortal from './components/student/StudentPortal';
import RecruiterPortal from './components/recruiter/RecruiterPortal';
import UniversityPortal from './components/university/UniversityPortal';
import SignupPage from './components/common/SignupPage';
import { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={`/${user.accessType}`} replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/student/*" 
            element={
              user && user.accessType === 'student' ? (
                <StudentPortal user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/recruiter/*" 
            element={
              user && user.accessType === 'recruiter' ? (
                <RecruiterPortal user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/university/*" 
            element={
              user && user.accessType === 'university' ? (
                <UniversityPortal user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/signup" 
            element={<SignupPage />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;