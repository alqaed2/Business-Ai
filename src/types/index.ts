export type UserRole = 'admin' | 'manager' | 'user';
export type SubscriptionPlan = 'starter' | 'pro' | 'enterprise';
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Tenant {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  createdAt: string;
  stripeCustomerId?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  tenantId: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
}

export interface Client {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  email?: string;
}

export interface Job {
  id: string;
  tenantId: string;
  type: string;
  status: JobStatus;
  input: any;
  result?: any;
  createdAt: string;
}

export interface ContentAsset {
  id: string;
  tenantId: string;
  type: string;
  data: any;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}
