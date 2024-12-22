// Navigation pour les pages d'authentification

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from '../views/auth/auth'; // Import unique de la page auth

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="auth" screenOptions={{ headerShown: false }}>
      {/* Route unique pour la page auth */}
      <Stack.Screen name="auth" component={Auth} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;

