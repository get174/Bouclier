import { Download, Edit2, Eye, Filter, Plus, Search, Trash2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import type { Visitor } from '../types';

const mockVisitors: Visitor[] = [
  {
    id: '1',
    firstName: 'Sophie',
    lastName: 'Martin',
    phone: '+33 6 12 34 56 78',
    visitDate: '2024-01-15',
    visitTime: '14:30',
    residentName: 'Marie Dubois',
    apartment: 'Apt 304',
    purpose: 'Visite familiale',
    status: 'approved',
    createdAt: '2024-01-14T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Durand',
    phone: '+33 6 98 76 54 32',
    visitDate: '2024-01-15',
    visitTime: '15:45',
    residentName: 'Jean Moreau',
    apartment: 'Apt 201',
    purpose: 'Livraison',
    status: 'pending',
    createdAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    firstName: 'Marie',
    lastName: 'Legrand',
    phone: '+33 6 11 22 33 44',
    visitDate: '2024-01-14',
    visitTime: '16:15',
    residentName: 'Paul Bernard',
    apartment: 'Apt 108',
    purpose: 'Ami',
    status: 'checked-out',
    createdAt: '2024-01-13T14:20:00Z',
  },
  {
    id: '4',
    firstName: 'Lucas',
    lastName: 'Bernard',
    phone: '+33 6 55 44 33 22',
    visitDate: '2024-01-15',
    visitTime: '17:00',
    residentName: 'Anne Petit',
    apartment: 'Apt 405',
    purpose: 'Travaux',
    status: 'rejected',
    createdAt: '2024-01-15T11:45:00Z',
  },
];

export default function Visitors() {
  const [visitors] = useState<Visitor[]>(mockVisitors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'status'>('date');

  const filteredVisitors = visitors
    .filter(visitor => {
      const matchesSearch =
        visitor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.apartment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || visitor.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'date':
          return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getStatusBadge = (status: Visitor['status']) => {
    const statusStyles = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      rejected: styles.statusRejected,
      'checked-in': styles.statusCheckedIn,
      'checked-out': styles.statusCheckedOut,
    };

    const statusTextStyles = {
      pending: styles.statusPendingText,
      approved: styles.statusApprovedText,
      rejected: styles.statusRejectedText,
      'checked-in': styles.statusCheckedInText,
      'checked-out': styles.statusCheckedOutText,
    };

    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Refusé',
      'checked-in': 'Présent',
      'checked-out': 'Parti',
    };

    return (
      <View style={[styles.statusBadge, statusStyles[status]]}>
        <Text style={[styles.statusText, statusTextStyles[status]]}>
          {labels[status]}
        </Text>
      </View>
    );
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorRow}>
      <View style={styles.visitorInfo}>
        <Text style={styles.visitorName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.visitorPhone}>{item.phone}</Text>
      </View>

      <View style={styles.residentInfo}>
        <Text style={styles.residentName}>{item.residentName}</Text>
        <Text style={styles.apartmentInfo}>{item.apartment}</Text>
      </View>

      <View style={styles.visitInfo}>
        <Text style={styles.visitDate}>
          {new Date(item.visitDate).toLocaleDateString('fr-FR')}
        </Text>
        <Text style={styles.visitTime}>{item.visitTime}</Text>
      </View>

      <View style={styles.purposeInfo}>
        <Text style={styles.purposeText}>{item.purpose}</Text>
      </View>

      <View style={styles.statusInfo}>
        {getStatusBadge(item.status)}
      </View>

      <View style={styles.actionsInfo}>
        <TouchableOpacity style={styles.actionButton}>
          <Eye width={16} height={16} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Edit2 width={16} height={16} color={Colors.light.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Trash2 width={16} height={16} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Visiteurs</Text>
          <Text style={styles.headerSubtitle}>Gestion des visiteurs de la résidence</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.exportButton}>
            <Download width={16} height={16} color="#374151" />
            <Text style={styles.exportButtonText}>Exporter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Plus width={16} height={16} color="white" />
            <Text style={styles.addButtonText}>Ajouter visiteur</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersCard}>
        <View style={styles.filtersGrid}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search width={16} height={16} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un visiteur..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Status Filter */}
          <View style={styles.filterContainer}>
            <Filter width={16} height={16} color="#6b7280" style={styles.filterIcon} />
            <TextInput
              style={styles.filterInput}
              placeholder="Tous les statuts"
              value={statusFilter}
              onChangeText={setStatusFilter}
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Sort By */}
          <TextInput
            style={styles.sortInput}
            placeholder="Trier par date"
            value={sortBy}
            onChangeText={(value) => setSortBy(value as 'name' | 'date' | 'status')}
            placeholderTextColor="#9ca3af"
          />


        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Visiteur</Text>
          <Text style={styles.headerCell}>Résident / Apt</Text>
          <Text style={styles.headerCell}>Date / Heure</Text>
          <Text style={styles.headerCell}>Motif</Text>
          <Text style={styles.headerCell}>Statut</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredVisitors}
        renderItem={renderVisitorItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Users width={64} height={64} color={Colors.light.textMuted} />
            <Text style={styles.emptyTitle}>Aucun visiteur trouvé</Text>
            <Text style={styles.emptySubtitle}>
              Les visiteurs apparaîtront ici une fois ajoutés.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  listContent: {
    padding: 32,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
  filtersCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    padding: 24,
    marginBottom: 32,
  },
  filtersGrid: {
    gap: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.surface,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.surface,
  },
  filterIcon: {
    marginRight: 12,
  },
  filterInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
  },
  sortInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.surface,
  },
  tableContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 16,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.light.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  visitorRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.borderLight,
    backgroundColor: Colors.light.card,
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  visitorPhone: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  residentInfo: {
    flex: 1,
  },
  residentName: {
    fontSize: 16,
    color: Colors.light.text,
  },
  apartmentInfo: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  visitInfo: {
    flex: 1,
  },
  visitDate: {
    fontSize: 16,
    color: Colors.light.text,
  },
  visitTime: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  purposeInfo: {
    flex: 1,
  },
  purposeText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  statusInfo: {
    flex: 1,
  },
  actionsInfo: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: Colors.light.warning,
  },
  statusApproved: {
    backgroundColor: Colors.light.success,
  },
  statusRejected: {
    backgroundColor: Colors.light.error,
  },
  statusCheckedIn: {
    backgroundColor: Colors.light.primaryLight,
  },
  statusCheckedOut: {
    backgroundColor: Colors.light.surfaceSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusPendingText: {
    color: '#92400e',
  },
  statusApprovedText: {
    color: '#166534',
  },
  statusRejectedText: {
    color: '#dc2626',
  },
  statusCheckedInText: {
    color: '#1e40af',
  },
  statusCheckedOutText: {
    color: Colors.light.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
