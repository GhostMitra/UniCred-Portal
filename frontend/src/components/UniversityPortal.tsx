import React, { useState } from 'react';
import { LogOut, Plus, Users, Award, FileText, BarChart3, Settings } from 'lucide-react';
import type { User } from '../App';

interface UniversityPortalProps {
  user: User;
  onLogout: () => void;
}

export default function UniversityPortal({ user, onLogout }: UniversityPortalProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const credentials = [
    { id: 1, type: 'Bachelor Degree', issued: 245, pending: 12, rejected: 3 },
    { id: 2, type: 'Master Degree', issued: 89, pending: 5, rejected: 1 },
    { id: 3, type: 'Certificate', issued: 467, pending: 23, rejected: 8 },
    { id: 4, type: 'Diploma', issued: 156, pending: 8, rejected: 2 }
  ];

  const recentIssues = [
    { id: '001', student: 'Sarah Johnson', type: 'Bachelor of Science', date: '2024-01-15', status: 'Issued' },
    { id: '002', student: 'Mike Chen', type: 'Master of Engineering', date: '2024-01-14', status: 'Pending' },
    { id: '003', student: 'Emily Davis', type: 'Certificate in AI', date: '2024-01-13', status: 'Issued' },
    { id: '004', student: 'James Wilson', type: 'Bachelor of Arts', date: '2024-01-12', status: 'Under Review' }
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">University Administration Portal</h1>
              <p className="text-gray-600">Welcome, {user.name}</p>
              <p className="text-sm text-gray-500">Admin ID: {user.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Issue Credential</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'credentials', label: 'Credentials', icon: Award },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Issued</p>
                    <p className="text-3xl font-bold">957</p>
                  </div>
                  <Award className="h-12 w-12 text-blue-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100">Active Students</p>
                    <p className="text-3xl font-bold">2,847</p>
                  </div>
                  <Users className="h-12 w-12 text-emerald-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100">Pending Review</p>
                    <p className="text-3xl font-bold">48</p>
                  </div>
                  <FileText className="h-12 w-12 text-amber-200" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">This Month</p>
                    <p className="text-3xl font-bold">127</p>
                  </div>
                  <BarChart3 className="h-12 w-12 text-purple-200" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Credential Types Overview */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Credential Management</h2>
                  <p className="text-gray-600">Overview of issued credentials by type</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {credentials.map((credential) => (
                      <div key={credential.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-900">{credential.type}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">
                              {credential.issued} Issued
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                            {credential.pending} Pending
                          </span>
                          <span className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                            {credential.rejected} Rejected
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Activity</h2>
                  <p className="text-gray-600">Latest credential issuance activity</p>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {recentIssues.map((issue) => (
                      <div key={issue.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{issue.student}</p>
                          <p className="text-sm text-gray-600">{issue.type}</p>
                          <p className="text-xs text-gray-500">{issue.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          issue.status === 'Issued' 
                            ? 'bg-emerald-100 text-emerald-800'
                            : issue.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tab contents would go here */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h2>
            <p className="text-gray-600">This section is currently under development.</p>
          </div>
        )}
      </div>
    </div>
  );
}