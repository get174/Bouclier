import {
  Bell,
  Calendar,
  Clock,
  Home,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from 'lucide-react-native';
import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { DashboardStats } from '../types';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

const mockStats: DashboardStats = {
  todayVisitors: 24,
  approvedVisitors: 18,
  rejectedVisitors: 3,
  pendingVisitors: 3,
  activeResidents: 156,
  unreadNotifications: 5,
};

const recentAlerts = [
  {
    id: '1',
    message: "Nouveau visiteur en attente d&apos;approbation",
    time: '5 min',
    type: 'warning' as const,
  },
  {
    id: '2',
    message: 'Accès refusé - Visiteur non autorisé',
    time: '12 min',
    type: 'error' as const,
  },
  {
    id: '3',
    message: 'Résident Marc Dubois a approuvé un visiteur',
    time: '25 min',
    type: 'success' as const,
  },
];

const todayVisitors = [
  { name: 'Sophie Martin', resident: 'Apt 304', time: '14:30', status: 'approved' as const },
  { name: 'Pierre Durand', resident: 'Apt 201', time: '15:45', status: 'pending' as const },
  { name: 'Marie Legrand', resident: 'Apt 108', time: '16:15', status: 'approved' as const },
  { name: 'Lucas Bernard', resident: 'Apt 405', time: '17:00', status: 'rejected' as const },
];

export default function Dashboard() {

  const stats = [
    {
      title: 'Visiteurs du jour',
      value: mockStats.todayVisitors,
      icon: Users,
      bgColor: '#3b82f6',
      change: '+12%',
    },
    {
      title: 'Approuvés',
      value: mockStats.approvedVisitors,
      icon: UserCheck,
      bgColor: '#10b981',
      change: '+8%',
    },
    {
      title: 'En attente',
      value: mockStats.pendingVisitors,
      icon: Clock,
      bgColor: '#f59e0b',
      change: '-5%',
    },
    {
      title: 'Refusés',
      value: mockStats.rejectedVisitors,
      icon: UserX,
      bgColor: '#ef4444',
      change: '+2%',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'pending':
        return styles.statusPending;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, isSmallScreen && styles.headerMobile]}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Vue d&apos;ensemble des activités de la résidence</Text>
        </View>
        <View style={styles.headerRight}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={styles.statCard}>
              <View style={styles.statContent}>
                <View style={styles.statLeft}>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <View style={styles.statChange}>
                    <TrendingUp size={14} color="#10b981" />
                    <Text style={styles.statChangeText}>{stat.change}</Text>
                  </View>
                </View>
                <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                  <Icon size={24} color="white" />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Visitors and Alerts */}
      <View style={styles.mainGrid}>
        {/* Today's Visitors */}
        <View style={[styles.sectionCard, !isSmallScreen && styles.halfWidth]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visiteurs d&apos;aujourd&apos;hui</Text>
            <Pressable>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </Pressable>
          </View>

          <View style={styles.visitorsList}>
            {todayVisitors.map((visitor, index) => (
              <View key={index} style={styles.visitorItem}>
                <View style={styles.visitorLeft}>
                  <View style={styles.visitorAvatar}>
                    <Text style={styles.visitorInitials}>
                      {visitor.name.split(' ').map((n) => n[0]).join('')}
                    </Text>
                  </View>
                  <View style={styles.visitorInfo}>
                    <Text style={styles.visitorName}>{visitor.name}</Text>
                    <Text style={styles.visitorResident}>{visitor.resident}</Text>
                  </View>
                </View>

                <View style={styles.visitorRight}>
                  <Text style={styles.visitorTime}>{visitor.time}</Text>
                  <View style={getStatusStyle(visitor.status)}>
                    <Text style={styles.statusText}>
                      {getStatusText(visitor.status)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={[styles.sectionCard, !isSmallScreen && styles.halfWidth]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertes récentes</Text>
            <Bell size={20} color="#6b7280" />
          </View>

          <View style={styles.alertsList}>
            {recentAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: getAlertColor(alert.type) }]} />
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>Il y a {alert.time}</Text>
                </View>
              </View>
            ))}
          </View>

          <Pressable style={styles.seeAllButton}>
            <Text style={styles.seeAllButtonText}>Voir toutes les alertes</Text>
          </Pressable>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>

        <View style={styles.actionsGrid}>
          <Pressable style={styles.actionButton}>
            <UserPlus size={20} color="#3b82f6" />
            <Text style={styles.actionText}>Ajouter un visiteur</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Home size={20} color="#10b981" />
            <Text style={styles.actionText}>Gérer les résidents</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Bell size={20} color="#f59e0b" />
            <Text style={styles.actionText}>Envoyer notification</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: isSmallScreen ? '100%' : '48%',
    marginBottom: 16,
    marginHorizontal: 0,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLeft: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainGrid: {
    gap: 16,
    marginBottom: 24,
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'center',
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
    alignSelf: 'stretch',
    marginHorizontal: 0,
  },
  halfWidth: {
    width: '48%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  visitorsList: {
    gap: 12,
  },
  visitorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  visitorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  visitorAvatar: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  visitorInitials: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  visitorInfo: {
    flex: 1,
  },
  visitorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  visitorResident: {
    fontSize: 12,
    color: '#6b7280',
  },
  visitorRight: {
    alignItems: 'flex-end',
  },
  visitorTime: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusApproved: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusRejected: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDefault: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 14,
    color: '#111827',
  },
  alertTime: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  seeAllButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  seeAllButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: 'white',
    flex: isSmallScreen ? 1 : 0,
    minWidth: isSmallScreen ? '100%' : '30%',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 12,
  },
});
