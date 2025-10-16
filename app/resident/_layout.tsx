import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs } from 'expo-router';
import { Bell, Calendar, Home, MessageCircle, Settings } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { ResidentDrawerMenu } from '../../components/ResidentDrawerMenu';
import { ResidentHeader } from '../../components/ResidentHeader';
import { useTheme } from '../../hooks/useTheme';
import { getUnreadNotificationsCount } from '../../services/apiService';
import AuthService from '../../services/authService';

export default function ResidentTabLayout() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [fullName, setFullName] = useState('');
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AuthService.fetchUserProfile();
        if (userData && userData.fullName) {
          setFullName(userData.fullName);
        }
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
        barStyle={colors.background === '#151718' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.primary}
      />
      <Tabs
        screenOptions={({ route }) => ({
          header: () => {
            let title = '';
            let subtitle = '';
            // Customize title and subtitle based on route name
            if (route.name === 'home') {
              title = `Bonjour ${fullName || 'Get'}`;
              subtitle = 'Que veux-tu faire aujourd\'hui ?';
            } else if (route.name === 'amenities') {
              title = 'Équipements';
              subtitle = 'Réserver et gérer les installations';
            } else if (route.name === 'notifications') {
                title = 'Notifications';
                subtitle = 'Restez à jour';
            } else if (route.name === 'chat') {
                title = 'Chat';
                subtitle = 'Discutez avec la communauté';
            } else if (route.name === 'settings') {
                title = 'Paramètres';
                subtitle = 'Gérez votre profil';
            }

            return (
              <ResidentHeader
                title={title}
                subtitle={subtitle}
                onMenuPress={toggleMenu}
              />
            );
          },
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

        {/* Hide payment screen from tab navigation */}
        <Tabs.Screen
          name="paiment/PaymentsScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="paiment/PaymentDetailsScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="paiment/AddPaymentScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="paiment/PaymentHistoryScreen"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="paiment/paymentCard"
          options={{
            href: null,
          }}
        />
         <Tabs.Screen
          name="paiment/payment_processing"
          options={{
            href: null,
          }}
        />
         <Tabs.Screen
          name="paiment/payments"
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
        {/* Masquer l'écran de livraison de la navigation à l'onglet */}
         <Tabs.Screen
          name="livraison/DeliveriesListScreen"
          options={{
            href: null,
            headerShown: false,
          }}
        />
         <Tabs.Screen
          name="livraison/DeliveryScreen"
          options={{
            href: null,
          }}
        />
         <Tabs.Screen
          name="livraison/AddDeliveryScreen"
          options={{
            href: null,
            headerShown: false,
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
