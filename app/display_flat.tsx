import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft, Home, Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getApiUrl } from '../constants/Config';
import { useCustomAlert } from '../contexts/AlertContext';

interface Apartment {
  _id: string;
  apartmentNumber: string;
  blockId: string;
  floor?: number;
  description?: string;
}

export default function DisplayFlat() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const { blockId } = useLocalSearchParams<{ blockId: string; blockName?: string }>();
  const [searchText, setSearchText] = useState('');
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching apartments for blockId:', blockId);

      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        setError('Vous devez être connecté');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      if (!blockId) {
        setError('ID du bloc manquant');
        return;
      }

      const response = await fetch(`${getApiUrl()}/api/apartments/blocks/${blockId}/apartments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Received apartments:', data.length, 'items');

      setApartments(data);

      if (data.length === 0) {
        setError('Aucun appartement trouvé pour ce bloc');
      }
    } catch (err) {
      console.error('Error fetching apartments:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [blockId]);

  useEffect(() => {
    if (blockId) {
      fetchApartments();
    }
  }, [blockId, fetchApartments]);

  const filteredApartments = apartments.filter(apartment =>
    apartment.apartmentNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleApartmentSelect = async (apartment: Apartment) => {
    try {
      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        showAlert('Erreur', 'Vous devez être connecté', 'error');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      Alert.alert(
        'Confirmer la sélection',
        `Voulez-vous sélectionner l'appartement ${apartment.apartmentNumber} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Confirmer',
            onPress: async () => {
              try {
                const response = await fetch(`${getApiUrl()}/api/user/select-apartment`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ apartmentId: apartment._id }),
                });

                if (response.status === 401) {
                  showAlert('Session expirée', 'Veuillez vous reconnecter', 'error');
                  await SecureStore.deleteItemAsync('authTokens');
                  router.push('/login');
                  return;
                }

                if (!response.ok) {
                  throw new Error('Erreur lors de la sélection');
                }

                showAlert('Succès', 'Appartement sélectionné avec succès!', 'success');
                router.replace('./resident');
              } catch (error) {
                console.error('Error selecting apartment:', error);
                showAlert('Erreur', 'Impossible de sélectionner l\'appartement', 'error');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error:', error);
      showAlert('Erreur', 'Une erreur est survenue', 'error');
    }
  };

  const renderItem = ({ item }: { item: Apartment }) => (
    <TouchableOpacity 
      style={styles.flatItem}
      onPress={() => handleApartmentSelect(item)}
    >
      <Home size={24} color="#22C55E" style={styles.flatIcon} />
      <View style={styles.flatInfo}>
        <Text style={styles.flatNumber}>{item.apartmentNumber}</Text>
        {item.floor && (
          <Text style={styles.floorText}>Étage {item.floor}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Chargement des appartements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchApartments}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Sélectionner un appartement</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un appartement"
          placeholderTextColor="#64748b"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filteredApartments.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noFlatsText}>
            {searchText ? 'Aucun appartement trouvé' : 'Aucun appartement disponible'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredApartments}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchApartments}
              colors={['#22C55E']}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    marginLeft: -30,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  list: {
    flexGrow: 1,
  },
  flatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  flatIcon: {
    marginRight: 12,
  },
  flatInfo: {
    flex: 1,
  },
  flatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  floorText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#22C55E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  noFlatsText: {
    fontSize: 16,
    color: '#64748b',
  },
});
