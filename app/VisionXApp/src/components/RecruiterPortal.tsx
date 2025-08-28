import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import RecruiterDashboard from './recruiter/RecruiterDashboard';
import CredentialVerification from './recruiter/CredentialVerification';
import RecruiterSettings from './recruiter/RecruiterSettings';
import { User } from '../types';

const Tab = createBottomTabNavigator();

interface RecruiterPortalProps {
  user: User;
  onLogout: () => void;
}

const RecruiterPortal: React.FC<RecruiterPortalProps> = ({ user, onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Verification') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
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
        component={RecruiterDashboard}
        options={{ title: 'Dashboard' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Verification" 
        component={CredentialVerification}
        options={{ title: 'Credential Verification' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Settings" 
        component={RecruiterSettings}
        options={{ title: 'Settings' }}
        initialParams={{ user, onLogout }}
      />
    </Tab.Navigator>
  );
};

export default RecruiterPortal;
