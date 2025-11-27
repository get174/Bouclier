import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ResidentHeader } from '../../components/ResidentHeader';
import { useMenu } from '../../contexts/MenuContext';

// Interface pour un équipement
interface Amenity {
  id: number;
  name: string;
  image: string;
  status: 'Disponible' | 'Réservée' | 'Sous-maintenance';
}

// Interface pour une réservation
interface Booking {
  id: number;
  amenityName: string;
  date: string;
  time: string;
  status: 'Confirmé' | 'En attente' | 'Annulé';
}

export default function AmenitiesScreen() {
  const router = useRouter();
  const { toggleMenu } = useMenu();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Remplacer par des appels API réels
        // const amenitiesResponse = await api.get('/amenities');
        // setAmenities(amenitiesResponse.data);
        
        // Données de simulation pour le développement
        const mockAmenities: Amenity[] = [
          {
            id: 1,
            name: 'Piscine',
            image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=500&auto=format&fit=crop&q=60',
            status: 'Disponible',
          },
          {
            id: 2,
            name: 'Salle de Sport',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60',
            status: 'Disponible',
          },
          {
            id: 3,
            name: 'Salle communautaire',
            image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=500&auto=format&fit=crop&q=60',
            status: 'Réservée',
          },
          {
            id: 4,
            name: 'Court de tennis',
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=500&auto=format&fit=crop&q=60',
            status: 'Sous-maintenance',
          },
        ];
        setAmenities(mockAmenities);

        // const bookingsResponse = await api.get('/my-bookings');
        // setBookings(bookingsResponse.data);

        const mockBookings: Booking[] = [
          {
            id: 1,
            amenityName: 'Salle communautaire',
            date: 'Samedi 15 mars',
            time: '14h00 - 18h00',
            status: 'Confirmé',
          },
        ];
        setBookings(mockBookings);

      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les données.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAmenityPress = (amenity: Amenity) => {
    if (amenity.status === 'Disponible') {
      router.push('/resident/amenities/amenity_booking');
    } else {
      Alert.alert('Indisponible', `Cet équipement est actuellement ${amenity.status.toLowerCase()}.`);
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
    <View style={{ flex: 1 }}>
      <ResidentHeader title="Équipements" subtitle="Bouclier" onMenuPress={toggleMenu} />
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Équipements disponibles</Text>
        <View style={styles.amenitiesList}>
          {amenities.map((amenity) => (
            <Pressable key={amenity.id} style={styles.amenityCard} onPress={() => handleAmenityPress(amenity)}>
              <Image
                source={{ uri: amenity.image }}
                style={styles.amenityImage}
              />
              <View style={styles.amenityInfo}>
                <Text style={styles.amenityName}>{amenity.name}</Text>
                <Text
                  style={[
                    styles.amenityStatus,
                    {
                      color:
                        amenity.status === 'Disponible'
                          ? '#059669'
                          : amenity.status === 'Réservée'
                          ? '#dc2626'
                          : '#d97706',
                    },
                  ]}>
                  {amenity.status}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes réservations</Text>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Text style={styles.bookingTitle}>{booking.amenityName}</Text>
              <Text style={styles.bookingDate}>{booking.date}</Text>
              <Text style={styles.bookingTime}>{booking.time}</Text>
              <View style={[
                styles.bookingStatus,
                { 
                  backgroundColor: booking.status === 'Confirmé' ? '#dcfce7' : '#fee2e2' 
                }
              ]}>
                <Text style={[
                  styles.bookingStatusText,
                  {
                    color: booking.status === 'Confirmé' ? '#059669' : '#dc2626'
                  }
                ]}>
                  {booking.status}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noBookingsContainer}>
            <Text style={styles.noBookingsText}>Vous n&apos;avez aucune réservation pour le moment.</Text>
          </View>
        )}
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  amenitiesList: {
    gap: 16,
  },
  amenityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  amenityImage: {
    width: '100%',
    height: 200,
  },
  amenityInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  amenityStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  bookingDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  bookingTime: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  bookingStatus: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  bookingStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noBookingsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  noBookingsText: {
    fontSize: 14,
    color: '#64748b',
  },
});
