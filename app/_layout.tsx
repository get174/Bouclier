import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AlertProvider } from '../contexts/AlertContext';
import { ThemeProvider } from '../contexts/ThemeContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AlertProvider>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="LoginOtp" options={{ headerShown: false }} />
            <Stack.Screen name="newpass" options={{ headerShown: false }} />
            <Stack.Screen name="select_building" options={{ headerShown: false }} />
            <Stack.Screen name="add_building" options={{ headerShown: false }} />
            <Stack.Screen name="display_building" options={{ headerShown: false }} />
            <Stack.Screen name="display_block" options={{ headerShown: false }} />
            <Stack.Screen name="display_flat" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{headerShown:false}}/>
            <Stack.Screen name="securite" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </AlertProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
