import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import { CreditCard, DollarSign, Smartphone } from 'lucide-react-native';
import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useCustomAlert } from '../../../contexts/AlertContext';

// Options de services et de paiement
const SERVICES = ['Loyer', 'Eau', 'Électricité', 'Entretien', 'Autre'];
const PAYMENT_METHODS = {
  CARD: 'Carte Bancaire',
  MOBILE: 'Mobile Money',
};
const MOBILE_MONEY_OPTIONS = ['Orange Money', 'M-Pesa', 'Airtel Money'];

export default function AddPaymentScreen() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();

  const [amount, setAmount] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [customService, setCustomService] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedMobileMoney, setSelectedMobileMoney] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddPayment = async () => {
    const service = selectedService === 'Autre' ? customService : selectedService;
    if (!amount || !service || !selectedPaymentMethod) {
      showAlert('Champs requis', 'Veuillez renseigner le montant, le service et la méthode de paiement.', 'warning');
      return;
    }
    if (selectedPaymentMethod === PAYMENT_METHODS.MOBILE && !selectedMobileMoney) {
      showAlert('Champs requis', 'Veuillez choisir un opérateur Mobile Money.', 'warning');
      return;
    }

    setLoading(true);
    // Ici, vous intégreriez la logique de paiement avec un service externe (Stripe, etc.)
    console.log({
      amount: parseFloat(amount),
      service,
      paymentMethod: selectedPaymentMethod,
      mobileMoneyProvider: selectedMobileMoney,
    });

    // Simulation d'un appel API
    setTimeout(() => {
      setLoading(false);
      showAlert('Paiement initié', `Votre paiement de ${amount}€ pour le service "${service}" a été initié.`, 'success');
      router.back();
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingView}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Effectuer un Paiement</ThemedText>
          <ThemedText style={styles.subtitle}>
            Sélectionnez un service et un mode de paiement pour régler vos factures.
          </ThemedText>
        </ThemedView>

        {/* Montant */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Montant à Payer</ThemedText>
          <View style={styles.inputContainer}>
            <DollarSign size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Services */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Service</ThemedText>
          <View style={styles.chipContainer}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service}
                style={[styles.chip, selectedService === service && styles.chipSelected]}
                onPress={() => setSelectedService(service)}
              >
                <Text style={[styles.chipText, selectedService === service && styles.chipTextSelected]}>
                  {service}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedService === 'Autre' && (
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Précisez le service"
              placeholderTextColor="#9ca3af"
              value={customService}
              onChangeText={setCustomService}
            />
          )}
        </View>

        {/* Méthode de paiement */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Méthode de Paiement</ThemedText>
          <View style={styles.paymentMethodContainer}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === PAYMENT_METHODS.CARD && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(PAYMENT_METHODS.CARD)}
            >
              <CreditCard size={24} color={selectedPaymentMethod === PAYMENT_METHODS.CARD ? '#fff' : '#374151'} />
              <Text style={[styles.paymentMethodText, selectedPaymentMethod === PAYMENT_METHODS.CARD && styles.paymentMethodTextSelected]}>
                {PAYMENT_METHODS.CARD}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedPaymentMethod === PAYMENT_METHODS.MOBILE && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(PAYMENT_METHODS.MOBILE)}
            >
              <Smartphone size={24} color={selectedPaymentMethod === PAYMENT_METHODS.MOBILE ? '#fff' : '#374151'} />
              <Text style={[styles.paymentMethodText, selectedPaymentMethod === PAYMENT_METHODS.MOBILE && styles.paymentMethodTextSelected]}>
                {PAYMENT_METHODS.MOBILE}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedPaymentMethod === PAYMENT_METHODS.MOBILE && (
            <View style={styles.mobileMoneyContainer}>
              <ThemedText style={styles.mobileMoneyTitle}>Choisir un opérateur</ThemedText>
              <View style={styles.chipContainer}>
                {MOBILE_MONEY_OPTIONS.map((operator) => (
                  <TouchableOpacity
                    key={operator}
                    style={[styles.chip, selectedMobileMoney === operator && styles.chipSelected]}
                    onPress={() => setSelectedMobileMoney(operator)}
                  >
                    <Text style={[styles.chipText, selectedMobileMoney === operator && styles.chipTextSelected]}>
                      {operator}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleAddPayment} disabled={loading}>
          <Text style={styles.submitButtonText}>
            {loading ? 'Traitement en cours...' : `Payer ${amount ? amount + '€' : ''}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#111827',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#0891b2',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  paymentMethodSelected: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  paymentMethodTextSelected: {
    color: '#ffffff',
  },
  mobileMoneyContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  mobileMoneyTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#0d9488',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
