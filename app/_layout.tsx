import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AlertProvider } from '../contexts/AlertContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after the layout is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider>
      <AlertProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="role_select" />
          <Stack.Screen name="select_building" />
          <Stack.Screen name="select_building_security" />
          <Stack.Screen name="display_building" />
          <Stack.Screen name="display_building_security" />
          <Stack.Screen name="display_block" />
          <Stack.Screen name="display_flat" />
          <Stack.Screen name="add_building" />
          <Stack.Screen name="forgotPassword" />
          <Stack.Screen name="LoginOtp" />
          <Stack.Screen name="newpass" />
          <Stack.Screen name="securite" />
          <Stack.Screen name="resident" />
        </Stack>
      </AlertProvider>
    </ThemeProvider>
  );
}
