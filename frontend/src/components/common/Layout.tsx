import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { User } from '../../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, title }) => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center min-w-0 flex-1">
              <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3 flex-shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-white truncate">{title}</h1>
                <p className="text-xs sm:text-sm text-slate-300">UniCred Portal</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Welcome back, {user.fullName}</p>
                <p className="text-xs text-slate-300">ID: {user.id}</p>
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition duration-200 flex items-center text-sm"
              >
                <LogOut className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;