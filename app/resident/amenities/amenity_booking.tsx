import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// Interface pour les détails de l'équipement
interface AmenityDetails {
  id: number;
  name: string;
  // Ajoutez d'autres champs si nécessaire, comme les heures d'ouverture
}

export default function BookAmenityScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [amenity, setAmenity] = useState<AmenityDetails | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAmenityDetails = async () => {
      try {
        // Remplacez par un appel API réel pour obtenir les détails de l'équipement
        // const response = await api.get(`/amenities/${id}`);
        // setAmenity(response.data);

        // Données de simulation
        const mockAmenity: AmenityDetails = {
          id: Number(id),
          name: `Équipement ${id}`, // Nom dynamique pour l'exemple
        };
        // Simuler un délai réseau
        setTimeout(() => {
          setAmenity(mockAmenity);
          setLoading(false);
        }, 500);

      } catch (error) {
        Alert.alert('Erreur', "Impossible de charger les détails de l'équipement.");
        console.error(error);
        router.back();
      }
    };

    if (id) {
      fetchAmenityDetails();
    }
  }, [id]);

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange: onDateChange,
        mode: 'date',
        is24Hour: true,
        minimumDate: new Date(),
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const handleBooking = async () => {
    if (!amenity) return;

    try {
      // Remplacez par un appel API réel pour créer une réservation
      // await api.post('/bookings', {
      //   amenityId: amenity.id,
      //   date: date.toISOString(),
      // });

      Alert.alert(
        'Réservation confirmée',
        `Votre réservation pour ${amenity.name} le ${date.toLocaleDateString()} a été confirmée.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de confirmer la réservation.');
      console.error(error);
    }
  };

  if (loading) {
    return <View style={styles.centered}><Text>Chargement...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Réserver : {amenity?.name}</Text>

      <View style={styles.datePickerContainer}>
        <Pressable onPress={openDatePicker} style={styles.datePickerButton}>
          <Text style={styles.datePickerButtonText}>Sélectionner une date</Text>
        </Pressable>
        <Text style={styles.selectedDateText}>Date : {date.toLocaleDateString()}</Text>
      </View>

      {showDatePicker && Platform.OS === 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <Pressable style={styles.confirmButton} onPress={handleBooking}>
        <Text style={styles.confirmButtonText}>Confirmer la réservation</Text>
      </Pressable>
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 24,
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  datePickerButton: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedDateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
