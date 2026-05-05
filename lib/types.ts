export type ProjectStage =
  | "lead"
  | "proposal"
  | "site-assessment"
  | "engineering"
  | "permitting"
  | "installation"
  | "inspection"
  | "complete";

export type ProjectType = "solar" | "electrical" | "solar+electrical" | "maintenance";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: "residential" | "commercial";
  status: "lead" | "active" | "complete" | "inactive";
  source: "referral" | "google" | "website" | "door-to-door" | "other";
  createdAt: string;
  lastContact: string;
  projectCount: number;
  totalValue: number;
  avatar?: string;
  notes?: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  title: string;
  customerId: string;
  customerName: string;
  address: string;
  type: ProjectType;
  stage: ProjectStage;
  value: number;
  systemSize?: number; // kW for solar
  startDate: string;
  targetDate: string;
  completedDate?: string;
  assignedTo: string;
  tags: string[];
  notes?: string;
  progress: number; // 0-100
  priority: "low" | "medium" | "high";
  permits: PermitStatus[];
  tasks: Task[];
  files: ProjectFile[];
  lastUpdated: string;
}

export interface PermitStatus {
  id: string;
  type: string;
  status: "pending" | "submitted" | "approved" | "rejected";
  submittedDate?: string;
  approvedDate?: string;
  number?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  driveId?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  projectId?: string;
  customerId?: string;
  type: "inspection" | "installation" | "assessment" | "meeting" | "other";
  location?: string;
  attendees?: string[];
  googleEventId?: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  snippet: string;
  from: string;
  fromEmail: string;
  to: string[];
  date: string;
  unread: boolean;
  starred: boolean;
  labels: string[];
  projectId?: string;
  customerId?: string;
  gmailThreadId?: string;
  messageCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  color: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  activeProjects: number;
  activeProjectsChange: number;
  pendingInstalls: number;
  completedThisMonth: number;
  completedChange: number;
  leadsThisMonth: number;
  leadsChange: number;
  avgProjectValue: number;
  installedKW: number;
}
