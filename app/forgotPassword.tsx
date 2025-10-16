import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { API_BASE_URL } from "../constants/Config";
import { useCustomAlert } from "../contexts/AlertContext";

export default function ForgotPassword() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      showAlert('Erreur', 'Veuillez entrer votre adresse e-mail', 'error');
      return;
    }

    if (!email.includes("@")) {
      showAlert('Erreur', 'Veuillez entrer une adresse e-mail valide', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showAlert('Succès', 'Code OTP envoyé à votre e-mail', 'success');
        router.push({
          pathname: "/loginOtp",
          params: { email },
        });
      } else {
        const data = await response.json();
        showAlert('Erreur', data.message || 'Échec de l\'envoi de l\'OTP', 'error');
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'OTP :", error);
      showAlert('Erreur', 'Problème de connexion au serveur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Mot de passe oublié</Text>
      </View>
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/buildings.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />

        <Text style={styles.bannerText}>
          Entrez votre adresse e-mail pour recevoir un code de réinitialisation.
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Entrez votre Email"
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={[styles.continueButton, (!email || loading) && styles.continueButtonDisabled]}
          onPress={handleSendOtp}
          disabled={!email || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.continueButtonText}>Envoyer le code</Text>
          )}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 46,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
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
  backButton: {
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "black",
    textAlign: "center",
  },
  form: {
    flex: 2,
    padding: 20,
  },
  input: {
    height: 48,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#1e293b",
    fontFamily: "System",
  },
  continueButton: {
    backgroundColor: "#22C55E",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "System",
  },
});
