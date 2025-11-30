import { ResidentHeader } from '@/components/ResidentHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { UserCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCustomAlert } from '../../../../contexts/AlertContext';
import apiService from '../../../../services/apiService';

interface Visitor {
  _id: string;
  name: string;
  phone?: string;
  reason?: string;
  photoUrl?: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
}

export default function VisitorFullDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchVisitor = async () => {
        try {
          setLoading(true);
          const response = await apiService.get<Visitor>(`/api/visitors/${id}`);
          setVisitor(response.data);
        } catch (error) {
          console.error("Failed to fetch visitor details", error);
          showAlert('Erreur', 'Impossible de charger les détails du visiteur.', 'error');
          router.back();
        } finally {
          setLoading(false);
        }
      };
      fetchVisitor();
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      dateStyle: 'full',
      timeStyle: 'short',
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Chargement...</ThemedText>
      </ThemedView>
    );
  }

  if (!visitor) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Visiteur non trouvé.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ResidentHeader
        title="Détails du Visiteur"
        subtitle="Bouclier"
        onMenuPress={() => {}}
        showBackButton={true}
        onBackPress={() => router.push('/resident/visitors/my_visitors')}
      />
      <ScrollView style={styles.container}>
        <View style={styles.headerSection}>
          {visitor.photoUrl ? (
            <Image source={{ uri: visitor.photoUrl }} style={styles.photo} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <UserCircle size={80} color="#94a3b8" />
            </View>
          )}
          <Text style={styles.visitorName}>{visitor.name}</Text>
          <View style={[styles.statusBadge, styles[visitor.status]]}>
            <Text style={styles.statusText}>{visitor.status}</Text>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <InfoRow label="Valide jusqu'au" value={formatDate(visitor.validUntil)} />
          {visitor.phone && <InfoRow label="Téléphone" value={visitor.phone} />}
          {visitor.reason && <InfoRow label="Raison de la visite" value={visitor.reason} />}
        </View>
      </ScrollView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#e2e8f0',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  active: { backgroundColor: '#22c55e' },
  expired: { backgroundColor: '#f97316' },
  used: { backgroundColor: '#64748b' },
  detailsSection: {
    padding: 16,
  },
  infoRow: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
  },
});
