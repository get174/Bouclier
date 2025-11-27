import { Clock, Phone, Plus, Save, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';

interface VisitorEntry {
  id: string;
  name: string;
  phone: string;
  time: string;
  photo?: string;
}

const apartmentOptions = [
  'Apt 101', 'Apt 102', 'Apt 103', 'Apt 201', 'Apt 202', 'Apt 203',
  'Apt 301', 'Apt 302', 'Apt 303', 'Apt 401', 'Apt 402', 'Apt 403',
  'Bât A-101', 'Bât A-102', 'Bât B-201', 'Bât B-202'
];

export default function AddVisitor() {
  const [apartment, setApartment] = useState('');
  const [apartmentSearch, setApartmentSearch] = useState('');
  const [visitors, setVisitors] = useState<VisitorEntry[]>([
    { id: '1', name: '', phone: '', time: '', photo: undefined }
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredApartments = apartmentOptions.filter(apt =>
    apt.toLowerCase().includes(apartmentSearch.toLowerCase())
  );

  const handleApartmentSelect = (selectedApartment: string) => {
    setApartment(selectedApartment);
    setApartmentSearch('');
  };

  const handleVisitorChange = (id: string, field: keyof VisitorEntry, value: string) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
    if (errors[`${id}-${field}`]) {
      setErrors(prev => ({ ...prev, [`${id}-${field}`]: '' }));
    }
  };

  const addVisitor = () => {
    const newId = (visitors.length + 1).toString();
    setVisitors(prev => [...prev, { id: newId, name: '', phone: '', time: '', photo: undefined }]);
  };

  const removeVisitor = (id: string) => {
    if (visitors.length > 1) {
      setVisitors(prev => prev.filter(v => v.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!apartment.trim()) newErrors.apartment = 'L&apos;appartement est requis';

    visitors.forEach(visitor => {
      if (!visitor.name.trim()) newErrors[`${visitor.id}-name`] = 'Le nom est requis';
      if (!visitor.phone.trim()) newErrors[`${visitor.id}-phone`] = 'Le téléphone est requis';
      if (!visitor.time.trim()) newErrors[`${visitor.id}-time`] = 'L&#39;heure est requise';

      // Phone validation
      if (visitor.phone && !/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(visitor.phone.replace(/\s/g, ''))) {
        newErrors[`${visitor.id}-phone`] = 'Format de téléphone invalide';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const visitorData = { apartment, visitors };
      console.log('Form submitted:', visitorData);
      Alert.alert('Succès', `${visitors.length} visiteur(s) ajouté(s) avec succès pour ${apartment}!`);

      // Reset form
      setApartment('');
      setVisitors([{ id: '1', name: '', phone: '', time: '', photo: undefined }]);
    }
  };

  const handleCancel = () => {
    setApartment('');
    setVisitors([{ id: '1', name: '', phone: '', time: '', photo: undefined }]);
    setErrors({});
  };

  const selectPhoto = (visitorId: string) => {
    // Placeholder for photo selection - will be implemented with proper image picker
    Alert.alert('Photo', 'Fonctionnalité de sélection de photo à implémenter');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ajouter des visiteurs</Text>
        <Text style={styles.headerSubtitle}>Enregistrer plusieurs visiteurs pour un appartement</Text>
      </View>

      {/* Apartment Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <User width={20} height={20} color={Colors.light.primary} />
          <Text style={styles.sectionTitle}>Sélection de l&apos;appartement</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Appartement *</Text>
          <TextInput
            style={[styles.input, errors.apartment && styles.inputError]}
            value={apartmentSearch}
            onChangeText={setApartmentSearch}
            placeholder="Rechercher un appartement..."
            placeholderTextColor={Colors.light.textMuted}
          />
          {errors.apartment && <Text style={styles.errorText}>{errors.apartment}</Text>}

          {apartmentSearch && filteredApartments.length > 0 && (
            <View style={styles.dropdown}>
              <ScrollView style={styles.dropdownList}>
                {filteredApartments.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleApartmentSelect(item)}
                  >
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {apartment && (
            <View style={styles.selectedApartment}>
              <Text style={styles.selectedText}>Appartement sélectionné: {apartment}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Visitors */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.visitorsHeader}>
            <User width={20} height={20} color={Colors.light.primary} />
            <Text style={styles.sectionTitle}>Visiteurs ({visitors.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addVisitor}>
              <Plus width={16} height={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {visitors.map((visitor, index) => (
          <View key={visitor.id} style={styles.visitorCard}>
            <View style={styles.visitorHeader}>
              <Text style={styles.visitorTitle}>Visiteur {index + 1}</Text>
              {visitors.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeVisitor(visitor.id)}
                >
                  <X width={16} height={16} color={Colors.light.error} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.grid}>
              {/* Photo */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Photo</Text>
                <TouchableOpacity style={styles.photoButton} onPress={() => selectPhoto(visitor.id)}>
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoText}>📷 Ajouter une photo</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom complet *</Text>
                <TextInput
                  style={[styles.input, errors[`${visitor.id}-name`] && styles.inputError]}
                  value={visitor.name}
                  onChangeText={(value) => handleVisitorChange(visitor.id, 'name', value)}
                  placeholder="Nom et prénom"
                  placeholderTextColor={Colors.light.textMuted}
                />
                {errors[`${visitor.id}-name`] && <Text style={styles.errorText}>{errors[`${visitor.id}-name`]}</Text>}
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Phone width={16} height={16} color={Colors.light.primary} />
                  <Text style={styles.label}>Téléphone *</Text>
                </View>
                <TextInput
                  style={[styles.input, errors[`${visitor.id}-phone`] && styles.inputError]}
                  value={visitor.phone}
                  onChangeText={(value) => handleVisitorChange(visitor.id, 'phone', value)}
                  placeholder="+33 6 12 34 56 78"
                  placeholderTextColor={Colors.light.textMuted}
                  keyboardType="phone-pad"
                />
                {errors[`${visitor.id}-phone`] && <Text style={styles.errorText}>{errors[`${visitor.id}-phone`]}</Text>}
              </View>

              {/* Time */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Clock width={16} height={16} color={Colors.light.primary} />
                  <Text style={styles.label}>Heure d'arrivée *</Text>
                </View>
                <TextInput
                  style={[styles.input, errors[`${visitor.id}-time`] && styles.inputError]}
                  value={visitor.time}
                  onChangeText={(value) => handleVisitorChange(visitor.id, 'time', value)}
                  placeholder="HH:MM"
                  placeholderTextColor={Colors.light.textMuted}
                />
                {errors[`${visitor.id}-time`] && <Text style={styles.errorText}>{errors[`${visitor.id}-time`]}</Text>}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <X width={16} height={16} color={Colors.light.text} />
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Save width={16} height={16} color="white" />
          <Text style={styles.submitButtonText}>Enregistrer  </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  section: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
  },
  visitorsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  visitorCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  visitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  removeButton: {
    padding: 4,
  },
  grid: {
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownList: {
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedApartment: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.light.primaryLight,
    borderRadius: 8,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  errorText: {
    fontSize: 12,
    color: Colors.light.error,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  photoButton: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  photoPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
});
