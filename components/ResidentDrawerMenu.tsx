import * as ImagePicker from 'expo-image-picker';
import { Link, useRouter } from 'expo-router';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  LogOut,
  QrCode,
  Send,
  User,
  UserCheck,
  Users,
  Wrench
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
// Update the path below if your authService is located elsewhere, e.g.:
// import authService from '../services/authService';
// or
// import authService from '../../services/authService';
import { API_BASE_URL } from '../constants/Config';
import authService from '../services/authService';

const { width } = Dimensions.get('window');

interface ResidentDrawerMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ResidentDrawerMenu({ isVisible, onClose }: ResidentDrawerMenuProps) {
  const router = useRouter();
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [visitorExpanded, setVisitorExpanded] = useState(false);
  const [depannageExpanded, setDepannageExpanded] = useState(false);

  const [fullName, setFullName] = useState<string>(''); // State for user's full name
  const [apartmentNumber, setApartmentNumber] = useState<string>(''); // State for apartment number
  const [blockName, setBlockName] = useState<string>(''); // State for block name
  const [buildingName, setBuildingName] = useState<string>(''); // State for building name
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null); // State for profile image URI
  const slideAnim = React.useRef(new Animated.Value(-width * 0.8)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data, which includes buildingId and a resident's apartmentId
        const userData = await authService.fetchUserProfile();
        if (userData) {
          setFullName(userData.fullName || '');
          setProfileImageUri(userData.profileImage ? `${API_BASE_URL}/${userData.profileImage}` : null);
          if (userData.appartementId) {
            // Using the apartmentId from the user's profile, fetch apartment details from the backend
            const headers = await authService.getAuthenticatedHeaders();
            const response = await fetch(`${API_BASE_URL}/api/apartments/${userData.appartementId}`, {
              method: 'GET',
              headers,
            });
            if (response.ok) {
              const data = await response.json();
              console.log('Apartment data:', data);
              if (data.success && data.apartment) {
                setApartmentNumber(data.apartment.number || '');
                setBlockName(data.apartment.blockName || '');
                console.log('Apartment state set:', data.apartment.number, data.apartment.blockName);
              }
            }
          }
          if (userData.buildingId) {
            // Using the buildingId from the user's profile, fetch building details from the backend
            const headers = await authService.getAuthenticatedHeaders();
            const response = await fetch(`${API_BASE_URL}/api/buildings/${userData.buildingId}`, {
              method: 'GET',
              headers,
            });
            if (response.ok) {
              const data = await response.json();
              console.log('Building data:', data);
              if (data.success && data.building) {
                setBuildingName(data.building.name || '');
                console.log('Building state set:', data.building.name);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user or apartment data:', error);
      }
    };

    if (isVisible) {
      fetchUserData();
    }
  }, [isVisible]);

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleImagePicker = async () => {
    Alert.alert(
      "Changer la photo de profil",
      "Choisissez une option",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Prendre une photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission refusée', 'La permission d\'accès à la caméra est requise.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              await uploadProfileImage(result.assets[0].uri);
            }
          }
        },
        {
          text: "Choisir depuis la galerie",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission refusée', 'La permission d\'accès à la galerie est requise.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: 'images',
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled) {
              await uploadProfileImage(result.assets[0].uri);
            }
          }
        }
      ]
    );
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      const headers = await authService.getAuthenticatedHeaders();
      // Remove Content-Type from headers when using FormData
      const { 'Content-Type': _, ...uploadHeaders } = headers;

      const formData = new FormData();
      formData.append('profileImage', {
        uri,
        name: 'profile.jpg',
        type: 'image/jpeg',
      } as any);
      // Note: We need to get current fullName and role, but for now we'll assume they exist
      formData.append('fullName', fullName);
      formData.append('role', 'resident'); // Assuming resident role

      console.log('Uploading to:', `${API_BASE_URL}/api/update-profile`);
      console.log('FormData contents:', formData);

      const response = await fetch(`${API_BASE_URL}/api/update-profile`, {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload success:', data);
        setProfileImageUri(`${API_BASE_URL}/${data.profileImage}`);
        Alert.alert('Succès', 'Photo de profil mise à jour avec succès.');
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        Alert.alert('Erreur', `Échec de la mise à jour: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        Alert.alert('Erreur réseau', 'Vérifiez votre connexion internet et l\'adresse du serveur.');
      } else {
        Alert.alert('Erreur', `Une erreur s\'est produite: ${error.message}`);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        { 
          text: "Confirmer", 
          onPress: async () => {
            onClose(); // Close the menu first
            await authService.clearTokens();
            router.replace('/login');
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={0.5}
        >
          <View style={styles.overlayBackground} />
        </TouchableOpacity>
      )}
      <Animated.View
        style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}
      >
        <View style={styles.menuContent}>
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.profileImageContainer} onPress={handleImagePicker}>
              <View style={styles.profileImage}>
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.profileImageStyle} />
                ) : (
                  <Text style={styles.profileInitial}>{fullName ? fullName.charAt(0) : 'G'}</Text>
                )}
              </View>
            </TouchableOpacity>
            <Text style={styles.profileName}>{fullName || 'Get'}</Text>
            <Text style={styles.profileApartment}>
              {apartmentNumber ? `Appartement ${apartmentNumber}` : 'Appartement A-101'}
              {blockName ? `\n${blockName}` : ''}
              {buildingName ? `\n${buildingName}` : ''}
            </Text>
          </View>

          <ScrollView style={styles.menuOptions}>
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setProfileExpanded(!profileExpanded)}
              >
                <View style={styles.menuItemContent}>
                  <Users size={20} color="#0891b2" />
                  <Text style={styles.menuItemText}>Profils</Text>
                </View>
                {profileExpanded ? (
                  <ChevronUp size={20} color="#0891b2" />
                ) : (
                  <ChevronDown size={20} color="#0891b2" />
                )}
              </TouchableOpacity>

              {profileExpanded && (
                <View style={styles.subMenu}>
                  <TouchableOpacity style={styles.subMenuItem}>
                    <View style={styles.subMenuContent}>
                      <User size={16} color="#0891b2" />
                      <Text style={styles.subMenuText}>Mes infos</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.subMenuItem}>
                    <View style={styles.subMenuContent}>
                      <Users size={16} color="#0891b2" />
                      <Text style={styles.subMenuText}>Membre de ma famille</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setVisitorExpanded(!visitorExpanded)}
              >
                <View style={styles.menuItemContent}>
                  <UserCheck size={20} color="#0891b2" />
                  <Text style={styles.menuItemText}>Gestion de visiteur</Text>
                </View>
                {visitorExpanded ? (
                  <ChevronUp size={20} color="#0891b2" />
                ) : (
                  <ChevronDown size={20} color="#0891b2" />
                )}
              </TouchableOpacity>

              {visitorExpanded && (
                <View style={styles.subMenu}>
                  <Link href="/resident/visitors/my_visitors" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <Users size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Mes visiteurs</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/resident/visitors/my_qrcodes" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <QrCode size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Mes QR codes</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <TouchableOpacity style={styles.subMenuItem}>
                    <View style={styles.subMenuContent}>
                      <Clock size={16} color="#0891b2" />
                      <Text style={styles.subMenuText}>Visiteurs en attente</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>



            {/* Dépannage section */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setDepannageExpanded(!depannageExpanded)}
              >
                <View style={styles.menuItemContent}>
                  <Wrench size={20} color="#0891b2" />
                  <Text style={styles.menuItemText}>Dépannage</Text>
                </View>
                {depannageExpanded ? (
                  <ChevronUp size={20} color="#0891b2" />
                ) : (
                  <ChevronDown size={20} color="#0891b2" />
                )}
              </TouchableOpacity>
              {depannageExpanded && (
                <View style={styles.subMenu}>
                  <Link href="/resident/depanage/depanage" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <Send size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Demande de dépannage</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/resident/depanage/RepairScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <FileText size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Mes dépannages</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.logoutContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <View style={styles.menuItemContent}>
                <LogOut size={20} color="#ffffff" />
                <Text style={styles.logoutText}>Déconnexion</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.8,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  menuContent: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#0f766e',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  profileInitial: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f766e',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileApartment: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  menuOptions: {
    flex: 1,
    paddingVertical: 20,
  },
  menuSection: {
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  subMenu: {
    backgroundColor: '#f8fafc',
    paddingLeft: 32, // Adjusted padding
  },
  subMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  subMenuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subMenuText: {
    fontSize: 14,
    color: '#475569',
  },
  logoutContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  profileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

