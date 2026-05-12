





export const currentUser = {
  id: 'u1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@dms.com',
  role: 'hr_admin',
  avatar: '',
  department: 'Human Resources',
  designation: 'HR Director'
};

export const departments = [
{ id: 'd1', name: 'Engineering', head: 'Michael Chen', employeeCount: 45 },
{ id: 'd2', name: 'Human Resources', head: 'Sarah Johnson', employeeCount: 12 },
{ id: 'd3', name: 'Marketing', head: 'Emily Davis', employeeCount: 18 },
{ id: 'd4', name: 'Sales', head: 'Robert Wilson', employeeCount: 32 },
{ id: 'd5', name: 'Finance', head: 'David Brown', employeeCount: 15 },
{ id: 'd6', name: 'Product', head: 'Jessica Lee', employeeCount: 20 },
{ id: 'd7', name: 'Design', head: 'Amanda Torres', employeeCount: 10 },
{ id: 'd8', name: 'Operations', head: 'James Anderson', employeeCount: 22 }];


export const employees = [
{ id: 'e1', employeeId: 'DMS001', name: 'Michael Chen', email: 'michael.chen@dms.com', phone: '+1-555-0101', department: 'Engineering', designation: 'VP Engineering', manager: 'CEO', joinDate: '2020-03-15', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 185000, skills: ['Leadership', 'System Design', 'Cloud Architecture'] },
{ id: 'e2', employeeId: 'DMS002', name: 'Emily Davis', email: 'emily.davis@dms.com', phone: '+1-555-0102', department: 'Marketing', designation: 'Marketing Director', manager: 'CEO', joinDate: '2020-06-01', status: 'active', avatar: '', location: 'New York', type: 'full_time', salary: 145000, skills: ['Digital Marketing', 'Brand Strategy', 'Analytics'] },
{ id: 'e3', employeeId: 'DMS003', name: 'Robert Wilson', email: 'robert.wilson@dms.com', phone: '+1-555-0103', department: 'Sales', designation: 'Sales Director', manager: 'CEO', joinDate: '2019-11-20', status: 'active', avatar: '', location: 'Chicago', type: 'full_time', salary: 155000, skills: ['Sales Strategy', 'CRM', 'Negotiation'] },
{ id: 'e4', employeeId: 'DMS004', name: 'Jessica Lee', email: 'jessica.lee@dms.com', phone: '+1-555-0104', department: 'Product', designation: 'Product Manager', manager: 'Michael Chen', joinDate: '2021-01-10', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 135000, skills: ['Product Strategy', 'Agile', 'User Research'] },
{ id: 'e5', employeeId: 'DMS005', name: 'David Brown', email: 'david.brown@dms.com', phone: '+1-555-0105', department: 'Finance', designation: 'Finance Manager', manager: 'CEO', joinDate: '2020-09-01', status: 'active', avatar: '', location: 'New York', type: 'full_time', salary: 125000, skills: ['Financial Analysis', 'Budgeting', 'Compliance'] },
{ id: 'e6', employeeId: 'DMS006', name: 'Amanda Torres', email: 'amanda.torres@dms.com', phone: '+1-555-0106', department: 'Design', designation: 'Design Lead', manager: 'Jessica Lee', joinDate: '2021-04-15', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 120000, skills: ['UI/UX Design', 'Figma', 'Design Systems'] },
{ id: 'e7', employeeId: 'DMS007', name: 'James Anderson', email: 'james.anderson@dms.com', phone: '+1-555-0107', department: 'Operations', designation: 'Operations Manager', manager: 'CEO', joinDate: '2020-02-01', status: 'active', avatar: '', location: 'Chicago', type: 'full_time', salary: 110000, skills: ['Operations', 'Supply Chain', 'Process Improvement'] },
{ id: 'e8', employeeId: 'DMS008', name: 'Sophia Martinez', email: 'sophia.martinez@dms.com', phone: '+1-555-0108', department: 'Engineering', designation: 'Senior Developer', manager: 'Michael Chen', joinDate: '2021-07-20', status: 'active', avatar: '', location: 'Remote', type: 'full_time', salary: 140000, skills: ['React', 'TypeScript', 'Node.js'] },
{ id: 'e9', employeeId: 'DMS009', name: 'Daniel Kim', email: 'daniel.kim@dms.com', phone: '+1-555-0109', department: 'Engineering', designation: 'DevOps Engineer', manager: 'Michael Chen', joinDate: '2022-01-15', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 130000, skills: ['AWS', 'Docker', 'Kubernetes'] },
{ id: 'e10', employeeId: 'DMS010', name: 'Rachel Green', email: 'rachel.green@dms.com', phone: '+1-555-0110', department: 'Marketing', designation: 'Content Strategist', manager: 'Emily Davis', joinDate: '2022-03-01', status: 'active', avatar: '', location: 'New York', type: 'full_time', salary: 85000, skills: ['Content Strategy', 'SEO', 'Copywriting'] },
{ id: 'e11', employeeId: 'DMS011', name: 'Kevin Patel', email: 'kevin.patel@dms.com', phone: '+1-555-0111', department: 'Sales', designation: 'Sales Executive', manager: 'Robert Wilson', joinDate: '2022-05-10', status: 'active', avatar: '', location: 'Chicago', type: 'full_time', salary: 75000, skills: ['B2B Sales', 'Lead Generation', 'CRM'] },
{ id: 'e12', employeeId: 'DMS012', name: 'Lisa Wang', email: 'lisa.wang@dms.com', phone: '+1-555-0112', department: 'Engineering', designation: 'QA Engineer', manager: 'Michael Chen', joinDate: '2022-06-15', status: 'on_leave', avatar: '', location: 'Remote', type: 'full_time', salary: 95000, skills: ['Testing', 'Automation', 'Selenium'] },
{ id: 'e13', employeeId: 'DMS013', name: 'Chris Taylor', email: 'chris.taylor@dms.com', phone: '+1-555-0113', department: 'Design', designation: 'UI Designer', manager: 'Amanda Torres', joinDate: '2022-08-01', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 90000, skills: ['UI Design', 'Illustration', 'Prototyping'] },
{ id: 'e14', employeeId: 'DMS014', name: 'Olivia Smith', email: 'olivia.smith@dms.com', phone: '+1-555-0114', department: 'Human Resources', designation: 'HR Specialist', manager: 'Sarah Johnson', joinDate: '2023-01-10', status: 'active', avatar: '', location: 'New York', type: 'full_time', salary: 70000, skills: ['Recruitment', 'Employee Relations', 'HRIS'] },
{ id: 'e15', employeeId: 'DMS015', name: 'Nathan Brooks', email: 'nathan.brooks@dms.com', phone: '+1-555-0115', department: 'Engineering', designation: 'Full Stack Developer', manager: 'Michael Chen', joinDate: '2023-02-20', status: 'active', avatar: '', location: 'Remote', type: 'full_time', salary: 115000, skills: ['Python', 'Django', 'React'] },
{ id: 'e16', employeeId: 'DMS016', name: 'Maria Garcia', email: 'maria.garcia@dms.com', phone: '+1-555-0116', department: 'Finance', designation: 'Accountant', manager: 'David Brown', joinDate: '2023-04-05', status: 'active', avatar: '', location: 'New York', type: 'full_time', salary: 72000, skills: ['Accounting', 'SAP', 'Tax'] },
{ id: 'e17', employeeId: 'DMS017', name: 'Alex Thompson', email: 'alex.thompson@dms.com', phone: '+1-555-0117', department: 'Product', designation: 'Business Analyst', manager: 'Jessica Lee', joinDate: '2023-06-01', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 95000, skills: ['Business Analysis', 'SQL', 'Jira'] },
{ id: 'e18', employeeId: 'DMS018', name: 'Tyler Robinson', email: 'tyler.robinson@dms.com', phone: '+1-555-0118', department: 'Engineering', designation: 'Junior Developer', manager: 'Sophia Martinez', joinDate: '2024-01-15', status: 'active', avatar: '', location: 'San Francisco', type: 'full_time', salary: 80000, skills: ['JavaScript', 'HTML/CSS', 'Git'] },
{ id: 'e19', employeeId: 'DMS019', name: 'Hannah White', email: 'hannah.white@dms.com', phone: '+1-555-0119', department: 'Marketing', designation: 'Social Media Manager', manager: 'Emily Davis', joinDate: '2024-02-01', status: 'active', avatar: '', location: 'Remote', type: 'full_time', salary: 68000, skills: ['Social Media', 'Content Creation', 'Analytics'] },
{ id: 'e20', employeeId: 'DMS020', name: 'Ryan Mitchell', email: 'ryan.mitchell@dms.com', phone: '+1-555-0120', department: 'Operations', designation: 'Intern', manager: 'James Anderson', joinDate: '2024-06-01', status: 'active', avatar: '', location: 'Chicago', type: 'intern', salary: 35000, skills: ['Excel', 'Data Entry', 'Research'] }];


export const attendanceRecords = [
{ id: 'a1', employeeId: 'e1', employeeName: 'Michael Chen', date: '2024-12-16', checkIn: '09:02', checkOut: '18:15', status: 'present', totalHours: 9.2, department: 'Engineering' },
{ id: 'a2', employeeId: 'e2', employeeName: 'Emily Davis', date: '2024-12-16', checkIn: '08:45', checkOut: '17:30', status: 'present', totalHours: 8.75, department: 'Marketing' },
{ id: 'a3', employeeId: 'e3', employeeName: 'Robert Wilson', date: '2024-12-16', checkIn: '09:30', checkOut: '18:45', status: 'late', totalHours: 9.25, department: 'Sales' },
{ id: 'a4', employeeId: 'e4', employeeName: 'Jessica Lee', date: '2024-12-16', checkIn: '08:55', checkOut: '17:55', status: 'present', totalHours: 9.0, department: 'Product' },
{ id: 'a5', employeeId: 'e5', employeeName: 'David Brown', date: '2024-12-16', checkIn: '09:00', checkOut: '18:00', status: 'present', totalHours: 9.0, department: 'Finance' },
{ id: 'a6', employeeId: 'e6', employeeName: 'Amanda Torres', date: '2024-12-16', checkIn: '10:00', checkOut: '14:00', status: 'half_day', totalHours: 4.0, department: 'Design' },
{ id: 'a7', employeeId: 'e7', employeeName: 'James Anderson', date: '2024-12-16', checkIn: '-', checkOut: '-', status: 'absent', totalHours: 0, department: 'Operations' },
{ id: 'a8', employeeId: 'e8', employeeName: 'Sophia Martinez', date: '2024-12-16', checkIn: '08:30', checkOut: '17:30', status: 'wfh', totalHours: 9.0, department: 'Engineering' },
{ id: 'a9', employeeId: 'e9', employeeName: 'Daniel Kim', date: '2024-12-16', checkIn: '09:10', checkOut: '18:30', status: 'present', totalHours: 9.3, department: 'Engineering' },
{ id: 'a10', employeeId: 'e10', employeeName: 'Rachel Green', date: '2024-12-16', checkIn: '-', checkOut: '-', status: 'leave', totalHours: 0, department: 'Marketing' },
{ id: 'a11', employeeId: 'e11', employeeName: 'Kevin Patel', date: '2024-12-16', checkIn: '08:50', checkOut: '18:10', status: 'present', totalHours: 9.3, department: 'Sales' },
{ id: 'a12', employeeId: 'e12', employeeName: 'Lisa Wang', date: '2024-12-16', checkIn: '-', checkOut: '-', status: 'leave', totalHours: 0, department: 'Engineering' },
{ id: 'a13', employeeId: 'e13', employeeName: 'Chris Taylor', date: '2024-12-16', checkIn: '09:05', checkOut: '18:00', status: 'present', totalHours: 8.9, department: 'Design' },
{ id: 'a14', employeeId: 'e14', employeeName: 'Olivia Smith', date: '2024-12-16', checkIn: '08:40', checkOut: '17:40', status: 'present', totalHours: 9.0, department: 'Human Resources' },
{ id: 'a15', employeeId: 'e15', employeeName: 'Nathan Brooks', date: '2024-12-16', checkIn: '09:15', checkOut: '18:45', status: 'wfh', totalHours: 9.5, department: 'Engineering' }];


export const leaveRequests = [
{ id: 'l1', employeeId: 'e10', employeeName: 'Rachel Green', type: 'casual', startDate: '2024-12-16', endDate: '2024-12-18', days: 3, reason: 'Family event', status: 'approved', appliedOn: '2024-12-10', department: 'Marketing' },
{ id: 'l2', employeeId: 'e12', employeeName: 'Lisa Wang', type: 'sick', startDate: '2024-12-14', endDate: '2024-12-20', days: 5, reason: 'Medical treatment', status: 'approved', appliedOn: '2024-12-13', department: 'Engineering' },
{ id: 'l3', employeeId: 'e8', employeeName: 'Sophia Martinez', type: 'wfh', startDate: '2024-12-19', endDate: '2024-12-20', days: 2, reason: 'Home repairs scheduled', status: 'pending', appliedOn: '2024-12-15', department: 'Engineering' },
{ id: 'l4', employeeId: 'e3', employeeName: 'Robert Wilson', type: 'earned', startDate: '2024-12-23', endDate: '2024-12-31', days: 7, reason: 'Year-end vacation', status: 'pending', appliedOn: '2024-12-14', department: 'Sales' },
{ id: 'l5', employeeId: 'e6', employeeName: 'Amanda Torres', type: 'casual', startDate: '2024-12-17', endDate: '2024-12-17', days: 1, reason: 'Personal errand', status: 'pending', appliedOn: '2024-12-15', department: 'Design' },
{ id: 'l6', employeeId: 'e15', employeeName: 'Nathan Brooks', type: 'sick', startDate: '2024-12-10', endDate: '2024-12-11', days: 2, reason: 'Flu', status: 'approved', appliedOn: '2024-12-10', department: 'Engineering' },
{ id: 'l7', employeeId: 'e11', employeeName: 'Kevin Patel', type: 'casual', startDate: '2024-12-05', endDate: '2024-12-05', days: 1, reason: 'Doctors appointment', status: 'rejected', appliedOn: '2024-12-03', department: 'Sales' },
{ id: 'l8', employeeId: 'e19', employeeName: 'Hannah White', type: 'wfh', startDate: '2024-12-22', endDate: '2024-12-24', days: 3, reason: 'Traveling to hometown', status: 'pending', appliedOn: '2024-12-16', department: 'Marketing' }];


export const leaveBalances = [
{ type: 'Casual Leave', total: 12, used: 5, remaining: 7 },
{ type: 'Sick Leave', total: 10, used: 3, remaining: 7 },
{ type: 'Earned Leave', total: 15, used: 8, remaining: 7 },
{ type: 'Paid Leave', total: 10, used: 2, remaining: 8 },
{ type: 'Work From Home', total: 24, used: 10, remaining: 14 },
{ type: 'Compensatory', total: 5, used: 1, remaining: 4 }];


export const payrollRecords = [
{ id: 'p1', employeeId: 'e1', employeeName: 'Michael Chen', month: 'November 2024', basicSalary: 92500, hra: 37000, allowances: 18500, deductions: 5550, pf: 11100, tax: 27750, netSalary: 103600, status: 'processed' },
{ id: 'p2', employeeId: 'e2', employeeName: 'Emily Davis', month: 'November 2024', basicSalary: 72500, hra: 29000, allowances: 14500, deductions: 4350, pf: 8700, tax: 18850, netSalary: 84100, status: 'processed' },
{ id: 'p3', employeeId: 'e3', employeeName: 'Robert Wilson', month: 'November 2024', basicSalary: 77500, hra: 31000, allowances: 15500, deductions: 4650, pf: 9300, tax: 20925, netSalary: 89125, status: 'processed' },
{ id: 'p4', employeeId: 'e4', employeeName: 'Jessica Lee', month: 'November 2024', basicSalary: 67500, hra: 27000, allowances: 13500, deductions: 4050, pf: 8100, tax: 16875, netSalary: 78975, status: 'processed' },
{ id: 'p5', employeeId: 'e5', employeeName: 'David Brown', month: 'November 2024', basicSalary: 62500, hra: 25000, allowances: 12500, deductions: 3750, pf: 7500, tax: 14375, netSalary: 74375, status: 'processed' },
{ id: 'p6', employeeId: 'e6', employeeName: 'Amanda Torres', month: 'November 2024', basicSalary: 60000, hra: 24000, allowances: 12000, deductions: 3600, pf: 7200, tax: 13200, netSalary: 72000, status: 'processed' },
{ id: 'p7', employeeId: 'e8', employeeName: 'Sophia Martinez', month: 'November 2024', basicSalary: 70000, hra: 28000, allowances: 14000, deductions: 4200, pf: 8400, tax: 17500, netSalary: 81900, status: 'processed' },
{ id: 'p8', employeeId: 'e9', employeeName: 'Daniel Kim', month: 'November 2024', basicSalary: 65000, hra: 26000, allowances: 13000, deductions: 3900, pf: 7800, tax: 15600, netSalary: 76700, status: 'pending' },
{ id: 'p9', employeeId: 'e15', employeeName: 'Nathan Brooks', month: 'November 2024', basicSalary: 57500, hra: 23000, allowances: 11500, deductions: 3450, pf: 6900, tax: 12075, netSalary: 69575, status: 'pending' },
{ id: 'p10', employeeId: 'e18', employeeName: 'Tyler Robinson', month: 'November 2024', basicSalary: 40000, hra: 16000, allowances: 8000, deductions: 2400, pf: 4800, tax: 6400, netSalary: 50400, status: 'pending' }];


export const jobPostings = [
{ id: 'j1', title: 'Senior Frontend Developer', department: 'Engineering', location: 'San Francisco', type: 'full_time', experience: '5-8 years', applicants: 34, status: 'open', postedDate: '2024-11-20', description: 'We are looking for a senior frontend developer with React experience.' },
{ id: 'j2', title: 'Product Designer', department: 'Design', location: 'Remote', type: 'full_time', experience: '3-5 years', applicants: 28, status: 'open', postedDate: '2024-11-25', description: 'Join our design team to create amazing user experiences.' },
{ id: 'j3', title: 'Sales Manager', department: 'Sales', location: 'Chicago', type: 'full_time', experience: '4-7 years', applicants: 19, status: 'open', postedDate: '2024-12-01', description: 'Lead our sales team in the midwest region.' },
{ id: 'j4', title: 'Data Analyst', department: 'Finance', location: 'New York', type: 'full_time', experience: '2-4 years', applicants: 42, status: 'open', postedDate: '2024-12-05', description: 'Analyze financial data and create insights.' },
{ id: 'j5', title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'contract', experience: '3-6 years', applicants: 15, status: 'open', postedDate: '2024-12-10', description: 'Build and maintain CI/CD pipelines.' },
{ id: 'j6', title: 'Marketing Intern', department: 'Marketing', location: 'New York', type: 'part_time', experience: '0-1 years', applicants: 56, status: 'closed', postedDate: '2024-10-15', description: 'Assist the marketing team with campaigns.' }];


export const candidates = [
{ id: 'c1', name: 'John Smith', email: 'john.smith@email.com', phone: '+1-555-1001', position: 'Senior Frontend Developer', stage: 'technical', appliedDate: '2024-11-22', rating: 4.2, resume: 'john_smith_resume.pdf' },
{ id: 'c2', name: 'Anna Williams', email: 'anna.w@email.com', phone: '+1-555-1002', position: 'Product Designer', stage: 'interview', appliedDate: '2024-11-28', rating: 4.5, resume: 'anna_williams_resume.pdf' },
{ id: 'c3', name: 'Mark Johnson', email: 'mark.j@email.com', phone: '+1-555-1003', position: 'Senior Frontend Developer', stage: 'hr_round', appliedDate: '2024-11-21', rating: 4.8, resume: 'mark_johnson_resume.pdf' },
{ id: 'c4', name: 'Sarah Lee', email: 'sarah.l@email.com', phone: '+1-555-1004', position: 'Data Analyst', stage: 'screening', appliedDate: '2024-12-06', rating: 3.9, resume: 'sarah_lee_resume.pdf' },
{ id: 'c5', name: 'Tom Brown', email: 'tom.b@email.com', phone: '+1-555-1005', position: 'Sales Manager', stage: 'applied', appliedDate: '2024-12-12', rating: 0, resume: 'tom_brown_resume.pdf' },
{ id: 'c6', name: 'Jennifer White', email: 'jen.w@email.com', phone: '+1-555-1006', position: 'DevOps Engineer', stage: 'selected', appliedDate: '2024-12-11', rating: 4.6, resume: 'jennifer_white_resume.pdf' },
{ id: 'c7', name: 'Carlos Rodriguez', email: 'carlos.r@email.com', phone: '+1-555-1007', position: 'Senior Frontend Developer', stage: 'rejected', appliedDate: '2024-11-23', rating: 2.8, resume: 'carlos_rodriguez_resume.pdf' },
{ id: 'c8', name: 'Priya Sharma', email: 'priya.s@email.com', phone: '+1-555-1008', position: 'Product Designer', stage: 'onboarding', appliedDate: '2024-11-10', rating: 4.7, resume: 'priya_sharma_resume.pdf' }];


export const performanceReviews = [
{ id: 'pr1', employeeId: 'e8', employeeName: 'Sophia Martinez', reviewPeriod: 'Q3 2024', rating: 4.5, goals: [
  { id: 'g1', title: 'Complete API Migration', description: 'Migrate all legacy APIs to new framework', progress: 100, status: 'completed', dueDate: '2024-09-30' },
  { id: 'g2', title: 'Mentor Junior Developers', description: 'Conduct weekly code review sessions', progress: 80, status: 'in_progress', dueDate: '2024-12-31' }],
  status: 'completed', reviewer: 'Michael Chen' },
{ id: 'pr2', employeeId: 'e9', employeeName: 'Daniel Kim', reviewPeriod: 'Q3 2024', rating: 4.2, goals: [
  { id: 'g3', title: 'Set up Kubernetes Cluster', description: 'Deploy production Kubernetes cluster', progress: 100, status: 'completed', dueDate: '2024-09-30' },
  { id: 'g4', title: 'Implement CI/CD Pipeline', description: 'Full CI/CD for all microservices', progress: 60, status: 'in_progress', dueDate: '2024-12-31' }],
  status: 'completed', reviewer: 'Michael Chen' },
{ id: 'pr3', employeeId: 'e10', employeeName: 'Rachel Green', reviewPeriod: 'Q3 2024', rating: 3.8, goals: [
  { id: 'g5', title: 'Increase Blog Traffic', description: 'Grow organic traffic by 30%', progress: 70, status: 'in_progress', dueDate: '2024-12-31' },
  { id: 'g6', title: 'Launch Newsletter', description: 'Weekly newsletter with 1000+ subscribers', progress: 90, status: 'in_progress', dueDate: '2024-12-31' }],
  status: 'completed', reviewer: 'Emily Davis' },
{ id: 'pr4', employeeId: 'e13', employeeName: 'Chris Taylor', reviewPeriod: 'Q4 2024', rating: 0, goals: [
  { id: 'g7', title: 'Design System V2', description: 'Complete redesign of component library', progress: 45, status: 'in_progress', dueDate: '2025-01-31' },
  { id: 'g8', title: 'User Research Sessions', description: 'Conduct 20 user research interviews', progress: 25, status: 'in_progress', dueDate: '2025-02-28' }],
  status: 'pending', reviewer: 'Amanda Torres' },
{ id: 'pr5', employeeId: 'e15', employeeName: 'Nathan Brooks', reviewPeriod: 'Q4 2024', rating: 0, goals: [
  { id: 'g9', title: 'Build Notification Service', description: 'Design and implement real-time notification system', progress: 30, status: 'in_progress', dueDate: '2025-01-31' },
  { id: 'g10', title: 'Reduce API Latency', description: 'Optimize response times below 200ms', progress: 50, status: 'in_progress', dueDate: '2025-02-28' }],
  status: 'in_progress', reviewer: 'Michael Chen' }];


export const assets = [
{ id: 'as1', name: 'MacBook Pro 16"', type: 'Laptop', serialNumber: 'MBP-2024-001', assignedTo: 'Michael Chen', assignedDate: '2024-01-15', status: 'assigned', condition: 'excellent' },
{ id: 'as2', name: 'MacBook Pro 14"', type: 'Laptop', serialNumber: 'MBP-2024-002', assignedTo: 'Sophia Martinez', assignedDate: '2024-02-01', status: 'assigned', condition: 'good' },
{ id: 'as3', name: 'Dell UltraSharp 27"', type: 'Monitor', serialNumber: 'DU27-2024-001', assignedTo: 'Daniel Kim', assignedDate: '2024-03-10', status: 'assigned', condition: 'excellent' },
{ id: 'as4', name: 'iPhone 15 Pro', type: 'Phone', serialNumber: 'IP15-2024-001', assignedTo: 'Robert Wilson', assignedDate: '2024-04-01', status: 'assigned', condition: 'excellent' },
{ id: 'as5', name: 'Dell XPS 15', type: 'Laptop', serialNumber: 'DXP-2024-001', assignedTo: '', assignedDate: '', status: 'available', condition: 'good' },
{ id: 'as6', name: 'Logitech MX Master 3S', type: 'Accessory', serialNumber: 'LMX-2024-001', assignedTo: 'Amanda Torres', assignedDate: '2024-05-15', status: 'assigned', condition: 'good' },
{ id: 'as7', name: 'ThinkPad X1 Carbon', type: 'Laptop', serialNumber: 'TPX-2024-001', assignedTo: '', assignedDate: '', status: 'maintenance', condition: 'fair' },
{ id: 'as8', name: 'iPad Pro 12.9"', type: 'Tablet', serialNumber: 'IPD-2024-001', assignedTo: 'Chris Taylor', assignedDate: '2024-06-01', status: 'assigned', condition: 'excellent' },
{ id: 'as9', name: 'Samsung 32" Curved', type: 'Monitor', serialNumber: 'SM32-2024-001', assignedTo: '', assignedDate: '', status: 'available', condition: 'excellent' },
{ id: 'as10', name: 'Standing Desk Pro', type: 'Furniture', serialNumber: 'SDP-2024-001', assignedTo: 'Jessica Lee', assignedDate: '2024-07-01', status: 'assigned', condition: 'excellent' }];


export const helpDeskTickets = [
{ id: 't1', title: 'Unable to access payslip', description: 'Getting error 403 when trying to download November payslip', category: 'Payroll', priority: 'high', status: 'open', createdBy: 'Kevin Patel', createdDate: '2024-12-15', assignedTo: 'Olivia Smith' },
{ id: 't2', title: 'Request for ergonomic chair', description: 'Need an ergonomic chair for home office setup', category: 'Assets', priority: 'medium', status: 'in_progress', createdBy: 'Nathan Brooks', createdDate: '2024-12-14', assignedTo: 'James Anderson' },
{ id: 't3', title: 'Leave balance discrepancy', description: 'My casual leave balance shows 2 less than expected', category: 'Leave', priority: 'medium', status: 'open', createdBy: 'Rachel Green', createdDate: '2024-12-13', assignedTo: 'Sarah Johnson' },
{ id: 't4', title: 'VPN not connecting', description: 'Corporate VPN stopped working after system update', category: 'IT', priority: 'urgent', status: 'in_progress', createdBy: 'Sophia Martinez', createdDate: '2024-12-16', assignedTo: 'Daniel Kim' },
{ id: 't5', title: 'Update bank details', description: 'Need to update bank account for salary credit', category: 'Payroll', priority: 'high', status: 'resolved', createdBy: 'Hannah White', createdDate: '2024-12-10', assignedTo: 'David Brown' },
{ id: 't6', title: 'Policy clarification', description: 'Need clarification on work from home policy for 2025', category: 'Policy', priority: 'low', status: 'open', createdBy: 'Tyler Robinson', createdDate: '2024-12-12', assignedTo: 'Sarah Johnson' }];


export const notifications = [
{ id: 'n1', title: 'Leave Approved', message: 'Your casual leave from Dec 16-18 has been approved.', type: 'success', read: false, timestamp: '2024-12-16T10:30:00' },
{ id: 'n2', title: 'Payroll Processed', message: 'November 2024 payroll has been processed successfully.', type: 'info', read: false, timestamp: '2024-12-15T14:00:00' },
{ id: 'n3', title: 'New Leave Request', message: 'Robert Wilson has applied for 7 days earned leave.', type: 'warning', read: false, timestamp: '2024-12-14T09:15:00' },
{ id: 'n4', title: 'Performance Review Due', message: 'Q4 2024 performance reviews are due by Dec 31.', type: 'warning', read: true, timestamp: '2024-12-13T11:00:00' },
{ id: 'n5', title: 'New Hire Onboarding', message: 'Jennifer White has been selected for DevOps Engineer position.', type: 'success', read: true, timestamp: '2024-12-12T16:45:00' },
{ id: 'n6', title: 'Attendance Alert', message: '3 employees have late check-ins today.', type: 'error', read: true, timestamp: '2024-12-11T10:00:00' },
{ id: 'n7', title: 'System Maintenance', message: 'Scheduled maintenance on Dec 20 from 2-4 AM EST.', type: 'info', read: true, timestamp: '2024-12-10T08:00:00' }];


export const shifts = [
{ id: 's1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00', employees: 35, color: '#3B82F6' },
{ id: 's2', name: 'General Shift', startTime: '09:00', endTime: '18:00', employees: 98, color: '#10B981' },
{ id: 's3', name: 'Afternoon Shift', startTime: '14:00', endTime: '22:00', employees: 25, color: '#F59E0B' },
{ id: 's4', name: 'Night Shift', startTime: '22:00', endTime: '06:00', employees: 16, color: '#8B5CF6' }];