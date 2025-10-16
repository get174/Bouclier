import { useRouter } from 'expo-router';
import {
  CheckCircle,
  Clock,
  Eye,
  Package,
  QrCode,
  User,
  XCircle
} from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Delivery } from '../services/deliveryService';
import { getStatusColors } from '../services/deliveryStatus';

interface DeliveryCardProps {
  delivery: Delivery;
  onConfirm?: (id: string) => void;
  onRefuse?: (id: string) => void;
}

export default function DeliveryCard({ delivery, onConfirm, onRefuse }: DeliveryCardProps) {
  if (!delivery) return null;
  const router = useRouter();
  const statusColors = getStatusColors(delivery.status);

  const handleConfirm = () => {
    Alert.alert(
      'Confirmer la livraison',
      'Êtes-vous sûr de vouloir confirmer cette livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => onConfirm?.(delivery.id) }
      ]
    );
  };

  const handleRefuse = () => {
    Alert.alert(
      'Refuser la livraison',
      'Êtes-vous sûr de vouloir refuser cette livraison ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Refuser', style: 'destructive', onPress: () => onRefuse?.(delivery.id) }
      ]
    );
  };

  const handleViewDetails = () => {
    router.push({
      pathname: './DeliveryScreen',
      params: { id: delivery.id }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = () => {
    switch (delivery.status) {
      case 'delivered':
        return <CheckCircle size={16} color={statusColors.color} />;
      case 'refused':
        return <XCircle size={16} color={statusColors.color} />;
      default:
        return <Package size={16} color={statusColors.color} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: statusColors.textColor }]}>
            {delivery.packageType}
          </Text>
        </View>
        <Text style={[styles.statusBadge, { backgroundColor: statusColors.bgColor, borderColor: statusColors.color }]}>
          {delivery.status === 'pending' ? 'En attente' :
           delivery.status === 'in_transit' ? 'En cours' :
           delivery.status === 'delivered' ? 'Livrée' :
           delivery.status === 'refused' ? 'Refusée' : 'Annulée'}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <User size={16} color="#64748b" />
          <Text style={styles.infoText}>{delivery.deliveryPersonName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={16} color="#64748b" />
          <Text style={styles.infoText}>
            {formatDate(delivery.estimatedTime)}
          </Text>
        </View>

        {delivery.qrCode && (
          <View style={styles.infoRow}>
            <QrCode size={16} color="#64748b" />
            <Text style={styles.infoText}>Code QR disponible</Text>
          </View>
        )}

        {delivery.photo && (
          <Image source={{ uri: delivery.photo }} style={styles.photo} />
        )}

        {delivery.description && (
          <Text style={styles.description} numberOfLines={2}>
            {delivery.description}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.viewButton} onPress={handleViewDetails}>
          <Eye size={16} color="#0891b2" />
          <Text style={styles.viewButtonText}>Voir détails</Text>
        </Pressable>

        {delivery.status === 'pending' && (
          <View style={styles.actionButtons}>
            <Pressable style={styles.confirmButton} onPress={handleConfirm}>
              <CheckCircle size={16} color="#ffffff" />
              <Text style={styles.confirmButtonText}>Confirmer</Text>
            </Pressable>

            <Pressable style={styles.refuseButton} onPress={handleRefuse}>
              <XCircle size={16} color="#ffffff" />
              <Text style={styles.refuseButtonText}>Refuser</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 8,
    resizeMode: 'cover',
  },
  description: {
    fontSize: 14,
    color: '#475569',
    marginTop: 8,
    lineHeight: 20,
  },
  actions: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    gap: 6,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  refuseButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  refuseButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});
