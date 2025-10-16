import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { Colors } from '../constants/Colors';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Payment {
  _id: string;
  amount: number;
  description: string;
  status: 'En attente' | 'Payé' | 'En retard';
  dueDate: string;
}

interface PaymentCardProps {
  payment: Payment;
  onPayPress: () => void;
}

const statusConfig = {
  'Payé': {
    label: 'Payé',
    color: Colors.light.success,
  },
  'En attente': {
    label: 'En attente',
    color: Colors.light.warning,
  },
  'En retard': {
    label: 'En retard',
    color: Colors.light.error,
  },
};

export default function PaymentCard({ payment, onPayPress }: PaymentCardProps) {
  if (!payment) {
    return null;
  }
  
  const config = statusConfig[payment.status];
  const formattedDueDate = format(new Date(payment.dueDate), "d MMMM yyyy", { locale: fr });

  return (
    <ThemedView style={styles.card}>
      <View style={styles.header}>
        <ThemedText style={styles.description}>{payment.description}</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: config.color }]}>
          <ThemedText style={styles.statusText}>{config.label}</ThemedText>
        </View>
      </View>
      <View style={styles.body}>
        <ThemedText style={styles.amount}>{`${payment.amount.toFixed(2)} €`}</ThemedText>
        <ThemedText style={styles.dueDate}>Échéance: {formattedDueDate}</ThemedText>
      </View>
      {payment.status !== 'Payé' && (
        <TouchableOpacity style={styles.payButton} onPress={onPayPress}>
          <ThemedText style={styles.payButtonText}>Payer maintenant</ThemedText>
        </TouchableOpacity>
      )}
       {payment.status === 'Payé' && (
        <View style={styles.paidConfirmation}>
          <ThemedText style={styles.paidText}>Paiement effectué</ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1, 
    marginRight: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  body: {
    marginBottom: 16,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  payButton: {
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paidConfirmation: {
    backgroundColor: Colors.light.success,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  paidText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
