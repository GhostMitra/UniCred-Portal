import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User } from '../../types';

type RecruiterSettingsRouteProp = RouteProp<{ Settings: { user: User; onLogout: () => void } }, 'Settings'>;

const RecruiterSettings: React.FC = () => {
  const route = useRoute<RecruiterSettingsRouteProp>();
  const { user, onLogout } = route.params;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);
  const [autoVerification, setAutoVerification] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    company: 'Tech Corp',
    position: 'Senior Recruiter',
    phone: '+1 (555) 123-4567',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    contactInfoVisibility: 'verified_only',
    analyticsSharing: true,
    marketingEmails: false,
  });

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    if (!profileData.fullName || !profileData.email) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    Alert.alert('Success', 'Profile updated successfully!');
    setShowEditProfile(false);
  };

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleSavePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    Alert.alert('Success', 'Password changed successfully!');
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handlePrivacySettings = () => {
    setShowPrivacySettings(true);
  };

  const handleSavePrivacy = () => {
    Alert.alert('Success', 'Privacy settings updated successfully!');
    setShowPrivacySettings(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' },
      ]
    );
  };

  const getVisibilityLabel = (visibility: string) => {
    switch (visibility) {
      case 'public':
        return 'Public';
      case 'verified_only':
        return 'Verified Users Only';
      case 'private':
        return 'Private';
      default:
        return 'Public';
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        {
          icon: 'person-outline',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: handleEditProfile,
          showArrow: true,
        },
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          subtitle: 'Update your password',
          onPress: handleChangePassword,
          showArrow: true,
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Settings',
          subtitle: 'Manage your privacy preferences',
          onPress: handlePrivacySettings,
          showArrow: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          subtitle: 'Receive notifications about verifications',
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
          showArrow: false,
          isSwitch: true,
          switchValue: notificationsEnabled,
        },
        {
          icon: 'mail-outline',
          title: 'Email Alerts',
          subtitle: 'Receive email notifications',
          onPress: () => setEmailAlerts(!emailAlerts),
          showArrow: false,
          isSwitch: true,
          switchValue: emailAlerts,
        },
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          subtitle: 'Toggle dark theme',
          onPress: () => setDarkModeEnabled(!darkModeEnabled),
          showArrow: false,
          isSwitch: true,
          switchValue: darkModeEnabled,
        },
        {
          icon: 'checkmark-circle-outline',
          title: 'Auto Verification',
          subtitle: 'Automatically verify simple credentials',
          onPress: () => setAutoVerification(!autoVerification),
          showArrow: false,
          isSwitch: true,
          switchValue: autoVerification,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: () => Alert.alert('Help & Support', 'Contact support at support@visionx.com'),
          showArrow: true,
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          subtitle: 'Read our terms and conditions',
          onPress: () => Alert.alert('Terms of Service', 'Terms of service will be displayed here'),
          showArrow: true,
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => Alert.alert('About', 'VisionX Recruiter App v1.0.0'),
          showArrow: true,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user.fullName || user.username).charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.userName}>{user.fullName || user.username}</Text>
        <Text style={styles.userEmail}>{user.email || 'No email provided'}</Text>
        <Text style={styles.userType}>Recruiter</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={16} color="#3b82f6" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.settingsItem}
              onPress={item.onPress}
              disabled={item.isSwitch}
            >
              <View style={styles.itemLeft}>
                <View style={styles.itemIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#3b82f6" />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              <View style={styles.itemRight}>
                {item.isSwitch ? (
                  <Switch
                    value={item.switchValue}
                    onValueChange={item.onPress}
                    trackColor={{ false: '#334155', true: '#1e40af' }}
                    thumbColor={item.switchValue ? '#3b82f6' : '#64748b'}
                  />
                ) : item.showArrow ? (
                  <Ionicons name="chevron-forward" size={20} color="#64748b" />
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditProfile(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={profileData.fullName}
                  onChangeText={(value) => setProfileData(prev => ({ ...prev, fullName: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={profileData.email}
                  onChangeText={(value) => setProfileData(prev => ({ ...prev, email: value }))}
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your company name"
                  value={profileData.company}
                  onChangeText={(value) => setProfileData(prev => ({ ...prev, company: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Position</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your job title"
                  value={profileData.position}
                  onChangeText={(value) => setProfileData(prev => ({ ...prev, position: value }))}
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={profileData.phone}
                  onChangeText={(value) => setProfileData(prev => ({ ...prev, phone: value }))}
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSaveProfile}>
                <Text style={styles.submitButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowChangePassword(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  value={passwordData.currentPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, currentPassword: value }))}
                  placeholderTextColor="#64748b"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, newPassword: value }))}
                  placeholderTextColor="#64748b"
                  secureTextEntry
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChangeText={(value) => setPasswordData(prev => ({ ...prev, confirmPassword: value }))}
                  placeholderTextColor="#64748b"
                  secureTextEntry
                />
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSavePassword}>
                <Text style={styles.submitButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacySettings}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacySettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <TouchableOpacity onPress={() => setShowPrivacySettings(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Profile Visibility</Text>
                <View style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>
                    {getVisibilityLabel(privacySettings.profileVisibility)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#64748b" />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Info Visibility</Text>
                <View style={styles.pickerButton}>
                  <Text style={styles.pickerButtonText}>
                    {getVisibilityLabel(privacySettings.contactInfoVisibility)}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#64748b" />
                </View>
              </View>
              
              <View style={styles.switchGroup}>
                <View style={styles.switchItem}>
                  <Text style={styles.switchLabel}>Share Analytics Data</Text>
                  <Switch
                    value={privacySettings.analyticsSharing}
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, analyticsSharing: value }))}
                    trackColor={{ false: '#334155', true: '#1e40af' }}
                    thumbColor={privacySettings.analyticsSharing ? '#3b82f6' : '#64748b'}
                  />
                </View>
                
                <View style={styles.switchItem}>
                  <Text style={styles.switchLabel}>Marketing Emails</Text>
                  <Switch
                    value={privacySettings.marketingEmails}
                    onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, marketingEmails: value }))}
                    trackColor={{ false: '#334155', true: '#1e40af' }}
                    thumbColor={privacySettings.marketingEmails ? '#3b82f6' : '#64748b'}
                  />
                </View>
              </View>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSavePrivacy}>
                <Text style={styles.submitButtonText}>Save Privacy Settings</Text>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 8,
  },
  userType: {
    fontSize: 14,
    color: '#64748b',
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  editButtonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e40af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  itemRight: {
    marginLeft: 12,
  },
  logoutSection: {
    padding: 20,
    paddingTop: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
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
  switchGroup: {
    marginBottom: 20,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
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

export default RecruiterSettings;
