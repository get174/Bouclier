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