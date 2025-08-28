import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User, Credential } from '../../types';
import { credentialService } from '../../services/credentialService';
import { studentService } from '../../services/studentService';
import { metricsService } from '../../services/metricsService';

type UniversityDashboardRouteProp = RouteProp<{ Dashboard: { user: User } }, 'Dashboard'>;

const UniversityDashboard: React.FC = () => {
  const route = useRoute<UniversityDashboardRouteProp>();
  const { user } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [recentCredentials, setRecentCredentials] = useState<any[]>([]);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalCredentials: 0,
    pendingVerifications: 0,
    verifiedToday: 0,
    programsOffered: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load credentials
      const allCredentials = await credentialService.getCredentials();
      setRecentCredentials(allCredentials.slice(0, 5)); // Show last 5 credentials
      
      // Load students
      const allStudents = await studentService.getAllStudents();
      const activeStudentsList = allStudents.filter(student => student.status === 'active');
      setActiveStudents(activeStudentsList.slice(0, 5)); // Show last 5 active students
      
      // Calculate stats
      setStats({
        totalStudents: allStudents.length,
        activeStudents: activeStudentsList.length,
        totalCredentials: allCredentials.length,
        pendingVerifications: allCredentials.filter(c => c.status === 'pending').length,
        verifiedToday: allCredentials.filter(c => {
          const today = new Date().toDateString();
          const issuedDate = new Date(c.dateIssued).toDateString();
          return issuedDate === today && c.status === 'verified';
        }).length,
        programsOffered: 15, // This would come from a separate API call
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert(
        'Error',
        'Failed to load dashboard data. Please check your connection and try again.',
        [{ text: 'OK', onPress: () => loadDashboardData() }]
      );
    } finally {
      setIsLoading(false);
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

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'graduated':
        return '#3b82f6';
      case 'inactive':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user.fullName || user.username}!</Text>
        <Text style={styles.subtitle}>Here's your university overview</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading dashboard data...</Text>
        </View>
      ) : (
        <>
          {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{stats.activeStudents}</Text>
          <Text style={styles.statLabel}>Active Students</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="document-text" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.totalCredentials}</Text>
          <Text style={styles.statLabel}>Credentials Issued</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{stats.pendingVerifications}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Additional Stats */}
      <View style={styles.additionalStats}>
        <View style={styles.additionalStatCard}>
          <Ionicons name="shield-checkmark" size={20} color="#10b981" />
          <Text style={styles.additionalStatNumber}>{stats.verifiedToday}</Text>
          <Text style={styles.additionalStatLabel}>Verified Today</Text>
        </View>
        
        <View style={styles.additionalStatCard}>
          <Ionicons name="school" size={20} color="#3b82f6" />
          <Text style={styles.additionalStatNumber}>{stats.programsOffered}</Text>
          <Text style={styles.additionalStatLabel}>Programs</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Search Students & Credentials</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, student ID, or program..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Credentials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Credentials Issued</Text>
        {recentCredentials.map((credential) => (
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
            </View>
          </View>
        ))}
      </View>

      {/* Active Students */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Active Students</Text>
        {activeStudents.map((student) => (
          <View key={student.id} style={styles.studentCard}>
            <View style={styles.studentHeader}>
              <View style={styles.studentAvatar}>
                <Text style={styles.avatarText}>
                  {student.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentEmail}>{student.email}</Text>
                <Text style={styles.studentProgram}>{student.program}</Text>
              </View>
              <View style={[styles.studentStatus, { backgroundColor: getStudentStatusColor(student.status) }]}>
                <Text style={styles.studentStatusText}>{student.status}</Text>
              </View>
            </View>
            
            <View style={styles.studentFooter}>
              <Text style={styles.graduationDate}>
                Expected Graduation: {student.graduationDate}
              </Text>
              
              <View style={styles.studentActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>View Profile</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Credentials</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mail-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-circle" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Issue Credential</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="person-add" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Add Student</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="shield-checkmark" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Verify Credential</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Program Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Program Overview</Text>
        <View style={styles.programGrid}>
          <View style={styles.programCard}>
            <Ionicons name="laptop" size={24} color="#3b82f6" />
            <Text style={styles.programName}>Computer Science</Text>
            <Text style={styles.programStats}>245 Students</Text>
          </View>
          
          <View style={styles.programCard}>
            <Ionicons name="business" size={24} color="#3b82f6" />
            <Text style={styles.programName}>Business Admin</Text>
            <Text style={styles.programStats}>189 Students</Text>
          </View>
          
          <View style={styles.programCard}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <Text style={styles.programName}>Data Science</Text>
            <Text style={styles.programStats}>156 Students</Text>
          </View>
          
          <View style={styles.programCard}>
            <Ionicons name="medical" size={24} color="#3b82f6" />
            <Text style={styles.programName}>Medicine</Text>
            <Text style={styles.programStats}>98 Students</Text>
          </View>
        </View>
      </View>
        </>
      )}
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    marginHorizontal: '1%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  additionalStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  additionalStatCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  additionalStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  searchSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
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
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 8,
  },
  section: {
    padding: 20,
    paddingTop: 0,
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
  studentCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  studentProgram: {
    fontSize: 12,
    color: '#64748b',
  },
  studentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  studentStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  studentFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  graduationDate: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  studentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  programGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  programCard: {
    width: '48%',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  programName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  programStats: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 16,
  },
});

export default UniversityDashboard;
