import React, { useState } from 'react';
import { ScanLine, CheckCircle, XCircle, Clock, User, Phone, MapPin } from 'lucide-react-native';

interface ScannedVisitor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  residentName: string;
  apartment: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockScannedVisitor: ScannedVisitor = {
  id: '1',
  firstName: 'Sophie',
  lastName: 'Martin',
  phone: '+33 6 12 34 56 78',
  residentName: 'Marie Dubois',
  apartment: 'Apt 304',
  purpose: 'Visite familiale',
  visitDate: '2024-01-15',
  visitTime: '14:30',
  status: 'approved',
};

export default function ScanControl() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedVisitor, setScannedVisitor] = useState<ScannedVisitor | null>(null);
  const [accessDecision, setAccessDecision] = useState<'granted' | 'denied' | null>(null);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      setScannedVisitor(mockScannedVisitor);
      setAccessDecision(null);
    }, 2000);
  };

  const handleAccessDecision = (decision: 'granted' | 'denied') => {
    setAccessDecision(decision);
    
    // Auto-reset after 3 seconds
    setTimeout(() => {
      setScannedVisitor(null);
      setAccessDecision(null);
    }, 3000);
  };

  const resetScan = () => {
    setScannedVisitor(null);
    setAccessDecision(null);
    setIsScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Scan & Contrôle daccès</h1>
        <p className="text-gray-600">Scanner le QR code du visiteur pour valider son accès</p>
      </div>

      {/* Scan Interface */}
      <div className="max-w-2xl mx-auto">
        {/* Scan Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            {!isScanning && !scannedVisitor && (
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <ScanLine className="w-16 h-16 text-gray-400" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Prêt à scanner
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Cliquez sur le bouton pour activer le scanner QR code
                  </p>
                  
                  <button
                    onClick={handleScan}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Démarrer le scan
                  </button>
                </div>
              </div>
            )}

            {isScanning && (
              <div className="space-y-6">
                <div className="w-32 h-32 mx-auto bg-blue-50 rounded-lg flex items-center justify-center border-2 border-blue-300 animate-pulse">
                  <ScanLine className="w-16 h-16 text-blue-600 animate-pulse" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Scan en cours...
                  </h3>
                  <p className="text-blue-600">
                    Positionnez le QR code devant la caméra
                  </p>
                </div>
              </div>
            )}

            {scannedVisitor && !accessDecision && (
              <div className="space-y-6">
                {/* Visitor Info Card */}
                <div className="bg-gray-50 rounded-lg p-6 text-left">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Informations du visiteur
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      scannedVisitor.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : scannedVisitor.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {scannedVisitor.status === 'approved' ? 'Pré-approuvé' : 
                       scannedVisitor.status === 'pending' ? 'En attente' : 'Refusé'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>
                        <strong>{scannedVisitor.firstName} {scannedVisitor.lastName}</strong>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{scannedVisitor.phone}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{scannedVisitor.residentName} - {scannedVisitor.apartment}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(scannedVisitor.visitDate).toLocaleDateString('fr-FR')} à {scannedVisitor.visitTime}
                      </span>
                    </div>
                    
                    <div className="md:col-span-2">
                      <strong>Motif:</strong> {scannedVisitor.purpose}
                    </div>
                  </div>
                </div>

                {/* Access Control Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => handleAccessDecision('denied')}
                    className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center space-x-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Refuser l&apos;accès</span>
                  </button>
                  
                  <button
                    onClick={() => handleAccessDecision('granted')}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Autoriser l&apos;accès</span>
                  </button>
                </div>
              </div>
            )}

            {accessDecision && (
              <div className="space-y-6">
                <div className={`w-32 h-32 mx-auto rounded-lg flex items-center justify-center ${
                  accessDecision === 'granted' ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'
                }`}>
                  {accessDecision === 'granted' ? (
                    <CheckCircle className="w-16 h-16 text-green-600" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-600" />
                  )}
                </div>
                
                <div>
                  <h3 className={`text-xl font-bold mb-2 ${
                    accessDecision === 'granted' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {accessDecision === 'granted' ? 'Accès autorisé' : 'Accès refusé'}
                  </h3>
                  
                  <p className={`text-lg ${
                    accessDecision === 'granted' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {accessDecision === 'granted' 
                      ? 'Le visiteur peut entrer dans la résidence'
                      : 'Le visiteur ne peut pas accéder à la résidence'
                    }
                  </p>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Retour automatique dans 3 secondes...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Manual Controls */}
        {!isScanning && (
          <div className="mt-6 text-center">
            <button
              onClick={resetScan}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Réinitialiser le scanner
            </button>
          </div>
        )}
      </div>

      {/* Recent Scans */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          
          <div className="space-y-3">
            {[
              { name: 'Marie Legrand', action: 'Accès autorisé', time: '14:23', status: 'granted' },
              { name: 'Pierre Durand', action: 'Accès refusé', time: '13:45', status: 'denied' },
              { name: 'Sophie Martin', action: 'Accès autorisé', time: '12:10', status: 'granted' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'granted' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <span className="font-medium text-gray-900">{activity.name}</span>
                    <span className="text-gray-500 ml-2">{activity.action}</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}