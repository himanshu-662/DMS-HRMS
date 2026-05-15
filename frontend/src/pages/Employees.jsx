import { useState, useMemo, useCallback } from 'react';
import {
  Search, Plus, Download, Upload,
  Mail, MapPin, Building2, Grid3X3, List, Eye, Edit, Trash2, AlertCircle, LayoutGrid, GripVertical, FileUp } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, Button, FormCheckbox } from '../components/FormInput';

import { api } from '../context/AppContext';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDropzone } from 'react-dropzone';

const departments = [
'Engineering', 'Human Resources', 'Marketing', 'Sales',
'Finance', 'Product', 'Design', 'Operations'];


const emptyEmployee = {
  name: '',
  email: '',
  phone: '',
  department: 'Engineering',
  designation: '',
  manager: '',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'active',
  avatar: '',
  location: '',
  type: 'full_time',
  salary: 0,
  skills: [],
  createAccount: false
};


export default function Employees() {
  const { state, dispatch, showToast, refreshData } = useApp();
  const { employees = [], searchQuery = '' } = state;

  const [viewMode, setViewMode] = useState('grid');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyEmployee);
  const [errors, setErrors] = useState({});
  const [isImporting, setIsImporting] = useState(false);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchSearch = searchQuery === '' ||
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = filterDept === 'all' || e.department === filterDept;
      const matchStatus = filterStatus === 'all' || e.status === filterStatus;
      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchQuery, filterDept, filterStatus]);

  const groupedEmployees = useMemo(() => {
    const groups = {};
    departments.forEach((dept) => {
      groups[dept] = filtered.filter((e) => e.department === dept);
    });
    return groups;
  }, [filtered]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const employeeId = draggableId;
    const newDepartment = destination.droppableId;
    const employee = employees.find((e) => e.id === employeeId);
    if (!employee) return;

    const updatedEmployees = employees.map((e) =>
    e.id === employeeId ? { ...e, department: newDepartment } : e
    );
    dispatch({ type: 'SET_DATA', payload: { employees: updatedEmployees } });

    try {
      await api.post(`/api/employees/update/${employeeId}`, {
        ...employee,
        department: newDepartment
      });
      showToast('success', 'Department Updated', `${employee.name} moved to ${newDepartment}`);
    } catch (error) {
      showToast('error', 'Update Failed', 'Could not save the new department');
      refreshData();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';else
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.designation.trim()) newErrors.designation = 'Job title is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      if (isEditing && selectedEmployee) {
        await api.post(`/api/employees/update/${selectedEmployee.id}`, formData);
        showToast('success', 'Employee Updated', `${formData.name}'s profile has been updated.`);
      } else {
        await api.post(`/api/employees`, formData);
        showToast('success', 'Employee Added', `${formData.name} has been added to the team.`);
      }
      refreshData();
      handleCloseModal();
    } catch (error) {
      showToast('error', 'Operation Failed', 'Could not save employee data.');
    }
  };

  const processFile = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let type = 'json';
    if (extension === 'csv') type = 'csv';
    if (extension === 'xlsx' || extension === 'xls') type = 'excel';

    setIsImporting(true);
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let data = [];
        if (type === 'json') {
          data = JSON.parse(event.target?.result);
        } else if (type === 'csv') {
          const content = event.target?.result;
          const result = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase()
          });
          data = result.data;
        } else if (type === 'excel') {
          const workbook = XLSX.read(event.target?.result, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          data = XLSX.utils.sheet_to_json(firstSheet);
        }

        if (!Array.isArray(data) || data.length === 0) {
          showToast('error', 'Invalid Format', 'File must contain a list of employees');
          return;
        }

        const normalizedData = data.map((emp) => ({
          name: emp.name || emp.fullname || emp["full name"] || "",
          email: emp.email || emp.mail || "",
          phone: emp.phone || emp.mobile || emp.contact || "",
          department: emp.department || emp.dept || "Engineering",
          designation: emp.designation || emp.role || emp.title || "",
          joinDate: emp.joindate || emp["join date"] || new Date().toISOString().split('T')[0],
          salary: emp.salary ? Number(emp.salary.toString().replace(/[^0-9.-]+/g, "")) : 0,
          status: emp.status || "active",
          location: emp.location || emp.city || "",
          type: emp.type || "full_time",
          skills: typeof emp.skills === 'string' ? emp.skills.split(',').map((s) => s.trim()) : emp.skills || []
        })).filter((emp) => emp.name && emp.email);

        if (normalizedData.length === 0) {
          showToast('error', 'Import Failed', 'No valid employee records found in file.');
          return;
        }

        const response = await api.post(`/api/employees/bulk`, normalizedData);
        showToast('success', 'Import Complete', response.data.message);
        refreshData();
        setShowImportModal(false);
      } catch (err) {
        showToast('error', 'Import Failed', 'Please check the file structure.');
      } finally {
        setIsImporting(false);
      }
    };

    if (type === 'excel') reader.readAsBinaryString(file);else
    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  });

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowImportModal(false);
    setIsEditing(false);
    setSelectedEmployee(null);
    setFormData(emptyEmployee);
    setErrors({});
  };

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setFormData({ ...emp, createAccount: false });
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleView = (emp) => {
    setSelectedEmployee(emp);
    setShowViewModal(true);
  };

  const handleDelete = async () => {
    if (selectedEmployee) {
      try {
        await api.delete(`/api/employees/${selectedEmployee.id}`);
        showToast('success', 'Employee Removed', `${selectedEmployee.name} has been removed.`);
        refreshData();
        setSelectedEmployee(null);
      } catch (error) {
        showToast('error', 'Delete Failed', error.response?.data?.detail || 'Could not remove employee.');
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'Join Date'];
    const rows = filtered.map((e) => [e.employeeId, e.name, e.email, e.department, e.designation, e.status, e.joinDate]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    showToast('success', 'Export Complete', `Exported ${filtered.length} employees.`);
  };

  const statusColors = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    inactive: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    on_leave: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    terminated: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  const gradients = [
    'from-blue-500 to-indigo-600', 
    'from-emerald-500 to-teal-600',
    'from-violet-500 to-purple-600', 
    'from-rose-500 to-pink-600',
    'from-orange-500 to-amber-600', 
    'from-cyan-500 to-blue-600'
  ];

  const isAdmin = state.currentUser?.role === 'hr_admin';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Employees</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your team and their roles across the organization.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <>
              <Button variant="ghost" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4" icon={<Upload className="w-4 h-4" />} onClick={() => setShowImportModal(true)}>Import</Button>
              <Button variant="ghost" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-xs font-bold px-4" icon={<Download className="w-4 h-4" />} onClick={exportToCSV}>Export</Button>
              <Button className="bg-primary-600 hover:bg-primary-500 text-xs font-bold px-6 shadow-lg shadow-primary-900/20" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Employee</Button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full pl-11 pr-4 py-3 bg-zinc-900 rounded-xl text-sm font-medium border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all text-white" />
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
          <button onClick={() => setViewMode('grid')} className={cn('p-2.5 rounded-lg transition-all', viewMode === 'grid' ? 'bg-zinc-800 text-primary-400' : 'text-zinc-500 hover:text-zinc-300')}><Grid3X3 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('list')} className={cn('p-2.5 rounded-lg transition-all', viewMode === 'list' ? 'bg-zinc-800 text-primary-400' : 'text-zinc-500 hover:text-zinc-300')}><List className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('group')} className={cn('p-2.5 rounded-lg transition-all', viewMode === 'group' ? 'bg-zinc-800 text-primary-400' : 'text-zinc-500 hover:text-zinc-300')}><LayoutGrid className="w-4 h-4" /></button>
        </div>
      </div>

      {viewMode === 'grid' &&
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((emp, idx) => (
            <div key={emp.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all group overflow-hidden flex flex-col">
              <div className={`h-2 bg-gradient-to-r ${gradients[idx % gradients.length]}`} />
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                    {emp.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className={cn("text-[10px] font-bold px-2 py-1 rounded-md border", statusColors[emp.status] || 'bg-zinc-800 text-zinc-400 border-zinc-800')}>
                    {emp.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                
                <h4 className="text-base font-bold text-white group-hover:text-primary-400 transition-colors">{emp.name}</h4>
                <p className="text-xs text-zinc-500 mt-1 font-medium">{emp.designation}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <Building2 className="w-4 h-4 text-zinc-600" />
                    {emp.department}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 font-medium">
                    <Mail className="w-4 h-4 text-zinc-600" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{emp.employeeId}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleView(emp)} className="p-2 text-zinc-500 hover:text-white transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => handleEdit(emp)} className="p-2 text-zinc-500 hover:text-white transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => {setSelectedEmployee(emp); setShowDeleteConfirm(true);}} className="p-2 text-zinc-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      }

      {viewMode === 'group' &&
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-320px)] min-h-[500px]">
            {departments.map((dept, deptIdx) => (
              <div key={dept} className="flex-shrink-0 w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", `bg-gradient-to-r ${gradients[deptIdx % gradients.length]}`)} />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{dept}</h4>
                  </div>
                  <span className="text-xs font-bold text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-800">{groupedEmployees[dept].length}</span>
                </div>
                
                <Droppable droppableId={dept}>
                  {(provided, snapshot) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className={cn("flex-1 p-3 rounded-2xl border-2 border-dashed transition-all space-y-3 overflow-y-auto", snapshot.isDraggingOver ? "bg-zinc-900 border-primary-500/30" : "bg-zinc-950/50 border-zinc-900")}>
                      {groupedEmployees[dept].map((emp, index) => (
                        <Draggable key={emp.id} draggableId={emp.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={cn("bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-sm transition-all relative group", snapshot.isDragging ? "shadow-2xl ring-2 ring-primary-500/40 bg-zinc-800 scale-105" : "hover:border-zinc-700")}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold", gradients[index % gradients.length])}>
                                    {emp.name.split(' ').map((n) => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-white">{emp.name}</p>
                                    <p className="text-[10px] text-zinc-500 font-medium">{emp.designation}</p>
                                  </div>
                                </div>
                                <div {...provided.dragHandleProps} className="text-zinc-700 hover:text-zinc-500"><GripVertical className="w-4 h-4" /></div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      }

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={handleCloseModal} title="Import Employees" subtitle="Upload a file to add multiple employees at once." size="md">
        <div className="p-6 space-y-6">
          <div {...getRootProps()} className={cn("border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer", isDragActive ? "border-primary-500 bg-primary-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-950")}>
            <input {...getInputProps()} />
            <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <FileUp className={cn("w-8 h-8", isDragActive ? "text-primary-400" : "text-zinc-600")} />
            </div>
            <h4 className="text-lg font-bold text-white">{isDragActive ? "Drop the file here" : "Upload File"}</h4>
            <p className="text-xs text-zinc-500 mt-2">Support for JSON, CSV, and Excel formats.</p>
          </div>
          
          {isImporting && (
            <div className="text-center py-4">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-bold">Importing employees...</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={handleCloseModal} title={isEditing ? 'Edit Employee' : 'Add New Employee'} subtitle={isEditing ? 'Update employee details.' : 'Fill in the details to add a new employee.'} size="lg" footer={<><Button variant="ghost" className="px-6" onClick={handleCloseModal}>Cancel</Button><Button className="bg-primary-600 px-8" onClick={handleSubmit}>{isEditing ? 'Save Changes' : 'Add Employee'}</Button></>}>
        <div className="space-y-6 p-2">
          {!state.settings?.auto_gen_id && !isEditing && (
            <div className="pb-6 border-b border-zinc-800">
              <FormInput 
                label="Employee ID" 
                value={formData.employeeId || ''} 
                onChange={(v) => setFormData({ ...formData, employeeId: v })} 
                placeholder="e.g. DMS123" 
                required 
                error={errors.employeeId} 
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <FormInput label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="e.g. John Doe" required error={errors.name} />
            <FormInput label="Email Address" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="e.g. john@company.com" required error={errors.email} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormInput label="Phone Number" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="e.g. +1 234 567 890" required error={errors.phone} />
            <FormInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} placeholder="e.g. New York, NY" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormSelect label="Department" value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} options={departments.map((d) => ({ value: d, label: d }))} />
            <FormInput label="Job Title" value={formData.designation} onChange={(v) => setFormData({ ...formData, designation: v })} placeholder="e.g. Software Engineer" required error={errors.designation} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormSelect label="Employment Type" value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} options={[{ value: 'full_time', label: 'Full Time' }, { value: 'part_time', label: 'Part Time' }, { value: 'contract', label: 'Contract' }, { value: 'intern', label: 'Intern' }]} />
            <FormInput label="Joining Date" type="date" value={formData.joinDate} onChange={(v) => setFormData({ ...formData, joinDate: v })} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <FormSelect 
              label="Reporting Manager" 
              value={formData.manager} 
              onChange={(v) => setFormData({ ...formData, manager: v })} 
              options={[
                { value: '', label: 'None (Top Level)' },
                ...employees.filter(e => e.status === 'active' && e.id !== selectedEmployee?.id).map(e => ({
                  value: e.name,
                  label: e.name.toUpperCase()
                }))
              ]}
            />
            <FormInput label="Annual Salary" type="number" value={formData.salary} onChange={(v) => setFormData({ ...formData, salary: Number(v) })} placeholder="e.g. 50000" />
          </div>
          {!isEditing && (
            <div className="pt-6 border-t border-zinc-800">
              <FormCheckbox 
                label="Create login account" 
                description="Automatically create a login account for this employee. The email will be used as the default password."
                checked={formData.createAccount}
                onChange={(v) => setFormData({ ...formData, createAccount: v })}
              />
            </div>
          )}
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={handleCloseModal} title="Employee Details" size="lg" footer={<><Button variant="ghost" className="px-6" onClick={handleCloseModal}>Close</Button><Button className="bg-primary-600 px-8" onClick={() => {handleCloseModal(); if (selectedEmployee) handleEdit(selectedEmployee);}}>Edit Profile</Button></>}>
        {selectedEmployee && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                {selectedEmployee.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{selectedEmployee.name}</h3>
                <p className="text-sm text-zinc-500 mt-1 font-medium">{selectedEmployee.designation} · {selectedEmployee.employeeId}</p>
                <div className={cn("text-[10px] font-bold px-3 py-1 rounded-md mt-4 inline-block border", statusColors[selectedEmployee.status] || 'bg-zinc-800 text-zinc-400 border-zinc-800')}>
                  {selectedEmployee.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Email Address', value: selectedEmployee.email },
                { label: 'Phone', value: selectedEmployee.phone },
                { label: 'Department', value: selectedEmployee.department },
                { label: 'Location', value: selectedEmployee.location || 'Remote' },
                { label: 'Reporting To', value: selectedEmployee.manager || 'N/A' },
                { label: 'Employment', value: selectedEmployee.type.replace('_', ' ') },
                { label: 'Joined On', value: new Date(selectedEmployee.joinDate).toLocaleDateString() },
                { label: 'Salary', value: `$${selectedEmployee.salary.toLocaleString()}` }
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-white mt-2 truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)} 
        onConfirm={handleDelete} 
        title="Delete Employee" 
        message={`Are you sure you want to remove ${selectedEmployee?.name}? This action cannot be undone.`} 
        type="danger" 
        confirmText="Remove Employee" 
      />
    </div>
  );
}