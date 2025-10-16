import { Edit2, Eye, Filter, Home, Mail, Phone, Plus, Search, UserCheck, UserX } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { Resident } from '../types';

const mockResidents: Resident[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dubois',
    apartment: 'Apt 304',
    phone: '+33 6 11 22 33 44',
    email: 'marie.dubois@email.com',
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Moreau',
    apartment: 'Apt 201',
    phone: '+33 6 55 66 77 88',
    email: 'jean.moreau@email.com',
    status: 'active',
    joinDate: '2023-03-20',
  },
  {
    id: '3',
    firstName: 'Paul',
    lastName: 'Bernard',
    apartment: 'Apt 108',
    phone: '+33 6 99 88 77 66',
    email: 'paul.bernard@email.com',
    status: 'inactive',
    joinDate: '2022-11-10',
  },
  {
    id: '4',
    firstName: 'Anne',
    lastName: 'Petit',
    apartment: 'Apt 405',
    phone: '+33 6 44 33 22 11',
    email: 'anne.petit@email.com',
    status: 'active',
    joinDate: '2023-06-05',
  },
];

const pendingApprovals = [
  {
    id: '1',
    visitorName: 'Sophie Martin',
    residentName: 'Marie Dubois',
    apartment: 'Apt 304',
    visitDate: '2024-01-15',
    visitTime: '14:30',
    purpose: 'Visite familiale',
  },
  {
    id: '2',
    visitorName: 'Lucas Dubois',
    residentName: 'Jean Moreau',
    apartment: 'Apt 201',
    visitDate: '2024-01-16',
    visitTime: '16:00',
    purpose: 'Travaux',
  },
];

export default function Residents() {
  const [residents] = useState<Resident[]>(mockResidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'apartment' | 'joinDate'>('name');

  const filteredResidents = residents
    .filter(resident => {
      const matchesSearch =
        resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.apartment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resident.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || resident.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'apartment':
          return a.apartment.localeCompare(b.apartment);
        case 'joinDate':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        default:
          return 0;
      }
    });

  const handleApproval = (approvalId: string, decision: 'approve' | 'reject') => {
    console.log(`${decision === 'approve' ? 'Approving' : 'Rejecting'} visitor with ID: ${approvalId}`);
    // Here you would typically make an API call
  };

  const renderResidentItem = ({ item }: { item: Resident }) => (
    <View style={styles.residentItem}>
      <View style={styles.residentInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.firstName[0]}{item.lastName[0]}
          </Text>
        </View>
        <View>
          <Text style={styles.residentName}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
      </View>

      <View style={styles.residentDetails}>
        <View style={styles.detailRow}>
          <Home width={16} height={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.apartment}</Text>
        </View>
        <View style={styles.detailRow}>
          <Phone width={16} height={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Mail width={16} height={16} color="#6b7280" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.residentRight}>
        <View style={[
          styles.statusBadge,
          item.status === 'active' && styles.statusActive,
          item.status === 'inactive' && styles.statusInactive,
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'active' && styles.statusTextActive,
            item.status === 'inactive' && styles.statusTextInactive,
          ]}>
            {item.status === 'active' ? 'Actif' : 'Inactif'}
          </Text>
        </View>

        <Text style={styles.joinDate}>
          {new Date(item.joinDate).toLocaleDateString('fr-FR')}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Eye width={16} height={16} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Edit2 width={16} height={16} color="#059669" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Résidents</Text>
          <Text style={styles.headerSubtitle}>Gestion des résidents de la résidence</Text>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Plus width={16} height={16} color="white" />
          <Text style={styles.addButtonText}>Ajouter résident</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Approvals */}
      <View style={styles.pendingCard}>
        <View style={styles.pendingHeader}>
          <Text style={styles.pendingTitle}>
            Approbations en attente ({pendingApprovals.length})
          </Text>
        </View>

        <View style={styles.pendingList}>
          {pendingApprovals.map((approval) => (
            <View key={approval.id} style={styles.pendingItem}>
              <View style={styles.pendingInfo}>
                <View style={styles.pendingRow}>
                  <Text style={styles.pendingName}>{approval.visitorName}</Text>
                  <Text style={styles.pendingLabel}>Visiteur</Text>
                </View>
                <View style={styles.pendingRow}>
                  <Text style={styles.pendingName}>{approval.residentName}</Text>
                  <Text style={styles.pendingLabel}>{approval.apartment}</Text>
                </View>
                <View style={styles.pendingRow}>
                  <Text style={styles.pendingName}>
                    {new Date(approval.visitDate).toLocaleDateString('fr-FR')} à {approval.visitTime}
                  </Text>
                  <Text style={styles.pendingLabel}>Date de visite</Text>
                </View>
                <View style={styles.pendingRow}>
                  <Text style={styles.pendingName}>{approval.purpose}</Text>
                  <Text style={styles.pendingLabel}>Motif</Text>
                </View>
              </View>

              <View style={styles.pendingActions}>
                <TouchableOpacity
                  onPress={() => handleApproval(approval.id, 'reject')}
                  style={styles.rejectButton}
                >
                  <UserX width={16} height={16} color="#dc2626" />
                  <Text style={styles.rejectButtonText}>Refuser</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleApproval(approval.id, 'approve')}
                  style={styles.approveButton}
                >
                  <UserCheck width={16} height={16} color="#16a34a" />
                  <Text style={styles.approveButtonText}>Approuver</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersCard}>
        <View style={styles.filtersGrid}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search width={16} height={16} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              placeholder="Rechercher un résident..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>

          {/* Status Filter */}
          <View style={styles.filterContainer}>
            <Filter width={16} height={16} color="#6b7280" style={styles.filterIcon} />
            <TextInput
              placeholder="Tous les statuts"
              value={statusFilter}
              onChangeText={setStatusFilter}
              style={styles.filterInput}
            />
          </View>

          {/* Sort By */}
          <TextInput
            placeholder="Trier par nom"
            value={sortBy}
            onChangeText={(value) => setSortBy(value as 'name' | 'apartment' | 'joinDate')}
            style={styles.sortInput}
          />

          {/* Results count */}
          <View style={styles.resultsCount}>
            <Text style={styles.resultsText}>
              {filteredResidents.length} résultat{filteredResidents.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Résident</Text>
          <Text style={styles.headerCell}>Contact</Text>
          <Text style={styles.headerCell}>Appartement</Text>
          <Text style={styles.headerCell}>Statut</Text>
          <Text style={styles.headerCell}>Date d&apos;inscription</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>
      </View>
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.listContent}>
      {renderHeader()}

      {filteredResidents.length > 0 ? (
        filteredResidents.map((resident) => (
          <View key={resident.id}>
            {renderResidentItem({ item: resident })}
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Home width={48} height={48} color="#9ca3af" />
          <Text style={styles.emptyText}>Aucun résident trouvé</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  pendingCard: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fbbf24',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  pendingHeader: {
    marginBottom: 16,
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
  },
  pendingList: {
    gap: 12,
  },
  pendingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  pendingInfo: {
    marginBottom: 12,
  },
  pendingRow: {
    marginBottom: 8,
  },
  pendingName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  pendingLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  pendingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  rejectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  rejectButtonText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveButtonText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  filtersCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 20,
    marginBottom: 24,
  },
  filtersGrid: {
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterIcon: {
    marginRight: 8,
  },
  filterInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  sortInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  resultsCount: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resultsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerCell: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  residentItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  residentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1d4ed8',
  },
  residentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  residentDetails: {
    flex: 1,
    marginHorizontal: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  residentRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusInactive: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusTextActive: {
    color: '#166534',
  },
  statusTextInactive: {
    color: '#374151',
  },
  joinDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
});
