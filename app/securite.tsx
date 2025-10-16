import React, { useState } from 'react';
import AddVisitor from './securite/AddVisitor';
import Dashboard from './securite/Dashboard';
import Layout from './securite/Layout';
import Notifications from './securite/Notifications';
import Residents from './securite/Residents';
import ScanControl from './securite/ScanControl';
import Settings from './securite/Settings';
import Visitors from './securite/Visitors';

export default function Securite() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showOnlyAvailableNotifications, setShowOnlyAvailableNotifications] = useState(false);

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
    >
      {renderPage()}
    </Layout>
  );
}
