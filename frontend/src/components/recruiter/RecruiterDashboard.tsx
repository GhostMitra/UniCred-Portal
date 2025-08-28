import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  Search,
  FileCheck,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';

interface RecruiterDashboardProps {
  user: User;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState([
    { label: 'Total Credentials', value: '0', icon: Shield, color: 'text-blue-400' },
    { label: 'Verified', value: '0', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Pending', value: '0', icon: Clock, color: 'text-yellow-400' },
    { label: 'Students', value: '0', icon: Users, color: 'text-purple-400' }
  ]);
  const [recentVerifications, setRecentVerifications] = useState<Array<{ candidate: string; credential: string; status: string; timestamp: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const m = await api.getMetrics();
        setStats([
          { label: 'Total Credentials', value: String(m.totalCredentials), icon: Shield, color: 'text-blue-400' },
          { label: 'Verified', value: String(m.verifiedCount), icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pending', value: String(m.pendingCount), icon: Clock, color: 'text-yellow-400' },
          { label: 'Students', value: String(m.totalStudents), icon: Users, color: 'text-purple-400' }
        ]);
        setRecentVerifications((m.recentCredentials || []).map((c: any) => ({
          candidate: c.studentId || 'N/A',
          credential: c.title,
          status: c.status,
          timestamp: new Date(c.createdAt).toLocaleString(),
        })));
      } catch {
        // ignore
      }
    })();
  }, []);

  // recentVerifications loaded from backend metrics

  const quickActions = [
    { title: 'Verify Credential', subtitle: 'Instant verification system', link: '/recruiter/verification', icon: Shield },
    { title: 'Search Candidates', subtitle: 'Find qualified candidates', link: '/recruiter/verification', icon: Search },
    { title: 'Generate Report', subtitle: 'Verification analytics', link: '/recruiter/verification', icon: BarChart3 }
  ];

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/recruiter/dashboard" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Dashboard
        </Link>
        <Link to="/recruiter/verification" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Verification
        </Link>
        <Link to="/recruiter/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Settings
        </Link>
      </nav>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-slate-800/50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Verifications */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Verifications</h2>
              <Link to="/recruiter/verification" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentVerifications.map((verification, index) => (
                <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        {verification.status === 'verified' ? 
                          <CheckCircle className="w-5 h-5 text-white" /> :
                          <Clock className="w-5 h-5 text-white" />
                        }
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{verification.candidate}</h3>
                        <p className="text-sm text-slate-400">{verification.credential}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        verification.status === 'verified' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {verification.status}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{verification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="block bg-slate-800/30 hover:bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 transition duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{action.title}</h3>
                      <p className="text-sm text-slate-400">{action.subtitle}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">Verification API</span>
                </div>
                <span className="text-xs text-green-400">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-white">Blockchain Network</span>
                </div>
                <span className="text-xs text-green-400">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-white">Database</span>
                </div>
                <span className="text-xs text-blue-400">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;