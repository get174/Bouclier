import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ResidentDrawerMenu } from '../../components/ResidentDrawerMenu';

// Interface pour le profil utilisateur
interface UserProfile {
  name: string;
  email: string;
  unit: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Remplacez par un appel API réel
        // const response = await apiService.get('/profile');
        // setProfile(response.data);
        // setName(response.data.name);

        // Données de simulation
        setTimeout(() => {
          const mockProfile: UserProfile = {
            name: 'Get',
            email: 'get@example.com',
            unit: 'Appartement A-101',
          };
          setProfile(mockProfile);
          setName(mockProfile.name);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error('Failed to fetch profile:', error);
        Alert.alert("Erreur", "Impossible de charger le profil.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Remplacez par un appel API réel pour mettre à jour le profil
      // await apiService.put('/profile', { name });

      // Simuler un délai réseau
      setTimeout(() => {
        setSaving(false);
        Alert.alert(
          'Profil mis à jour',
          'Vos informations ont été enregistrées avec succès.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }, 1000);

    } catch (error) {
      setSaving(false);
      console.error('Failed to save profile:', error);
      Alert.alert("Erreur", "Impossible d'enregistrer les modifications.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e293b" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Entrez votre nom complet"
        />

        <Text style={styles.label}>Adresse e-mail</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={profile?.email}
          editable={false}
        />

        <Text style={styles.label}>Appartement</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={profile?.unit}
          editable={false}
        />

        <Pressable style={styles.saveButton} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          )}
        </Pressable>
      </View>
      <ResidentDrawerMenu isVisible={isMenuVisible} onClose={toggleMenu} />
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 16,
    marginBottom: 20,
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
