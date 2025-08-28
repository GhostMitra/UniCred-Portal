import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Award, FileText, Calendar, User, MapPin } from 'lucide-react';
import { User as UserType, Credential } from '../../types';
import { api } from '../../lib/api';

interface CredentialManagementProps {
  user: UserType;
}

const CredentialManagement: React.FC<CredentialManagementProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newCredential, setNewCredential] = useState({
    title: '',
    type: 'bachelor' as 'bachelor' | 'master' | 'certificate' | 'diploma',
    studentId: '',
    studentName: '',
    graduationDate: ''
  });

  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const items = await api.listCredentials();
        setCredentials(items);
      } catch {
        await api.seedMockCredentials().catch(() => {});
        const items = await api.listCredentials();
        setCredentials(items);
      }
    })();
  }, []);

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || cred.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleIssueCredential = async () => {
    try {
      await api.issueCredential({
        title: newCredential.title,
        type: newCredential.type,
        institution: user.fullName || 'University',
        dateIssued: newCredential.graduationDate || new Date().toISOString(),
        studentId: newCredential.studentId || undefined,
        studentName: newCredential.studentName || undefined,
      });
      setShowIssueForm(false);
      setNewCredential({
        title: '',
        type: 'bachelor',
        studentId: '',
        studentName: '',
        graduationDate: ''
      });
      alert('Credential issued');
    } catch (e: any) {
      alert('Failed to issue credential: ' + e.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'expired': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bachelor':
      case 'master': return '🎓';
      case 'certificate': return '📜';
      case 'diploma': return '🏆';
      default: return '📋';
    }
  };

  const credentialsByType = {
    bachelor: filteredCredentials.filter(c => c.type === 'bachelor'),
    master: filteredCredentials.filter(c => c.type === 'master'),
    certificate: filteredCredentials.filter(c => c.type === 'certificate'),
    diploma: filteredCredentials.filter(c => c.type === 'diploma')
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/university/dashboard" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Dashboard
        </Link>
        <Link to="/university/credentials" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Credentials
        </Link>
        <Link to="/university/directory" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Directory
        </Link>
        <Link to="/university/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Credential Management</h1>
          <p className="text-slate-300">Issue and manage academic credentials</p>
        </div>
        <button
          onClick={() => setShowIssueForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Issue Credential
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search credentials, students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-8 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            <option value="all" className="bg-slate-800">All Types</option>
            <option value="bachelor" className="bg-slate-800">Bachelor's</option>
            <option value="master" className="bg-slate-800">Master's</option>
            <option value="certificate" className="bg-slate-800">Certificates</option>
            <option value="diploma" className="bg-slate-800">Diplomas</option>
          </select>
        </div>
      </div>

      {/* Credentials by Type */}
      <div className="space-y-8">
        {Object.entries(credentialsByType).map(([type, typeCredentials]) => (
          typeCredentials.length > 0 && (
            <div key={type}>
              <h2 className="text-xl font-semibold text-white mb-4 capitalize flex items-center">
                <span className="text-2xl mr-2">{getTypeIcon(type)}</span>
                {type === 'bachelor' ? 'Bachelor\'s Degrees' : 
                 type === 'master' ? 'Master\'s Degrees' : 
                 type === 'certificate' ? 'Certificates' : 'Diplomas'}
                <span className="ml-2 text-sm font-normal text-slate-400">({typeCredentials.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {typeCredentials.map((credential) => (
                  <div key={credential.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{getTypeIcon(credential.type)}</div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(credential.status)}`}>
                        {credential.status}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-white text-lg mb-2">{credential.title}</h3>
                    <div className="space-y-1 mb-4">
                      <p className="text-slate-300 text-sm flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {credential.studentName}
                      </p>
                      <p className="text-slate-400 text-xs">ID: {credential.studentId}</p>
                      <p className="text-slate-400 text-xs flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Issued: {credential.dateIssued}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View Details
                      </button>
                      <div className="flex space-x-2">
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                          <Award className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No credentials found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Issue Credential Modal */}
      {showIssueForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Issue New Credential</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Credential Title</label>
                <input
                  type="text"
                  value={newCredential.title}
                  onChange={(e) => setNewCredential({...newCredential, title: e.target.value})}
                  placeholder="e.g., Bachelor of Computer Science"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Type</label>
                <select
                  value={newCredential.type}
                  onChange={(e) => setNewCredential({...newCredential, type: e.target.value as any})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="bachelor" className="bg-slate-800">Bachelor's Degree</option>
                  <option value="master" className="bg-slate-800">Master's Degree</option>
                  <option value="certificate" className="bg-slate-800">Certificate</option>
                  <option value="diploma" className="bg-slate-800">Diploma</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Student ID</label>
                <input
                  type="text"
                  value={newCredential.studentId}
                  onChange={(e) => setNewCredential({...newCredential, studentId: e.target.value})}
                  placeholder="STU001"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Student Name</label>
                <input
                  type="text"
                  value={newCredential.studentName}
                  onChange={(e) => setNewCredential({...newCredential, studentName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Graduation Date</label>
                <input
                  type="date"
                  value={newCredential.graduationDate}
                  onChange={(e) => setNewCredential({...newCredential, graduationDate: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowIssueForm(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleIssueCredential}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Issue Credential
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialManagement;