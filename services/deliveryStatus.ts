export interface DeliveryStatus {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  {
    id: 'pending',
    label: 'En attente',
    color: '#f59e0b',
    bgColor: '#fef3c7',
    textColor: '#92400e'
  },
  {
    id: 'in_transit',
    label: 'En cours',
    color: '#3b82f6',
    bgColor: '#dbeafe',
    textColor: '#1e40af'
  },
  {
    id: 'delivered',
    label: 'Livrée',
    color: '#10b981',
    bgColor: '#d1fae5',
    textColor: '#065f46'
  },
  {
    id: 'refused',
    label: 'Refusée',
    color: '#ef4444',
    bgColor: '#fee2e2',
    textColor: '#991b1b'
  },
  {
    id: 'cancelled',
    label: 'Annulée',
    color: '#6b7280',
    bgColor: '#f3f4f6',
    textColor: '#374151'
  }
];

export const getStatusById = (id: string): DeliveryStatus | undefined => {
  return DELIVERY_STATUSES.find(status => status.id === id);
};

export const getStatusLabel = (id: string): string => {
  const status = getStatusById(id);
  return status ? status.label : 'Inconnu';
};

export const getStatusColors = (id: string) => {
  const status = getStatusById(id);
  return status ? {
    color: status.color,
    bgColor: status.bgColor,
    textColor: status.textColor
  } : {
    color: '#6b7280',
    bgColor: '#f3f4f6',
    textColor: '#374151'
  };
};

export type DeliveryStatusType = 'pending' | 'in_transit' | 'delivered' | 'refused' | 'cancelled';
