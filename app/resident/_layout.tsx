import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Bell, Calendar, Home, MessageCircle, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { ResidentDrawerMenu } from '../../components/ResidentDrawerMenu';
import { MenuProvider, useMenu } from '../../contexts/MenuContext';
import { useTheme } from '../../hooks/useTheme';
import { getUnreadNotificationsCount } from '../../services/apiService';
import AuthService from '../../services/authService';

function ResidentTabLayoutContent() {
  const { isMenuVisible, toggleMenu } = useMenu();
  const [notificationCount, setNotificationCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const { colors } = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.fetchUserProfile();

      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    const fetchNotificationCount = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const count = await getUnreadNotificationsCount(userId);
          setNotificationCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    fetchUserData();
    fetchNotificationCount();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle={colors.background === '#c9c9c9ff' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surfaceSecondary,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
      })}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="amenities"
          options={{
            title: 'Équipements',
            tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          }}/>
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Notifications',
            tabBarIcon: ({ color, size }) => (
              <View>
                <Bell size={size} color={color} />
                {notificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{notificationCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}/>
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chat',
            tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
          }}/>
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
          }}/>

        {/* Hide visitor routes from tab navigation */}
        <Tabs.Screen
          name="visitors/add_visitors"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="visitors/my_qrcodes"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="visitors/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="visitors/my_visitors"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="visitors/details/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        {/* Hide edit_profile and notification_preferences from tab navigation */}
        <Tabs.Screen
          name="edit_profile"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="notification_preferences"
          options={{
            href: null,
          }}
        />

        {/* Hide amenity_booking from tab navigation */}
        <Tabs.Screen
          name="amenities/amenity_booking"
          options={{
            href: null,
          }}
        />



        {/* Masquer l'écran de depanange de la navigation à l'onglet */}
         <Tabs.Screen
          name="depanage/depanage"
          options={{
            href: null,
            headerShown: false,
          }}
        />
         <Tabs.Screen
          name="depanage/RepairScreen"
          options={{
            href: null,
            
          }}
        />


      </Tabs>
      <ResidentDrawerMenu isVisible={isMenuVisible} onClose={toggleMenu} />
      </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default function ResidentTabLayout() {
  return (
    <MenuProvider>
      <ResidentTabLayoutContent />
    </MenuProvider>
  );
}
