
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const { width } = Dimensions.get('window');

export type AlertType = 'success' | 'error' | 'warning';

interface CustomAlertProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: AlertType;
}

const ICONS = {
  success: <CheckCircle size={48} color="#22C55E" />,
  error: <XCircle size={48} color="#EF4444" />,
  warning: <AlertTriangle size={48} color="#F59E0B" />,
};

const TITLE_COLORS = {
  success: '#166534',
  error: '#991B1B',
  warning: '#92400E',
};

const CustomAlert: React.FC<CustomAlertProps> = ({
  isVisible,
  onClose,
  title,
  message,
  type = 'success',
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropTransitionOutTiming={0}
      style={styles.modal}
    >
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>{ICONS[type]}</View>
        <ThemedText style={[styles.title, { color: TITLE_COLORS[type] }]} type="title">
          {title}
        </ThemedText>
        <ThemedText style={styles.message} type="default">
          {message}
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.85,
    maxWidth: 320,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomAlert;
