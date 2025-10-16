import { Bell, CheckCircle2, Eye, Filter, Mail, Send, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Notification } from '../types';

interface NewNotification {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  recipients: string[];
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nouveau visiteur approuvé',
    message: 'Sophie Martin a été approuvée pour sa visite chez Marie Dubois (Apt 304) aujourd\'hui à 14:30.',
    type: 'success',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
    recipient: 'marie.dubois@email.com',
  },
  {
    id: '2',
    title: 'Demande d\'approbation visiteur',
    message: 'Pierre Durand souhaite rendre visite à Jean Moreau (Apt 201) demain à 15:45. Approbation requise.',
    type: 'warning',
    timestamp: '2024-01-15T09:15:00Z',
    read: true,
    recipient: 'jean.moreau@email.com',
  },
  {
    id: '3',
    title: 'Accès refusé',
    message: 'Lucas Bernard - accès refusé à la résidence. Visiteur non autorisé.',
    type: 'error',
    timestamp: '2024-01-15T11:45:00Z',
    read: false,
    recipient: 'security@bouclier.com',
  },
  {
    id: '4',
    title: 'Rappel de visite',
    message: 'Marie Legrand est attendue chez Paul Bernard (Apt 108) dans 30 minutes.',
    type: 'info',
    timestamp: '2024-01-14T15:45:00Z',
    read: true,
    recipient: 'paul.bernard@email.com',
  },
];

export default function Notifications() {
  const [notifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'warning' | 'error' | 'info'>('all');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [newNotification, setNewNotification] = useState<NewNotification>({
    title: '',
    message: '',
    type: 'info',
    recipients: [],
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 width={20} height={20} color="#16a34a" />;
      case 'warning':
        return <Bell width={20} height={20} color="#ca8a04" />;
      case 'error':
        return <Bell width={20} height={20} color="#dc2626" />;
      default:
        return <Bell width={20} height={20} color="#2563eb" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return { borderLeftColor: '#16a34a', backgroundColor: '#f0fdf4' };
      case 'warning':
        return { borderLeftColor: '#ca8a04', backgroundColor: '#fffbeb' };
      case 'error':
        return { borderLeftColor: '#dc2626', backgroundColor: '#fef2f2' };
      default:
        return { borderLeftColor: '#2563eb', backgroundColor: '#eff6ff' };
    }
  };

  const sendNotification = () => {
    console.log('Sending notification:', newNotification);
    // Here you would typically send the notification via your API
    Alert.alert('Succès', 'Notification envoyée avec succès!');
    setShowComposeModal(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: [],
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>Centre de notifications et d&apos;alertes</Text>
        </View>
        
        <Pressable
          onPress={() => setShowComposeModal(true)}
          style={styles.newNotificationButton}
        >
          <Send width={16} height={16} color="white" />
          <Text style={styles.newNotificationText}>Nouvelle notification</Text>
        </Pressable>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {[
          { label: 'Total', count: notifications.length, color: '#3b82f6' },
          { label: 'Non lues', count: notifications.filter(n => !n.read).length, color: '#eab308' },
          { label: 'Succès', count: notifications.filter(n => n.type === 'success').length, color: '#16a34a' },
          { label: 'Alertes', count: notifications.filter(n => n.type === 'error').length, color: '#dc2626' },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statCount}>{stat.count}</Text>
            </View>
            <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
              <Bell width={24} height={24} color="white" />
            </View>
          </View>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <Filter width={20} height={20} color="#9ca3af" />
        <View style={styles.filterButtons}>
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'unread', label: 'Non lues' },
            { key: 'success', label: 'Succès' },
            { key: 'warning', label: 'Avertissements' },
            { key: 'error', label: 'Erreurs' },
            { key: 'info', label: 'Informations' },
          ].map((filterOption) => (
            <Pressable
              key={filterOption.key}
              onPress={() => setFilter(filterOption.key as any)}
              style={[styles.filterButton, filter === filterOption.key && styles.filterButtonActive]}
            >
              <Text style={[styles.filterButtonText, filter === filterOption.key && styles.filterButtonTextActive]}>
                {filterOption.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Notifications List */}
      <View style={styles.notificationsList}>
        {filteredNotifications.map((notification) => (
          <View
            key={notification.id}
            style={[styles.notificationCard, getNotificationStyle(notification.type)]}
          >
            <View style={styles.notificationContent}>
              <View style={styles.notificationIcon}>
                {getNotificationIcon(notification.type)}
              </View>
              
              <View style={styles.notificationText}>
                <View style={styles.notificationHeader}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  {!notification.read && <View style={styles.unreadDot} />}
                </View>
                
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                
                <View style={styles.notificationMeta}>
                  <View style={styles.metaItem}>
                    <Mail width={16} height={16} color="#6b7280" />
                    <Text style={styles.metaText}>{notification.recipient}</Text>
                  </View>
                  <Text style={styles.metaText}>
                    {new Date(notification.timestamp).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.notificationActions}>
              <Pressable style={styles.actionButton}>
                <Eye width={16} height={16} color="#2563eb" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Trash2 width={16} height={16} color="#dc2626" />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      {filteredNotifications.length === 0 && (
        <View style={styles.emptyState}>
          <Bell width={48} height={48} color="#d1d5db" />
          <Text style={styles.emptyText}>Aucune notification trouvée</Text>
        </View>
      )}

      {/* Compose Modal */}
      <Modal
        visible={showComposeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowComposeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouvelle notification</Text>
              <Pressable
                onPress={() => setShowComposeModal(false)}
                style={styles.modalClose}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </Pressable>
            </View>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Titre</Text>
                <TextInput
                  value={newNotification.title}
                  onChangeText={(text) => setNewNotification(prev => ({ ...prev, title: text }))}
                  style={styles.textInput}
                  placeholder="Titre de la notification"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  value={newNotification.message}
                  onChangeText={(text) => setNewNotification(prev => ({ ...prev, message: text }))}
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Contenu de la notification"
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <View style={styles.picker}>
                  <Pressable
                    onPress={() => setNewNotification(prev => ({ ...prev, type: 'info' as const }))}
                    style={[styles.pickerOption, newNotification.type === 'info' && styles.pickerOptionActive]}
                  >
                    <Text style={styles.pickerText}>Information</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setNewNotification(prev => ({ ...prev, type: 'success' as const }))}
                    style={[styles.pickerOption, newNotification.type === 'success' && styles.pickerOptionActive]}
                  >
                    <Text style={styles.pickerText}>Succès</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setNewNotification(prev => ({ ...prev, type: 'warning' as const }))}
                    style={[styles.pickerOption, newNotification.type === 'warning' && styles.pickerOptionActive]}
                  >
                    <Text style={styles.pickerText}>Avertissement</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setNewNotification(prev => ({ ...prev, type: 'error' as const }))}
                    style={[styles.pickerOption, newNotification.type === 'error' && styles.pickerOptionActive]}
                  >
                    <Text style={styles.pickerText}>Erreur</Text>
                  </Pressable>
                </View>
              </View>
              
              <View style={styles.modalActions}>
                <Pressable
                  onPress={() => setShowComposeModal(false)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Annuler</Text>
                </Pressable>
                <Pressable
                  onPress={sendNotification}
                  style={styles.sendButton}
                >
                  <Send width={16} height={16} color="white" />
                  <Text style={styles.sendText}>Envoyer</Text>
                </Pressable>
              </View>
            </View>
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
  newNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',

    paddingVertical: 8,
    borderRadius: 5,
    marginLeft  : -35,
  },
  newNotificationText: {
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
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 12,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 2,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#dbeafe',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#1e40af',
  },
  notificationsList: {
    marginBottom: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    flex: 1,
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationText: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  notificationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  notificationActions: {
    flexDirection: 'row',
    marginLeft: 12,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sendText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});
