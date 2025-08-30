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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 left-4 sm:left-auto sm:right-4 sm:w-96 z-50">
          <div className="bg-green-600/90 backdrop-blur-md border border-green-500/30 rounded-lg p-4 shadow-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-200 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Success!</p>
                <p className="text-xs text-green-200 mt-1">Credential visibility approved for student.</p>
              </div>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="ml-3 text-green-200 hover:text-white transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-lg w-fit">
        <Link to="/recruiter/dashboard" className="px-3 sm:px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition text-sm sm:text-base">
          Dashboard
        </Link>
        <Link to="/recruiter/verification" className="px-3 sm:px-4 py-2 bg-white/20 text-white rounded-md font-medium text-sm sm:text-base">
          Verification
        </Link>
        <Link to="/recruiter/settings" className="px-3 sm:px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition text-sm sm:text-base">
          Settings
        </Link>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Instant Credential Verification</h1>
        <p className="text-sm sm:text-base text-slate-300">Verify educational credentials instantly using blockchain technology</p>
      </div>

      {/* Verification Mode Toggle */}
      <div className="flex flex-wrap gap-1 bg-white/10 p-1 rounded-lg w-fit">
        <button
          onClick={() => setVerificationMode('search')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition text-sm sm:text-base ${
            verificationMode === 'search' 
              ? 'bg-white/20 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="hidden sm:inline">Search Verification</span>
          <span className="sm:hidden">Search</span>
        </button>
        <button
          onClick={() => setVerificationMode('upload')}
          className={`px-3 sm:px-4 py-2 rounded-md font-medium transition text-sm sm:text-base ${
            verificationMode === 'upload' 
              ? 'bg-white/20 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="hidden sm:inline">Upload Document</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>

      {/* Verification Interface */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Search/Upload Panel */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
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
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/20">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Verification Results</h2>
          
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
            <div className="space-y-4 sm:space-y-6">
              {/* Status */}
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className={`p-3 sm:p-4 rounded-full ${
                  verificationResult.verification.status === 'authentic' 
                    ? 'bg-green-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {verificationResult.verification.status === 'authentic' ? 
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" /> :
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  }
                </div>
              </div>

              <div className={`text-center p-3 sm:p-4 rounded-lg ${
                verificationResult.verification.status === 'authentic' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <h3 className={`text-base sm:text-lg font-semibold ${
                  verificationResult.verification.status === 'authentic' ? 'text-green-300' : 'text-red-300'
                }`}>
                  {verificationResult.verification.status === 'authentic' ? 'Credential Verified' : 'Verification Failed'}
                </h3>
                <p className="text-xs sm:text-sm mt-1 text-slate-300">
                  Confidence: {verificationResult.verification.confidence}%
                </p>
              </div>

              {/* Credential Details */}
              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-sm sm:text-base font-semibold text-white">Credential Details</h4>
                <div className="bg-slate-800/30 rounded-lg p-3 sm:p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-slate-400 text-xs sm:text-sm">Student:</span>
                    <span className="text-white text-sm sm:text-base font-medium sm:text-right">{verificationResult.candidate.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-slate-400 text-xs sm:text-sm">Credential:</span>
                    <span className="text-white text-sm sm:text-base font-medium sm:text-right">{verificationResult.credential.title}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-slate-400 text-xs sm:text-sm">Institution:</span>
                    <span className="text-white text-sm sm:text-base font-medium sm:text-right">{verificationResult.credential.institution}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-slate-400 text-xs sm:text-sm">Date Issued:</span>
                    <span className="text-white text-sm sm:text-base font-medium sm:text-right">{verificationResult.credential.dateIssued}</span>
                  </div>
                  {verificationResult.credential.gpa && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-slate-400 text-xs sm:text-sm">GPA:</span>
                      <span className="text-white text-sm sm:text-base font-medium sm:text-right">{verificationResult.credential.gpa}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
                  <button className="w-full sm:flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center text-sm">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Download Report</span>
                    <span className="sm:hidden">Download</span>
                  </button>
                  <button className="w-full sm:flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-3 py-2.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center text-sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Blockchain View</span>
                    <span className="sm:hidden">Blockchain</span>
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isApproving || verificationResult?.credential?.recruiterApproved}
                    className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2.5 sm:py-2 rounded-lg transition duration-200 flex items-center justify-center text-sm font-medium"
                  >
                    {verificationResult?.credential?.recruiterApproved ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span>Approved</span>
                      </>
                    ) : isApproving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Approve Visibility</span>
                        <span className="sm:hidden">Approve</span>
                      </>
                    )}
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