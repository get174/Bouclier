import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Eye, EyeOff, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ResidentHeader } from "../components/ResidentHeader";
import { API_BASE_URL } from "../constants/Config";
import { useCustomAlert } from "../contexts/AlertContext";

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function NewPass() {
  const router = useRouter();
  const { showAlert } = useCustomAlert();
  const { email } = useLocalSearchParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureNew, setSecureNew] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Faible", color: "#ef4444" };
    if (score <= 3) return { score, label: "Moyen", color: "#f59e0b" };
    if (score <= 4) return { score, label: "Bon", color: "#3b82f6" };
    return { score, label: "Excellent", color: "#10b981" };
  };

  const getPasswordRequirements = (password: string): PasswordRequirement[] => [
    { text: "Au moins 8 caractères", met: password.length >= 8 },
    { text: "Une lettre minuscule", met: /[a-z]/.test(password) },
    { text: "Une lettre majuscule", met: /[A-Z]/.test(password) },
    { text: "Un chiffre", met: /[0-9]/.test(password) },
    { text: "Un caractère spécial", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const passwordStrength = getPasswordStrength(newPassword);
  const requirements = getPasswordRequirements(newPassword);
  const isPasswordValid = requirements.every(req => req.met);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isButtonDisabled = !isPasswordValid || !passwordsMatch || loading;

  const handleSavePassword = async () => {
    if (!isPasswordValid) {
      showAlert("Erreur", "Le mot de passe ne respecte pas les critères de sécurité.", "error");
      return;
    }
    if (!passwordsMatch) {
      showAlert("Erreur", "Les mots de passe ne correspondent pas.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/setPassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        showAlert("Succès", "Votre mot de passe a été mis à jour.", "success");
        router.replace("/login");
      } else {
        showAlert("Erreur", data.message || "Une erreur est survenue.", "error");
      }
    } catch (_error) {
      showAlert("Erreur", "Impossible de contacter le serveur.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0f766e" barStyle="light-content" />
      <ResidentHeader
        title="Nouveau mot de passe"
        subtitle="Sécurisez votre compte"
        showBackButton={true}
        onBackPress={() => router.back()}
      />

      <View style={styles.form}>
        <Text style={styles.subtitle}>
          Créez un nouveau mot de passe sécurisé pour votre compte.
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={secureNew}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity onPress={() => setSecureNew(!secureNew)} style={styles.eyeIcon}>
            {secureNew ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
          </TouchableOpacity>
        </View>

        {newPassword.length > 0 && (
          <View style={styles.strengthContainer}>
            <Text style={styles.strengthLabel}>Force du mot de passe:</Text>
            <View style={styles.strengthBar}>
              <View style={[styles.strengthFill, { width: `${(passwordStrength.score / 5) * 100}%`, backgroundColor: passwordStrength.color }]} />
            </View>
            <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
              {passwordStrength.label}
            </Text>
          </View>
        )}

        {newPassword.length > 0 && (
          <View style={styles.requirementsContainer}>
            {requirements.map((req, index) => (
              <View key={index} style={styles.requirement}>
                {req.met ? (
                  <Check size={16} color="#10b981" />
                ) : (
                  <X size={16} color="#ef4444" />
                )}
                <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
                  {req.text}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureConfirm}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)} style={styles.eyeIcon}>
            {secureConfirm ? <EyeOff size={20} color="#64748b" /> : <Eye size={20} color="#64748b" />}
          </TouchableOpacity>
        </View>

        {confirmPassword.length > 0 && (
          <View style={styles.matchIndicator}>
            {passwordsMatch ? (
              <View style={styles.matchContainer}>
                <Check size={16} color="#10b981" />
                <Text style={styles.matchText}>Les mots de passe correspondent</Text>
              </View>
            ) : (
              <View style={styles.matchContainer}>
                <X size={16} color="#ef4444" />
                <Text style={styles.matchTextError}>Les mots de passe ne correspondent pas</Text>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, isButtonDisabled && styles.submitButtonDisabled]}
          onPress={handleSavePassword}
          disabled={isButtonDisabled}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Enregistrer</Text>
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
  form: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#1e293b",
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
  strengthContainer: {
    marginBottom: 16,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    marginBottom: 8,
  },
  strengthFill: {
    height: "100%",
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: "600",
  },
  requirementsContainer: {
    marginBottom: 16,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 8,
  },
  requirementMet: {
    color: "#10b981",
  },
  matchIndicator: {
    marginBottom: 16,
  },
  matchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  matchText: {
    fontSize: 14,
    color: "#10b981",
    marginLeft: 8,
  },
  matchTextError: {
    fontSize: 14,
    color: "#ef4444",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#22C55E",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: "#a5d6a7",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
});
