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

type RecruiterDashboardRouteProp = RouteProp<{ Dashboard: { user: User } }, 'Dashboard'>;

const RecruiterDashboard: React.FC = () => {
  const route = useRoute<RecruiterDashboardRouteProp>();
  const { user } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [recentVerifications, setRecentVerifications] = useState<any[]>([]);
  const [topCandidates, setTopCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalVerifications: 0,
    verifiedToday: 0,
    pendingVerifications: 0,
    totalCandidates: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load credentials for verification
      const allCredentials = await credentialService.getCredentials();
      setRecentVerifications(allCredentials.slice(0, 5)); // Show last 5 credentials
      
      // Load students as candidates
      const allStudents = await studentService.getAllStudents();
      const candidatesWithCredentials = await Promise.all(
        allStudents.map(async (student) => {
          const credentials = await studentService.getStudentCredentials(student.id);
          const verifiedCreds = credentials.filter(c => c.status === 'verified').length;
          const matchScore = Math.min(95, 70 + (verifiedCreds * 5)); // Simple scoring algorithm
          
          return {
            id: student.id,
            name: student.name,
            email: student.email,
            credentials: credentials.length,
            verifiedCreds,
            matchScore,
          };
        })
      );
      
      // Sort by match score and take top 5
      const topCandidatesList = candidatesWithCredentials
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
      setTopCandidates(topCandidatesList);
      
      // Calculate stats
      setStats({
        totalVerifications: allCredentials.length,
        verifiedToday: allCredentials.filter(c => {
          const today = new Date().toDateString();
          const issuedDate = new Date(c.dateIssued).toDateString();
          return issuedDate === today && c.status === 'verified';
        }).length,
        pendingVerifications: allCredentials.filter(c => c.status === 'pending').length,
        totalCandidates: allStudents.length,
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
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user.fullName || user.username}!</Text>
        <Text style={styles.subtitle}>Here's your recruitment overview</Text>
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
          <Ionicons name="shield-checkmark" size={24} color="#10b981" />
          <Text style={styles.statNumber}>{stats.totalVerifications}</Text>
          <Text style={styles.statLabel}>Total Verifications</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>{stats.verifiedToday}</Text>
          <Text style={styles.statLabel}>Verified Today</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>{stats.pendingVerifications}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#8b5cf6" />
          <Text style={styles.statNumber}>{stats.totalCandidates}</Text>
          <Text style={styles.statLabel}>Candidates</Text>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Search Candidates</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, skills, or credentials..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#64748b"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Candidates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Candidates</Text>
        {topCandidates.map((candidate) => (
          <View key={candidate.id} style={styles.candidateCard}>
            <View style={styles.candidateHeader}>
              <View style={styles.candidateAvatar}>
                <Text style={styles.avatarText}>
                  {candidate.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.candidateInfo}>
                <Text style={styles.candidateName}>{candidate.name}</Text>
                <Text style={styles.candidateEmail}>{candidate.email}</Text>
                <View style={styles.credentialInfo}>
                  <Text style={styles.credentialText}>
                    {candidate.verifiedCreds}/{candidate.credentials} credentials verified
                  </Text>
                </View>
              </View>
              <View style={[styles.matchScore, { backgroundColor: getMatchScoreColor(candidate.matchScore) }]}>
                <Text style={styles.matchScoreText}>{candidate.matchScore}%</Text>
              </View>
            </View>
            
            <View style={styles.candidateActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                <Text style={styles.actionText}>View Profile</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="mail-outline" size={16} color="#3b82f6" />
                <Text style={styles.actionText}>Contact</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
                <Text style={styles.actionText}>Credentials</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Verifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Verifications</Text>
        {recentVerifications.map((verification) => (
          <View key={verification.id} style={styles.verificationCard}>
            <View style={styles.verificationHeader}>
              <View style={styles.verificationInfo}>
                <Text style={styles.studentName}>{verification.studentName}</Text>
                <Text style={styles.credentialTitle}>{verification.credentialTitle}</Text>
                <Text style={styles.verificationDate}>
                  Verified: {verification.verificationDate}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(verification.status) }]}>
                <Text style={styles.statusText}>{verification.status}</Text>
              </View>
            </View>
            
            <View style={styles.verificationActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                <Text style={styles.actionText}>View Details</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="download-outline" size={16} color="#3b82f6" />
                <Text style={styles.actionText}>Download Report</Text>
              </TouchableOpacity>
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
            <Text style={styles.quickActionText}>New Job Posting</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="people-circle" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Browse Candidates</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="analytics" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>View Reports</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="settings" size={24} color="#3b82f6" />
            <Text style={styles.quickActionText}>Settings</Text>
          </TouchableOpacity>
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
  candidateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  candidateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  candidateAvatar: {
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
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  candidateEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  credentialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credentialText: {
    fontSize: 12,
    color: '#64748b',
  },
  matchScore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  matchScoreText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  candidateActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  verificationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  verificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  verificationInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  credentialTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  verificationDate: {
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
  verificationActions: {
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

export default RecruiterDashboard;

