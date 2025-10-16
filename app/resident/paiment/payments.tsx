import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getPayments } from '../../../services/paymentService';
import PaymentCard from '../../../components/PaymentCard'; 
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Colors } from '../../../constants/Colors';

interface Payment {
  _id: string;
  amount: number;
  description: string;
  status: 'En attente' | 'Payé' | 'En retard';
  dueDate: string;
}

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      // Optionally, show an alert to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPayments();
  }, []);

  const handlePayPress = (payment: Payment) => {
    router.push({
      pathname: '/resident/paiment/payment_processing',
      params: {
        paymentId: payment._id,
        amount: payment.amount,
        description: payment.description,
      },
    });
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={payments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PaymentCard
            payment={item}
            onPayPress={() => handlePayPress(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.centered}>
            <ThemedText>Aucun paiement à afficher.</ThemedText>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
});
