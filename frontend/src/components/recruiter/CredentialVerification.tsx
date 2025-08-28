import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, CheckCircle, XCircle, Clock, Download, ExternalLink, Upload } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';

interface CredentialVerificationProps {
  user: User;
}

const CredentialVerification: React.FC<CredentialVerificationProps> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationMode, setVerificationMode] = useState<'search' | 'upload'>('search');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsVerifying(true);
    try {
      const result = await api.verifyByHash(searchQuery.trim());
      if (result.exists) {
        setVerificationResult({
          found: true,
          candidate: {
            name: result.credential?.studentName || 'Unknown',
            id: result.credential?.studentId || 'N/A',
            email: 'N/A'
          },
          credential: {
            title: result.credential?.title,
            type: result.credential?.type,
            institution: result.credential?.institution,
            dateIssued: new Date(result.credential?.dateIssued).toISOString().slice(0,10),
            status: result.credential?.status,
            credentialId: result.credential?.id
          },
          verification: {
            status: 'authentic',
            verifiedAt: new Date().toISOString(),
            blockchainHash: (result.anchor?.txHash || result.anchor?.signature),
            confidence: 99.0
          },
        });
      } else {
        setVerificationResult({
          found: false,
          verification: { status: 'failed', confidence: 0 },
        });
      }
    } catch (e) {
      setVerificationResult({ found: false, verification: { status: 'failed', confidence: 0 } });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApprove = async () => {
    if (!verificationResult?.credential?.credentialId && !verificationResult?.credential?.id) return;
    const id = verificationResult.credential.credentialId || verificationResult.credential.id;
    setIsApproving(true);
    try {
      await api.recruiterApprove(id);
      setVerificationResult((prev: any) => ({
        ...prev,
        credential: { ...prev.credential, recruiterApproved: true },
      }));
      alert('Credential visibility approved for student.');
    } catch (e) {
      alert('Failed to approve credential');
    } finally {
      setIsApproving(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      console.log('File uploaded:', file.name);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <nav className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/recruiter/dashboard" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Dashboard
        </Link>
        <Link to="/recruiter/verification" className="px-4 py-2 bg-white/20 text-white rounded-md font-medium">
          Verification
        </Link>
        <Link to="/recruiter/settings" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Instant Credential Verification</h1>
        <p className="text-slate-300">Verify educational credentials instantly using blockchain technology</p>
      </div>

      {/* Verification Mode Toggle */}
      <div className="flex space-x-1 bg-white/10 p-1 rounded-lg w-fit">
        <button
          onClick={() => setVerificationMode('search')}
          className={`px-4 py-2 rounded-md font-medium transition ${
            verificationMode === 'search' 
              ? 'bg-white/20 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Search Verification
        </button>
        <button
          onClick={() => setVerificationMode('upload')}
          className={`px-4 py-2 rounded-md font-medium transition ${
            verificationMode === 'upload' 
              ? 'bg-white/20 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          Upload Document
        </button>
      </div>

      {/* Verification Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search/Upload Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">
            {verificationMode === 'search' ? 'Search Credential' : 'Upload Document'}
          </h2>
          
          {verificationMode === 'search' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Enter Credential ID, Student ID, or Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., TECH-CS-2024-001 or John Smith"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={isVerifying || !searchQuery.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isVerifying ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Verify Credential
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Upload Credential Document
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-white mb-2">Drag and drop or click to upload</p>
                  <p className="text-sm text-slate-400 mb-4">Supports PDF, JPG, PNG files up to 10MB</p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer inline-block transition"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Results */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-6">Verification Results</h2>
          
          {!verificationResult && !isVerifying && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Ready to Verify</h3>
              <p className="text-slate-400">Enter a credential ID or upload a document to begin verification</p>
            </div>
          )}

          {isVerifying && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-white mb-2">Verifying Credential</h3>
              <p className="text-slate-400">Checking blockchain records and institutional databases...</p>
            </div>
          )}

          {verificationResult && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-center mb-6">
                <div className={`p-4 rounded-full ${
                  verificationResult.verification.status === 'authentic' 
                    ? 'bg-green-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {verificationResult.verification.status === 'authentic' ? 
                    <CheckCircle className="w-8 h-8 text-green-400" /> :
                    <XCircle className="w-8 h-8 text-red-400" />
                  }
                </div>
              </div>

              <div className={`text-center p-4 rounded-lg ${
                verificationResult.verification.status === 'authentic' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  verificationResult.verification.status === 'authentic' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {verificationResult.verification.status === 'authentic' ? 'Credential Verified' : 'Verification Failed'}
                </h3>
                <p className="text-sm mt-1 text-slate-300">
                  Confidence: {verificationResult.verification.confidence}%
                </p>
              </div>

              {/* Credential Details */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white">Credential Details</h4>
                <div className="bg-slate-800/30 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student:</span>
                    <span className="text-white">{verificationResult.candidate.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Credential:</span>
                    <span className="text-white">{verificationResult.credential.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Institution:</span>
                    <span className="text-white">{verificationResult.credential.institution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date Issued:</span>
                    <span className="text-white">{verificationResult.credential.dateIssued}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPA:</span>
                    <span className="text-white">{verificationResult.credential.gpa}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download Report
                  </button>
                  <button className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Blockchain View
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || verificationResult?.credential?.recruiterApproved}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center"
                  >
                    {verificationResult?.credential?.recruiterApproved ? 'Approved' : (isApproving ? 'Approving...' : 'Approve Visibility')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredentialVerification;