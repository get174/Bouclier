import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Bell } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getNotifications, getUnreadNotificationsCount } from '../../services/apiService';
import authService from '../../services/authService';

// Define the type for a single notification from the API
type ApiNotification = {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
};

// Notification Item Component
const NotificationItem = ({ item }: { item: ApiNotification }) => {
  const timeAgo = formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: fr });

  return (
    <View style={styles.notificationCard}>
      <View style={[styles.iconContainer, { backgroundColor: '#0891b21A' }]}>
        <Bell size={20} color={'#0891b2'} />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{timeAgo}</Text>
      </View>
    </View>
  );
};

// Empty State Component
const EmptyState = () => (
  <View style={styles.emptyContainer}>
    <Bell size={40} color="#94a3b8" />
    <Text style={styles.emptyText}>Aucune notification</Text>
    <Text style={styles.emptySubText}>Vous êtes à jour !</Text>
  </View>
);

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const userData = await authService.getUserData();
    if (!userData?.id) {
      setLoading(false);
      return;
    }
    console.log('User ID:', userData.id);

    try {
      const [notifs, count] = await Promise.all([
        getNotifications(userData.id),
        getUnreadNotificationsCount(userData.id)
      ]);
      console.log('Notifications:', notifs);
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to fetch notifications data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <ActivityIndicator size="large" color="#1e293b" style={{ marginTop: 20 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}
        </Text>
      </View>
      <FlatList
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1e293b']} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#475569',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'center',
  },
});
