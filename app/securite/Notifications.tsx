import { Bell, CheckCircle2, Eye, Filter, Mail, Send, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import type { Notification } from '../types';

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
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    recipients: [] as string[],
  });

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <Bell className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-blue-500 bg-blue-50';
    }
  };

  const sendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sending notification:', newNotification);
    // Here you would typically send the notification via your API
    alert('Notification envoyée avec succès!');
    setShowComposeModal(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: [],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Centre de notifications et d&apos;alertes</p>
        </div>
        
        <button
          onClick={() => setShowComposeModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700"
        >
          <Send className="w-4 h-4 mr-2" />
          Nouvelle notification
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total', count: notifications.length, color: 'bg-blue-500' },
          { label: 'Non lues', count: notifications.filter(n => !n.read).length, color: 'bg-yellow-500' },
          { label: 'Succès', count: notifications.filter(n => n.type === 'success').length, color: 'bg-green-500' },
          { label: 'Alertes', count: notifications.filter(n => n.type === 'error').length, color: 'bg-red-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Toutes' },
              { key: 'unread', label: 'Non lues' },
              { key: 'success', label: 'Succès' },
              { key: 'warning', label: 'Avertissements' },
              { key: 'error', label: 'Erreurs' },
              { key: 'info', label: 'Informations' },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-xl shadow-sm border-l-4 ${getNotificationStyle(notification.type)} p-6`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  
                  <p className="text-gray-700 mb-3">{notification.message}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{notification.recipient}</span>
                    </div>
                    <span>
                      {new Date(notification.timestamp).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Aucune notification trouvée</p>
        </div>
      )}

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Nouvelle notification</h2>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={sendNotification} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Titre de la notification"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Contenu de la notification"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="info">Information</option>
                  <option value="success">Succès</option>
                  <option value="warning">Avertissement</option>
                  <option value="error">Erreur</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}