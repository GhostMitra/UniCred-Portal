import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User, Credential } from '../../types';
import { credentialService } from '../../services/credentialService';

type CredentialsRouteProp = RouteProp<{ Credentials: { user: User } }, 'Credentials'>;

const Credentials: React.FC = () => {
  const route = useRoute<CredentialsRouteProp>();
  const { user } = route.params;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCredential, setNewCredential] = useState({
    title: '',
    type: 'certificate' as 'bachelor' | 'master' | 'certificate' | 'diploma',
    institution: '',
    dateIssued: '',
  });

  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setIsLoading(true);
      let userCredentials: Credential[] = [];
      
      if (user.username) {
        // Try to get credentials by username first
        try {
          userCredentials = await credentialService.getCredentialsByUsername(user.username);
        } catch (error) {
          console.log('Failed to get credentials by username, trying studentId...');
          // Fallback to studentId if username method fails
          if (user.studentId) {
            userCredentials = await credentialService.getStudentCredentials(user.studentId);
          }
        }
      } else if (user.studentId) {
        // Fallback to studentId if username is not available
        userCredentials = await credentialService.getStudentCredentials(user.studentId);
      }
      
      setCredentials(userCredentials);
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

  // Filter credentials based on search and filter
  const filteredCredentials = credentials.filter(credential => {
    const matchesSearch = credential.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         credential.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || credential.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return '#10b981'; // green-500
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'expired':
        return '#ef4444'; // red-500
      default:
        return '#64748b'; // slate-500
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bachelor':
        return 'school';
      case 'master':
        return 'library';
      case 'certificate':
        return 'ribbon';
      case 'diploma':
        return 'document-text';
      default:
        return 'document';
    }
  };

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
        return 'Other';
    }
  };

  const handleCredentialPress = (credential: Credential) => {
    Alert.alert(
      credential.title,
      `Institution: ${credential.institution}\nType: ${getTypeLabel(credential.type)}\nIssued: ${credential.dateIssued}\nStatus: ${credential.status}`,
      [
        { text: 'Share', onPress: () => console.log('Share credential') },
        { text: 'Download', onPress: () => console.log('Download credential') },
        { text: 'View Details', onPress: () => console.log('View details') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleAddCredential = () => {
    if (!newCredential.title || !newCredential.institution || !newCredential.dateIssued) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const credential: Credential = {
      id: Date.now().toString(),
      title: newCredential.title,
      type: newCredential.type,
      institution: newCredential.institution,
      dateIssued: newCredential.dateIssued,
      status: 'pending',
      studentId: user.studentId || 'STU001',
      studentName: user.fullName || user.username,
    };

    setCredentials(prev => [credential, ...prev]);
    setNewCredential({ title: '', type: 'certificate', institution: '', dateIssued: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Credential added successfully!');
  };

  const handleDeleteCredential = (credentialId: string) => {
    Alert.alert(
      'Delete Credential',
      'Are you sure you want to delete this credential?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCredentials(prev => prev.filter(c => c.id !== credentialId));
          },
        },
      ]
    );
  };

  const stats = {
    total: credentials.length,
    verified: credentials.filter(c => c.status === 'verified').length,
    pending: credentials.filter(c => c.status === 'pending').length,
    expired: credentials.filter(c => c.status === 'expired').length,
  };

  return (
    <View style={styles.container}>
      {/* Header with Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Digital Credential Wallet</Text>
        <Text style={styles.subtitle}>Manage and share your verified credentials</Text>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{stats.verified}</Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statBadge}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter Bar */}
      <View style={styles.searchFilterBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search credentials..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#64748b"
          />
        </View>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={20} color="#3b82f6" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Credentials List */}
      <ScrollView style={styles.content}>
        {filteredCredentials.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#64748b" />
            <Text style={styles.emptyTitle}>
              {searchTerm || filterType !== 'all' ? 'No matching credentials' : 'No Credentials Yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start building your credential portfolio by adding your first achievement'
              }
            </Text>
            {!searchTerm && filterType === 'all' && (
              <TouchableOpacity style={styles.emptyAddButton} onPress={() => setShowAddModal(true)}>
                <Text style={styles.emptyAddButtonText}>Add Your First Credential</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredCredentials.map((credential) => (
            <TouchableOpacity
              key={credential.id}
              style={styles.credentialCard}
              onPress={() => handleCredentialPress(credential)}
            >
              <View style={styles.credentialHeader}>
                <View style={styles.typeIcon}>
                  <Ionicons 
                    name={getTypeIcon(credential.type) as any} 
                    size={24} 
                    color="#3b82f6" 
                  />
                </View>
                <View style={styles.credentialInfo}>
                  <Text style={styles.credentialTitle}>{credential.title}</Text>
                  <Text style={styles.institution}>{credential.institution}</Text>
                  <Text style={styles.date}>Issued: {credential.dateIssued}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(credential.status) }]}>
                  <Text style={styles.statusText}>{credential.status}</Text>
                </View>
              </View>
              
              <View style={styles.credentialFooter}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{getTypeLabel(credential.type)}</Text>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="download-outline" size={16} color="#3b82f6" />
                    <Text style={styles.actionText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteCredential(credential.id)}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
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
            
            <View style={styles.filterOptions}>
              {['all', 'bachelor', 'master', 'certificate', 'diploma'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterOption,
                    filterType === type && styles.filterOptionSelected
                  ]}
                  onPress={() => {
                    setFilterType(type);
                    setShowFilterModal(false);
                  }}
                >
                  <Text style={[
                    styles.filterOptionText,
                    filterType === type && styles.filterOptionTextSelected
                  ]}>
                    {type === 'all' ? 'All Types' : getTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Credential Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Credential</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Credential Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Bachelor of Computer Science"
                  value={newCredential.title}
                  onChangeText={(value) => setNewCredential(prev => ({ ...prev, title: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type</Text>
                <View style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>
                    {getTypeLabel(newCredential.type)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#64748b" />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Institution</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Tech University"
                  value={newCredential.institution}
                  onChangeText={(value) => setNewCredential(prev => ({ ...prev, institution: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date Issued</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={newCredential.dateIssued}
                  onChangeText={(value) => setNewCredential(prev => ({ ...prev, dateIssued: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleAddCredential}>
                <Text style={styles.submitButtonText}>Add Credential</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statBadge: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  searchFilterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  filterButton: {
    padding: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  credentialCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  credentialHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  institution: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
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
  credentialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  typeBadge: {
    backgroundColor: '#1e40af',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    color: '#3b82f6',
    fontSize: 14,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyAddButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  filterOptions: {
    width: '100%',
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#3b82f6',
  },
  filterOptionText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  filterOptionTextSelected: {
    color: '#ffffff',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Credentials;
