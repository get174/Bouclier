import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { API_BASE_URL } from "../constants/Config";
import { useCustomAlert } from "../contexts/AlertContext";

export default function Register() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const handleRegister = async () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      showAlert('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Erreur', 'Les mots de passe ne correspondent pas', 'error');
      return;
    }

    if (password.length < 6) {
      showAlert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Succès', 'Compte créé avec succès! Veuillez vous connecter.', 'success');
        router.push('/login');
      } else {
        showAlert('Erreur', data.message || 'Erreur lors de l\'inscription', 'error');
      }
    } catch (error) {
      console.error("Erreur :", error);
      showAlert('Erreur', 'Problème de connexion au serveur', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    // Placeholder for Google OAuth implementation
    showAlert('Info', 'Connexion Google - Fonctionnalité à venir', 'warning');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      
      {/* Header with blurred background image */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../assets/images/buildings.png")}
          style={styles.headerImage}
          blurRadius={3}
        />
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Créer un compte</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Nom complet"
            placeholderTextColor="#94a3b8"
            autoCapitalize="words"
          />

          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Téléphone"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              placeholder="Mot de passe"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              onPress={() => setSecureTextEntry(!secureTextEntry)}
              style={styles.eyeIcon}
            >
              {secureTextEntry ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={secureConfirmTextEntry}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
              style={styles.eyeIcon}
            >
              {secureConfirmTextEntry ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Text>
          </TouchableOpacity>

          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>ou</Text>
            <View style={styles.separatorLine} />
          </View>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleRegister}
          >
            <Text style={styles.googleButtonText}>S&apos;enregistrer avec Google</Text>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.loginLink}>Connectez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    height: 200,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingTop: 30,
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
  passwordContainer: {
    position: "relative",
    marginBottom: 16,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 14,
    padding: 4,
  },
  registerButton: {
    backgroundColor: "#22C55E",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
  },
  registerButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "System",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#64748b",
    fontSize: 14,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 12,
    marginBottom: 24,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleButtonText: {
    color: "#444444",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginLinkText: {
    color: "#64748b",
    fontSize: 14,
  },
  loginLink: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "700",
  },
});
