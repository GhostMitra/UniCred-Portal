import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import UniversityDashboard from './university/UniversityDashboard';
import CredentialManagement from './university/CredentialManagement';
import StudentDirectory from './university/StudentDirectory';
import UniversitySettings from './university/UniversitySettings';
import { User } from '../types';

const Tab = createBottomTabNavigator();

interface UniversityPortalProps {
  user: User;
  onLogout: () => void;
}

const UniversityPortal: React.FC<UniversityPortalProps> = ({ user, onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Credentials') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Students') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
        },
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={UniversityDashboard}
        options={{ title: 'Dashboard' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Credentials" 
        component={CredentialManagement}
        options={{ title: 'Credential Management' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Students" 
        component={StudentDirectory}
        options={{ title: 'Student Directory' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Settings" 
        component={UniversitySettings}
        options={{ title: 'Settings' }}
        initialParams={{ user, onLogout }}
      />
    </Tab.Navigator>
  );
};

export default UniversityPortal;
