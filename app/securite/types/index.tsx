import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Visitor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  visitDate: string;
  visitTime: string;
  residentName: string;
  apartment: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out';
  createdAt: string;
  qrCode?: string;
}

export interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  apartment: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  recipient: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'agent';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface DashboardStats {
  todayVisitors: number;
  approvedVisitors: number;
  rejectedVisitors: number;
  pendingVisitors: number;
  activeResidents: number;
  unreadNotifications: number;
}

export default function TypesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Types Management</Text>
      <Text style={styles.subtitle}>Manage visitor, resident, and notification types</Text>
      {/* Placeholder content - can be expanded later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
