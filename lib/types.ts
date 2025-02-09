export interface DashboardData {
  tokenUsage: {
    totalIssued: number;
    totalUsed: number;
    remaining: number;
  };
  tokenUsageHistory?: Array<{
    date: string;
    totalUsed: number;
  }>;
  // ... other types
}

export type DashboardError = {
  timestamp: string;
  message: string;
};

export type AuditLog = {
  timestamp: string;
  action: string;
  performedBy: string;
}; 