import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  Clock,
  FileText,
  Package,
  QrCode,
  Save,
  User
} from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import { CreateDeliveryData, deliveryService } from '../../../services/deliveryService';
import AuthService from '../../../services/authService';

export default function AddDeliveryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userProfileLoading, setUserProfileLoading] = useState(true);
  const [userProfileError, setUserProfileError] = useState<string | null>(null);

  // Form state
  const [deliveryPersonName, setDeliveryPersonName] = useState('');
  const [packageType, setPackageType] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setUserProfileLoading(true);
        setUserProfileError(null);

        const userData = await AuthService.getUserData();
        if (!userData || !userData.buildingId || !userData.appartementId) {
          console.log('User profile incomplete, fetching from server...');
          await AuthService.fetchUserProfile();
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        setUserProfileError('Erreur lors du chargement du profil utilisateur');
      } finally {
        setUserProfileLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Vous devez autoriser l\'accès à la galerie pour ajouter une photo.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie');
    }
  };

  const handleSubmit = async () => {
    if (!deliveryPersonName.trim() || !packageType.trim()) {
      Alert.alert('Champs obligatoires', 'Veuillez remplir le nom du livreur et le type de colis.');
      return;
    }

    setLoading(true);

    try {
      // Create deliveryData object from form state
      const deliveryData: CreateDeliveryData = {
        deliveryPersonName: deliveryPersonName.trim(),
        packageType: packageType.trim(),
        estimatedTime: date.toISOString(),
        qrCode: qrCode.trim() || undefined,
        description: description.trim() || undefined,
        photo: photoUri || undefined,
      };

      await deliveryService.createDelivery(deliveryData);

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Livraison ajoutée avec succès !'
      });
      router.back();

    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue.';

      if (errorMessage.includes('SESSION_EXPIRED')) {
         Alert.alert(
            'Session expirée',
            'Votre session a expiré. Veuillez vous reconnecter.',
            [{ text: 'OK', onPress: () => router.replace('/login') }]
          );
      } else {
        Toast.show({
            type: 'error',
            text1: 'Erreur',
            text2: errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true);
  };

  // Show loading screen while user profile is loading
  if (userProfileLoading) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Stack.Screen
          options={{
            headerTitle: 'Nouvelle Livraison',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>Chargement du profil utilisateur...</Text>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Show error screen if user profile failed to load
  if (userProfileError) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Stack.Screen
          options={{
            headerTitle: 'Nouvelle Livraison',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
                <ArrowLeft size={24} color="#333" />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{userProfileError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setUserProfileError(null);
              // Reload user profile
              const loadUserProfile = async () => {
                try {
                  setUserProfileLoading(true);
                  const userData = await AuthService.getUserData();
                  if (!userData || !userData.buildingId || !userData.appartementId) {
                    await AuthService.fetchUserProfile();
                  }
                } catch (error) {
                  console.error('Error loading user profile:', error);
                  setUserProfileError('Erreur lors du chargement du profil utilisateur');
                } finally {
                  setUserProfileLoading(false);
                }
              };
              loadUserProfile();
            }}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerTitle: 'Nouvelle Livraison',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 10 }}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Nom du livreur */}
          <View style={styles.section}>
            <Text style={styles.label}>Nom du livreur *</Text>
            <View style={styles.inputContainer}>
              <User size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                value={deliveryPersonName}
                onChangeText={setDeliveryPersonName}
                placeholder="Ex: Jean Dupont"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Type de colis */}
          <View style={styles.section}>
            <Text style={styles.label}>Type de colis *</Text>
            <View style={styles.inputContainer}>
              <Package size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                value={packageType}
                onChangeText={setPackageType}
                placeholder="Ex: Colis, Lettre..."
              />
            </View>
          </View>

          {/* Heure estimée */}
          <View style={styles.section}>
            <Text style={styles.label}>Heure estimée *</Text>
            <TouchableOpacity onPress={showDatepicker} style={styles.inputContainer}>
                <Clock size={20} color="#64748b" />
                <Text style={styles.dateText}>{date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
            </TouchableOpacity>
          </View>

          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="datetime"
              is24Hour={true}
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Code QR */}
          <View style={styles.section}>
            <Text style={styles.label}>Code QR (optionnel)</Text>
            <View style={styles.inputContainer}>
              <QrCode size={20} color="#64748b" />
              <TextInput
                style={styles.input}
                value={qrCode}
                onChangeText={setQrCode}
                placeholder="Saisissez le code"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description (optionnel)</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#64748b" />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Notes supplémentaires..."
                multiline
              />
            </View>
          </View>

          {/* Photo */}
          <View style={styles.section}>
            <Text style={styles.label}>Photo (optionnel)</Text>
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
              <Camera size={20} color="#64748b" />
              <Text style={styles.imagePickerText}>
                {photoUri ? 'Changer la photo' : 'Ajouter une photo'}
              </Text>
            </TouchableOpacity>

            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.imagePreview} />
            ) : null}
          </View>

          {/* Bouton de soumission */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Save size={20} color="#ffffff" />
            <Text style={styles.submitButtonText}>
              {loading ? 'Ajout en cours...' : 'Ajouter la livraison'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#334155',
  },
  dateText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 20,
    gap: 8,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#64748b',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#e2e8f0',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0891b2',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0891b2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
