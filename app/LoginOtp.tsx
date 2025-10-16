import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { API_BASE_URL } from '../constants/Config';
import { useCustomAlert } from '../contexts/AlertContext';

export default function LoginOtp() {
  const { showAlert } = useCustomAlert();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [resendTimer, setResendTimer] = useState(30);
  const router = useRouter();
  const inputsRef = useRef<(TextInput | null)[]>([]);

  const { email } = useLocalSearchParams();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Veuillez entrer le code complet à 6 chiffres');
      return;
    }

    if (attempts >= 3) {
      showAlert('Erreur', 'Trop de tentatives. Veuillez demander un nouveau code.', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/verifyOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push({
          pathname: '../newpass',
          params: { email },
        });
      } else {
        setAttempts(prev => prev + 1);
        if (attempts >= 2) {
          setError('Code incorrect. Demandez un nouveau code.');
        } else {
          setError(`Code incorrect. ${2 - attempts} tentative(s) restante(s).`);
        }
      }
    } catch (error) {
      console.error("Erreur de vérification OTP:", error);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setResendLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/sendOtp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        showAlert('Succès', 'Nouveau code envoyé', 'success');
        setResendTimer(30);
        setAttempts(0);
        setError('');
        setOtp(Array(6).fill(''));
        inputsRef.current[0]?.focus();
      } else {
        showAlert('Erreur', 'Échec de l\'envoi du code', 'error');
      }
    } catch (error) {
      console.error("Erreur lors du renvoi de l'OTP:", error);
      showAlert('Erreur', 'Erreur de connexion', 'error');
    } finally {
      setResendLoading(false);
    }
  };




  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Code de vérification</Text>
        <Text style={styles.subtitle}>Entrez le code envoyé à {email}</Text>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => {
              inputsRef.current[index] = el;
            }}
            style={[styles.otpInput, error && styles.otpInputError]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <TouchableOpacity
          onPress={handleResend}
          disabled={resendTimer > 0 || resendLoading}
          style={[styles.resendButton, (resendTimer > 0 || resendLoading) && styles.resendButtonDisabled]}
        >
          {resendLoading ? (
            <ActivityIndicator size="small" color="#22C55E" />
          ) : (
            <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
              {resendTimer > 0 ? `Renvoyer dans ${resendTimer}s` : 'Renvoyer le code'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, (loading || otp.some(d => d === '')) && styles.disabledButton]}
        onPress={handleVerify}
        disabled={loading || otp.some(d => d === '')}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.continueButtonText}>Continuer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  illustration: {
    width: 100,
    height: 100,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    position: 'relative',
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
  },
  continueButton: {
    backgroundColor: '#a8d5ba', // pastel green
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInputError: {
    borderColor: '#ef4444',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#22C55E',
    fontWeight: '600',
    fontSize: 14,
  },
  resendTextDisabled: {
    color: '#9ca3af',
  },
});

