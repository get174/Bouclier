import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Camera,
  Image as ImageIcon,
  MoreHorizontal,
  Settings,
  Wrench,
  X,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

interface ProblemData {
  type: string;
  description: string;
  image?: string;
}

const problemTypes = [
  { id: 'plomberie', label: 'Plomberie', icon: Wrench },
  { id: 'electricite', label: 'Électricité', icon: Zap },
  { id: 'ascenseur', label: 'Ascenseur', icon: Settings },
  { id: 'autre', label: 'Autre', icon: MoreHorizontal },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 22,
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '45%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonSelected: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  typeButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
  },
  typeButtonTextSelected: {
    color: '#ffffff',
  },
  descriptionInput: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#64748b',
  },
  imagePreviewContainer: {
    marginTop: 12,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  imagePreviewOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  imagePreviewText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  submitSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default function DepanageScreen() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Formulaire
  const [selectedType, setSelectedType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la galerie est nécessaire pour ajouter des photos.');
      }

      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus.status !== 'granted') {
        Alert.alert('Permission requise', 'L\'accès à la caméra est nécessaire pour prendre des photos.');
      }
    }
  };

  const handleImagePicker = async () => {
    Alert.alert(
      'Sélection d\'image',
      'Choisissez une source',
      [
        {
          text: 'Caméra',
          onPress: () => pickImageFromCamera(),
        },
        {
          text: 'Galerie',
          onPress: () => pickImageFromLibrary(),
        },
        {
          text: 'Annuler',
          style: 'cancel',
        },
      ]
    );
  };

  const pickImageFromCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la caméra.');
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible d\'accéder à la galerie.');
    }
  };

  const removeImage = () => {
    setImage('');
  };

  const handleSubmit = async () => {
    if (!selectedType || !description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);

    try {
      const problemData: ProblemData = {
        type: selectedType,
        description: description.trim(),
        image: image || undefined,
      };

      // TODO: Envoyer les données au backend
      console.log('Données à envoyer:', problemData);

      // Simulation d'envoi
      setTimeout(() => {
        setSubmitting(false);
        Alert.alert(
          'Demande envoyée',
          'Votre demande de dépannage a été envoyée avec succès. Vous recevrez une notification dès qu\'un technicien sera assigné.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Réinitialiser le formulaire
                setSelectedType('');
                setDescription('');
                setImage('');
                router.back();
              }
            }
          ]
        );
      }, 1500);

    } catch (error) {
      setSubmitting(false);
      console.error('Erreur lors de l\'envoi:', error);
      Alert.alert('Erreur', 'Impossible d\'envoyer la demande. Veuillez réessayer.');
    }
  };

  const renderProblemTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Type de problème *</Text>
      <View style={styles.typeGrid}>
        {problemTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedType === type.id;

          return (
            <Pressable
              key={type.id}
              style={[
                styles.typeButton,
                isSelected && styles.typeButtonSelected
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Icon
                size={24}
                color={isSelected ? '#ffffff' : '#0891b2'}
              />
              <Text style={[
                styles.typeButtonText,
                isSelected && styles.typeButtonTextSelected
              ]}>
                {type.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const renderDescriptionField = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Description du problème *</Text>
      <TextInput
        style={styles.descriptionInput}
        value={description}
        onChangeText={setDescription}
        placeholder="Décrivez en détail le problème que vous rencontrez..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );

  const renderImagePicker = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Photo (optionnel)</Text>
      <Pressable style={styles.imagePickerButton} onPress={handleImagePicker}>
        <Camera size={20} color="#64748b" />
        <Text style={styles.imagePickerText}>
          {image ? 'Changer la photo' : 'Ajouter une photo'}
        </Text>
      </Pressable>

      {image && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <Pressable style={styles.removeImageButton} onPress={removeImage}>
            <X size={16} color="#ffffff" />
          </Pressable>
          <View style={styles.imagePreviewOverlay}>
            <ImageIcon size={16} color="#22C55E" />
            <Text style={styles.imagePreviewText}>Photo sélectionnée</Text>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Demande de dépannage</Text>
          <Text style={styles.subtitle}>
            Signalez un problème technique dans votre bâtiment
          </Text>
        </View>

        {renderProblemTypeSelector()}
        {renderDescriptionField()}
        {renderImagePicker()}

        <View style={styles.submitSection}>
          <Pressable
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
