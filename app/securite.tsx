import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import AddVisitor from './securite/AddVisitor';
import Agents from './securite/Agents';
import Dashboard from './securite/Dashboard';
import Layout from './securite/Layout';
import Notifications from './securite/Notifications';
import Residents from './securite/Residents';
import ScanControl from './securite/ScanControl';
import Settings from './securite/Settings';
import Visitors from './securite/Visitors';

export default function Securite() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnlyAvailableNotifications, setShowOnlyAvailableNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      // Clear authentication data from secure store
      const keysToRemove = [
        "authToken",
        "refreshToken",
        "userId",
        "userEmail",
        "userRole",
        "userData",
      ];

      for (const key of keysToRemove) {
        await SecureStore.deleteItemAsync(key);
      }

      console.log('Logging out...');
      // Navigate back to login screen
      router.replace('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still navigate to login even if clearing fails
      router.replace('/login');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard showOnlyAvailableNotifications={showOnlyAvailableNotifications} onNotificationPress={() => setShowOnlyAvailableNotifications(!showOnlyAvailableNotifications)} />;
      case 'visitors':
        return <Visitors />;
      case 'add-visitor':
        return <AddVisitor />;
      case 'scan-control':
        return <ScanControl />;
      case 'residents':
        return <Residents />;
      case 'agents':
        return <Agents />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard showOnlyAvailableNotifications={showOnlyAvailableNotifications} onNotificationPress={() => setShowOnlyAvailableNotifications(!showOnlyAvailableNotifications)} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onNotificationPress={() => setShowOnlyAvailableNotifications(!showOnlyAvailableNotifications)}
      showOnlyAvailableNotifications={showOnlyAvailableNotifications}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}
