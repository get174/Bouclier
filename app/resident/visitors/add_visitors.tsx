import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';
import { ResidentHeader } from '../../../components/ResidentHeader';
import { useCustomAlert } from '../../../contexts/AlertContext';
import apiService from '../../../services/apiService';

interface Visitor {
  id: number;
  name: string;
  phone: string;
  image: string | null;
}

interface VisitorApiResponse {
  message: string;
  visitor: {
    id: string;
    name: string;
    accessId: string;
    validUntil: string;
  };
}

export default function AddVisitors() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [visitors, setVisitors] = useState<Visitor[]>([{ id: 1, name: '', phone: '', image: null }]);
  const [reason, setReason] = useState('');
  const [validUntil, setValidUntil] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const qrCodeRef = useRef<ViewShot>(null);

  const resetForm = useCallback(() => {
    setVisitors([{ id: 1, name: '', phone: '', image: null }]);
    setReason('');
    setValidUntil(new Date());
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm])
  );

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || validUntil;
    setShowDatePicker(Platform.OS === 'ios');
    setValidUntil(currentDate);
  };

  const handleVisitorChange = (id: number, field: keyof Omit<Visitor, 'id'>, value: string) => {
    setVisitors(currentVisitors =>
      currentVisitors.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addVisitor = () => {
    setVisitors(currentVisitors => [
      ...currentVisitors,
      { id: Date.now(), name: '', phone: '', image: null },
    ]);
  };

  const removeVisitor = (id: number) => {
    if (visitors.length > 1) {
      setVisitors(currentVisitors => currentVisitors.filter(v => v.id !== id));
    } else {
      showAlert('Action impossible', 'Vous devez avoir au moins un visiteur.', 'warning');
    }
  };

  const pickImage = async (visitorId: number) => {
    Alert.alert(
      'Ajouter une photo',
      'Choisissez une option',
      [
        { text: 'Prendre une photo', onPress: () => takePhoto(visitorId) },
        { text: 'Choisir depuis la galerie', onPress: () => pickFromGallery(visitorId) },
        { text: 'Annuler', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const takePhoto = async (visitorId: number) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission refusée', 'Désolé, nous avons besoin de la permission pour accéder à votre appareil photo.', 'error');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleVisitorChange(visitorId, 'image', result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors de la prise de photo:", error);
      showAlert('Erreur', 'Une erreur est survenue lors de l\'ouverture de l\'appareil photo.', 'error');
    }
  };

  const pickFromGallery = async (visitorId: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('Permission refusée', 'Désolé, nous avons besoin de la permission pour accéder à vos photos.', 'error');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        handleVisitorChange(visitorId, 'image', result.assets[0].uri);
      }
    } catch (error) {
      console.error("Erreur lors du choix depuis la galerie:", error);
      showAlert('Erreur', 'Une erreur est survenue lors de l\'ouverture de la galerie.', 'error');
    }
  };

  const handleSubmit = async () => {
    const firstVisitor = visitors[0];
    if (!firstVisitor || !firstVisitor.name) {
      showAlert('Erreur', 'Veuillez renseigner le nom du premier visiteur.', 'error');
      return;
    }

    const formData = new FormData();
    
    // Assuming the backend can handle an array of visitors
    // We stringify the visitors array and append it.
    // The backend will need to parse this string.
    formData.append('visitors', JSON.stringify(visitors.map(({id, ...rest}) => rest)));

    formData.append('reason', reason);
    formData.append('validUntil', validUntil.toISOString());

    // Append images separately
    visitors.forEach((visitor, index) => {
      if (visitor.image) {
        const uriParts = visitor.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append(`photo_${index}`, {
          uri: visitor.image,
          name: `photo_${index}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }
    });


    try {
      // The endpoint might need to be updated to handle multiple visitors, e.g., '/api/visitors/group'
      const response = await apiService.post<VisitorApiResponse>('/api/visitors/group', formData);

      if (response.data?.visitor?.accessId) {
        setQrCodeValue(response.data.visitor.accessId);
        setModalVisible(true);
      } else {
        showAlert('Erreur', 'La création du groupe de visiteurs a échoué. Réponse de l\'API invalide.', 'error');
      }
    } catch (error: any) {
      console.error(error);
      showAlert('Erreur', error.message || 'Une erreur est survenue lors de la création du visiteur.', 'error');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const shareQrCode = async () => {
    const viewShot = qrCodeRef.current;
    if (viewShot && viewShot.capture) {
      try {
        const uri = await viewShot.capture();
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Partager ce QR code',
        });
      } catch (error) {
        console.error("Erreur lors de la capture ou du partage du QR code:", error);
        showAlert('Erreur', 'Impossible de partager le QR code.', 'error');
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1 }}>
      <ResidentHeader
        title="Ajouter un visiteur"
        subtitle="Ajouter votre visiteur en toute simplicité"
        onMenuPress={() => {}}
        showBackButton={true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      >
        <ScrollView style={styles.container}>
          <View style={styles.formContainer}>
          {visitors.map((visitor, index) => (
            <View key={visitor.id} style={styles.visitorContainer}>
               <View style={styles.visitorHeader}>
                <Text style={styles.visitorTitle}>Visiteur {index + 1}</Text>
                {visitors.length > 1 && (
                  <TouchableOpacity onPress={() => removeVisitor(visitor.id)}>
                    <Ionicons name="trash-outline" size={22} color="#ff3b30" />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom complet *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrez le nom complet"
                  value={visitor.name}
                  onChangeText={(text) => handleVisitorChange(visitor.id, 'name', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Entrez le numéro de téléphone"
                  value={visitor.phone}
                  onChangeText={(text) => handleVisitorChange(visitor.id, 'phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Photo (optionnel)</Text>
                <TouchableOpacity style={styles.photoButton} onPress={() => pickImage(visitor.id)}>
                  {visitor.image ? (
                    <Image source={{ uri: visitor.image }} style={styles.photoPreview} />
                  ) : (
                    <View style={styles.photoPlaceholder}>
                      <Ionicons name="camera-outline" size={30} color="#666" />
                      <Text style={styles.photoText}>Ajouter une photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addVisitor}>
            <Ionicons name="add-circle-outline" size={22} color="#007AFF" />
            <Text style={styles.addButtonText}>Ajouter un autre visiteur</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Valide jusqu&apos;au *</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <View style={styles.input}>
                <Text style={styles.inputText}>{formatDate(validUntil)}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={validUntil}
              mode="datetime"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raison de la visite</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez la raison de la visite"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Générer QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>QR Code Visiteur</Text>
            {qrCodeValue && (
               <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 0.9 }}>
                    <QRCode
                    value={qrCodeValue}
                    size={200}
                    />
              </ViewShot>
            )}
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={shareQrCode}
              >
                <Text style={styles.textStyle}>Partager</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    container: {
      flex: 1,
    },
    formContainer: {
      padding: 20,
    },
    visitorContainer: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: '#e0e0e0',
    },
    visitorHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    visitorTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#007AFF',
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#eaf4ff',
      marginBottom: 20,
    },
    addButtonText: {
      marginLeft: 8,
      fontSize: 16,
      fontWeight: '600',
      color: '#007AFF',
    },
    separator: {
      height: 1,
      backgroundColor: '#ddd',
      marginVertical: 10,
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 5,
    },
    input: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      fontSize: 16,
      color: '#333',
      justifyContent: 'center',
    },
    inputText: {
      fontSize: 16,
      color: '#333',
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    photoButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      height: 150,
    },
    photoPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    photoText: {
      marginTop: 8,
      fontSize: 14,
      color: '#666',
    },
    photoPreview: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 12,
    },
    button: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#f0f0f0',
      borderWidth: 1,
      borderColor: '#ddd',
    },
    submitButton: {
      backgroundColor: '#007AFF',
    },
    cancelButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
    },
    shareButton: {
      backgroundColor: '#2196F3',
      marginTop: 0,
      width: 120,
      paddingVertical: 10,
      marginRight: 10,
    },
    closeButton: {
      backgroundColor: '#f44336',
      marginTop: 0,
      width: 120,
      paddingVertical: 10,
    },
    modalButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 15,
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
