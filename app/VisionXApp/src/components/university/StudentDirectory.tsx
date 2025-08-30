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
import { User } from '../../types';
import { studentService } from '../../services/studentService';

type StudentDirectoryRouteProp = RouteProp<{ Students: { user: User } }, 'Students'>;

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  program: string;
  status: 'active' | 'graduated' | 'inactive' | 'suspended';
  enrollmentDate: string;
  graduationDate?: string;
  gpa: number;
  creditsCompleted: number;
  totalCredits: number;
  advisor: string;
  phone: string;
  address: string;
}

const StudentDirectory: React.FC = () => {
  const route = useRoute<StudentDirectoryRouteProp>();
  const { user } = route.params;

  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    studentId: '',
    program: 'Computer Science',
    phone: '',
    address: '',
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const allStudents = await studentService.getAllStudents();
      setStudents(allStudents as Student[]);
    } catch (error) {
      console.error('Error loading students:', error);
      Alert.alert(
        'Error',
        'Failed to load students. Please check your connection and try again.',
        [{ text: 'OK', onPress: () => loadStudents() }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const programs = [
    'Computer Science',
    'Business Administration',
    'Data Science',
    'Engineering',
    'Arts',
    'Medicine',
    'Law',
    'Psychology',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'graduated':
        return '#3b82f6';
      case 'inactive':
        return '#64748b';
      case 'suspended':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'graduated':
        return 'Graduated';
      case 'inactive':
        return 'Inactive';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesProgram && matchesStatus;
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.studentId || !newStudent.program) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      status: 'active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      gpa: 0.0,
      creditsCompleted: 0,
      totalCredits: 120,
      advisor: 'TBD',
      phone: newStudent.phone || 'N/A',
      address: newStudent.address || 'N/A',
    };

    setStudents([student, ...students]);
    setNewStudent({
      name: '',
      email: '',
      studentId: '',
      program: 'Computer Science',
      phone: '',
      address: '',
    });
    setShowAddStudentModal(false);
    Alert.alert('Success', 'Student added successfully!');
  };

  const handleUpdateStudentStatus = (studentId: string, newStatus: Student['status']) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status: newStatus } : student
    ));
    Alert.alert('Success', `Student status updated to ${getStatusLabel(newStatus)}`);
  };

  const handleViewStudentDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetailsModal(true);
  };

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    graduatedStudents: students.filter(s => s.status === 'graduated').length,
    suspendedStudents: students.filter(s => s.status === 'suspended').length,
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.header}>
        <Text style={styles.title}>Student Directory</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalStudents}</Text>
            <Text style={styles.statLabel}>Total Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeStudents}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.graduatedStudents}</Text>
            <Text style={styles.statLabel}>Graduated</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.suspendedStudents}</Text>
            <Text style={styles.statLabel}>Suspended</Text>
          </View>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
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

      {/* Add Student Button */}
      <View style={styles.addSection}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddStudentModal(true)}
        >
          <Ionicons name="person-add" size={24} color="#ffffff" />
          <Text style={styles.addButtonText}>Add New Student</Text>
        </TouchableOpacity>
      </View>

      {/* Students List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Students ({filteredStudents.length})</Text>
        {filteredStudents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={48} color="#64748b" />
            <Text style={styles.emptyStateText}>No students found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or filter criteria</Text>
          </View>
        ) : (
          filteredStudents.map((student) => (
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
                  <Text style={styles.studentId}>ID: {student.studentId}</Text>
                  <Text style={styles.studentProgram}>{student.program}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) }]}>
                  <Text style={styles.statusText}>{getStatusLabel(student.status)}</Text>
                </View>
              </View>
              
              <View style={styles.studentDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>GPA:</Text>
                  <Text style={styles.detailValue}>{student.gpa.toFixed(1)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Credits:</Text>
                  <Text style={styles.detailValue}>{student.creditsCompleted}/{student.totalCredits}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Advisor:</Text>
                  <Text style={styles.detailValue}>{student.advisor}</Text>
                </View>
              </View>
              
              <View style={styles.studentActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleViewStudentDetails(student)}
                >
                  <Ionicons name="eye-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>View Details</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-text-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Credentials</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mail-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Contact</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="settings-outline" size={16} color="#3b82f6" />
                  <Text style={styles.actionText}>Settings</Text>
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
              <Text style={styles.modalTitle}>Filter Students</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterOption}>
              <Text style={styles.filterLabel}>Program</Text>
              <Picker
                selectedValue={filterProgram}
                onValueChange={(value) => setFilterProgram(value)}
                style={styles.picker}
                dropdownIconColor="#64748b"
              >
                <Picker.Item label="All Programs" value="all" />
                {programs.map(program => (
                  <Picker.Item key={program} label={program} value={program} />
                ))}
              </Picker>
            </View>
            
            <View style={styles.filterOption}>
              <Text style={styles.filterLabel}>Status</Text>
              <Picker
                selectedValue={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
                style={styles.picker}
                dropdownIconColor="#64748b"
              >
                <Picker.Item label="All Statuses" value="all" />
                <Picker.Item label="Active" value="active" />
                <Picker.Item label="Graduated" value="graduated" />
                <Picker.Item label="Inactive" value="inactive" />
                <Picker.Item label="Suspended" value="suspended" />
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

      {/* Add Student Modal */}
      <Modal
        visible={showAddStudentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddStudentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Student</Text>
              <TouchableOpacity onPress={() => setShowAddStudentModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={styles.formInput}
                value={newStudent.name}
                onChangeText={(text) => setNewStudent({ ...newStudent, name: text })}
                placeholder="Enter full name"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                value={newStudent.email}
                onChangeText={(text) => setNewStudent({ ...newStudent, email: text })}
                placeholder="Enter email address"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Student ID *</Text>
              <TextInput
                style={styles.formInput}
                value={newStudent.studentId}
                onChangeText={(text) => setNewStudent({ ...newStudent, studentId: text })}
                placeholder="Enter student ID"
                placeholderTextColor="#64748b"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Program *</Text>
              <Picker
                selectedValue={newStudent.program}
                onValueChange={(value) => setNewStudent({ ...newStudent, program: value })}
                style={styles.picker}
                dropdownIconColor="#64748b"
              >
                {programs.map(program => (
                  <Picker.Item key={program} label={program} value={program} />
                ))}
              </Picker>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <TextInput
                style={styles.formInput}
                value={newStudent.phone}
                onChangeText={(text) => setNewStudent({ ...newStudent, phone: text })}
                placeholder="Enter phone number"
                placeholderTextColor="#64748b"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.formInput}
                value={newStudent.address}
                onChangeText={(text) => setNewStudent({ ...newStudent, address: text })}
                placeholder="Enter address"
                placeholderTextColor="#64748b"
                multiline
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddStudentModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addStudentButton}
                onPress={handleAddStudent}
              >
                <Text style={styles.addStudentButtonText}>Add Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Student Details Modal */}
      <Modal
        visible={showStudentDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowStudentDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Student Details</Text>
              <TouchableOpacity onPress={() => setShowStudentDetailsModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            {selectedStudent && (
              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Personal Information</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Name:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.name}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Email:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.email}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Student ID:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.studentId}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Phone:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.phone}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Address:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.address}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Academic Information</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Program:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.program}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Status:</Text>
                    <Text style={[styles.detailItemValue, { color: getStatusColor(selectedStudent.status) }]}>
                      {getStatusLabel(selectedStudent.status)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Enrollment Date:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.enrollmentDate}</Text>
                  </View>
                  {selectedStudent.graduationDate && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailItemLabel}>Graduation Date:</Text>
                      <Text style={styles.detailItemValue}>{selectedStudent.graduationDate}</Text>
                    </View>
                  )}
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>GPA:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.gpa.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Credits Completed:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.creditsCompleted}/{selectedStudent.totalCredits}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailItemLabel}>Advisor:</Text>
                    <Text style={styles.detailItemValue}>{selectedStudent.advisor}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Quick Actions</Text>
                  <View style={styles.quickActions}>
                    <TouchableOpacity 
                      style={styles.quickActionButton}
                      onPress={() => {
                        setShowStudentDetailsModal(false);
                        // Navigate to credentials or other actions
                      }}
                    >
                      <Ionicons name="document-text" size={20} color="#3b82f6" />
                      <Text style={styles.quickActionText}>View Credentials</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.quickActionButton}
                      onPress={() => {
                        setShowStudentDetailsModal(false);
                        // Navigate to edit student
                      }}
                    >
                      <Ionicons name="create" size={20} color="#3b82f6" />
                      <Text style={styles.quickActionText}>Edit Student</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
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
  addSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
  },
  addButtonText: {
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
  studentId: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  studentProgram: {
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
  studentDetails: {
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  studentActions: {
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
  addStudentButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  addStudentButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  detailsContent: {
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItemLabel: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  detailItemValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
  },
  quickActionText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default StudentDirectory;
