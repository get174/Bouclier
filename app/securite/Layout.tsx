import {
  Bell,
  Home,
  LayoutDashboard,
  Menu,
  ScanLine,
  Settings,
  Shield,
  UserPlus,
  Users,
  X
} from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'visitors', label: 'Visiteurs', icon: Users },
  { id: 'add-visitor', label: 'Ajouter visiteur', icon: UserPlus },
  { id: 'scan-control', label: 'Scan & Contrôle', icon: ScanLine },
  { id: 'residents', label: 'Résidents', icon: Home },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export default function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <View style={styles.container}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <Pressable 
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <View style={[styles.sidebar, sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed]}>
        <View style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Shield width={24} height={24} color="white" />
            </View>
            <Text style={styles.title}>Bouclier</Text>
            <Pressable
              onPress={() => setSidebarOpen(false)}
              style={styles.closeButton}
            >
              <X width={20} height={20} color="#6b7280" />
            </Pressable>
          </View>

          {/* Navigation */}
          <ScrollView style={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    onPageChange(item.id);
                    setSidebarOpen(false);
                  }}
                  style={[styles.navItem, isActive && styles.navItemActive]}
                >
                  <Icon width={20} height={20} color={isActive ? '#3b82f6' : '#6b7280'} />
                  <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* User info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AD</Text>
            </View>
            <View>
              <Text style={styles.userName}>Admin</Text>
              <Text style={styles.userEmail}>admin@bouclier.com</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main content */}
      <View style={styles.main}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => setSidebarOpen(true)}
            style={styles.menuButton}
          >
            <Menu width={20} height={20} color="#6b7280" />
          </Pressable>
          
          <View style={styles.topBarRight}>
            <Bell width={20} height={20} color="#6b7280" />
            <View style={styles.notificationDot} />
          </View>
        </View>

        {/* Page content */}
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfbff',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 256,
    height: '100%',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 50,
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: -256 }],
  },
  sidebarContent: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  nav: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  navTextActive: {
    color: '#1d4ed8',
  },
  userInfo: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
  main: {
    flex: 1,
    width: '100%',
  },
  topBar: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
    paddingHorizontal: 24,
  },
  menuButton: {
    padding: 8,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    backgroundColor: '#ef4444',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    padding: 24,
  },
});
