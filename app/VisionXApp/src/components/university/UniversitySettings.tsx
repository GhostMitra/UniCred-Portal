import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User } from '../../types';

type UniversitySettingsRouteProp = RouteProp<{ Settings: { user: User; onLogout: () => void } }, 'Settings'>;

const UniversitySettings: React.FC = () => {
  const route = useRoute<UniversitySettingsRouteProp>();
  const { user, onLogout } = route.params;

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoVerification, setAutoVerification] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showUniversityModal, setShowUniversityModal] = useState(false);

  const [profileData, setProfileData] = useState({
    universityName: 'VisionX University',
    address: '123 University Ave, City, State 12345',
    phone: '+1-555-0123',
    email: 'admin@visionx.edu',
    website: 'www.visionx.edu',
    accreditation: 'Regional Accreditation Board',
    founded: '1995',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareStudentData: false,
    publicDirectory: true,
    analyticsCollection: true,
    thirdPartySharing: false,
  });

  const [universitySettings, setUniversitySettings] = useState({
    academicYear: '2024-2025',
    semesterSystem: 'Fall/Spring/Summer',
    gradingScale: 'A-F (4.0 scale)',
    maxCreditsPerSemester: '18',
    graduationRequirements: '120 credits minimum',
    transferPolicy: 'Up to 60 credits from accredited institutions',
  });

  const handleSaveProfile = () => {
    Alert.alert('Success', 'University profile updated successfully!');
    setShowProfileModal(false);
  };

  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      Alert.alert('Error', 'New password must be at least 8 characters long');
      return;
    }

    Alert.alert('Success', 'Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordModal(false);
  };

  const handleSavePrivacy = () => {
    Alert.alert('Success', 'Privacy settings updated successfully!');
    setShowPrivacyModal(false);
  };

  const handleSaveUniversity = () => {
    Alert.alert('Success', 'University settings updated successfully!');
    setShowUniversityModal(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'General Settings',
      items: [
        {
          icon: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications about important updates',
          isSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          icon: 'mail',
          title: 'Email Alerts',
          subtitle: 'Get email notifications for critical events',
          isSwitch: true,
          switchValue: emailAlerts,
          onSwitchChange: setEmailAlerts,
        },
        {
          icon: 'moon',
          title: 'Dark Mode',
          subtitle: 'Use dark theme throughout the app',
          isSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
        {
          icon: 'shield-checkmark',
          title: 'Auto-Verification',
          subtitle: 'Automatically verify credentials when possible',
          isSwitch: true,
          switchValue: autoVerification,
          onSwitchChange: setAutoVerification,
        },
      ],
    },
    {
      title: 'University Management',
      items: [
        {
          icon: 'business',
          title: 'University Profile',
          subtitle: 'Manage university information and details',
          onPress: () => setShowUniversityModal(true),
          showArrow: true,
        },
        {
          icon: 'school',
          title: 'Academic Settings',
          subtitle: 'Configure academic policies and requirements',
          onPress: () => Alert.alert('Info', 'Academic settings feature coming soon'),
          showArrow: true,
        },
        {
          icon: 'people',
          title: 'Faculty Management',
          subtitle: 'Manage faculty members and advisors',
          onPress: () => Alert.alert('Info', 'Faculty management feature coming soon'),
          showArrow: true,
        },
        {
          icon: 'analytics',
          title: 'Reports & Analytics',
          subtitle: 'View institutional reports and statistics',
          onPress: () => Alert.alert('Info', 'Reports feature coming soon'),
          showArrow: true,
        },
      ],
    },
    {
      title: 'Account & Security',
      items: [
        {
          icon: 'person',
          title: 'Edit Profile',
          subtitle: 'Update your personal information',
          onPress: () => setShowProfileModal(true),
          showArrow: true,
        },
        {
          icon: 'lock-closed',
          title: 'Change Password',
          subtitle: 'Update your account password',
          onPress: () => setShowPasswordModal(true),
          showArrow: true,
        },
        {
          icon: 'shield',
          title: 'Privacy Settings',
          subtitle: 'Manage data sharing and privacy preferences',
          onPress: () => setShowPrivacyModal(true),
          showArrow: true,
        },
        {
          icon: 'log-out',
          title: 'Logout',
          subtitle: 'Sign out of your account',
          onPress: handleLogout,
          showArrow: false,
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your university preferences</Text>
      </View>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.settingItem}
              onPress={item.onPress}
              disabled={item.isSwitch}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={24} color="#3b82f6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
              {item.isSwitch ? (
                <Switch
                  value={item.switchValue}
                  onValueChange={item.onSwitchChange}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={item.switchValue ? '#ffffff' : '#64748b'}
                />
              ) : item.showArrow ? (
                <Ionicons name="chevron-forward" size={20} color="#64748b" />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* University Profile Modal */}
      <Modal
        visible={showUniversityModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUniversityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>University Profile</Text>
              <TouchableOpacity onPress={() => setShowUniversityModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <View style={styles.formField}>
                <Text style={styles.formLabel}>University Name</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.universityName}
                  onChangeText={(text) => setProfileData({ ...profileData, universityName: text })}
                  placeholder="Enter university name"
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.address}
                  onChangeText={(text) => setProfileData({ ...profileData, address: text })}
                  placeholder="Enter university address"
                  placeholderTextColor="#64748b"
                  multiline
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                  placeholder="Enter phone number"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                  placeholder="Enter email address"
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Website</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.website}
                  onChangeText={(text) => setProfileData({ ...profileData, website: text })}
                  placeholder="Enter website URL"
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Accreditation</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.accreditation}
                  onChangeText={(text) => setProfileData({ ...profileData, accreditation: text })}
                  placeholder="Enter accreditation body"
                  placeholderTextColor="#64748b"
                />
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Founded Year</Text>
                <TextInput
                  style={styles.formInput}
                  value={profileData.founded}
                  onChangeText={(text) => setProfileData({ ...profileData, founded: text })}
                  placeholder="Enter founding year"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowUniversityModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveUniversity}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Current Password</Text>
              <TextInput
                style={styles.formInput}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                placeholder="Enter current password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>New Password</Text>
              <TextInput
                style={styles.formInput}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                placeholder="Enter new password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.formInput}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                placeholder="Confirm new password"
                placeholderTextColor="#64748b"
                secureTextEntry
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveButtonText}>Change Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Privacy Settings Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Settings</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.privacySection}>
              <Text style={styles.privacySectionTitle}>Data Sharing</Text>
              
              <View style={styles.privacyItem}>
                <View style={styles.privacyItemContent}>
                  <Text style={styles.privacyItemTitle}>Share Student Data</Text>
                  <Text style={styles.privacyItemSubtitle}>Allow sharing of student information with partners</Text>
                </View>
                <Switch
                  value={privacySettings.shareStudentData}
                  onValueChange={(value) => setPrivacySettings({ ...privacySettings, shareStudentData: value })}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={privacySettings.shareStudentData ? '#ffffff' : '#64748b'}
                />
              </View>
              
              <View style={styles.privacyItem}>
                <View style={styles.privacyItemContent}>
                  <Text style={styles.privacyItemTitle}>Public Directory</Text>
                  <Text style={styles.privacyItemSubtitle}>Show university in public directories</Text>
                </View>
                <Switch
                  value={privacySettings.publicDirectory}
                  onValueChange={(value) => setPrivacySettings({ ...privacySettings, publicDirectory: value })}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={privacySettings.publicDirectory ? '#ffffff' : '#64748b'}
                />
              </View>
              
              <View style={styles.privacyItem}>
                <View style={styles.privacyItemContent}>
                  <Text style={styles.privacyItemTitle}>Analytics Collection</Text>
                  <Text style={styles.privacyItemSubtitle}>Collect usage analytics for improvement</Text>
                </View>
                <Switch
                  value={privacySettings.analyticsCollection}
                  onValueChange={(value) => setPrivacySettings({ ...privacySettings, analyticsCollection: value })}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={privacySettings.analyticsCollection ? '#ffffff' : '#64748b'}
                />
              </View>
              
              <View style={styles.privacyItem}>
                <View style={styles.privacyItemContent}>
                  <Text style={styles.privacyItemTitle}>Third-Party Sharing</Text>
                  <Text style={styles.privacyItemSubtitle}>Allow data sharing with third-party services</Text>
                </View>
                <Switch
                  value={privacySettings.thirdPartySharing}
                  onValueChange={(value) => setPrivacySettings({ ...privacySettings, thirdPartySharing: value })}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={privacySettings.thirdPartySharing ? '#ffffff' : '#64748b'}
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowPrivacyModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSavePrivacy}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
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
  modalScroll: {
    maxHeight: 400,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  privacySection: {
    marginBottom: 20,
  },
  privacySectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  privacyItemContent: {
    flex: 1,
    marginRight: 16,
  },
  privacyItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  privacyItemSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default UniversitySettings;
