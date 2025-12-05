import { Link } from 'expo-router';
import { MessageCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ResidentHeader } from '../../../components/ResidentHeader';
import { useMenu } from '../../../contexts/MenuContext';
import ApiService from '../../../services/apiService';
import AuthService from '../../../services/authService';

interface Building {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface BuildingResponse {
  building: {
    name: string;
  };
}

export default function ChatListScreen() {
  const { toggleMenu } = useMenu();
  const [building, setBuilding] = useState<Building | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBuilding();
  }, []);

  const fetchUserBuilding = async () => {
    try {
      const buildingId = await AuthService.getBuildingId();
      if (buildingId) {
        const response = await ApiService.get<BuildingResponse>(`/api/buildings/${buildingId}`);
        setBuilding({
          id: buildingId,
          name: response.data.building.name,
          lastMessage: 'Bienvenue dans le chat de résidence',
          lastMessageTime: '10:32',
        });
      }
    } catch (error) {
      console.error('Error fetching building:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ResidentHeader title="Chat" subtitle="Bouclier" onMenuPress={toggleMenu} />
      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Mes discussions</Text>

        {loading ? (
          <Text style={styles.loadingText}>Chargement...</Text>
        ) : building ? (
          <Link href={`/resident/chat/${building.id}` as any} asChild>
            <TouchableOpacity style={styles.chatCard}>
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>
                  <MessageCircle size={24} color="#0891b2" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.buildingName}>{building.name}</Text>
                  <Text style={styles.lastMessage} numberOfLines={1}>
                    {building.lastMessage}
                  </Text>
                </View>
                <View style={styles.rightContainer}>
                  <Text style={styles.lastMessageTime}>{building.lastMessageTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ) : (
          <Text style={styles.emptyText}>Aucun bâtiment trouvé</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginTop: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginTop: 40,
  },
  chatCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  buildingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748b',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  lastMessageTime: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
});
