export type { Department, Branch, CostCenter } from './department';

export interface Budget {
  id: string;
  name: string;
  departmentId?: string;
  branchId?: string;
  fiscalYear: number;
  period: 'monthly' | 'quarterly' | 'annual';
  totalBudget: number;
  spent: number;
  remaining: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed';
  createdAt: string;
}

export interface BudgetAlert {
  id: string;
  budgetId: string;
  threshold: number;
  message: string;
  isTriggered: boolean;
  triggeredAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  resource: string;
  resourceId?: string;
  previousValue?: string;
  newValue?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  name: string;
  type: string;
  category: string;
  parameters?: Record<string, unknown>;
  generatedBy: string;
  generatedAt: string;
  fileUrl?: string;
  expiresAt?: string;
}

export interface AnalyticsKPI {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  unit?: string;
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'doughnut';
  data: Record<string, unknown>[];
  filters?: Record<string, unknown>;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  data?: Record<string, unknown>;
}
