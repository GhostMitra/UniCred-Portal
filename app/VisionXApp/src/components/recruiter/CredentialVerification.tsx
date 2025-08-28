import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User, VerificationResult } from '../../types';

type CredentialVerificationRouteProp = RouteProp<{ Verification: { user: User } }, 'Verification'>;

const CredentialVerification: React.FC = () => {
  const route = useRoute<CredentialVerificationRouteProp>();
  const { user } = route.params;

  // Debug logging
  console.log('CredentialVerification - Route params:', route.params);
  console.log('CredentialVerification - User:', user);

  // Add error handling for missing user
  if (!user) {
    console.log('CredentialVerification - No user found, showing error');
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.subtitle}>User information not found</Text>
        </View>
      </View>
    );
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [verificationMode, setVerificationMode] = useState<'search' | 'upload'>('search');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    setIsVerifying(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification result
      const success = Math.random() > 0.3;
      
      if (success) {
        const result: VerificationResult = {
          found: true,
          candidate: {
            name: 'John Doe',
            id: 'STU001',
            email: 'john.doe@email.com'
          },
          credential: {
            title: 'Bachelor of Computer Science',
            type: 'bachelor',
            institution: 'Tech University',
            dateIssued: '2023-05-15',
            status: 'verified',
            credentialId: 'CRED001'
          },
          verification: {
            status: 'authentic',
            verifiedAt: new Date().toISOString(),
            blockchainHash: '0x1234567890abcdef',
            confidence: 99.0
          },
        };
        setVerificationResult(result);
        setShowResultModal(true);
      } else {
        setVerificationResult({
          found: false,
          verification: { status: 'failed', confidence: 0 },
        });
        setShowResultModal(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleApprove = async () => {
    if (!verificationResult?.credential?.credentialId) return;
    
    setIsApproving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerificationResult(prev => prev ? {
        ...prev,
        credential: { ...prev.credential!, recruiterApproved: true },
      } : null);
      
      Alert.alert('Success', 'Credential visibility approved for student.');
    } catch (error) {
      Alert.alert('Error', 'Failed to approve credential');
    } finally {
      setIsApproving(false);
    }
  };

  const handleFileUpload = () => {
    Alert.alert('File Upload', 'File upload functionality will be implemented soon!');
  };

  const getVerificationStatusColor = (status: string) => {
    if (!status) return '#64748b';
    
    switch (status) {
      case 'authentic':
        return '#10b981';
      case 'failed':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (!confidence || isNaN(confidence)) return '#64748b';
    
    if (confidence >= 90) return '#10b981';
    if (confidence >= 70) return '#f59e0b';
    return '#ef4444';
  };

  try {
    return (
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Credential Verification</Text>
          <Text style={styles.subtitle}>Verify the authenticity of student credentials</Text>
        </View>

      {/* Mode Selection */}
      <View style={styles.modeSelection}>
        <TouchableOpacity
          style={[
            styles.modeButton,
            verificationMode === 'search' && styles.modeButtonActive
          ]}
          onPress={() => setVerificationMode('search')}
        >
          <Ionicons 
            name="search" 
            size={20} 
            color={verificationMode === 'search' ? '#ffffff' : '#64748b'} 
          />
          <Text style={[
            styles.modeButtonText,
            verificationMode === 'search' && styles.modeButtonTextActive
          ]}>
            Search by Hash
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.modeButton,
            verificationMode === 'upload' && styles.modeButtonActive
          ]}
          onPress={() => setVerificationMode('upload')}
        >
          <Ionicons 
            name="cloud-upload" 
            size={20} 
            color={verificationMode === 'upload' ? '#ffffff' : '#64748b'} 
          />
          <Text style={[
            styles.modeButtonText,
            verificationMode === 'upload' && styles.modeButtonTextActive
          ]}>
            Upload File
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Section */}
      {verificationMode === 'search' && (
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search by Credential Hash</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter credential hash or ID..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#64748b"
              multiline
            />
          </View>
          
          <TouchableOpacity
            style={[styles.verifyButton, isVerifying && styles.verifyButtonDisabled]}
            onPress={handleSearch}
            disabled={isVerifying}
          >
            {isVerifying ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.verifyButtonText}>Verifying...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
                <Text style={styles.verifyButtonText}>Verify Credential</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Upload Section */}
      {verificationMode === 'upload' && (
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Credential File</Text>
          <View style={styles.uploadContainer}>
            <Ionicons name="cloud-upload" size={48} color="#64748b" />
            <Text style={styles.uploadText}>Drag and drop your credential file here</Text>
            <Text style={styles.uploadSubtext}>or click to browse</Text>
            
            <TouchableOpacity style={styles.uploadButton} onPress={handleFileUpload}>
              <Ionicons name="folder-open" size={20} color="#3b82f6" />
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.supportedFormats}>
            <Text style={styles.supportedFormatsTitle}>Supported Formats:</Text>
            <Text style={styles.supportedFormatsText}>PDF, PNG, JPG, JSON</Text>
          </View>
        </View>
      )}

      {/* Verification History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Verifications</Text>
        
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>Bachelor of Computer Science</Text>
              <Text style={styles.historyStudent}>John Doe - STU001</Text>
              <Text style={styles.historyDate}>Verified: 2024-01-15</Text>
            </View>
            <View style={[styles.historyStatus, { backgroundColor: '#10b981' }]}>
              <Text style={styles.historyStatusText}>Verified</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>Web Development Certificate</Text>
              <Text style={styles.historyStudent}>Jane Smith - STU002</Text>
              <Text style={styles.historyDate}>Verified: 2024-01-14</Text>
            </View>
            <View style={[styles.historyStatus, { backgroundColor: '#10b981' }]}>
              <Text style={styles.historyStatusText}>Verified</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <View style={styles.historyInfo}>
              <Text style={styles.historyTitle}>Data Science Diploma</Text>
              <Text style={styles.historyStudent}>Mike Johnson - STU003</Text>
              <Text style={styles.historyDate}>Verified: 2024-01-13</Text>
            </View>
            <View style={[styles.historyStatus, { backgroundColor: '#f59e0b' }]}>
              <Text style={styles.historyStatusText}>Pending</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Verification Result Modal */}
      <Modal
        visible={showResultModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowResultModal(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verification Result</Text>
              <TouchableOpacity onPress={() => setShowResultModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            {verificationResult ? (
              verificationResult.found ? (
                <View style={styles.resultContent}>
                  {/* Candidate Info */}
                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Candidate Information</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Name:</Text>
                      <Text style={styles.infoValue}>{verificationResult.candidate?.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>ID:</Text>
                      <Text style={styles.infoValue}>{verificationResult.candidate?.id || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Email:</Text>
                      <Text style={styles.infoValue}>{verificationResult.candidate?.email || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Credential Info */}
                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Credential Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Title:</Text>
                      <Text style={styles.infoValue}>{verificationResult.credential?.title || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Type:</Text>
                      <Text style={styles.infoValue}>{verificationResult.credential?.type || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Institution:</Text>
                      <Text style={styles.infoValue}>{verificationResult.credential?.institution || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Date Issued:</Text>
                      <Text style={styles.infoValue}>{verificationResult.credential?.dateIssued || 'N/A'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Status:</Text>
                      <Text style={styles.infoValue}>{verificationResult.credential?.status || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Verification Info */}
                  <View style={styles.resultSection}>
                    <Text style={styles.resultSectionTitle}>Verification Details</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Status:</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getVerificationStatusColor(verificationResult.verification.status) }]}>
                        <Text style={styles.statusText}>{verificationResult.verification.status}</Text>
                      </View>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Confidence:</Text>
                      <Text style={[styles.infoValue, { color: getConfidenceColor(verificationResult.verification.confidence) }]}>
                        {verificationResult.verification.confidence}%
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Blockchain Hash:</Text>
                      <Text style={styles.infoValue}>{verificationResult.verification.blockchainHash || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.resultActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="download-outline" size={20} color="#3b82f6" />
                      <Text style={styles.actionButtonText}>Download Report</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.approveButton, isApproving && styles.approveButtonDisabled]}
                      onPress={handleApprove}
                      disabled={isApproving}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                      <Text style={styles.approveButtonText}>
                        {isApproving ? 'Approving...' : 'Approve Visibility'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.resultContent}>
                  <View style={styles.noResultContainer}>
                    <Ionicons name="close-circle" size={64} color="#ef4444" />
                    <Text style={styles.noResultTitle}>Verification Failed</Text>
                    <Text style={styles.noResultText}>
                      No credential found with the provided information. Please check your search query and try again.
                    </Text>
                  </View>
                </View>
              )
            ) : (
              <View style={styles.resultContent}>
                <View style={styles.noResultContainer}>
                  <Ionicons name="alert-circle" size={64} color="#ef4444" />
                  <Text style={styles.noResultTitle}>No Result</Text>
                  <Text style={styles.noResultText}>
                    No verification result available.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
    );
  } catch (error) {
    console.error('CredentialVerification - Error rendering component:', error);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.subtitle}>Something went wrong. Please try again.</Text>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  modeSelection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modeButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  modeButtonText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  searchSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 40,
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#64748b',
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadSection: {
    padding: 20,
    paddingTop: 0,
  },
  uploadContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadSubtext: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 20,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  supportedFormats: {
    alignItems: 'center',
  },
  supportedFormatsTitle: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportedFormatsText: {
    color: '#64748b',
    fontSize: 12,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  historyItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  historyStudent: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#64748b',
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  historyStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultContent: {
    flex: 1,
  },
  resultSection: {
    marginBottom: 20,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  approveButtonDisabled: {
    backgroundColor: '#64748b',
  },
  approveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  noResultContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 12,
  },
  noResultText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default CredentialVerification;

