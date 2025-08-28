import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Award, 
  FileText, 
  TrendingUp, 
  GraduationCap,
  Calendar,
  BookOpen,
  Shield,
  Plus,
  Search
} from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';

interface UniversityDashboardProps {
  user: User;
}

const UniversityDashboard: React.FC<UniversityDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState([
    { label: 'Total Students', value: '0', icon: Users, color: 'text-blue-400' },
    { label: 'Credentials Issued', value: '0', icon: Award, color: 'text-green-400' },
    { label: 'Pending Requests', value: '0', icon: FileText, color: 'text-yellow-400' },
    { label: 'Verified', value: '0', icon: TrendingUp, color: 'text-purple-400' }
  ]);
  const [recentActivity, setRecentActivity] = useState<{ type: string; action: string; student: string; timestamp: string }[]>([]);
  const [credentialTypes, setCredentialTypes] = useState<Array<{ type: string; count: number; color: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const m = await api.getMetrics();
        setStats([
          { label: 'Total Students', value: String(m.totalStudents), icon: Users, color: 'text-blue-400' },
          { label: 'Credentials Issued', value: String(m.totalCredentials), icon: Award, color: 'text-green-400' },
          { label: 'Pending Requests', value: String(m.pendingCount), icon: FileText, color: 'text-yellow-400' },
          { label: 'Verified', value: String(m.verifiedCount), icon: TrendingUp, color: 'text-purple-400' }
        ]);
        setRecentActivity((m.recentCredentials || []).map((c: any) => ({
          type: 'credential',
          action: `Issued ${c.type}`,
          student: c.studentId || 'N/A',
          timestamp: new Date(c.createdAt).toLocaleString(),
        })));
        const counts: Record<string, number> = {};
        (m.recentCredentials || []).forEach((c: any) => { counts[c.type] = (counts[c.type] || 0) + 1; });
        setCredentialTypes(Object.entries(counts).map(([type, count]) => ({ type, count: count as number, color: 'bg-blue-500/20 text-blue-300' })));
      } catch {
        // ignore
      }
    })();
  }, []);

  // recentActivity and credentialTypes are loaded from backend metrics

  const quickActions = [
    { title: 'Issue Credential', subtitle: 'Create new credential', link: '/university/credentials', icon: Plus },
    { title: 'Student Directory', subtitle: 'Manage student records', link: '/university/directory', icon: Users },
    { title: 'Verify Credential', subtitle: 'Check credential status', link: '/university/credentials', icon: Shield }
  ];

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/university/dashboard" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Dashboard
        </Link>
        <Link to="/university/credentials" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Credentials
        </Link>
        <Link to="/university/directory" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Directory
        </Link>
        <Link to="/university/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
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
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Link to="/university/credentials" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        {activity.type === 'credential' && <Award className="w-5 h-5 text-white" />}
                        {activity.type === 'request' && <FileText className="w-5 h-5 text-white" />}
                        {activity.type === 'verification' && <Shield className="w-5 h-5 text-white" />}
                        {activity.type === 'student' && <Users className="w-5 h-5 text-white" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{activity.action}</h3>
                        <p className="text-sm text-slate-400">{activity.student}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
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

          {/* Credential Types Overview */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-lg font-semibold text-white mb-4">Credential Types</h2>
            <div className="space-y-3">
              {credentialTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-medium">{type.type}</h4>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block mt-1 ${type.color}`}>
                      {type.count} issued
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDashboard;