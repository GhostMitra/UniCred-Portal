import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { User } from '../../types';

type ProfileRouteProp = RouteProp<{ Profile: { user: User; onLogout: () => void } }, 'Profile'>;

interface ProfileItem {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  showArrow: boolean;
  isSwitch?: boolean;
  switchValue?: boolean;
}

const Profile: React.FC = () => {
  const route = useRoute<ProfileRouteProp>();
  const { user, onLogout } = route.params;

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'This feature will be implemented soon!');
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be implemented soon!');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'This feature will be implemented soon!');
  };

  const handleHelpSupport = () => {
    Alert.alert('Help & Support', 'This feature will be implemented soon!');
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

  const profileSections: { title: string; items: ProfileItem[] }[] = [
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
          title: 'Notifications',
          subtitle: 'Manage notification preferences',
          onPress: () => setNotificationsEnabled(!notificationsEnabled),
          showArrow: false,
          isSwitch: true,
          switchValue: notificationsEnabled,
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
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help & Support',
          subtitle: 'Get help and contact support',
          onPress: handleHelpSupport,
          showArrow: true,
        },
        {
          icon: 'information-circle-outline',
          title: 'About',
          subtitle: 'App version and information',
          onPress: () => Alert.alert('About', 'VisionX App v1.0.0'),
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
        <Text style={styles.userType}>{user.accessType}</Text>
        
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Ionicons name="pencil" size={16} color="#3b82f6" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Sections */}
      {profileSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={styles.profileItem}
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
  profileItem: {
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
});

export default Profile;
