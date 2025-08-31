import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { User, NewCredential } from '../../types';
import { credentialService } from '../../services/credentialService';

type CredentialManagementRouteProp = RouteProp<{ Credentials: { user: User } }, 'Credentials'>;

const CredentialManagement: React.FC = () => {
  const route = useRoute<CredentialManagementRouteProp>();
  const { user } = route.params ?? { user: null };


  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [newCredential, setNewCredential] = useState<NewCredential>({
    title: '',
    type: 'bachelor',
    studentId: '',
    studentName: '',
    graduationDate: '',
  });

  const [credentials, setCredentials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      const allCredentials = await credentialService.getCredentials();
      setCredentials(allCredentials);
      
      // Filter pending credentials
      const pending = allCredentials.filter(c => c.status === 'pending');
      setPendingCredentials(pending);
    } catch (error) {
      console.error('Error loading credentials:', error);
      Alert.alert(
        'Error',
        'Failed to load credentials. Please check your connection and try again.',
        [{ text: 'OK', onPress: () => loadCredentials() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [pendingCredentials, setPendingCredentials] = useState<any[]>([]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'bachelor':
        return 'Bachelor';
      case 'master':
        return 'Master';
      case 'certificate':
        return 'Certificate';
      case 'diploma':
        return 'Diploma';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'expired':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const filteredCredentials = credentials.filter((credential) => {
    const matchesSearch =
      (credential.studentName ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (credential.studentId ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (credential.title ?? '').toLowerCase().includes(searchQuery.toLowerCase());
  
    const matchesType = filterType === 'all' || credential.type === filterType;
    return matchesSearch && matchesType;
  });
  

  const handleIssueCredential = () => {
    if (!newCredential.title || !newCredential.studentId || !newCredential.studentName || !newCredential.graduationDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const credential = {
      id: Date.now().toString(),
      ...newCredential,
      dateIssued: new Date().toISOString().split('T')[0],
      status: 'verified',
      blockchainHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
    };

    setCredentials([credential, ...credentials]);
    setNewCredential({
      title: '',
      type: 'bachelor',
      studentId: '',
      studentName: '',
      graduationDate: '',
    });
    setShowIssueModal(false);
    Alert.alert('Success', 'Credential issued successfully!');
  };

  const handleVerifyCredential = (credentialId: string) => {
    setCredentials(credentials.map(cred => 
      cred.id === credentialId ? { ...cred, status: 'verified' } : cred
    ));
    setPendingCredentials(pendingCredentials.filter(cred => cred.id !== credentialId));
    Alert.alert('Success', 'Credential verified successfully!');
  };

  const handleRevokeCredential = (credentialId: string) => {
    Alert.alert(
      'Confirm Revocation',
      'Are you sure you want to revoke this credential? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke',
          style: 'destructive',
          onPress: () => {
            setCredentials(credentials.filter(cred => cred.id !== credentialId));
            Alert.alert('Success', 'Credential revoked successfully!');
          },
        },
      ]
    );
  };

  const stats = {
    totalIssued: credentials.length,
    verified: credentials.filter(c => c.status === 'verified').length,
    pending: pendingCredentials.length,
    revoked: 0,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Credential Management</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalIssued}</Text>
            <Text style={styles.statLabel}>Total Issued</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.verified}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.revoked}</Text>
            <Text style={styles.statLabel}>Revoked</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search credentials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748b"
          />
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#3b82f6" />
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Issue New Credential Button */}
      <View style={styles.issueSection}>
        <TouchableOpacity 
          style={styles.issueButton}
          onPress={() => setShowIssueModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="#ffffff" />
          <Text style={styles.issueButtonText}>Issue New Credential</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Verifications */}
      {pendingCredentials.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Verifications</Text>
          {pendingCredentials.map((credential) => (
            <View key={credential.id} style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <View style={styles.credentialInfo}>
                  <Text style={styles.credentialTitle}>{credential.title}</Text>
                  <Text style={styles.studentInfo}>
                    {credential.studentName} - {credential.studentId}
                  </Text>
                  <Text style={styles.credentialDate}>
                    Issued: {credential.dateIssued}
                  </Text>
                  <Text style={styles.credentialType}>
                    Type: {getTypeLabel(credential.type)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(credential.status) }]}>
                  <Text style={styles.statusText}>{credential.status}</Text>
                </View>
              </View>
              
              <View style={styles.credentialActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.verifyButton]}
                  onPress={() => handleVerifyCredential(credential.id)}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={[styles.actionText, { color: '#10b981' }]}>Verify</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* All Credentials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Credentials</Text>
        {filteredCredentials.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#64748b" />
            <Text style={styles.emptyStateText}>No credentials found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filter criteria</Text>
          </View>
        ) : (
          filteredCredentials.map((credential) => (
            <View key={credential.id} style={styles.credentialCard}>
              <View style={styles.credentialHeader}>
                <View style={styles.credentialInfo}>
                  <Text style={styles.credentialTitle}>{credential.title}</Text>
                  <Text style={styles.studentInfo}>
                    {credential.studentName} - {credential.studentId}
                  </Text>
                  <Text style={styles.credentialDate}>
                    Issued: {credential.dateIssued}
                  </Text>
                  <Text style={styles.credentialType}>
                    Type: {getTypeLabel(credential.type)}
                  </Text>
                  <Text style={styles.blockchainHash}>
                    Hash: {credential.blockchainHash}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(credential.status) }]}>
                  <Text style={styles.statusText}>{credential.status}</Text>
                </View>
              </View>
              
              <View style={styles.credentialActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Download</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.revokeButton]}
                  onPress={() => handleRevokeCredential(credential.id)}
                >
                  <Ionicons name="close-circle" size={16} color="#ef4444" />
                  <Text style={[styles.actionText, { color: '#ef4444' }]}>Revoke</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Credentials</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterOption}>
              <Text style={styles.filterLabel}>Credential Type</Text>
              <Picker
                selectedValue={filterType}
                onValueChange={(value) => setFilterType(value)}
                style={styles.picker}
                dropdownIconColor="#64748b"
              >
                <Picker.Item label="All Types" value="all" />
                <Picker.Item label="Bachelor" value="bachelor" />
                <Picker.Item label="Master" value="master" />
                <Picker.Item label="Certificate" value="certificate" />
                <Picker.Item label="Diploma" value="diploma" />
              </Picker>
            </View>
            
            <TouchableOpacity 
              style={styles.applyFilterButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyFilterButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Issue Credential Modal */}
      <Modal
        visible={showIssueModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIssueModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Issue New Credential</Text>
              <TouchableOpacity onPress={() => setShowIssueModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Credential Title</Text>
              <TextInput
                style={styles.formInput}
                value={newCredential.title}
                onChangeText={(text) => setNewCredential({ ...newCredential, title: text })}
                placeholder="e.g., Bachelor of Computer Science"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Credential Type</Text>
              <Picker
                selectedValue={newCredential.type}
                onValueChange={(value) => setNewCredential({ ...newCredential, type: value as any })}
                style={styles.picker}
                dropdownIconColor="#64748b"
              >
                <Picker.Item label="Bachelor" value="bachelor" />
                <Picker.Item label="Master" value="master" />
                <Picker.Item label="Certificate" value="certificate" />
                <Picker.Item label="Diploma" value="diploma" />
              </Picker>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Student ID</Text>
              <TextInput
                style={styles.formInput}
                value={newCredential.studentId}
                onChangeText={(text) => setNewCredential({ ...newCredential, studentId: text })}
                placeholder="e.g., STU001"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Student Name</Text>
              <TextInput
                style={styles.formInput}
                value={newCredential.studentName}
                onChangeText={(text) => setNewCredential({ ...newCredential, studentName: text })}
                placeholder="e.g., John Doe"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Graduation Date</Text>
              <TextInput
                style={styles.formInput}
                value={newCredential.graduationDate}
                onChangeText={(text) => setNewCredential({ ...newCredential, graduationDate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowIssueModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.issueCredentialButton}
                onPress={handleIssueCredential}
              >
                <Text style={styles.issueCredentialButtonText}>Issue Credential</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
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
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  issueSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  issueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
  },
  issueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  credentialCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  credentialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  credentialInfo: {
    flex: 1,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  studentInfo: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  credentialDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  credentialType: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  blockchainHash: {
    fontSize: 10,
    color: '#64748b',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  credentialActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#3b82f6',
    fontSize: 14,
    marginLeft: 4,
  },
  verifyButton: {
    // Inherits from actionButton
  },
  revokeButton: {
    // Inherits from actionButton
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
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
    fontWeight: '600',
    color: '#ffffff',
  },
  filterOption: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  picker: {
    backgroundColor: '#334155',
    borderRadius: 8,
    color: '#ffffff',
  },
  applyFilterButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyFilterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#64748b',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  issueCredentialButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  issueCredentialButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CredentialManagement;
