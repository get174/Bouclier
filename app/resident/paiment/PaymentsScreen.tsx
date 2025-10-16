import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentCard from '../../../components/PaymentCard';
import { Invoice, paymentService } from '../../../services/paymentService';

export default function PaymentsScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInvoices = async () => {
    try {
      // Remplacer 'resident-1' par l'ID du résident connecté
      const data = await paymentService.getInvoices('resident-1');
      console.log('Factures reçues:', data); // Ajout du console.log
      setInvoices(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des factures:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvoices();
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PaymentCard invoice={item} />}
        ListHeaderComponent={<Text style={styles.title}>Factures à Payer</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune facture en attente.</Text>}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
});
