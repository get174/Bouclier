import { Link, useRouter } from 'expo-router';
import {
  Archive,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  CreditCard,
  FileText,
  History as HistoryIcon,
  LogOut,
  Package,
  PackagePlus,
  PlusCircle,
  QrCode,
  Receipt,
  Send,
  User,
  UserCheck,
  Users,
  Wrench,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  const [deliveryExpanded, setDeliveryExpanded] = useState(false);
  const [depannageExpanded, setDepannageExpanded] = useState(false);
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [fullName, setFullName] = useState<string>(''); // State for user's full name
  const [apartmentNumber, setApartmentNumber] = useState<string>(''); // State for apartment number
  const [blockName, setBlockName] = useState<string>(''); // State for block name
  const [buildingName, setBuildingName] = useState<string>(''); // State for building name
  const slideAnim = React.useRef(new Animated.Value(-width * 0.8)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data, which includes buildingId and a resident's apartmentId
        const userData = await authService.fetchUserProfile();
        if (userData) {
          setFullName(userData.fullName || '');
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
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Text style={styles.profileInitial}>{fullName ? fullName.charAt(0) : 'G'}</Text>
              </View>
            </View>
            <Text style={styles.profileName}>{fullName || 'Get'}</Text>
            <Text style={styles.profileApartment}>{apartmentNumber ? `Appartement ${apartmentNumber}${blockName ? ` - ${blockName}` : ''}${buildingName ? ` - ${buildingName}` : ''}` : 'Appartement A-101'}</Text>
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

            {/* Livraison section */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setDeliveryExpanded(!deliveryExpanded)}
              >
                <View style={styles.menuItemContent}>
                  <Package size={20} color="#0891b2" />
                  <Text style={styles.menuItemText}>Livraison</Text>
                </View>
                {deliveryExpanded ? (
                  <ChevronUp size={20} color="#0891b2" />
                ) : (
                  <ChevronDown size={20} color="#0891b2" />
                )}
              </TouchableOpacity>
              {deliveryExpanded && (
                <View style={styles.subMenu}>
                  <Link href="/resident/livraison/AddDeliveryScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <PackagePlus size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Nouvelle livraison</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                
                  <Link href="/resident/livraison/DeliveryScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <ClipboardList size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Détails de livraison</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/resident/livraison/DeliveryScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <Archive size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Mes livraison</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                
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

            {/* Paiement section */}
            <View style={styles.menuSection}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setPaymentExpanded(!paymentExpanded)}
              >
                <View style={styles.menuItemContent}>
                  <CreditCard size={20} color="#0891b2" />
                  <Text style={styles.menuItemText}>Paiement</Text>
                </View>
                {paymentExpanded ? (
                  <ChevronUp size={20} color="#0891b2" />
                ) : (
                  <ChevronDown size={20} color="#0891b2" />
                )}
              </TouchableOpacity>
              {paymentExpanded && (
                <View style={styles.subMenu}>
                  <Link href="/resident/paiment/PaymentsScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <Receipt size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Mes factures</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/resident/paiment/PaymentHistoryScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <HistoryIcon size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Historique des paiements</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/resident/paiment/AddPaymentScreen" asChild>
                    <TouchableOpacity style={styles.subMenuItem} onPress={onClose}>
                      <View style={styles.subMenuContent}>
                        <PlusCircle size={16} color="#0891b2" />
                        <Text style={styles.subMenuText}>Ajouter un paiement</Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <View style={styles.menuItemContent}>
                <LogOut size={20} color="#0891b2" />
                <Text style={styles.menuItemText}>Déconnexion</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
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
});

