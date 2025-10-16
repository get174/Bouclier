import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Bell, ChevronRight, HelpCircle, Home, LogOut, Shield, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import AuthService from '../../services/authService';
import { API_BASE_URL } from '../../constants/Config';

interface SettingItem {
  icon: React.ElementType;
  label: string;
  link?: string;
  action?: string;
}

const getSettingsSections = (isDark: boolean): { title: string; items: SettingItem[] }[] => [
  {
    title: 'Apparence',
    items: [
      { icon: isDark ? Bell : Home, label: 'Mode sombre', action: 'toggleTheme' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { icon: User, label: 'Paramètres du profil', link: '/resident/edit_profile' },
      { icon: Home, label: 'Détails de résidence', link: '/resident/settings' }, // Placeholder link
      { icon: Bell, label: 'Préférences de notification', link: '/resident/notification_preferences' },
    ],
  },
  {
    title: 'Sécurité',
    items: [
      { icon: Shield, label: 'Paramètres de confidentialité', link: '/resident/settings' }, // Placeholder link
      { icon: User, label: 'Membres de la famille autorisés', link: '/resident/visitors/my_visitors' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Aide & FAQs', link: '/resident/settings' }, // Placeholder link
      { icon: LogOut, label: 'Déconnexion', action: 'logout' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, themeMode, setThemeMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [blockName, setBlockName] = useState('');
  const [buildingName, setBuildingName] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authService = AuthService;
        const profile = await authService.fetchUserProfile();
        if (profile) {
          setFullName(profile.fullName || '');
          if (profile.appartementId) {
            const headers = await authService.getAuthenticatedHeaders();
            const response = await fetch(`${API_BASE_URL}/api/apartments/${profile.appartementId}`, {
              method: 'GET',
              headers,
            });
            if (response.ok) {
              const data = await response.json();
              console.log('Apartment data (settings):', data);
              if (data.success && data.apartment) {
                setApartmentNumber(data.apartment.number || '');
                setBlockName(data.apartment.blockName || '');
                console.log('Apartment state set (settings):', data.apartment.number, data.apartment.blockName);
              }
            }
          }
          if (profile.buildingId) {
            const headers = await authService.getAuthenticatedHeaders();
            const response = await fetch(`${API_BASE_URL}/api/buildings/${profile.buildingId}`, {
              method: 'GET',
              headers,
            });
            if (response.ok) {
              const data = await response.json();
              console.log('Building data (settings):', data);
              if (data.success && data.building) {
                setBuildingName(data.building.name || '');
                console.log('Building state set (settings):', data.building.name);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        Alert.alert("Erreur", "Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('refreshToken');
      router.replace('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
      Alert.alert("Erreur", "La déconnexion a échoué. Veuillez réessayer.");
    }
  };

  const handlePress = (item: SettingItem) => {
    if (item.action === 'logout') {
      Alert.alert(
        "Déconnexion",
        "Êtes-vous sûr de vouloir vous déconnecter ?",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Confirmer", onPress: handleLogout, style: "destructive" },
        ]
      );
    } else if (item.action === 'toggleTheme') {
      toggleTheme();
    } else if (item.link) {
      router.push(item.link as any);
    }
  };

  const dynamicStyles = styles(colors);

  return (
    <ScrollView style={dynamicStyles.container}>
      <LinearGradient
        colors={['#0f766e', '#0d9488']}
        style={dynamicStyles.profileHeader}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <>
            <View style={dynamicStyles.profileImageContainer}>
              <View style={dynamicStyles.profileImage}>
                <Text style={dynamicStyles.profileInitials}>{fullName ? fullName.charAt(0) : ''}</Text>
              </View>
            </View>
            <View style={dynamicStyles.profileInfo}>
              <Text style={dynamicStyles.profileName}>{fullName}</Text>
              <Text style={dynamicStyles.profileUnit}>
                {buildingName} {blockName && `- ${blockName}`} {apartmentNumber && `- Apt ${apartmentNumber}`}
              </Text>
            </View>
          </>
        )}
      </LinearGradient>

      {getSettingsSections(themeMode === 'dark').map((section, index) => (
        <View key={index} style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>{section.title}</Text>
          <View style={dynamicStyles.sectionContent}>
            {section.items.map((item, itemIndex) => {
              const Icon = item.icon;
              const isLastItem = itemIndex === section.items.length - 1;
              return (
                <Pressable
                  key={itemIndex}
                  style={[dynamicStyles.settingItem, isLastItem && dynamicStyles.noBorder]}
                  onPress={() => handlePress(item)}
                >
                  <View style={dynamicStyles.settingItemLeft}>
                    <Icon size={20} color={colors.secondary} />
                    <Text style={dynamicStyles.settingItemLabel}>{item.label}</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  profileHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 220, // Hauteur minimale pour accommoder l'indicateur de chargement
    justifyContent: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.surfaceSecondary,
    elevation: 5,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileUnit: {
    fontSize: 15,
    color: colors.text,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  sectionContent: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
});
