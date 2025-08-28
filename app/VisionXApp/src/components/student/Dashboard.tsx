import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User, Credential } from '../../types';
import { credentialService } from '../../services/credentialService';
import { metricsService } from '../../services/metricsService';

type DashboardRouteProp = RouteProp<{ Dashboard: { user: User } }, 'Dashboard'>;

const Dashboard: React.FC = () => {
  const route = useRoute<DashboardRouteProp>();
  const { user } = route.params;
  
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    expired: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load user's credentials using username (more reliable than studentId)
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
      
      // Calculate stats
      setStats({
        total: userCredentials.length,
        verified: userCredentials.filter(c => c.status === 'verified').length,
        pending: userCredentials.filter(c => c.status === 'pending').length,
        expired: userCredentials.filter(c => c.status === 'expired').length,
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
        return '#10b981'; // green-500
      case 'pending':
        return '#f59e0b'; // amber-500
      case 'expired':
        return '#ef4444'; // red-500
      default:
        return '#64748b'; // slate-500
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back, {user.fullName || user.username}!</Text>
        <Text style={styles.subtitle}>Here's your credential overview</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading your credentials...</Text>
        </View>
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="document-text" size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Credentials</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statNumber}>{stats.verified}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="alert-circle" size={24} color="#ef4444" />
              <Text style={styles.statNumber}>{stats.expired}</Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Credentials</Text>
            {credentials.length > 0 ? (
              credentials.slice(0, 3).map((credential) => (
                <View key={credential.id} style={styles.credentialCard}>
                  <View style={styles.credentialHeader}>
                    <Text style={styles.credentialTitle}>{credential.title}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(credential.status) }]}>
                      <Text style={styles.statusText}>{credential.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.institution}>{credential.institution}</Text>
                  <Text style={styles.date}>Issued: {new Date(credential.dateIssued).toLocaleDateString()}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={48} color="#64748b" />
                <Text style={styles.emptyStateText}>No credentials yet</Text>
                <Text style={styles.emptyStateSubtext}>Your credentials will appear here once they're issued</Text>
              </View>
            )}
          </View>
        </>
      )}



      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add-circle" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Add Credential</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={20} color="#3b82f6" />
            <Text style={styles.actionButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  section: {
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  credentialTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
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
  institution: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#64748b',
  },
  quickActions: {
    padding: 20,
    paddingTop: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#3b82f6',
    marginLeft: 8,
    fontWeight: '500',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#94a3b8',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Dashboard;
