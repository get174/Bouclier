import { CheckCircle, Clock, MapPin, Phone, ScanLine, User, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Scan & Contrôle d'accès</Text>
        <Text style={styles.subtitle}>Scanner le QR code du visiteur pour valider son accès</Text>
      </View>

      {/* Scan Interface */}
      <View style={styles.scanInterface}>
        {/* Scan Area */}
        <View style={styles.scanArea}>
          <View style={styles.scanContent}>
            {!isScanning && !scannedVisitor && (
              <View style={styles.scanReady}>
                <View style={styles.scanIconContainer}>
                  <ScanLine style={styles.scanIcon} />
                </View>

                <View style={styles.scanTextContainer}>
                  <Text style={styles.scanHeading}>
                    Prêt à scanner
                  </Text>
                  <Text style={styles.scanDescription}>
                    Cliquez sur le bouton pour activer le scanner QR code
                  </Text>

                  <TouchableOpacity
                    onPress={handleScan}
                    style={styles.scanButton}
                  >
                    <Text style={styles.scanButtonText}>Démarrer le scan</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isScanning && (
              <View style={styles.scanning}>
                <View style={styles.scanningIconContainer}>
                  <ScanLine style={styles.scanningIcon} />
                </View>

                <View style={styles.scanningTextContainer}>
                  <Text style={styles.scanningHeading}>
                    Scan en cours...
                  </Text>
                  <Text style={styles.scanningDescription}>
                    Positionnez le QR code devant la caméra
                  </Text>
                </View>
              </View>
            )}

            {scannedVisitor && !accessDecision && (
              <View style={styles.visitorInfo}>
                {/* Visitor Info Card */}
                <View style={styles.visitorCard}>
                  <View style={styles.visitorHeader}>
                    <Text style={styles.visitorTitle}>
                      Informations du visiteur
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      scannedVisitor.status === 'approved' ? styles.statusApproved :
                      scannedVisitor.status === 'pending' ? styles.statusPending : styles.statusRejected
                    ]}>
                      <Text style={styles.statusText}>
                        {scannedVisitor.status === 'approved' ? 'Pré-approuvé' :
                         scannedVisitor.status === 'pending' ? 'En attente' : 'Refusé'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.visitorDetails}>
                    <View style={styles.detailRow}>
                      <User style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        <Text style={styles.detailBold}>{scannedVisitor.firstName} {scannedVisitor.lastName}</Text>
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Phone style={styles.detailIcon} />
                      <Text style={styles.detailText}>{scannedVisitor.phone}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <MapPin style={styles.detailIcon} />
                      <Text style={styles.detailText}>{scannedVisitor.residentName} - {scannedVisitor.apartment}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Clock style={styles.detailIcon} />
                      <Text style={styles.detailText}>
                        {new Date(scannedVisitor.visitDate).toLocaleDateString('fr-FR')} à {scannedVisitor.visitTime}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailBold}>Motif:</Text>
                      <Text style={styles.detailText}> {scannedVisitor.purpose}</Text>
                    </View>
                  </View>
                </View>

                {/* Access Control Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    onPress={() => handleAccessDecision('denied')}
                    style={styles.denyButton}
                  >
                    <XCircle style={styles.buttonIcon} />
                    <Text style={styles.denyButtonText}>Refuser l'accès</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleAccessDecision('granted')}
                    style={styles.grantButton}
                  >
                    <CheckCircle style={styles.buttonIcon} />
                    <Text style={styles.grantButtonText}>Autoriser l'accès</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {accessDecision && (
              <View style={styles.decisionResult}>
                <View style={[
                  styles.decisionIconContainer,
                  accessDecision === 'granted' ? styles.decisionGranted : styles.decisionDenied
                ]}>
                  {accessDecision === 'granted' ? (
                    <CheckCircle style={styles.decisionIcon} />
                  ) : (
                    <XCircle style={styles.decisionIcon} />
                  )}
                </View>

                <View style={styles.decisionTextContainer}>
                  <Text style={[
                    styles.decisionTitle,
                    accessDecision === 'granted' ? styles.decisionTitleGranted : styles.decisionTitleDenied
                  ]}>
                    {accessDecision === 'granted' ? 'Accès autorisé' : 'Accès refusé'}
                  </Text>

                  <Text style={[
                    styles.decisionMessage,
                    accessDecision === 'granted' ? styles.decisionMessageGranted : styles.decisionMessageDenied
                  ]}>
                    {accessDecision === 'granted'
                      ? 'Le visiteur peut entrer dans la résidence'
                      : 'Le visiteur ne peut pas accéder à la résidence'
                    }
                  </Text>

                  <Text style={styles.decisionCountdown}>
                    Retour automatique dans 3 secondes...
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Manual Controls */}
        {!isScanning && (
          <View style={styles.manualControls}>
            <TouchableOpacity
              onPress={resetScan}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Réinitialiser le scanner</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recent Scans */}
      <View style={styles.recentScans}>
        <View style={styles.recentScansCard}>
          <Text style={styles.recentScansTitle}>Activité récente</Text>

          <View style={styles.activityList}>
            {[
              { name: 'Marie Legrand', action: 'Accès autorisé', time: '14:23', status: 'granted' },
              { name: 'Pierre Durand', action: 'Accès refusé', time: '13:45', status: 'denied' },
              { name: 'Sophie Martin', action: 'Accès autorisé', time: '12:10', status: 'granted' },
            ].map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityLeft}>
                  <View style={[
                    styles.activityDot,
                    activity.status === 'granted' ? styles.activityDotGranted : styles.activityDotDenied
                  ]} />
                  <View style={styles.activityTextContainer}>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                  </View>
                </View>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    color: '#6B7280',
  },
  scanInterface: {
    maxWidth: 512,
    alignSelf: 'center',
  },
  scanArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  scanContent: {
    alignItems: 'center',
  },
  scanReady: {
    gap: 24,
  },
  scanIconContainer: {
    width: 128,
    height: 128,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
  },
  scanIcon: {
    width: 64,
    height: 64,
    color: '#9CA3AF',
  },
  scanTextContainer: {
    alignItems: 'center',
  },
  scanHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  scanDescription: {
    color: '#6B7280',
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  scanning: {
    gap: 24,
  },
  scanningIconContainer: {
    width: 128,
    height: 128,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  scanningIcon: {
    width: 64,
    height: 64,
    color: '#2563EB',
  },
  scanningTextContainer: {
    alignItems: 'center',
  },
  scanningHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  scanningDescription: {
    color: '#2563EB',
  },
  visitorInfo: {
    gap: 24,
  },
  visitorCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 24,
  },
  visitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  visitorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  statusApproved: {
    backgroundColor: '#ECFDF5',
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusRejected: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  visitorDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailIcon: {
    width: 16,
    height: 16,
    color: '#9CA3AF',
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  detailBold: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  denyButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  denyButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  grantButton: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  grantButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  decisionResult: {
    gap: 24,
  },
  decisionIconContainer: {
    width: 128,
    height: 128,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  decisionGranted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  decisionDenied: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  decisionIcon: {
    width: 64,
    height: 64,
  },
  decisionTextContainer: {
    alignItems: 'center',
  },
  decisionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  decisionTitleGranted: {
    color: '#065F46',
  },
  decisionTitleDenied: {
    color: '#991B1B',
  },
  decisionMessage: {
    fontSize: 18,
    marginBottom: 16,
  },
  decisionMessageGranted: {
    color: '#047857',
  },
  decisionMessageDenied: {
    color: '#DC2626',
  },
  decisionCountdown: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  manualControls: {
    marginTop: 24,
    alignItems: 'center',
  },
  resetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  recentScans: {
    maxWidth: 1024,
    alignSelf: 'center',
  },
  recentScansCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
  },
  recentScansTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activityDotGranted: {
    backgroundColor: '#10B981',
  },
  activityDotDenied: {
    backgroundColor: '#EF4444',
  },
  activityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityName: {
    fontWeight: '500',
    color: '#111827',
  },
  activityAction: {
    color: '#6B7280',
  },
  activityTime: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});
