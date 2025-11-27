import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl,TouchableOpacity } from 'react-native';
import { useFocusEffect , Link } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import apiService from '../../../services/apiService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ResidentHeader } from '../../../components/ResidentHeader';

interface Visitor {
  _id: string;
  name: string;
  accessId: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
}

export default function MyQRCodesScreen() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.get<Visitor[]>('/api/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error("Failed to fetch visitors", error);
      // Optionally show an alert to the user
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchVisitors();
    }, [fetchVisitors])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchVisitors();
    setRefreshing(false);
  }, [fetchVisitors]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Chargement des QR codes...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ResidentHeader
        title="Mes QR Codes"
        subtitle="Liste de vos Qr codes générés"
        onMenuPress={() => {}}
        showBackButton={true}
      />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ThemedView style={styles.page}>
        {visitors.length === 0 ? (
          <ThemedView style={styles.centered}>
            <ThemedText style={styles.emptyText}>Vous navez aucun QR code actif.</ThemedText>
            <ThemedText>Tirez pour rafraîchir.</ThemedText>
          </ThemedView>
        ) : (
          visitors.map((visitor) => (
            <Link key={visitor._id} href={`/resident/visitors/${visitor.accessId}`} asChild>
              <TouchableOpacity>
                <View style={styles.qrCard}>
                  <View style={styles.qrCodeContainer}>
                    <QRCode value={visitor.accessId} size={80} />
                  </View>
                  <View style={styles.infoContainer}>
                    <Text style={styles.visitorName}>{visitor.name}</Text>
                    <Text style={styles.validityText}>
                      Valide jusquau: {formatDate(visitor.validUntil)}
                    </Text>
                    <View style={[styles.statusBadge, styles[visitor.status]]}>
                      <Text style={styles.statusText}>{visitor.status}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))
        )}
      </ThemedView>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  page: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  qrCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qrCodeContainer: {
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  visitorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  validityText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  active: {
    backgroundColor: '#22c55e', // green-500
  },
  expired: {
    backgroundColor: '#f97316', // orange-500
  },
  used: {
    backgroundColor: '#64748b', // slate-500
  },
});
