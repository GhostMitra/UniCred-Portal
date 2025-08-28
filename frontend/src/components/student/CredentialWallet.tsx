import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, Share2, Shield, Search, Filter, Eye } from 'lucide-react';
import { User, Credential } from '../../types';
import { api } from '../../lib/api';

interface CredentialWalletProps {
  user: User;
}

const CredentialWallet: React.FC<CredentialWalletProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (user.studentId) {
          const items = await api.getStudentCredentials(user.studentId);
          setCredentials(items);
        } else {
          // Fallback: load all and filter client-side
          const all = await api.listCredentials();
          setCredentials(all);
        }
      } catch {
        // try seeding and reloading
        await api.seedMockCredentials().catch(() => {});
        const all = await api.listCredentials();
        setCredentials(all);
      }
    })();
  }, [user.studentId]);

  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cred.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || cred.type === filterType;
    return matchesSearch && matchesFilter;
  });

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

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/student/dashboard" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Dashboard
        </Link>
        <Link to="/student/credentials" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Credentials
        </Link>
        <Link to="/student/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Credential Wallet</h1>
          <p className="text-slate-300">Manage and share your verified credentials</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-300 text-sm font-medium">
            {credentials.filter(c => c.status === 'verified').length} Verified
          </div>
          <div className="bg-yellow-500/20 px-3 py-1 rounded-full text-yellow-300 text-sm font-medium">
            {credentials.filter(c => c.status === 'pending').length} Pending
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search credentials..."
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

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCredentials.map((credential) => (
          <div key={credential.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-white/40 transition duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{getTypeIcon(credential.type)}</div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(credential.status)}`}>
                {credential.status}
              </div>
            </div>
            
            <h3 className="font-semibold text-white text-lg mb-2">{credential.title}</h3>
            <p className="text-slate-300 text-sm mb-1">{credential.institution}</p>
            <p className="text-slate-400 text-xs mb-4">Issued: {credential.dateIssued}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button className="flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                  <Download className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition">
                  <Shield className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCredentials.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No credentials found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default CredentialWallet;