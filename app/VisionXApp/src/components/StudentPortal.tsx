import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from './student/Dashboard';
import Credentials from './student/Credentials';
import Profile from './student/Profile';
import { User } from '../types';

type TabParamList = {
  Dashboard: { user: User };
  Credentials: { user: User };
  Profile: { user: User; onLogout: () => void };
};

const Tab = createBottomTabNavigator<TabParamList>();

interface StudentPortalProps {
  user: User;
  onLogout: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ user, onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Credentials') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
        component={Dashboard}
        options={{ title: 'Dashboard' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Credentials" 
        component={Credentials}
        options={{ title: 'My Credentials' }}
        initialParams={{ user }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{ title: 'Profile' }}
        initialParams={{ user, onLogout }}
      />
    </Tab.Navigator>
  );
};

export default StudentPortal;
