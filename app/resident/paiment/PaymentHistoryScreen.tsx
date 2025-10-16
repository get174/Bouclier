import { CheckCircle, Clock, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Payment, paymentService } from '../../../services/paymentService';

const statusConfig = {
  success: { label: 'Succès', Icon: CheckCircle, color: '#10b981' },
  failed: { label: 'Échec', Icon: XCircle, color: '#ef4444' },
  pending: { label: 'En attente', Icon: Clock, color: '#f59e0b' },
};

export default function PaymentHistoryScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentService.getPaymentHistory('resident-1').then(data => {
      setPayments(data);
      setLoading(false);
    });
  }, []);

  const renderPaymentItem = ({ item }: { item: Payment }) => {
    const config = statusConfig[item.status];
    return (
      <View style={styles.itemContainer}>
        <config.Icon size={24} color={config.color} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemText}>{`Paiement de ${item.amount} $`}</Text>
          <Text style={styles.itemDate}>{new Date(item.paymentDate).toLocaleString('fr-FR')}</Text>
        </View>
        <Text style={[styles.itemStatus, { color: config.color }]}>{config.label}</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={renderPaymentItem}
        ListHeaderComponent={<Text style={styles.title}>Historique des Paiements</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun paiement trouvé.</Text>}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  listContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6b7280',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  itemStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
