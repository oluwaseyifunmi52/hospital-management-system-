import { ReactNode } from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  children?: ReactNode;
}

const statusConfig: Record<string, { class: string; label: string }> = {
  // Appointment
  scheduled: { class: 'badge-info', label: 'Scheduled' },
  confirmed: { class: 'badge-primary', label: 'Confirmed' },
  completed: { class: 'badge-success', label: 'Completed' },
  cancelled: { class: 'badge-danger', label: 'Cancelled' },
  no_show: { class: 'badge-warning', label: 'No Show' },

  // Invoice
  draft: { class: 'badge-secondary', label: 'Draft' },
  pending: { class: 'badge-warning', label: 'Pending' },
  partially_paid: { class: 'badge-info', label: 'Partially Paid' },
  paid: { class: 'badge-success', label: 'Paid' },
  overdue: { class: 'badge-danger', label: 'Overdue' },

  // Payment
  failed: { class: 'badge-danger', label: 'Failed' },
  refunded: { class: 'badge-warning', label: 'Refunded' },

  // Lab
  sample_collected: { class: 'badge-info', label: 'Sample Collected' },
  processing: { class: 'badge-info', label: 'Processing' },
  reviewed: { class: 'badge-success', label: 'Reviewed' },

  // Staff
  active: { class: 'badge-success', label: 'Active' },
  inactive: { class: 'badge-danger', label: 'Inactive' },
  on_leave: { class: 'badge-warning', label: 'On Leave' },

  // General
  approved: { class: 'badge-success', label: 'Approved' },
  rejected: { class: 'badge-danger', label: 'Rejected' },
  submitted: { class: 'badge-info', label: 'Submitted' },
  accrued: { class: 'badge-status', label: 'Accrued' },
  reconciled: { class: 'badge-success', label: 'Reconciled' },
  posted: { class: 'badge-success', label: 'Posted' },
  voided: { class: 'badge-danger', label: 'Voided' },
};

const typeClass: Record<string, string> = {
  default: 'badge-secondary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  primary: 'badge-primary',
};

export function StatusBadge({ status, type = 'default', children }: StatusBadgeProps) {
  const lower = status.toLowerCase();
  const config = statusConfig[lower] || { class: typeClass[type] || typeClass.default, label: status };
  return (
    <span className={`${config.class} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
      {children || config.label}
    </span>
  );
}
