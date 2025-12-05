import { ActionCard } from '@/components/ActionCard';
import { NoticeCard } from '@/components/NoticeCard';
import { ResidentHeader } from '@/components/ResidentHeader';
import { UpcomingEventCard } from '@/components/UpcomingEventCard';
import { Colors } from '@/constants/Colors';
import { PenTool as Tool, UserCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '../../constants/Config';
import { useMenu } from '../../contexts/MenuContext';
import AuthService from '../../services/authService';

interface UserData {
  id: string;
  email: string;
  fullName?: string;
  buildingId?: string;
  blockId?: string;
  appartementId?: string;
}

export default function HomeScreen() {
  const { toggleMenu } = useMenu();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [apartmentNumber, setApartmentNumber] = useState<string>('');
  const [blockName, setBlockName] = useState<string>('');
  const [buildingName, setBuildingName] = useState<string>('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const authService = AuthService;
      const profile = await authService.fetchUserProfile();
      setUserData(profile);
      console.log('User profile loaded:', profile);

      if (profile) {
        console.log('Profile IDs - appartementId:', profile.appartementId, 'blockId:', profile.blockId, 'buildingId:', profile.buildingId);

        if (profile.appartementId) {
          console.log('Fetching apartment data for:', profile.appartementId);
          try {
            const headers = await authService.getAuthenticatedHeaders();
            const response = await fetch(`${API_BASE_URL}/api/apartments/${profile.appartementId}`, {
              method: 'GET',
              headers,
            });
            if (response.ok) {
              const data = await response.json();
              console.log('Apartment data (home):', data);
              if (data.success && data.apartment) {
                setApartmentNumber(data.apartment.number || '');
                setBlockName(data.apartment.blockName || '');
                console.log('Apartment state set (home):', data.apartment.number, data.apartment.blockName);
              } else {
                console.log('Apartment data not found, falling back to block data');
                // Fall through to block logic
                if (profile.blockId) {
                  console.log('Fetching block data for:', profile.blockId);
                  const headers2 = await authService.getAuthenticatedHeaders();
                  const response2 = await fetch(`${API_BASE_URL}/api/blocks/${profile.blockId}`, {
                    method: 'GET',
                    headers: headers2,
                  });
                  if (response2.ok) {
                    const data2 = await response2.json();
                    console.log('Block data (home):', data2);
                    if (data2.success && data2.block) {
                      setBlockName(data2.block.name || '');
                      if (!buildingName) {
                        setBuildingName(data2.block.buildingName || '');
                      }
                      console.log('Block state set (home):', data2.block.name, data2.block.buildingName);
                    }
                  } else {
                    console.log('Block API failed:', response2.status);
                  }
                }
              }
            } else {
              console.log('Apartment API failed:', response.status, 'falling back to block data');
              // Fall through to block logic
              if (profile.blockId) {
                console.log('Fetching block data for:', profile.blockId);
                const headers2 = await authService.getAuthenticatedHeaders();
                const response2 = await fetch(`${API_BASE_URL}/api/blocks/${profile.blockId}`, {
                  method: 'GET',
                  headers: headers2,
                });
                if (response2.ok) {
                  const data2 = await response2.json();
                  console.log('Block data (home):', data2);
                  if (data2.success && data2.block) {
                    setBlockName(data2.block.name || '');
                    if (!buildingName) {
                      setBuildingName(data2.block.buildingName || '');
                    }
                    console.log('Block state set (home):', data2.block.name, data2.block.buildingName);
                  }
                } else {
                  console.log('Block API failed:', response2.status, '- No location data available');
                }
              } else {
                console.log('No blockId available - No location data available');
              }
            }
          } catch (error) {
            console.error('Error fetching apartment data:', error);
          }
        } else if (profile.blockId) {
          console.log('Fetching block data for:', profile.blockId);
          const headers = await authService.getAuthenticatedHeaders();
          const response = await fetch(`${API_BASE_URL}/api/blocks/${profile.blockId}`, {
            method: 'GET',
            headers,
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Block data (home):', data);
            if (data.success && data.block) {
              setBlockName(data.block.name || '');
              if (!buildingName) {
                setBuildingName(data.block.buildingName || '');
              }
              console.log('Block state set (home):', data.block.name, data.block.buildingName);
            }
          } else {
            console.log('Block API failed:', response.status);
          }
        } else {
          console.log('No appartementId or blockId found in profile');
        }

        if (profile.buildingId) {
          console.log('Fetching building data for:', profile.buildingId);
          const headers = await authService.getAuthenticatedHeaders();
          const response = await fetch(`${API_BASE_URL}/api/buildings/${profile.buildingId}`, {
            method: 'GET',
            headers,
          });
          if (response.ok) {
            const data = await response.json();
            console.log('Building data (home):', data);
            if (data.success && data.building) {
              setBuildingName(data.building.name || '');
              console.log('Building state set (home):', data.building.name);
            }
          } else {
            console.log('Building API failed:', response.status);
          }
        } else {
          console.log('No buildingId found in profile');
        }
      } else {
        console.log('No profile data received');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Data would eventually come from an API
  const notices = [
    "Travaux de maintenance prévus pour demain de 10h à 14h",
  ];

  const upcomingEvents = [
    {
      title: "Réunion mensuelle de la société",
      details: "Dimanche à 10h00",
      location: "Salle communautaire",
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ResidentHeader title="Accueil" subtitle="Bouclier" onMenuPress={toggleMenu} />
      <ScrollView style={styles.scrollContainer}>
      <View style={styles.profileSection}>
        <View style={styles.profileContent}>
          <View style={styles.userInfo}>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{userData?.fullName || 'Resident'}</Text>
              <View style={styles.apartmentInfo}>
                <Text style={styles.buildingText}>{buildingName}</Text>
                <Text style={styles.blockText}>Block: {blockName || 'Non assigné'}</Text>
                <Text style={styles.aptText}>Apt: {apartmentNumber || 'Non assigné'}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <View style={styles.actionGrid}>
          <ActionCard href="/resident/visitors/add_visitors" icon={UserCheck} text="Ajouter Visiteur" />
          <ActionCard href="/resident/depanage/depanage" icon={Tool} text="Dépannage" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avis importants</Text>
        {notices.map((notice, index) => (
          <NoticeCard key={`notice-${index}`} message={notice} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prochains Événements</Text>
        {upcomingEvents.map((event, index) => (
          <UpcomingEventCard
            key={`event-${index}`}
            title={event.title}
            details={event.details}
            location={event.location}
          />
        ))}
      </View>
    </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  profileSection: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileContent: {
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  apartmentInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  apartmentText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  buildingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  blockText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    marginTop: 2,
  },
  aptText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
    marginTop: 2,
  },
  errorText: {
    textAlign: 'center',
    color: '#ef4444',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16, // Use rowGap for vertical spacing
    justifyContent: 'space-around', // Distribute items evenly
  },
});
