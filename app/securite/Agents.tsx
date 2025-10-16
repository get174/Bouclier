import { CheckCircle, Clock, Edit, Trash2, UserPlus, Users, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import {
	Alert,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'present' | 'absent' | 'off-duty';
  shift: string;
  lastCheckIn?: Date;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@bouclier.com',
    phone: '+33 6 12 34 56 78',
    status: 'present',
    shift: 'Matin',
    lastCheckIn: new Date(),
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@bouclier.com',
    phone: '+33 6 23 45 67 89',
    status: 'absent',
    shift: 'Soir',
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@bouclier.com',
    phone: '+33 6 34 56 78 90',
    status: 'off-duty',
    shift: 'Nuit',
  },
];

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPresenceModal, setShowPresenceModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    shift: 'Matin',
  });

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'present':
        return <CheckCircle width={20} height={20} color="#16a34a" />;
      case 'absent':
        return <XCircle width={20} height={20} color="#dc2626" />;
      case 'off-duty':
        return <Clock width={20} height={20} color="#ca8a04" />;
    }
  };

  const getStatusText = (status: Agent['status']) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'off-duty':
        return 'Hors service';
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'present':
        return '#16a34a';
      case 'absent':
        return '#dc2626';
      case 'off-duty':
        return '#ca8a04';
    }
  };

  const addAgent = () => {
    if (!newAgent.name || !newAgent.email || !newAgent.phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const agent: Agent = {
      id: Date.now().toString(),
      ...newAgent,
      status: 'off-duty',
    };

    setAgents([...agents, agent]);
    setShowAddModal(false);
    setNewAgent({
      name: '',
      email: '',
      phone: '',
      shift: 'Matin',
    });
    Alert.alert('Succès', 'Agent ajouté avec succès!');
  };

  const updatePresence = (agentId: string, status: Agent['status']) => {
    setAgents(agents.map(agent =>
      agent.id === agentId
        ? { ...agent, status, lastCheckIn: status === 'present' ? new Date() : undefined }
        : agent
    ));
    setShowPresenceModal(false);
    setSelectedAgent(null);
  };

  const deleteAgent = (agentId: string) => {
    Alert.alert(
      'Supprimer l\'agent',
      'Êtes-vous sûr de vouloir supprimer cet agent ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setAgents(agents.filter(agent => agent.id !== agentId));
            Alert.alert('Succès', 'Agent supprimé avec succès!');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Gestion des Agents</Text>
          <Text style={styles.headerSubtitle}>Gérer les agents de sécurité et leur présence</Text>
        </View>

        <Pressable
          onPress={() => setShowAddModal(true)}
          style={styles.addButton}
        >
          <UserPlus width={16} height={16} color="white" />
          <Text style={styles.addButtonText}>Ajouter Agent</Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total Agents', count: agents.length, color: '#3b82f6' },
          { label: 'Présents', count: agents.filter(a => a.status === 'present').length, color: '#16a34a' },
          { label: 'Absents', count: agents.filter(a => a.status === 'absent').length, color: '#dc2626' },
          { label: 'Hors service', count: agents.filter(a => a.status === 'off-duty').length, color: '#ca8a04' },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statCount}>{stat.count}</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <Users width={24} height={24} color="white" />
            </View>
          </View>
        ))}
      </View>

      {/* Agents List */}
      <View style={styles.agentsList}>
        {agents.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <View style={styles.agentInfo}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentEmail}>{agent.email}</Text>
                <Text style={styles.agentPhone}>{agent.phone}</Text>
              </View>

              <View style={styles.agentStatus}>
                {getStatusIcon(agent.status)}
                <Text style={[styles.statusText, { color: getStatusColor(agent.status) }]}>
                  {getStatusText(agent.status)}
                </Text>
              </View>
            </View>

            <View style={styles.agentDetails}>
              <Text style={styles.shiftText}>Poste: {agent.shift}</Text>
              {agent.lastCheckIn && (
                <Text style={styles.checkInText}>
                  Dernière présence: {agent.lastCheckIn.toLocaleString('fr-FR')}
                </Text>
              )}
            </View>

            <View style={styles.agentActions}>
              <Pressable
                onPress={() => {
                  setSelectedAgent(agent);
                  setShowPresenceModal(true);
                }}
                style={styles.actionButton}
              >
                <Edit width={16} height={16} color="#2563eb" />
              </Pressable>
              <Pressable
                onPress={() => deleteAgent(agent.id)}
                style={styles.actionButton}
              >
                <Trash2 width={16} height={16} color="#dc2626" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {agents.length === 0 && (
        <View style={styles.emptyState}>
          <Users width={48} height={48} color="#d1d5db" />
          <Text style={styles.emptyText}>Aucun agent trouvé</Text>
        </View>
      )}

      {/* Add Agent Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter un Agent</Text>
              <Pressable
                onPress={() => setShowAddModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom complet *</Text>
                <TextInput
                  value={newAgent.name}
                  onChangeText={(text) => setNewAgent(prev => ({ ...prev, name: text }))}
                  style={styles.textInput}
                  placeholder="Nom complet de l'agent"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  value={newAgent.email}
                  onChangeText={(text) => setNewAgent(prev => ({ ...prev, email: text }))}
                  style={styles.textInput}
                  placeholder="email@bouclier.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone *</Text>
                <TextInput
                  value={newAgent.phone}
                  onChangeText={(text) => setNewAgent(prev => ({ ...prev, phone: text }))}
                  style={styles.textInput}
                  placeholder="+33 6 XX XX XX XX"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Poste</Text>
                <View style={styles.picker}>
                  {['Matin', 'Après-midi', 'Soir', 'Nuit'].map((shift) => (
                    <Pressable
                      key={shift}
                      onPress={() => setNewAgent(prev => ({ ...prev, shift }))}
                      style={[styles.pickerOption, newAgent.shift === shift && styles.pickerOptionActive]}
                    >
                      <Text style={styles.pickerText}>{shift}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Annuler</Text>
                </Pressable>
                <Pressable
                  onPress={addAgent}
                  style={styles.saveButton}
                >
                  <UserPlus width={16} height={16} color="white" />
                  <Text style={styles.saveText}>Ajouter</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Presence Modal */}
      <Modal
        visible={showPresenceModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPresenceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Mettre à jour la présence
              </Text>
              <Pressable
                onPress={() => setShowPresenceModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            {selectedAgent && (
              <View style={styles.presenceForm}>
                <Text style={styles.agentNameText}>{selectedAgent.name}</Text>

                <View style={styles.statusOptions}>
                  {[
                    { status: 'present' as const, label: 'Présent', color: '#16a34a' },
                    { status: 'absent' as const, label: 'Absent', color: '#dc2626' },
                    { status: 'off-duty' as const, label: 'Hors service', color: '#ca8a04' },
                  ].map((option) => (
                    <Pressable
                      key={option.status}
                      onPress={() => updatePresence(selectedAgent.id, option.status)}
                      style={[styles.statusOption, { borderColor: option.color }]}
                    >
                      {getStatusIcon(option.status)}
                      <Text style={[styles.statusOptionText, { color: option.color }]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statIcon: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  agentsList: {
    marginBottom: 24,
  },
  agentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  agentEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  agentPhone: {
    fontSize: 14,
    color: '#6b7280',
  },
  agentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  agentDetails: {
    marginBottom: 12,
  },
  shiftText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  checkInText: {
    fontSize: 12,
    color: '#6b7280',
  },
  agentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalClose: {
    padding: 8,
  },
  modalCloseText: {
    fontSize: 18,
    color: '#6b7280',
  },
  form: {
    // No specific styles
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 4,
    backgroundColor: '#f3f4f6',
  },
  pickerOptionActive: {
    backgroundColor: '#dbeafe',
  },
  pickerText: {
    fontSize: 14,
    color: '#374151',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 12,
  },
  cancelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  presenceForm: {
    alignItems: 'center',
  },
  agentNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
  },
  statusOptions: {
    width: '100%',
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  statusOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
});
