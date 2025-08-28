import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, User, Mail, Calendar, GraduationCap, Award, Eye } from 'lucide-react';
import { User as UserType, Student } from '../../types';
import { api } from '../../lib/api';

interface StudentDirectoryProps {
  user: UserType;
}

const StudentDirectory: React.FC<StudentDirectoryProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const items = await api.listStudents();
        setStudents(items);
      } catch {
        // Ensure base mock exists then reload
        await api.seedMockCredentials().catch(() => {});
        const items = await api.listStudents();
        setStudents(items);
      }
    })();
  }, []);

  const filteredStudents = useMemo(() => students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [students, searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'graduated': return 'bg-blue-500/20 text-blue-300';
      case 'inactive': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getCredentialCount = (credentials: any[], status?: string) => {
    if (!status) return credentials.length;
    return credentials.filter(c => c.status === status).length;
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/university/dashboard" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Dashboard
        </Link>
        <Link to="/university/credentials" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Credentials
        </Link>
        <Link to="/university/directory" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Directory
        </Link>
        <Link to="/university/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Student Directory</h1>
          <p className="text-slate-300">Track degrees, certificates, and student records</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-300 font-medium">
            {students.filter(s => s.status === 'active').length} Active
          </div>
          <div className="bg-blue-500/20 px-3 py-1 rounded-full text-blue-300 font-medium">
            {students.filter(s => s.status === 'graduated').length} Graduated
          </div>
          <div className="bg-gray-500/20 px-3 py-1 rounded-full text-gray-300 font-medium">
            {students.filter(s => s.status === 'inactive').length} Inactive
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-8 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all" className="bg-slate-800">All Status</option>
            <option value="active" className="bg-slate-800">Active</option>
            <option value="graduated" className="bg-slate-800">Graduated</option>
            <option value="inactive" className="bg-slate-800">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{student.name}</h3>
                  <p className="text-slate-400 text-sm">ID: {student.id}</p>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                {student.status}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-slate-300 text-sm">
                <Mail className="w-4 h-4 mr-2" />
                {student.email}
              </div>
            </div>

            {/* Credentials Summary */}
            <div className="bg-slate-800/30 rounded-lg p-4 mb-4">
              <h4 className="text-white font-medium mb-3 flex items-center">
                <Award className="w-4 h-4 mr-2" />
                Credentials Summary
              </h4>
              {student.credentials.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{getCredentialCount(student.credentials, 'verified')}</p>
                    <p className="text-xs text-slate-400">Verified</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{getCredentialCount(student.credentials, 'pending')}</p>
                    <p className="text-xs text-slate-400">Pending</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-2">No credentials issued</p>
              )}
            </div>

            {/* Recent Credentials */}
            {student.credentials.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-white font-medium text-sm">Recent Credentials:</h4>
                {student.credentials.slice(0, 2).map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between bg-slate-800/20 rounded p-2">
                    <div>
                      <p className="text-white text-sm font-medium">{credential.title}</p>
                      <p className="text-slate-400 text-xs">{credential.dateIssued}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      credential.status === 'verified' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {credential.status}
                    </div>
                  </div>
                ))}
                {student.credentials.length > 2 && (
                  <p className="text-slate-400 text-xs">+{student.credentials.length - 2} more credentials</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 mr-2" />
                Issue Credential
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No students found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;