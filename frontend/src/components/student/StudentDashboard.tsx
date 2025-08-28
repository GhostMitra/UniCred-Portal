import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Award, 
  Calendar, 
  TrendingUp, 
  Shield, 
  FileText,
  Clock,
  CheckCircle
} from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';

interface StudentDashboardProps {
  user: User;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [stats, setStats] = useState([
    { label: 'Total Credentials', value: '0', icon: Award, color: 'text-blue-400' },
    { label: 'Verified', value: '0', icon: CheckCircle, color: 'text-green-400' },
    { label: 'Pending', value: '0', icon: Clock, color: 'text-yellow-400' },
    { label: 'Status', value: '-', icon: TrendingUp, color: 'text-purple-400' }
  ]);
  const [recentCredentials, setRecentCredentials] = useState<{ title: string; type: string; status: string; date: string }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!user.studentId) return;
        const data = await api.getStudentMetrics(user.studentId);
        setStats([
          { label: 'Total Credentials', value: String(data.stats.totalCredentials), icon: Award, color: 'text-blue-400' },
          { label: 'Verified', value: String(data.stats.verified), icon: CheckCircle, color: 'text-green-400' },
          { label: 'Pending', value: String(data.stats.pending), icon: Clock, color: 'text-yellow-400' },
          { label: 'Status', value: data.student.status, icon: TrendingUp, color: 'text-purple-400' }
        ]);
        setRecentCredentials(
          (data.recentCredentials || []).map((c: any) => ({
            title: c.title,
            type: c.type,
            status: c.status,
            date: new Date(c.dateIssued).toISOString().slice(0,10),
          }))
        );
      } catch {
        // ignore
      }
    })();
  }, [user.studentId]);

  const quickActions = [
    { title: 'View Credentials', subtitle: 'Access your digital wallet', link: '/student/credentials', icon: Award },
    { title: 'Update Profile', subtitle: 'Manage your information', link: '/student/settings', icon: FileText },
    { title: 'Verification History', subtitle: 'Track credential usage', link: '/student/credentials', icon: Shield }
  ];

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/student/dashboard" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Dashboard
        </Link>
        <Link to="/student/credentials" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Credentials
        </Link>
        <Link to="/student/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
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
        {/* Recent Credentials */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Recent Credentials</h2>
              <Link to="/student/credentials" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentCredentials.map((credential, index) => (
                <div key={index} className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-2 rounded-lg">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{credential.title}</h3>
                        <p className="text-sm text-slate-400">{credential.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        credential.status === 'verified' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {credential.status}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{credential.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;