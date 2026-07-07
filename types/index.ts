export type Role = "CUSTOMER" | "ADMIN" | null;

export interface Plan {
  id: string;
  name: string;
  price: number;
  dataLimit: number;
  features: string[];
}

export interface AuditLog {
  id: string;
  customerId: string;
  action: string;
  date: string;
}
