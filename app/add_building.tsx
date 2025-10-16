import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { ArrowLeft, Phone } from 'lucide-react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../constants/Config';
import { useCustomAlert } from '../contexts/AlertContext';

const communes = ['Gombe', 'Limete', 'Ngaliema', 'Kintambo', 'Binza'];
const functions = ['Gardien', 'Gestionnaire', 'Président de COPRO', 'Autre'];

export default function AddBuilding() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();

  const [responsibleName, setResponsibleName] = useState('');
  const [countryCode, setCountryCode] = useState('+243');
  const [contactNumber, setContactNumber] = useState('');
  const [responsibleFunction, setResponsibleFunction] = useState(functions[0]);
  const [buildingName, setBuildingName] = useState('');
  const [commune, setCommune] = useState(communes[0]);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 10) {
      setContactNumber(cleaned);
    }
  };

  const validateForm = () => {
    if (!responsibleName.trim()) {
      showAlert('Erreur', 'Le nom du responsable est obligatoire', 'error');
      return false;
    }
    if (!contactNumber.trim()) {
      showAlert('Erreur', 'Le numéro de contact est obligatoire', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const token = await SecureStore.getItemAsync('userToken');
      
      if (!token) {
        showAlert('Erreur', 'Vous devez être connecté pour ajouter un immeuble', 'error');
        return;
      }

      const data = {
        responsibleName,
        contactNumber: countryCode + contactNumber,
        responsibleFunction,
        buildingName,
        commune,
      };
      
      const res = await fetch(`${API_BASE_URL}/buildings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement');
      }

      const result = await res.json();
      console.log('Immeuble ajouté:', result);
      
      showAlert('Succès', 'Immeuble enregistré avec succès', 'success');
      router.back();
    } catch (err) {
      console.error('Erreur:', err);
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      showAlert('Erreur', errorMessage, 'error');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="red" />
            </TouchableOpacity>
            <Text style={styles.title}>Enregistrer un immeuble</Text>
          </View>

          <View style={styles.banner}>
            <Image
              source={require('../assets/images/buildings.png')}
              style={styles.bannerImage}
              resizeMode="contain"
            />
            <Text style={styles.bannerText}>
              Envie d&apos;enregistrer votre immeuble sur Bouclier ? Recommandez-le et facilitez la sécurité de vos résidents.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nom du responsable de l&apos;immeuble *</Text>
            <TextInput
              style={styles.input}
              value={responsibleName}
              onChangeText={setResponsibleName}
              placeholder="Entrez le nom du responsable"
              placeholderTextColor="#94a3b8"
              returnKeyType="next"
            />

            <Text style={styles.label}>Numéro de contact *</Text>
            <View style={styles.contactContainer}>
              <RNPickerSelect
                onValueChange={(itemValue: string) => setCountryCode(itemValue)}
                items={[
                  { label: '+243', value: '+243' },
                  { label: '+1', value: '+1' },
                  { label: '+33', value: '+33' },
                ]}
                value={countryCode}
                style={pickerSelectStyles}
                useNativeAndroidPickerStyle={false}
              />
              <TextInput
                style={styles.contactInput}
                value={contactNumber}
                onChangeText={handleChange}
                placeholder="Entrez le numéro"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
                returnKeyType="next"
              />
              <Phone size={10} color="#64748b" style={styles.addressIcon} />
            </View>

            <Text style={styles.label}>Fonction du responsable</Text>
            <RNPickerSelect
              onValueChange={(itemValue: string) => setResponsibleFunction(itemValue)}
              items={functions.map((func) => ({ label: func, value: func }))}
              value={responsibleFunction}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />

            <Text style={styles.label}>Nom de l&apos;immeuble</Text>
            <TextInput
              style={styles.input}
              value={buildingName}
              onChangeText={setBuildingName}
              placeholder="Entrez le nom de l&apos;immeuble"
              placeholderTextColor="#94a3b8"
              returnKeyType="next"
            />

            <Text style={styles.label}>Commune / Quartier</Text>
            <RNPickerSelect
              onValueChange={(itemValue: string) => setCommune(itemValue)}
              items={communes.map((comm) => ({ label: comm, value: comm }))}
              value={commune}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Enregistrer maintenant</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  inputAndroid: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 46,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#f5f0e9',
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  bannerImage: {
    width: 60,
    height: 60,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: '#444444',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginLeft: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  addressIcon: {
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
