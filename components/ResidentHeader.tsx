import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Menu } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResidentHeaderProps {
  title: string;
  subtitle: string;
  onMenuPress: () => void;
  showBackButton?: boolean;
}

export function ResidentHeader({ title, subtitle, onMenuPress, showBackButton = false }: ResidentHeaderProps) {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#0f766e', '#0d9488']}
      style={styles.header}
    >
      <View style={styles.headerContent}>
        {showBackButton ? (
          <TouchableOpacity style={styles.menuButton} onPress={() => router.back()}>
            <ArrowLeft size={28} color="#ffffffff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Menu size={28} color="#fafafaff" />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 20, // Reduced to minimize space
    paddingBottom: 20,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000000ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,

  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    position: 'absolute',
    left: 5,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    padding: 8,
    zIndex: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});
