import { useFocusEffect, useRouter } from 'expo-router';
import { Package, Plus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Delivery, deliveryService } from '../../../services/deliveryService';
import { getStatusColors, getStatusLabel } from '../../../services/deliveryStatus';

export default function DeliveriesListScreen() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDeliveries = useCallback(async () => {
    try {
      const data = await deliveryService.getDeliveries();
      setDeliveries(data);
    } catch (error) {
      console.error('Erreur lors du chargement des livraisons:', error);
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
            text1: 'Erreur de chargement',
            text2: errorMessage
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDeliveries();
    }, [loadDeliveries])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const handleDeliveryPress = (delivery: Delivery) => {
    router.push({
      pathname: '/resident/livraison/DeliveryScreen',
      params: { id: delivery._id }
    });
  };

  const renderDeliveryItem = ({ item }: { item: Delivery }) => {
    const statusColors = getStatusColors(item.status);

    return (
      <Pressable
        style={styles.deliveryItem}
        onPress={() => handleDeliveryPress(item)}
      >
        <View style={styles.deliveryHeader}>
          <View style={styles.packageIconContainer}>
            <Package size={24} color="#0891b2" />
          </View>
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryPerson}>{item.deliveryPersonName}</Text>
            <Text style={styles.packageType}>{item.packageType}</Text>
            <Text style={styles.estimatedTime}>
              {new Date(item.estimatedTime).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors.bgColor }]}>
            <Text style={[styles.statusText, { color: statusColors.textColor }]}>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Package size={64} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>Aucune livraison</Text>
      <Text style={styles.emptySubtitle}>
        Appuyez sur "Ajouter" pour enregistrer une nouvelle livraison.
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0891b2" />
        <Text style={styles.loadingText}>Chargement des livraisons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Livraisons</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/resident/livraison/AddDeliveryScreen')}
        >
          <Plus size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Ajouter</Text>
        </Pressable>
      </View>

      <FlatList
        data={deliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0891b2"]} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0891b2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  deliveryItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryPerson: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  packageType: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
