export interface FinancialTransaction {
  id: string;
  transactionNumber: string;
  type: 'debit' | 'credit';
  category: string;
  amount: number;
  currency: string;
  description: string;
  reference?: string;
  branchId?: string;
  departmentId?: string;
  costCenter?: string;
  createdBy: string;
  createdAt: string;
}

export interface AccountsReceivable {
  id: string;
  invoiceId: string;
  patientId: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
}

export interface AccountsPayable {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
}

export interface CashTransaction {
  id: string;
  type: 'inflow' | 'outflow';
  amount: number;
  category: string;
  description: string;
  reference?: string;
  branchId?: string;
  createdBy: string;
  createdAt: string;
}

export interface GeneralLedgerEntry {
  id: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
  reference?: string;
  branchId?: string;
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  type: 'income_statement' | 'balance_sheet' | 'cash_flow' | 'trial_balance' | 'custom';
  period: string;
  startDate: string;
  endDate: string;
  data: Record<string, unknown>;
  generatedBy: string;
  generatedAt: string;
}
