
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

export default function Login() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [infoMessage, setInfoMessage] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showOtpButton, setShowOtpButton] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const checkEmail = async (emailToCheck: string) => {
    if (!emailToCheck) {
      setEmailExists(null);
      setInfoMessage("");
      setShowPasswordInput(false);
      setShowOtpButton(false);
      return;
    }

    if (!emailToCheck.includes(".com")) {
      setEmailExists(null);
      setInfoMessage("");
      setShowPasswordInput(false);
      setShowOtpButton(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/checkEmail`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailToCheck }),
        }
      );

      const data = await response.json();

      setEmailExists(data.exists);
      setShowPasswordInput(data.exists && data.hasPassword);

      if (!data.exists) {
        setInfoMessage("Email inconnu, cliquez sur 'Connexion par OTP'");
        setShowPasswordInput(false);
        setShowOtpButton(true);
      } else if (data.hasPassword) {
        setInfoMessage("");
        setShowPasswordInput(true);
        setShowOtpButton(false);
      } else {
        setInfoMessage("click sur connexion par otp pour vs enregistrer");
        setShowPasswordInput(false);
        setShowOtpButton(true);
      }
    } catch (error) {
      console.error(error);
      setEmailExists(null);
      setInfoMessage("");
      setShowPasswordInput(false);
      setShowOtpButton(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Erreur', 'Veuillez remplir tous les champs', 'error');
      return;
    }

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingTime = Math.ceil((lockoutUntil - Date.now()) / 1000);
      showAlert('Erreur', `Trop de tentatives. Réessayez dans ${remainingTime} secondes.`, 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Validate token response with better error handling
        if (!data.accessToken || !data.refreshToken || !data.expiresIn) {
          console.error('Invalid token response:', data);
          throw new Error('Réponse serveur invalide - tokens ou expiresIn manquants');
        }

        // Validate token format
        if (typeof data.accessToken !== 'string' || !data.accessToken.trim() ||
            typeof data.refreshToken !== 'string' || !data.refreshToken.trim() ||
            typeof data.expiresIn !== 'number' || data.expiresIn <= 0) {
          console.error('Invalid token format:', data);
          throw new Error('Format de tokens invalide reçu du serveur');
        }

        // Store tokens securely with proper validation
        try {
          const tokenData = {
            accessToken: data.accessToken.trim(),
            refreshToken: data.refreshToken.trim(),
            expiresAt: Date.now() + (data.expiresIn * 1000)
          };

          // Validate token data before storing
          if (!tokenData.accessToken || !tokenData.refreshToken || !tokenData.expiresAt) {
            throw new Error('Données de token invalides');
          }

          await SecureStore.setItemAsync("authTokens", JSON.stringify(tokenData));
        } catch (storageError) {
          console.error('Error storing tokens:', storageError);
          throw new Error('Erreur lors de la sauvegarde des tokens');
        }

        setToken(data.accessToken);

        // Fetch user buildingId and other info
        const userResponse = await fetch(`${API_BASE_URL}/api/user/userBuilding`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        let userData: any = { email, token: data.accessToken, status: data.status, isTemporary: data.isTemporary, role: data.role };

        if (userResponse.ok) {
          const userDataResponse = await userResponse.json();
          userData = {
            ...userData,
            buildingId: userDataResponse.buildingId,
            blockId: userDataResponse.blockId,
            appartementId: userDataResponse.appartementId,
          };
        }

        // DEBUG: Log user data to diagnose redirection issue
        console.log('=== DEBUG USER DATA ===');
        console.log('userData:', JSON.stringify(userData, null, 2));
        console.log('buildingId:', userData.buildingId);
        console.log('blockId:', userData.blockId);
        console.log('appartementId:', userData.appartementId);
        console.log('isTemporary:', userData.isTemporary);
        console.log('role:', userData.role);
        console.log('======================');

        // Store complete user data - ensure it's properly stringified
        const userDataString = JSON.stringify(userData);
        if (typeof userDataString === 'string') {
          await SecureStore.setItemAsync("userData", userDataString);
        } else {
          console.error('Failed to stringify user data:', userData);
          showAlert('Erreur', 'Impossible de sauvegarder les données utilisateur', 'error');
        }

        showAlert('Succès', 'Connexion réussie', 'success');

        // Redirection en fonction du rôle de l'utilisateur et de l'affectation de construction
        if (userData.role === 'resident') {
          // Vérifiez si l'utilisateur a déjà une configuration complète
          if (userData.buildingId && userData.blockId && userData.appartementId && userData.isTemporary === false) {
            console.log('✅ Configuration complète détectée - redirection vers ./resident');
            // Configuration complète - allez directement à la maison résidente
            router.push("./resident");
          } else {
            console.log('❌ Configuration incomplète - processus étape par étape');
            // Configuration incomplète - suivez le processus étape par étape
            if (!userData.buildingId) {
              console.log('🔍 Pas de buildingId - redirection vers /select_building');
              // Aucun bâtiment affecté - allez à la sélection du bâtiment
              router.push("/select_building");
            } else if (!userData.blockId) {
              console.log('🔍 BuildingId présent mais pas de blockId - redirection vers /display_block');
              // Bâtiment attribué mais pas de bloc - allez dans la sélection de blocs
              router.push({
                pathname: "/display_block",
                params: { buildingId: userData.buildingId }
              });
            } else if (!userData.appartementId) {
              console.log('🔍 BuildingId et blockId présents mais pas d appartementId - redirection vers /display_flat');
              // Bâtiment et bloc attribué mais pas d'appartement - allez à la sélection d'appartements
              router.push({
                pathname: "/display_flat",
                params: { blockId: userData.blockId }
              });
            } else {
              console.log('🔍 Toutes les affectations présentes mais isTemporary=true - redirection vers /display_flat');
              // Toutes les affectations complètes mais toujours temporaires - allez à la sélection des appartements pour finaliser
              router.push({
                pathname: "/display_flat",
                params: { blockId: userData.blockId }
              });
            }
          }
        } else if (userData.role === 'security') {
          if (!userData.buildingId) {
            router.push("/select_building_security");
          } else {
            router.push("/securite");
          }
        } else {
          router.push("/role_select");
        }
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);

        if (newAttempts >= 5) {
          setLockoutUntil(Date.now() + 5 * 60 * 1000); // 5 minutes lockout
          showAlert('Erreur', 'Trop de tentatives. Compte bloqué pour 5 minutes.', 'error');
        } else {
          showAlert('Erreur', data.message || 'Connexion échouée', 'error');
        }
      }
    } catch (error) {
      console.error("Erreur :", error);
      showAlert('Erreur', 'Problème de connexion au serveurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    setIsSendingOtp(true);
    try {
      await fetch(`${API_BASE_URL}/api/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      router.push({
        pathname: "/LoginOtp",
        params: { email },
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'OTP :", error);
      showAlert('Erreur', "L'envoi de l'OTP a échoué.", 'error');
    } finally {
      setIsSendingOtp(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (email.length > 5) {
        checkEmail(email);
      } else {
        setEmailExists(null);
        setShowOtpButton(false);
        setShowPasswordInput(false);
        setInfoMessage("");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const timer = setTimeout(() => {
        setLockoutUntil(null);
        setFailedAttempts(0);
      }, lockoutUntil - Date.now());
      return () => clearTimeout(timer);
    }
  }, [lockoutUntil]);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#008000" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Connexion</Text>
      </View>
      <View style={styles.banner}>
        <Image
          source={require("../assets/images/buildings.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />

        <Text style={styles.bannerText}>
          Entrez votre adresse e-mail ou numéro pour continuer.
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

        {infoMessage && !loading && (
          <Text style={{ color: "orange", marginTop: 10 }}>{infoMessage}</Text>
        )}

        {showPasswordInput && (
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              placeholder="Entrez votre mot de passe"
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              onPress={toggleSecureEntry}
              style={styles.eyeIcon}
            >
              {secureTextEntry ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!emailExists || (emailExists && !showPasswordInput)) &&
              styles.continueButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!emailExists || (emailExists && !showPasswordInput)}
        >
          <Text style={styles.continueButtonText}>Continuer</Text>
        </TouchableOpacity>
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push('/forgotPassword')}>
            <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          {showOtpButton && (
            <TouchableOpacity
              onPress={handleOtpLogin}
              disabled={isSendingOtp}
              style={styles.otpButtonContainer}
            >
              {isSendingOtp ? (
                <ActivityIndicator size="small" color="#22C55E" />
              ) : (
                <Text style={styles.otpLogin}>Connexion par OTP</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
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
  illustration: {
    width: 120,
    height: 80,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  eyeIcon: {
    padding: 4,
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
  bottomLinks: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  forgotPassword: {
    color: "#64748b",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  otpLogin: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "700",
  },
  otpButtonContainer: {
    minWidth: 120, // Donne une largeur minimale pour accommoder l'indicateur
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
