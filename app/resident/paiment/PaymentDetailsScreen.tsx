import { useLocalSearchParams, useRouter } from 'expo-router';
import { CreditCard, Smartphone } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Invoice, Payment, paymentService } from '../../../services/paymentService';

const paymentMethods = [
  { id: 'credit_card', label: 'Carte Bancaire', Icon: CreditCard },
  { id: 'orange_money', label: 'Orange Money', Icon: Smartphone },
  { id: 'mpesa', label: 'M-Pesa', Icon: Smartphone },
  { id: 'airtel_money', label: 'Airtel Money', Icon: Smartphone },
];

export default function PaymentDetailsScreen() {
  const { invoiceId } = useLocalSearchParams<{ invoiceId: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<Payment['paymentMethod'] | null>(null);

  useEffect(() => {
    if (invoiceId) {
      paymentService.getInvoiceDetails(invoiceId).then(data => {
        setInvoice(data || null);
        setLoading(false);
      });
    }
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!invoice || !selectedMethod) {
      Alert.alert("Erreur", "Veuillez sélectionner une méthode de paiement.");
      return;
    }

    setPaying(true);
    try {
      await paymentService.processPayment(invoice.id, selectedMethod, invoice.amount);
      Alert.alert("Succès", "Votre paiement a été effectué avec succès.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert("Échec du paiement", error.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (!invoice) {
    return <Text style={styles.errorText}>Facture non trouvée.</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{`Facture ${invoice.month} ${invoice.year}`}</Text>
          <Text style={styles.headerAmount}>{`${invoice.amount} $`}</Text>
          <Text style={[styles.status, { color: invoice.status === 'paid' ? '#10b981' : '#f59e0b' }]}>
            {invoice.status === 'paid' ? 'Payée' : 'En attente'}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Détails de la facture</Text>
          {invoice.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemAmount}>{`${item.amount} $`}</Text>
            </View>
          ))}
        </View>

        {invoice.status !== 'paid' && (
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Choisir un moyen de paiement</Text>
            {paymentMethods.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodButton, selectedMethod === method.id && styles.selectedMethod]}
                onPress={() => setSelectedMethod(method.id as Payment['paymentMethod'])}
              >
                <method.Icon size={24} color={selectedMethod === method.id ? '#fff' : '#0891b2'} />
                <Text style={[styles.methodLabel, selectedMethod === method.id && { color: '#fff' }]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {invoice.status !== 'paid' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={paying || !selectedMethod}>
            {paying ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>{`Payer ${invoice.amount} $`}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  loader: { flex: 1, justifyContent: 'center' },
  errorText: { textAlign: 'center', marginTop: 20, color: 'red' },
  content: { padding: 16 },
  header: { alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  headerAmount: { fontSize: 32, fontWeight: 'bold', color: '#0891b2', marginVertical: 8 },
  status: { fontSize: 16, fontWeight: '600' },
  detailsSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#374151' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  itemDescription: { fontSize: 16, color: '#4b5563' },
  itemAmount: { fontSize: 16, fontWeight: '500', color: '#1f2937' },
  paymentSection: { marginBottom: 24 },
  methodButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, marginBottom: 12 },
  selectedMethod: { backgroundColor: '#0891b2', borderColor: '#0891b2' },
  methodLabel: { fontSize: 16, fontWeight: '500', color: '#374151' },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  payButton: { backgroundColor: '#0891b2', padding: 16, borderRadius: 8, alignItems: 'center', opacity: 1 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
