import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ArrowLeft, Building, Search } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getApiUrl } from '../constants/Config';
import { useCustomAlert } from '../contexts/AlertContext';

interface Block {
  _id: string;
  blockName: string;
  buildingId: string;
}

export default function DisplayBlock() {
  const router = useRouter();
  const { buildingId } = useLocalSearchParams();
  const { showAlert } = useCustomAlert();
  const [searchText, setSearchText] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        setError('Vous devez être connecté');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      const response = await fetch(`${getApiUrl()}/api/buildings/${buildingId}/blocks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des blocs');
      }

      const data = await response.json();
      setBlocks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  useEffect(() => {
    if (buildingId) {
      fetchBlocks();
    }
  }, [buildingId, fetchBlocks]);

  const filteredBlocks = blocks.filter(block =>
    block.blockName.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleBlockSelect = async (block: Block) => {
    try {
      const authTokens = await SecureStore.getItemAsync('authTokens');

      if (!authTokens) {
        showAlert('Erreur', 'Vous devez être connecté', 'error');
        router.push('/login');
        return;
      }

      const { accessToken } = JSON.parse(authTokens);

      const response = await fetch(`${getApiUrl()}/api/user/update-block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blockId: block._id }),
      });

      if (response.status === 401) {
        showAlert('Session expirée', 'Veuillez vous reconnecter', 'error');
        await SecureStore.deleteItemAsync('authTokens');
        router.push('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du bloc');
      }

      // Navigate to display flats after successful block selection
      router.push({
        pathname: '/display_flat',
        params: { blockId: block._id }
      });
    } catch (error) {
      console.error('Error selecting block:', error);
      showAlert('Erreur', 'Impossible de sélectionner le bloc', 'error');
    }
  };

  const renderItem = ({ item }: { item: Block }) => (
    <TouchableOpacity
      style={styles.blockItem}
      onPress={() => handleBlockSelect(item)}
    >
      <Building size={24} color="#22C55E" style={styles.blockIcon} />
      <Text style={styles.blockName}>{item.blockName}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Chargement des blocs...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBlocks}>
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
        <Text style={styles.title}>Sélectionner un bloc</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#64748b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un bloc"
          placeholderTextColor="#64748b"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {filteredBlocks.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.noBlocksText}>
            {searchText ? 'Aucun bloc trouvé' : 'Aucun bloc disponible'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredBlocks}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          style={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={fetchBlocks}
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
  blockItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  blockIcon: {
    marginRight: 12,
  },
  blockName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
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
  noBlocksText: {
    fontSize: 16,
    color: '#64748b',
  },
});
