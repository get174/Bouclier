import { MoreHorizontal, Settings, Wrench, Zap } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';

type ProblemTypeKey = 'plomberie' | 'electricite' | 'ascenseur' | 'autre';

const problemTypes: Record<ProblemTypeKey, { label: string; icon: React.ComponentType<any>; color: string }> = {
  plomberie: { label: 'Plomberie', icon: Wrench, color: '#0891b2' },
  electricite: { label: 'Électricité', icon: Zap, color: '#f59e0b' },
  ascenseur: { label: 'Ascenseur', icon: Settings, color: '#10b981' },
  autre: { label: 'Autre', icon: MoreHorizontal, color: '#6b7280' },
};

const mockRepairs = [
  {
    id: '1',
    type: 'plomberie',
    description: 'Fuite d\'eau dans la cuisine',
    status: 'En cours',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    type: 'electricite',
    description: 'Problème d\'éclairage dans le salon',
    status: 'Résolu',
    image: '',
  },
  {
    id: '3',
    type: 'ascenseur',
    description: 'Ascenseur bloqué au 3ème étage',
    status: 'En attente',
    image: 'https://via.placeholder.com/150',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  header: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  itemType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  itemStatus: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891b2',
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  statusEnCours: {
    color: '#0891b2',
  },
  statusResolue: {
    color: '#22c55e',
  },
  statusEnAttente: {
    color: '#f59e0b',
  },
});

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'en cours':
      return styles.statusEnCours;
    case 'résolu':
      return styles.statusResolue;
    case 'en attente':
      return styles.statusEnAttente;
    default:
      return styles.statusEnCours;
  }
}

export default function RepairScreen() {
  const renderItem = ({ item }: { item: typeof mockRepairs[0] }) => {
    const typeKey = item.type as ProblemTypeKey;
    const TypeIcon = problemTypes[typeKey]?.icon || MoreHorizontal;
    const iconColor = problemTypes[typeKey]?.color || '#6b7280';

    return (
      <View style={styles.itemContainer}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + '33' }]}>
          <TypeIcon size={28} color={iconColor} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemType}>{problemTypes[typeKey]?.label || 'Autre'}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>
          <Text style={[styles.itemStatus, getStatusStyle(item.status)]}>{item.status}</Text>
        </View>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.itemImage} />
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes dépannages</Text>
      </View>
      <FlatList
        data={mockRepairs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
