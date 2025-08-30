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
    const query = searchQuery.trim();
    if (!query) return;
    
    // Frontend validation - require minimum length
    if (query.length < 15) {
      setVerificationResult({
        found: false,
        verification: { 
          status: 'failed', 
          confidence: 0,
          statusMessage: 'Please enter a complete credential ID or hash (minimum 15 characters)',
          searchMethod: 'invalid_query'
        },
      });
      return;
    }
    
    setIsVerifying(true);
    try {
      // Use enhanced search that only does exact matches
      const result = await api.searchCredentials(query);
      if (result.exists) {
        // Determine verification status based on actual database values
        let verificationStatus = 'pending';
        let confidence = 50.0;
        let statusMessage = 'Pending Verification';
        
        if (result.credential?.status === 'verified') {
          if (result.credential?.recruiterApproved && result.credential?.studentAccepted) {
            verificationStatus = 'authentic';
            confidence = 99.0;
            statusMessage = 'Fully Verified';
          } else if (result.credential?.recruiterApproved && !result.credential?.studentAccepted) {
            verificationStatus = 'pending_student';
            confidence = 75.0;
            statusMessage = 'Pending Student Acceptance';
          } else if (!result.credential?.recruiterApproved && result.credential?.studentAccepted) {
            verificationStatus = 'pending_recruiter';
            confidence = 75.0;
            statusMessage = 'Pending Recruiter Approval';
          } else {
            verificationStatus = 'pending_both';
            confidence = 50.0;
            statusMessage = 'Pending Both Approvals';
          }
        } else if (result.credential?.status === 'pending') {
          verificationStatus = 'pending_issuance';
          confidence = 25.0;
          statusMessage = 'Pending Issuance';
        } else if (result.credential?.status === 'revoked') {
          verificationStatus = 'revoked';
          confidence = 0.0;
          statusMessage = 'Credential Revoked';
        }

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
            credentialId: result.credential?.id,
            recruiterApproved: result.credential?.recruiterApproved,
            studentAccepted: result.credential?.studentAccepted
          },
          verification: {
            status: verificationStatus,
            statusMessage: statusMessage,
            verifiedAt: new Date().toISOString(),
            blockchainHash: (result.anchor?.txHash || result.anchor?.signature),
            confidence: confidence,
            searchMethod: result.method,
            additionalResults: result.additionalResults
          },
        });
      } else {
        setVerificationResult({
          found: false,
          verification: { 
            status: 'failed', 
            confidence: 0,
            statusMessage: result.error || 'Credential not found',
            searchMethod: result.method
          },
        });
      }
    } catch (e) {
      setVerificationResult({ 
        found: false, 
        verification: { 
          status: 'failed', 
          confidence: 0,
          statusMessage: 'Search failed - please check your connection'
        } 
      });
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
                  Enter Full Credential ID or Hash
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., CRED_BACHELOR_CS_STU001 or hash_bachelor_cs_001"
                    className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  ⚠️ Enter the complete credential ID or blockchain hash for verification. Partial matches are not supported.
                </p>
                <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2">Test with these examples:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Fully Verified:</span>
                      <code className="text-blue-300 bg-slate-700/50 px-2 py-1 rounded cursor-pointer hover:bg-slate-700/70" 
                            onClick={() => setSearchQuery('CRED_BACHELOR_CS_STU001')}>
                        CRED_BACHELOR_CS_STU001
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Pending Recruiter:</span>
                      <code className="text-yellow-300 bg-slate-700/50 px-2 py-1 rounded cursor-pointer hover:bg-slate-700/70" 
                            onClick={() => setSearchQuery('CRED_CERT_CYBER_STU001')}>
                        CRED_CERT_CYBER_STU001
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">By Hash:</span>
                      <code className="text-green-300 bg-slate-700/50 px-2 py-1 rounded cursor-pointer hover:bg-slate-700/70" 
                            onClick={() => setSearchQuery('hash_bachelor_cs_001')}>
                        hash_bachelor_cs_001
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={isVerifying || !searchQuery.trim() || searchQuery.trim().length < 15}
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
                    : verificationResult.verification.status === 'failed' || verificationResult.verification.status === 'revoked'
                    ? 'bg-red-500/20'
                    : 'bg-yellow-500/20'
                }`}>
                  {verificationResult.verification.status === 'authentic' ? 
                    <CheckCircle className="w-8 h-8 text-green-400" /> :
                    verificationResult.verification.status === 'failed' || verificationResult.verification.status === 'revoked' ?
                    <XCircle className="w-8 h-8 text-red-400" /> :
                    <Clock className="w-8 h-8 text-yellow-400" />
                  }
                </div>
              </div>

              <div className={`text-center p-4 rounded-lg ${
                verificationResult.verification.status === 'authentic' 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : verificationResult.verification.status === 'failed' || verificationResult.verification.status === 'revoked'
                  ? 'bg-red-500/20 border border-red-500/30'
                  : 'bg-yellow-500/20 border border-yellow-500/30'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  verificationResult.verification.status === 'authentic' 
                    ? 'text-green-300' 
                    : verificationResult.verification.status === 'failed' || verificationResult.verification.status === 'revoked'
                    ? 'text-red-300'
                    : 'text-yellow-300'
                }`}>
                  {verificationResult.verification.statusMessage || 
                   (verificationResult.verification.status === 'authentic' ? 'Credential Verified' : 'Verification Failed')}
                </h3>
                <p className="text-sm mt-1 text-slate-300">
                  Confidence: {verificationResult.verification.confidence}%
                  {verificationResult.verification.searchMethod && (
                    <span className="block text-xs mt-1 text-slate-400">
                      Found by: {verificationResult.verification.searchMethod.replace('_', ' ')}
                      {verificationResult.verification.additionalResults > 0 && 
                        ` (+${verificationResult.verification.additionalResults} more credentials for this student)`
                      }
                    </span>
                  )}
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
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white capitalize">{verificationResult.credential.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recruiter Approved:</span>
                    <span className={`${verificationResult.credential.recruiterApproved ? 'text-green-400' : 'text-red-400'}`}>
                      {verificationResult.credential.recruiterApproved ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Student Accepted:</span>
                    <span className={`${verificationResult.credential.studentAccepted ? 'text-green-400' : 'text-red-400'}`}>
                      {verificationResult.credential.studentAccepted ? 'Yes' : 'No'}
                    </span>
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
                  {verificationResult?.verification?.status !== 'failed' && verificationResult?.verification?.status !== 'revoked' && (
                    <button
                      onClick={handleApprove}
                      disabled={isApproving || verificationResult?.credential?.recruiterApproved}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-2 rounded-lg transition duration-200 flex items-center justify-center"
                    >
                      {verificationResult?.credential?.recruiterApproved ? 'Already Approved' : (isApproving ? 'Approving...' : 'Approve Visibility')}
                    </button>
                  )}
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