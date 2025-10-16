import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ArrowRight, LogOut, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useCustomAlert } from "../contexts/AlertContext";

export default function SelectBuildingSecurity() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleRegister = () => {
    // Navigate to building registration page or handle registration logic
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              // Clear all authentication data
              const keysToRemove = [
                "authToken",
                "refreshToken",
                "userId",
                "userEmail",
                "userRole",
                "userData",
              ];

              for (const key of keysToRemove) {
                await SecureStore.deleteItemAsync(key);
              }

              // Navigate to login page
              router.replace("/login");
            } catch (error) {
              console.error("Erreur lors de la déconnexion:", error);
              showAlert('Erreur', 'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.', 'error');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sélection Immeuble Sécurité</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <LogOut size={24} color="red" />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/buildings.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <Text style={styles.bannerText}>
          Sélectionnez limmeuble que vous sécurisez
        </Text>
      </View>

      <View style={styles.selectorContainer}>
        <TextInput
          style={styles.selectorInput}
          placeholder="Sélectionner l'immeuble"
          placeholderTextColor="#94a3b8"
          value={selectedBuilding}
          onPress={() => router.push("../display_building_security")}
        />
        <Shield size={24} color="#64748b" style={styles.buildingIcon} />
      </View>

      <Text style={styles.helpText}>
        Si limmeuble nest pas dans la liste, veuillez lenregistrer.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Limmeuble nest pas encore sur Bouclier ?
        </Text>
        <Text style={styles.cardSubtitle}>
          Référencez cet immeuble et contribuez à la sécurité de la communauté.
        </Text>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("../add_building")}
        >
          <Text style={styles.registerButtonText}>Enregistrer</Text>
          <ArrowRight size={20} color="#22C55E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  logoutButton: {
    position: "absolute",
    top: 10,
    right: 0,
    padding: 8,
    color: "Red",
    opacity: 1,
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 20,
  },
  selectorInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1e293b",
  },
  buildingIcon: {
    marginLeft: 8,
  },
  helpText: {
    marginTop: 12,
    fontSize: 14,
    padding: 10,
    color: "#64748b",
  },
  card: {
    backgroundColor: "#f5f0e9",
    borderRadius: 12,
    padding: 20,
    marginTop: 30,
    position: "relative",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#d0e8d8",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  registerButtonText: {
    color: "#22C55E",
    fontWeight: "700",
    fontSize: 16,
    marginRight: 8,
  },
  illustration: {
    width: 120,
    height: 120,
    position: "absolute",
    top: 10,
    right: 10,
  },
  banner: {
    flexDirection: "row",
    backgroundColor: "#f5f0e9",
    padding: 16,
    alignItems: "center",
    gap: 12,
  },
  bannerImage: {
    width: 60,
    height: 60,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    color: "#444444",
  },
});
