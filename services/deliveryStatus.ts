export interface StatusColors {
  bgColor: string;
  color: string;
  textColor: string;
}

export function getStatusColors(status: string): StatusColors {
  switch (status) {
    case 'pending':
      return {
        bgColor: '#fef3c7',
        color: '#f59e0b',
        textColor: '#92400e',
      };
    case 'in_transit':
      return {
        bgColor: '#dbeafe',
        color: '#3b82f6',
        textColor: '#1e40af',
      };
    case 'delivered':
      return {
        bgColor: '#d1fae5',
        color: '#10b981',
        textColor: '#065f46',
      };
    case 'refused':
      return {
        bgColor: '#fee2e2',
        color: '#ef4444',
        textColor: '#991b1b',
      };
    case 'cancelled':
      return {
        bgColor: '#f3f4f6',
        color: '#6b7280',
        textColor: '#374151',
      };
    default:
      return {
        bgColor: '#f3f4f6',
        color: '#6b7280',
        textColor: '#374151',
      };
  }
}
