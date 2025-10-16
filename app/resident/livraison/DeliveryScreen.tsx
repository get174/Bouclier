import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Check, Clock, FileText, Package, QrCode, User, X } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { getApiUrl } from '../../../constants/Config';
import { Delivery, deliveryService } from '../../../services/deliveryService';
import { getStatusColors, getStatusLabel } from '../../../services/deliveryStatus';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  photo: { width: '100%', height: 250, backgroundColor: '#e2e8f0' },
  photoPlaceholder: { width: '100%', height: 250, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  statusBadge: { position: 'absolute', top: -15, right: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 20 },
  icon: { marginRight: 15, marginTop: 5 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  value: { fontSize: 16, color: '#1e293b', fontWeight: '500' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: '#e2e8f0', backgroundColor: '#fff' },
  button: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderRadius: 12, gap: 8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
  refuseButton: { backgroundColor: '#fee2e2', marginRight: 10 },
  refuseButtonText: { color: '#ef4444' },
  confirmButton: { backgroundColor: '#10b981', marginLeft: 10 },
  confirmButtonText: { color: '#fff' },
});

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <View style={styles.infoRow}>
        <Icon size={20} color="#64748b" style={styles.icon} />
        <View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    </View>
);

export default function DeliveryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const handleUpdateStatus = useCallback(async (status: 'delivered' | 'refused') => {
    if (!id) return;
    try {
      setActionLoading(true);
      await deliveryService.updateDeliveryStatus(id, status, status === 'refused' ? 'Refusé par le résident' : undefined);
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: `Livraison marquée comme ${status === 'delivered' ? 'reçue' : 'refusée'}.`
      });
      router.back();
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erreur', text2: "La mise à jour du statut a échoué." });
    } finally {
      setActionLoading(false);
    }
  }, [id, router]);

  const fetchDelivery = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await deliveryService.getDeliveryById(id);
      setDelivery(data);
    } catch (error) {
      console.error(error);
      Toast.show({ type: 'error', text1: 'Erreur', text2: "Impossible de charger les détails." });
      router.back();
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color="#0891b2" />
      </ThemedView>
    );
  }

  if (!delivery) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Aucune donnée de livraison trouvée.</ThemedText>
      </ThemedView>
    );
  }
  
  const statusColors = getStatusColors(delivery.status);
  const photoUrl = delivery.photo ? `${getApiUrl()}/${delivery.photo.replace(/\\/g, '/')}` : null;

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Détails de la Livraison', headerLeft: () => <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color="#333" /></TouchableOpacity> }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {photoUrl ? (
            <Image source={{ uri: photoUrl }} style={styles.photo} />
        ) : (
            <View style={styles.photoPlaceholder}><Package size={60} color="#94a3b8" /></View>
        )}

        <View style={styles.content}>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bgColor }]}>
                <Text style={[styles.statusText, { color: statusColors.textColor }]}>{getStatusLabel(delivery.status)}</Text>
            </View>
            <InfoRow icon={User} label="Livreur" value={delivery.deliveryPersonName} />
            <InfoRow icon={Package} label="Type de colis" value={delivery.packageType} />
            <InfoRow icon={Calendar} label="Date estimée" value={new Date(delivery.estimatedTime).toLocaleDateString('fr-FR', { dateStyle: 'full' })} />
            <InfoRow icon={Clock} label="Heure estimée" value={new Date(delivery.estimatedTime).toLocaleTimeString('fr-FR', { timeStyle: 'short' })} />
            {delivery.description && <InfoRow icon={FileText} label="Description" value={delivery.description} />}
            {delivery.qrCode && <InfoRow icon={QrCode} label="Code QR" value={delivery.qrCode} />}
        </View>
      </ScrollView>
      
      {delivery.status === 'pending' && (
        <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.refuseButton]} onPress={() => handleUpdateStatus('refused')} disabled={actionLoading}>
                <X size={20} color="#ef4444" />
                <Text style={[styles.buttonText, styles.refuseButtonText]}>Refuser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => handleUpdateStatus('delivered')} disabled={actionLoading}>
                {actionLoading ? <ActivityIndicator color="#fff" /> : <Check size={20} color="#fff" />}
                <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirmer la réception</Text>
            </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}
