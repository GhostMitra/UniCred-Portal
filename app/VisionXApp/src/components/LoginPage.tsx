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
  ActivityIndicator,
} from 'react-native';
import { User } from '../types';
import { authService } from '../services/authService';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accessType, setAccessType] = useState<'student' | 'recruiter' | 'university'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.login({
        id: username,
        password,
        accessType,
      });

      // Convert backend user format to app User format
      const user: User = {
        id: response.user.id,
        username: response.user.username,
        email: response.user.email,
        fullName: response.user.fullName,
        accessType: response.user.accessType,
        studentId: response.user.studentId,
      };
      
      onLogin(user);
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>UniCred</Text>
          <Text style={styles.subtitle}>Student Credential Platform</Text>
          
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor="#64748b"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#64748b"
            />

            {/* Access Type Picker */}
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>Access Type:</Text>
              <View style={styles.pickerButtons}>
                {(['student', 'recruiter', 'university'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.pickerButton,
                      accessType === type && styles.pickerButtonActive
                    ]}
                    onPress={() => setAccessType(type)}
                  >
                    <Text style={[
                      styles.pickerButtonText,
                      accessType === type && styles.pickerButtonTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginButtonText}>Login</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]} 
              onPress={onNavigateToSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // slate-900
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // slate-400
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 300,
  },
  input: {
    backgroundColor: '#1e293b', // slate-800
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155', // slate-700
  },
  loginButton: {
    backgroundColor: '#3b82f6', // blue-500
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981', // emerald-500
  },
  signupButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    marginBottom: 16,
    width: '100%',
  },
  pickerLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'left',
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pickerButton: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  pickerButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  pickerButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  pickerButtonTextActive: {
    color: '#ffffff',
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  signupButtonDisabled: {
    opacity: 0.6,
  },
});

export default LoginPage;
