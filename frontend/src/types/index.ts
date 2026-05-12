export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'hr_admin' | 'manager' | 'employee' | 'recruiter';
  avatar: string;
  department: string;
  designation: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  manager: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  avatar: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'intern';
  salary: number;
  skills: string[];
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'half_day' | 'wfh' | 'leave' | 'late' | 'holiday';
  totalHours: number;
  department: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'earned' | 'paid' | 'unpaid' | 'wfh' | 'compensatory';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
  department: string;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  pf: number;
  tax: number;
  netSalary: number;
  status: 'processed' | 'pending' | 'on_hold';
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full_time' | 'part_time' | 'contract' | 'remote';
  experience: string;
  applicants: number;
  status: 'open' | 'closed' | 'draft';
  postedDate: string;
  description: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  stage: 'applied' | 'screening' | 'interview' | 'technical' | 'hr_round' | 'selected' | 'rejected' | 'onboarding';
  appliedDate: string;
  rating: number;
  resume: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  rating: number;
  goals: Goal[];
  status: 'pending' | 'in_progress' | 'completed';
  reviewer: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  dueDate: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  assignedTo: string;
  assignedDate: string;
  status: 'assigned' | 'available' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface HelpDeskTicket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: string;
  createdDate: string;
  assignedTo: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  employees: number;
  color: string;
}

export type PageType =
  | 'dashboard'
  | 'employees'
  | 'attendance'
  | 'leaves'
  | 'payroll'
  | 'recruitment'
  | 'performance'
  | 'assets'
  | 'helpdesk'
  | 'shifts'
  | 'reports'
  | 'settings'
  | 'profile';
