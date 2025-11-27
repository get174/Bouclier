import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft, Building, Search } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getApiUrl } from '../constants/Config';
import { useCustomAlert } from '../contexts/AlertContext';

type BuildingType = {
  _id: string;
  buildingName: string;
  commune: string;
};

export default function DisplayBuilding() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [searchText, setSearchText] = useState('');
  const [buildings, setBuildings] = useState<BuildingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBuildings = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        showAlert('Erreur', 'Vous devez être connecté pour voir les immeubles', 'error');
        router.push('/login');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      const response = await fetch(`${getApiUrl()}/api/buildings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        showAlert('Session expirée', 'Veuillez vous reconnecter', 'error');
        await SecureStore.deleteItemAsync('authTokens');
        await SecureStore.deleteItemAsync('userData');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des immeubles');
      }

      const data = await response.json();
      setBuildings(data);
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router, showAlert]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const handleBuildingSelect = async (building: BuildingType) => {
    try {
      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        showAlert('Erreur', 'Vous devez être connecté pour sélectionner l\'immeuble', 'error');
        router.push('/login');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      const response = await fetch(`${getApiUrl()}/api/user/update-building`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ buildingId: building._id }),
      });

      if (response.status === 401) {
        showAlert('Session expirée', 'Veuillez vous reconnecter', 'error');
        await SecureStore.deleteItemAsync('authTokens');
        await SecureStore.deleteItemAsync('userData');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Update SecureStore with new buildingId
      try {
        const userDataString = await SecureStore.getItemAsync('userData');
        if (userDataString) {
          const parsedData = JSON.parse(userDataString);
          parsedData.buildingId = building._id;
          await SecureStore.setItemAsync('userData', JSON.stringify(parsedData));
        } else {
          // Create new userData if it doesn't exist
          await SecureStore.setItemAsync('userData', JSON.stringify({ buildingId: building._id }));
        }
      } catch (storageError) {
        console.error('Error updating SecureStore:', storageError);
      }

      // Navigate to display blocks after successful building selection
      router.push({
        pathname: '/display_block',
        params: { buildingId: building._id }
      });
    } catch (error) {
      console.error('Error selecting building:', error);
      showAlert('Erreur', `Impossible de sélectionner l'immeuble: ${error.message}`, 'error');
    }
  };

  const renderItem = ({ item }: { item: BuildingType }) => (
    <TouchableOpacity 
      style={styles.buildingItem} 
      onPress={() => handleBuildingSelect(item)}
    >
      <Building size={24} color="#22C55E" style={styles.buildingIcon} />
      <View style={styles.buildingInfo}>
        <Text style={styles.buildingName}>{item.buildingName}</Text>
        <Text style={styles.buildingCity}>{item.commune}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredBuildings = buildings.filter(building =>
    building?.buildingName?.toLowerCase()?.includes(searchText?.toLowerCase() || '')
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Chargement des immeubles...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBuildings}>
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
        <Text style={styles.title}>Sélectionner un immeuble</Text>
      </View>
      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Recherchez un immeuble"
          placeholderTextColor="#64748b"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      {filteredBuildings.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noBuildingsText}>
            {searchText ? 'Aucun immeuble trouvé' : 'Aucun immeuble disponible'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBuildings}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          style={styles.list}
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
    flexGrow: 0,
  },
  buildingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomColor: '#d1d5db',
    borderBottomWidth: 1,
  },
  buildingIcon: {
    marginRight: 12,
  },
  buildingInfo: {
    flexDirection: 'column',
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  buildingCity: {
    fontSize: 14,
    color: '#64748b',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  noBuildingsText: {
    fontSize: 16,
    color: '#64748b',
  },
});
