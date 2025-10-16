import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import apiService from '../../../services/apiService';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { API_BASE_URL } from '@/constants/Config';
import { useCustomAlert } from '../../../contexts/AlertContext';

interface Visitor {
  _id: string;
  name: string;
  accessId: string;
  validUntil: string;
  status: 'active' | 'expired' | 'used';
  photoUrl?: string;
}

export default function VisitorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [loading, setLoading] = useState(true);
  const qrCodeRef = useRef<ViewShot>(null);

  useEffect(() => {
    if (id) {
      const fetchVisitor = async () => {
        try {
          setLoading(true);
          const response = await apiService.get<Visitor>(`/api/visitors/${id}`);
          setVisitor(response.data);
        } catch (error) {
          console.error("Failed to fetch visitor details", error);
          showAlert('Erreur', 'Impossible de charger les détails du visiteur.', 'error');
          router.back();
        } finally {
          setLoading(false);
        }
      };
      fetchVisitor();
    }
  }, [id]);

  const shareQrCode = async () => {
    const viewShot = qrCodeRef.current;
    if (viewShot && viewShot.capture) {
      try {
        const uri = await viewShot.capture();
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Partager ce QR code',
        });
      } catch (error) {
        console.error("Erreur lors du partage du QR code:", error);
        showAlert('Erreur', 'Impossible de partager le QR code.', 'error');
      }
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Chargement...</ThemedText>
      </ThemedView>
    );
  }

  if (!visitor) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Visiteur non trouvé.</ThemedText>
      </ThemedView>
    );
  }

  const imageUrl = visitor.photoUrl
    ? `${API_BASE_URL}/${visitor.photoUrl}`
    : null;

  return (
    <ThemedView style={styles.container}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.visitorImage} />
      ) : (
        <View style={styles.visitorImagePlaceholder}>
          <ThemedText>Pas de photo</ThemedText>
        </View>
      )}
      <View style={styles.qrContainer}>
        <ViewShot ref={qrCodeRef} options={{ format: 'png', quality: 1.0 }}>
          <View style={styles.qrCodeBackground}>
            <QRCode value={visitor.accessId} size={250} />
          </View>
        </ViewShot>
        <Text style={styles.visitorName}>{visitor.name}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={shareQrCode}>
          <Text style={styles.buttonText}>Partager</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  visitorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#0891b2',
  },
  visitorImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  qrCodeBackground: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  visitorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    color: '#1e293b',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  shareButton: {
    backgroundColor: '#0891b2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
});
