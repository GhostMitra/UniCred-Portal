import React, { useState } from 'react';
import { Shield, GraduationCap, Users, Building2, Lock, User, ChevronDown } from 'lucide-react';
import { User as UserType } from '../types';
import { api } from '../lib/api';

interface LoginPageProps {
  onLogin: (user: UserType) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    accessType: 'student' as 'student' | 'recruiter' | 'university'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ensure demo users exist
      await api.seedDemo().catch(() => {});
      const resp = await api.login({ id: formData.id, password: formData.password, accessType: formData.accessType });
      const user: UserType = {
        id: resp.user.id,
        username: resp.user.username,
        accessType: resp.user.accessType,
        fullName: resp.user.fullName,
        email: resp.user.email,
        studentId: resp.user.studentId,
      };
      localStorage.setItem('token', resp.token);
      onLogin(user);
    } catch (err: any) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const accessTypeOptions = [
    { value: 'student', label: 'Student Portal', icon: GraduationCap, color: 'text-blue-400' },
    { value: 'recruiter', label: 'Recruiter Portal', icon: Users, color: 'text-green-400' },
    { value: 'university', label: 'University Admin', icon: Building2, color: 'text-purple-400' }
  ];

  const currentOption = accessTypeOptions.find(opt => opt.value === formData.accessType);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">UniCred Portal</h1>
          <p className="text-slate-300">Blockchain-Secured Educational Credentials</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Access Type Selector */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Access Type</label>
              <div className="relative">
                <select
                  value={formData.accessType}
                  onChange={(e) => setFormData({...formData, accessType: e.target.value as any})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {accessTypeOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
              </div>
            </div>

            {/* User ID */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-white mb-2">User ID</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your ID"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-10 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {currentOption && <currentOption.icon className="w-5 h-5 mr-2" />}
                  Access {currentOption?.label}
                </>
              )}
            </button>

            {/* Signup Button */}
            <button
              type="button"
              onClick={() => window.location.href = '/signup'}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center mt-4"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;