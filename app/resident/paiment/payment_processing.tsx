import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '../../../components/ThemedText';
import { ThemedView } from '../../../components/ThemedView';
import { Colors } from '../../../constants/Colors';
import { updatePaymentStatus } from '../../../services/paymentService';

export default function PaymentProcessingScreen() {
  const { paymentId, amount, description } = useLocalSearchParams();
  const router = useRouter();
  
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }
    
    setLoading(true);
    try {
      // In a real app, you would integrate with a payment gateway like Stripe.
      // Here, we'll just simulate a successful payment and update the status.
      if (typeof paymentId === 'string') {
        await updatePaymentStatus(paymentId, 'Payé');
        Alert.alert(
          'Paiement Réussi',
          'Votre paiement a été traité avec succès.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      console.error('Payment failed:', error);
      Alert.alert('Erreur', 'Le paiement a échoué. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Paiement sécurisé</ThemedText>
      <View style={styles.detailsContainer}>
        <ThemedText style={styles.description}>{description}</ThemedText>
        <ThemedText style={styles.amount}>{amount} €</ThemedText>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nom sur la carte"
        value={cardHolder}
        onChangeText={setCardHolder}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de carte"
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType="numeric"
        maxLength={16}
        placeholderTextColor="#999"
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.expiry]}
          placeholder="MM/AA"
          value={expiryDate}
          onChangeText={setExpiryDate}
          keyboardType="numeric"
          maxLength={5}
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.input, styles.cvv]}
          placeholder="CVV"
          value={cvv}
          onChangeText={setCvv}
          keyboardType="numeric"
          maxLength={3}
          secureTextEntry
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
        <ThemedText style={styles.buttonText}>
          {loading ? 'Traitement...' : `Payer ${amount} €`}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: Colors.light.tint,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiry: {
    flex: 1,
    marginRight: 10,
  },
  cvv: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
