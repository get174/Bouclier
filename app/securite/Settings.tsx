import { Download, Mail, Save, Settings as SettingsIcon, Shield, Upload, User as UserIcon, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import type { User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@bouclier.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    firstName: 'Agent',
    lastName: 'Sécurité',
    email: 'agent@bouclier.com',
    role: 'agent',
    status: 'active',
    lastLogin: '2024-01-15T08:15:00Z',
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'users' | 'system' | 'exports'>('users');
  const [users] = useState<User[]>(mockUsers);
  const [systemSettings, setSystemSettings] = useState({
    autoApproval: false,
    notificationsEmail: true,
    notificationsPush: true,
    qrCodeExpiry: 24,
    maxVisitorsPerDay: 50,
    visitTimeWindow: 2,
  });

  const handleSystemSettingChange = (key: string, value: boolean | number) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    console.log('Saving system settings:', systemSettings);
    Alert.alert('Succès', 'Paramètres sauvegardés avec succès!');
  };

  const handleExport = (type: 'excel' | 'pdf', data: 'visitors' | 'residents' | 'notifications') => {
    console.log(`Exporting ${data} as ${type}`);
    Alert.alert('Export', `Export ${type.toUpperCase()} des ${data} en cours...`);
  };

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'system', label: 'Système', icon: SettingsIcon },
    { id: 'exports', label: 'Exports', icon: Download },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <Text style={styles.headerSubtitle}>Configuration du système et gestion des utilisateurs</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsHeader}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              >
                <Icon width={20} height={20} color={activeTab === tab.id ? '#2563eb' : '#6b7280'} />
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.tabContent}>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <View style={styles.usersTab}>
              <View style={styles.usersHeader}>
                <Text style={styles.sectionTitle}>Gestion des utilisateurs</Text>
                <Pressable style={styles.addUserButton}>
                  <Text style={styles.addUserText}>Ajouter utilisateur</Text>
                </Pressable>
              </View>

              <ScrollView horizontal style={styles.tableContainer}>
                <View style={styles.table}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderText}>Utilisateur</Text>
                    <Text style={styles.tableHeaderText}>Rôle</Text>
                    <Text style={styles.tableHeaderText}>Statut</Text>
                    <Text style={styles.tableHeaderText}>Dernière connexion</Text>
                    <Text style={styles.tableHeaderText}>Actions</Text>
                  </View>
                  {users.map((user) => (
                    <View key={user.id} style={styles.tableRow}>
                      <View style={styles.userCell}>
                        <View style={styles.userAvatar}>
                          <UserIcon width={20} height={20} color="#2563eb" />
                        </View>
                        <View>
                          <Text style={styles.userName}>
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                      </View>
                      <View style={styles.roleCell}>
                        <Text style={[styles.roleBadge, user.role === 'admin' ? styles.adminBadge : styles.agentBadge]}>
                          {user.role === 'admin' ? 'Administrateur' : 'Agent'}
                        </Text>
                      </View>
                      <View style={styles.statusCell}>
                        <Text style={[styles.statusBadge, user.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
                          {user.status === 'active' ? 'Actif' : 'Inactif'}
                        </Text>
                      </View>
                      <Text style={styles.lastLoginText}>
                        {new Date(user.lastLogin).toLocaleString('fr-FR')}
                      </Text>
                      <View style={styles.actionsCell}>
                        <Pressable style={styles.editButton}>
                          <Text style={styles.editText}>Modifier</Text>
                        </Pressable>
                        {user.role !== 'admin' && (
                          <Pressable style={styles.deleteButton}>
                            <Text style={styles.deleteText}>Supprimer</Text>
                          </Pressable>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <View style={styles.systemTab}>
              <Text style={styles.sectionTitle}>Paramètres système</Text>

              <View style={styles.settingsGrid}>
                {/* Approval Settings */}
                <View style={styles.settingsCard}>
                  <View style={styles.cardHeader}>
                    <Shield width={20} height={20} color="#2563eb" />
                    <Text style={styles.cardTitle}>Approbation des visiteurs</Text>
                  </View>

                  <View style={styles.settingsList}>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Approbation automatique</Text>
                      <Switch
                        value={systemSettings.autoApproval}
                        onValueChange={(value) => handleSystemSettingChange('autoApproval', value)}
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Fenêtre de visite (heures)</Text>
                      <TextInput
                        value={systemSettings.visitTimeWindow.toString()}
                        onChangeText={(text) => handleSystemSettingChange('visitTimeWindow', parseInt(text) || 0)}
                        style={styles.numberInput}
                        keyboardType="numeric"
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Max visiteurs par jour</Text>
                      <TextInput
                        value={systemSettings.maxVisitorsPerDay.toString()}
                        onChangeText={(text) => handleSystemSettingChange('maxVisitorsPerDay', parseInt(text) || 0)}
                        style={styles.numberInput}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>

                {/* Notification Settings */}
                <View style={styles.settingsCard}>
                  <View style={styles.cardHeader}>
                    <Mail width={20} height={20} color="#16a34a" />
                    <Text style={styles.cardTitle}>Notifications</Text>
                  </View>

                  <View style={styles.settingsList}>
                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Notifications email</Text>
                      <Switch
                        value={systemSettings.notificationsEmail}
                        onValueChange={(value) => handleSystemSettingChange('notificationsEmail', value)}
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Notifications push</Text>
                      <Switch
                        value={systemSettings.notificationsPush}
                        onValueChange={(value) => handleSystemSettingChange('notificationsPush', value)}
                      />
                    </View>

                    <View style={styles.settingItem}>
                      <Text style={styles.settingLabel}>Expiration QR code (heures)</Text>
                      <TextInput
                        value={systemSettings.qrCodeExpiry.toString()}
                        onChangeText={(text) => handleSystemSettingChange('qrCodeExpiry', parseInt(text) || 0)}
                        style={styles.numberInput}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.saveButtonContainer}>
                <Pressable onPress={handleSaveSettings} style={styles.saveButton}>
                  <Save width={16} height={16} color="white" />
                  <Text style={styles.saveButtonText}>Sauvegarder</Text>
                </Pressable>
              </View>
            </View>
          )}

          {/* Exports Tab */}
          {activeTab === 'exports' && (
            <View style={styles.exportsTab}>
              <Text style={styles.sectionTitle}>Exports de données</Text>

              <View style={styles.exportsGrid}>
                {[
                  {
                    title: 'Visiteurs',
                    description: 'Exporter la liste complète des visiteurs',
                    data: 'visitors' as const,
                    count: '156 entrées'
                  },
                  {
                    title: 'Résidents',
                    description: 'Exporter la liste des résidents',
                    data: 'residents' as const,
                    count: '89 entrées'
                  },
                  {
                    title: 'Notifications',
                    description: 'Exporter l\'historique des notifications',
                    data: 'notifications' as const,
                    count: '324 entrées'
                  },
                ].map((exportItem) => (
                  <View key={exportItem.data} style={styles.exportCard}>
                    <Text style={styles.exportTitle}>{exportItem.title}</Text>
                    <Text style={styles.exportDescription}>{exportItem.description}</Text>
                    <Text style={styles.exportCount}>{exportItem.count}</Text>

                    <View style={styles.exportButtons}>
                      <Pressable
                        onPress={() => handleExport('excel', exportItem.data)}
                        style={styles.exportButtonExcel}
                      >
                        <Download width={16} height={16} color="white" />
                        <Text style={styles.exportButtonText}>Export Excel</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => handleExport('pdf', exportItem.data)}
                        style={styles.exportButtonPdf}
                      >
                        <Download width={16} height={16} color="white" />
                        <Text style={styles.exportButtonText}>Export PDF</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>

              {/* Import Section */}
              <View style={styles.importSection}>
                <View style={styles.importHeader}>
                  <Upload width={20} height={20} color="#2563eb" />
                  <Text style={styles.importTitle}>Import de données</Text>
                </View>

                <View style={styles.importCard}>
                  <Text style={styles.importDescription}>
                    Importez des données depuis un fichier Excel ou CSV.
                  </Text>
                  <TextInput
                    placeholder="Sélectionner un fichier..."
                    style={styles.fileInput}
                    editable={false}
                  />
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  tabsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 8,
  },
  tabTextActive: {
    color: '#1d4ed8',
  },
  tabContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  usersTab: {
    // No specific styles
  },
  usersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addUserButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: -43,
    marginTop : 35,
  },
  addUserText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  tableContainer: {
    // No specific styles
  },
  table: {
    minWidth: 800,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  userCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  roleCell: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  adminBadge: {
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
  },
  agentBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
  },
  statusCell: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  inactiveBadge: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  lastLoginText: {
    flex: 1.5,
    fontSize: 14,
    color: '#6b7280',
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: 16,
  },
  editText: {
    fontSize: 14,
    color: '#2563eb',
  },
  deleteButton: {
    // No specific styles
  },
  deleteText: {
    fontSize: 14,
    color: '#dc2626',
  },
  systemTab: {
    // No specific styles
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  settingsCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 24,
    margin: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  settingsList: {
    // No specific styles
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    width: 80,
    textAlign: 'center',
  },
  saveButtonContainer: {
    alignItems: 'flex-end',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  exportsTab: {
    // No specific styles
  },
  exportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  exportCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 24,
    margin: 8,
  },
  exportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  exportDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  exportCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  exportButtons: {
    // No specific styles
  },
  exportButtonExcel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  exportButtonPdf: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  importSection: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 24,
  },
  importHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  importTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  importCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 8,
    padding: 16,
  },
  importDescription: {
    fontSize: 14,
    color: '#1e40af',
    marginBottom: 16,
  },
  fileInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: 'white',
  },
});
