import { ResidentHeader } from '@/components/ResidentHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import apiService from '../../../services/apiService';

interface Visitor {
  _id: string;
  name: string;
  accessId: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
}

function VisitorCard({ visitor }: { visitor: Visitor }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusStyles = {
    active: {
      backgroundColor: '#dcfce7',
      color: '#166534',
    },
    expired: {
      backgroundColor: '#ffedd5',
      color: '#9a3412',
    },
    used: {
      backgroundColor: '#e2e8f0',
      color: '#334155',
    },
  };

  return (
    <Link href={`/resident/visitors/details/${visitor.accessId}`} asChild>
      <TouchableOpacity style={styles.visitorCard}>
        <View>
          <Text style={styles.visitorName}>{visitor.name}</Text>
          <Text style={styles.validityText}>
            Valide jusqu'au {formatDate(visitor.validUntil)}
          </Text>
          <View style={[styles.statusBadge, statusStyles[visitor.status]]}>
            <Text style={[styles.statusText, { color: statusStyles[visitor.status].color }]}>
              {visitor.status}
            </Text>
     </View>
        </View>
        <ChevronRight size={20} color="#94a3b8" />
      </TouchableOpacity>
    </Link>
  );
}

export default function MyVisitorsScreen() {
  const router = useRouter();
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

  const upcomingVisitors = visitors.filter(v => v.status === 'active');
  const pastVisitors = visitors.filter(v => v.status !== 'active');

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Chargement des visiteurs...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ResidentHeader
        title="Mes Visiteurs"
        subtitle="Bouclier"
        showBackButton={true}
        onBackPress={() => router.push('/resident/home')}
      />
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ThemedView style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prochains Visiteurs</Text>
            {upcomingVisitors.length > 0 ? (
              upcomingVisitors.map(visitor => <VisitorCard key={visitor._id} visitor={visitor} />)
            ) : (
              <Text style={styles.emptyText}>Aucun visiteur à venir.</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historique des Visites</Text>
            {pastVisitors.length > 0 ? (
              pastVisitors.map(visitor => <VisitorCard key={visitor._id} visitor={visitor} />)
            ) : (
              <Text style={styles.emptyText}>Aucun historique de visite.</Text>
            )}
          </View>
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
    paddingVertical: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#64748b',
    padding: 16,
  },
  visitorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  visitorName: {
    fontSize: 16,
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
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
