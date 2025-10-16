import { Download, Mail, Save, Settings as SettingsIcon, Shield, Upload, User as UserIcon, Users } from 'lucide-react-native';
import React, { useState } from 'react';
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
    alert('Paramètres sauvegardés avec succès!');
  };

  const handleExport = (type: 'excel' | 'pdf', data: 'visitors' | 'residents' | 'notifications') => {
    console.log(`Exporting ${data} as ${type}`);
    alert(`Export ${type.toUpperCase()} des ${data} en cours...`);
  };

  const tabs = [
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'system', label: 'Système', icon: SettingsIcon },
    { id: 'exports', label: 'Exports', icon: Download },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600">Configuration du système et gestion des utilisateurs</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Gestion des utilisateurs</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  Ajouter utilisateur
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière connexion
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'admin' ? 'Administrateur' : 'Agent'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastLogin).toLocaleString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-4">
                            Modifier
                          </button>
                          {user.role !== 'admin' && (
                            <button className="text-red-600 hover:text-red-900">
                              Supprimer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Paramètres système</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Approval Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                    Approbation des visiteurs
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Approbation automatique
                      </label>
                      <button
                        onClick={() => handleSystemSettingChange('autoApproval', !systemSettings.autoApproval)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          systemSettings.autoApproval ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            systemSettings.autoApproval ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fenêtre de visite (heures)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.visitTimeWindow}
                        onChange={(e) => handleSystemSettingChange('visitTimeWindow', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="24"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max visiteurs par jour
                      </label>
                      <input
                        type="number"
                        value={systemSettings.maxVisitorsPerDay}
                        onChange={(e) => handleSystemSettingChange('maxVisitorsPerDay', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-green-600" />
                    Notifications
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Notifications email
                      </label>
                      <button
                        onClick={() => handleSystemSettingChange('notificationsEmail', !systemSettings.notificationsEmail)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          systemSettings.notificationsEmail ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            systemSettings.notificationsEmail ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">
                        Notifications push
                      </label>
                      <button
                        onClick={() => handleSystemSettingChange('notificationsPush', !systemSettings.notificationsPush)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          systemSettings.notificationsPush ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            systemSettings.notificationsPush ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiration QR code (heures)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.qrCodeExpiry}
                        onChange={(e) => handleSystemSettingChange('qrCodeExpiry', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        max="168"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          )}

          {/* Exports Tab */}
          {activeTab === 'exports' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Exports de données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <div key={exportItem.data} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-md font-semibold text-gray-900 mb-2">
                      {exportItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {exportItem.description}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {exportItem.count}
                    </p>
                    
                    <div className="space-y-2">
                      <button
                        onClick={() => handleExport('excel', exportItem.data)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Excel</span>
                      </button>
                      
                      <button
                        onClick={() => handleExport('pdf', exportItem.data)}
                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Import Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Import de données
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 mb-4">
                    Importez des données depuis un fichier Excel ou CSV.
                  </p>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}