import { useRouter } from 'expo-router';
import { Shield, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCustomAlert } from '../contexts/AlertContext';
import apiService from '../services/apiService';

const RoleSelectScreen = () => {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(''); // 'resident' or 'security'
  const router = useRouter();
  const { showAlert } = useCustomAlert();

  const handleSubmit = async () => {
    if (!fullName.trim() || !role) {
      showAlert('Erreur', 'Veuillez saisir votre nom complet et sélectionner un rôle.', 'error');
      return;
    }

    try {
      await apiService.updateProfile(fullName, role);

      showAlert('Succès', 'Votre profil a été mis à jour.', 'success');

      if (role === 'resident') {
        router.replace('/select_building');
      } else if (role === 'security') {
        router.replace('/select_building_security');
      }
    } catch (error) {
      console.error('Update failed:', error);
      showAlert('Échec de la mise à jour', 'Impossible de mettre à jour votre profil.', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Complétez votre profil</Text>
      </View>
      
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/bouclier.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <Text style={styles.bannerText}>
          Veuillez fournir votre nom complet et sélectionner votre rôle pour finaliser votre inscription.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nom complet"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.roleSelectionText}>Sélectionnez votre rôle :</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleButton, role === 'resident' && styles.selectedRole]} 
            onPress={() => setRole('resident')}
          >
            <User size={32} color={role === 'resident' ? '#22C55E' : '#64748b'} />
            <Text style={[styles.roleText, role === 'resident' && styles.selectedRoleText]}>Résident</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.roleButton, role === 'security' && styles.selectedRole]} 
            onPress={() => setRole('security')}
          >
            <Shield size={32} color={role === 'security' ? '#22C55E' : '#64748b'} />
            <Text style={[styles.roleText, role === 'security' && styles.selectedRoleText]}>Sécurité</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!fullName || !role) && styles.submitButtonDisabled]} 
          onPress={handleSubmit}
          disabled={!fullName || !role}
        >
          <Text style={styles.submitButtonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 46,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'black',
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
    flex: 1,
    padding: 20,
  },
  input: {
    height: 48,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
    fontSize: 16,
    color: '#1e293b',
  },
  roleSelectionText: {
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
    color: '#475569',
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
    height: 120,
    justifyContent: 'center',
    gap: 8,
  },
  selectedRole: {
    borderColor: '#22C55E',
    backgroundColor: '#f0fff4',
  },
  roleText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  selectedRoleText: {
    color: '#22C55E',
  },
  submitButton: {
    backgroundColor: '#22C55E',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 'auto', // Push to bottom
  },
  submitButtonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default RoleSelectScreen;