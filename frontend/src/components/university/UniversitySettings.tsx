import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, Globe, Save, Camera, Shield } from 'lucide-react';
import { User as UserType } from '../../types';

interface UniversitySettingsProps {
  user: UserType;
}

const UniversitySettings: React.FC<UniversitySettingsProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    institutionName: 'Tech University',
    adminName: user.fullName || '',
    email: user.email || '',
    phone: '+1 (555) 234-5678',
    address: '789 University Blvd, Academic City, ST 67890',
    website: 'https://techuniversity.edu',
    adminId: user.id,
    establishedYear: '1985',
    accreditation: 'WASC Senior College and University Commission',
    studentCapacity: '15,000',
    settings: {
      autoVerification: true,
      blockchainEnabled: true,
      emailNotifications: true,
      apiAccess: true
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Handle save logic here
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
        <Link to="/university/directory" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Directory
        </Link>
        <Link to="/university/settings" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">University Settings</h1>
          <p className="text-slate-300">Manage institutional information and system preferences</p>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
        >
          {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Building2 className="w-4 h-4 mr-2" />}
          {isEditing ? 'Save Changes' : 'Edit Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Institution Profile */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xl font-bold mb-4">
                {formData.institutionName.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-slate-800 p-2 rounded-full border-2 border-white/20 hover:bg-slate-700 transition">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white">{formData.institutionName}</h3>
            <p className="text-slate-300 text-sm">Est. {formData.establishedYear}</p>
            <p className="text-slate-400 text-xs">Admin ID: {formData.adminId}</p>
            <div className="mt-4 space-y-2">
              <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium inline-block">
                Accredited Institution
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium inline-block w-full">
                Blockchain Verified
              </div>
            </div>
          </div>
        </div>

        {/* Institution Information */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-6">Institution Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Institution Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Admin Name</label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    disabled={!isEditing}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Student Capacity</label>
                <input
                  type="number"
                  value={formData.studentCapacity}
                  onChange={(e) => setFormData({...formData, studentCapacity: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60 resize-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-2">Accreditation</label>
                <input
                  type="text"
                  value={formData.accreditation}
                  onChange={(e) => setFormData({...formData, accreditation: e.target.value})}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          System Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Auto Verification</h4>
              <p className="text-slate-400 text-sm">Automatically verify credentials upon issuance</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.settings.autoVerification}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: {...formData.settings, autoVerification: e.target.checked}
                })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Blockchain Integration</h4>
              <p className="text-slate-400 text-sm">Enable blockchain-based credential verification</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.settings.blockchainEnabled}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: {...formData.settings, blockchainEnabled: e.target.checked}
                })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">Email Notifications</h4>
              <p className="text-slate-400 text-sm">Send email notifications for system events</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.settings.emailNotifications}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: {...formData.settings, emailNotifications: e.target.checked}
                })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div>
              <h4 className="text-white font-medium">API Access</h4>
              <p className="text-slate-400 text-sm">Enable third-party API integrations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.settings.apiAccess}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: {...formData.settings, apiAccess: e.target.checked}
                })}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversitySettings;