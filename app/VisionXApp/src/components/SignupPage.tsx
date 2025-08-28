import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { SignupData } from '../types';
import { authService } from '../services/authService';

interface SignupPageProps {
  onSignup: (data: SignupData) => void;
  onBackToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onSignup, onBackToLogin }) => {
  const [formData, setFormData] = useState<SignupData>({
    userType: 'student',
    name: '',
    email: '',
    password: '',
    validId: '',
  });
  const [showUserTypePicker, setShowUserTypePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.validId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await authService.signup({
        userType: formData.userType,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        validId: formData.validId,
      });

      Alert.alert(
        'Success!',
        'Account created successfully. You can now login.',
        [
          {
            text: 'OK',
            onPress: () => onSignup(formData),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return 'school';
      case 'recruiter':
        return 'business';
      case 'university':
        return 'library';
      default:
        return 'person';
    }
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'student':
        return 'Student';
      case 'recruiter':
        return 'Recruiter';
      case 'university':
        return 'University';
      default:
        return 'User';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={48} color="#3b82f6" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our community of professionals</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* User Type Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>User Type</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowUserTypePicker(true)}
              >
                <View style={styles.pickerButtonContent}>
                  <Ionicons 
                    name={getUserTypeIcon(formData.userType)} 
                    size={20} 
                    color="#3b82f6" 
                  />
                  <Text style={styles.pickerButtonText}>
                    {getUserTypeLabel(formData.userType)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#64748b" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholderTextColor="#64748b"
                autoCapitalize="words"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>

            {/* Valid ID Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Valid ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your ID number"
                value={formData.validId}
                onChangeText={(value) => handleChange('validId', value)}
                placeholderTextColor="#64748b"
                autoCapitalize="none"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.submitButtonText}>Creating Account...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
              <Ionicons name="arrow-back" size={16} color="#64748b" />
              <Text style={styles.backButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* User Type Picker Modal */}
      <Modal
        visible={showUserTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserTypePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select User Type</Text>
              <TouchableOpacity onPress={() => setShowUserTypePicker(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <Picker
              selectedValue={formData.userType}
              onValueChange={(value) => {
                handleChange('userType', value);
                setShowUserTypePicker(false);
              }}
              style={styles.picker}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Recruiter" value="recruiter" />
              <Picker.Item label="University" value="university" />
            </Picker>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerButton: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  pickerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#64748b',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  backButtonText: {
    color: '#64748b',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  picker: {
    backgroundColor: '#1e293b',
    color: '#ffffff',
  },
});

export default SignupPage;

