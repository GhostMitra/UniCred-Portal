import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginPage from './src/components/LoginPage';
import SignupPage from './src/components/SignupPage';
import StudentPortal from './src/components/StudentPortal';
import RecruiterPortal from './src/components/RecruiterPortal';
import UniversityPortal from './src/components/UniversityPortal';
import { User, SignupData } from './src/types';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleSignup = (signupData: SignupData) => {
    // After successful signup, navigate back to login
    // The user will need to login with their new credentials
  };

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login">
              {props => (
                <LoginPage 
                  {...props} 
                  onLogin={handleLogin} 
                  onNavigateToSignup={() => props.navigation.navigate('Signup')}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Signup">
              {props => (
                <SignupPage 
                  {...props} 
                  onSignup={handleSignup}
                  onBackToLogin={() => props.navigation.navigate('Login')}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            {user.accessType === 'student' && (
              <Stack.Screen name="StudentPortal">
                {props => <StudentPortal {...props} user={user} onLogout={handleLogout} />}
              </Stack.Screen>
            )}
            {user.accessType === 'recruiter' && (
              <Stack.Screen name="RecruiterPortal">
                {props => <RecruiterPortal {...props} user={user} onLogout={handleLogout} />}
              </Stack.Screen>
            )}
            {user.accessType === 'university' && (
              <Stack.Screen name="UniversityPortal">
                {props => <UniversityPortal {...props} user={user} onLogout={handleLogout} />}
              </Stack.Screen>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
