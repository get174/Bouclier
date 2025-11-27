import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authService from '../services/authService';

const logo = require('../assets/images/logo.png');
const illustration = require('../assets/images/bouclier.png');
const image1 = require('../assets/images/image1.jpg');

const { width } = Dimensions.get('window');

export default function EntryScreen() {
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuthStatus = async () => {
        try {
          const token = await authService.getValidAccessToken();
          if (token) {
            // User is authenticated, check role and redirect accordingly
            const userRole = await authService.getUserRole();
            if (userRole === 'security') {
              router.replace('/securite');
            } else {
              router.replace('/resident/home');
            }
          } else {
            // No valid token, stay on the landing page (or redirect to login)
            setLoading(false);
          }
        } catch (error) {
          console.error("Auth check failed", error);
          setLoading(false); // Show page on error
        }
      };

      checkAuthStatus();
    }, [])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <HomeScreen />;
}

function HomeScreen() {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const images = [illustration, image1];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      setCurrentIndex(nextIndex);
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#F9FAFB',
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 30,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 120,
      height: 80,
    },
    illustrationContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    slider: {
      height: 300,
    },
    sliderContent: {
      alignItems: 'center',
    },
    illustration: {
      height: 350,
      marginBottom: 15,
    },
    paymentSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 20,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
      marginBottom: 30,
    },
    paymentTitle: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 10,
      color: '#111827',
      textAlign: 'center',
    },
    paymentSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 20,
      lineHeight: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#22C55E',
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 16,
    },
    bottomText: {
      fontSize: 12,
      color: '#6B7280',
      textAlign: 'center',
      marginBottom: 10,
    },
    linkText: {
      color: '#2563EB',
      textDecorationLine: 'underline',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.illustrationContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.slider}
            contentContainerStyle={styles.sliderContent}
          >
            {images.map((img, index) => (
              <Image key={index} source={img} style={[styles.illustration, { width }]} resizeMode="contain" />
            ))}
          </ScrollView>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Journal des Accès</Text>
          <Text style={styles.paymentSubtitle}>
            Grâce au journal des accès, les gardiens et les résidents peuvent consulter l&apos;historique des entrées et sorties dans l&apos;immeuble.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => Linking.openURL('https://example.com/terms')}>
          <Text style={[styles.bottomText, styles.linkText]}>
            En cliquant sur commencer, vous acceptez les conditions générales
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
