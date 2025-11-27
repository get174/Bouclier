import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Switch, Text, View } from 'react-native';

// Interface pour les préférences de notification
interface NotificationPreferences {
  visitorAlerts: boolean;
  communityNews: boolean;
  bookingConfirmations: boolean;
}

export default function NotificationPreferencesScreen() {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // Remplacez par un appel API réel
        // const response = await apiService.get('/notification-preferences');
        // setPreferences(response.data);

        // Données de simulation
        setTimeout(() => {
          const mockPreferences: NotificationPreferences = {
            visitorAlerts: true,
            communityNews: true,
            bookingConfirmations: false,
          };
          setPreferences(mockPreferences);
          setLoading(false);
        }, 500);

      } catch (error) {
        console.error('Failed to fetch preferences:', error);
        Alert.alert("Erreur", "Impossible de charger les préférences.");
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handleToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    if (!preferences) return;

    // Mettre à jour l'état localement pour une réactivité instantanée
    const updatedPreferences = { ...preferences, [key]: value };
    setPreferences(updatedPreferences);

    try {
      // Remplacez par un appel API réel pour sauvegarder la préférence
      // await apiService.put('/notification-preferences', { [key]: value });
      
      // Simuler un délai réseau pour la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 300));

    } catch (error) {
      console.error('Failed to save preference:', error);
      Alert.alert("Erreur", "Impossible de sauvegarder la modification.");
      // Annuler la modification en cas d'erreur
      setPreferences(preferences);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1e293b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.item}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Alertes de visiteurs</Text>
            <Text style={styles.itemDescription}>Recevoir une notification à l&apos;arrivée d&apos;un visiteur.</Text>
          </View>
          <Switch
            trackColor={{ false: '#e2e8f0', true: '#14b8a6' }}
            thumbColor={preferences?.visitorAlerts ? '#ffffff' : '#f1f5f9'}
            onValueChange={(value) => handleToggle('visitorAlerts', value)}
            value={preferences?.visitorAlerts}
          />
        </View>

        <View style={styles.item}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Annonces de la communauté</Text>
            <Text style={styles.itemDescription}>Rester informé des nouvelles et des événements.</Text>
          </View>
          <Switch
            trackColor={{ false: '#e2e8f0', true: '#14b8a6' }}
            thumbColor={preferences?.communityNews ? '#ffffff' : '#f1f5f9'}
            onValueChange={(value) => handleToggle('communityNews', value)}
            value={preferences?.communityNews}
          />
        </View>

        <View style={[styles.item, styles.noBorder]}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>Confirmations de réservation</Text>
            <Text style={styles.itemDescription}>Recevoir des rappels pour vos réservations d&apos;équipements.</Text>
          </View>
          <Switch
            trackColor={{ false: '#e2e8f0', true: '#14b8a6' }}
            thumbColor={preferences?.bookingConfirmations ? '#ffffff' : '#f1f5f9'}
            onValueChange={(value) => handleToggle('bookingConfirmations', value)}
            value={preferences?.bookingConfirmations}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  itemTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    color: '#64748b',
  },
});
