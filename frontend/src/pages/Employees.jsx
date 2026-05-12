import { useState, useMemo, useCallback } from 'react';
import {
  Search, Plus, Download, Upload,
  Mail, MapPin, Building2, Grid3X3, List, Eye, Edit, Trash2, AlertCircle, LayoutGrid, GripVertical, FileUp } from
'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormInput, FormSelect, Button } from '../components/FormInput';

import axios from 'axios';
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
  skills: []
};




export default function Employees() {
  const { state, dispatch, showToast, refreshData } = useApp();
  const { employees, searchQuery } = state;

  const [viewMode, setViewMode] = useState('grid');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState('json');
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
      await axios.post(`http://localhost:8000/api/employees/update/${employeeId}`, {
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
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isEditing && selectedEmployee) {
        await axios.post(`http://localhost:8000/api/employees/update/${selectedEmployee.id}`, formData);
        showToast('success', 'Employee Updated', `${formData.name}'s profile has been updated.`);
      } else {
        await axios.post('http://localhost:8000/api/employees', formData);
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
          // Log for debugging
          console.log("CSV Content:", content.substring(0, 200));
          const result = Papa.parse(content, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim().toLowerCase() // Normalize headers to lowercase
          });
          data = result.data;
          console.log("Parsed Data:", data.slice(0, 2));
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
        })).filter((emp) => emp.name && emp.email); // Must have name and email

        if (normalizedData.length === 0) {
          showToast('error', 'Import Failed', 'No valid employee records found in file. Check column headers.');
          return;
        }

        const response = await axios.post('http://localhost:8000/api/employees/bulk', normalizedData);
        showToast('success', 'Import Complete', response.data.message);
        refreshData();
        setShowImportModal(false);
      } catch (err) {
        console.error("Import Error Details:", err);
        showToast('error', 'Import Failed', 'Please check the file structure or console for details');
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
    setFormData({ ...emp });
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
        await axios.delete(`http://localhost:8000/api/employees/${selectedEmployee.id}`);
        showToast('success', 'Employee Removed', `${selectedEmployee.name} has been removed.`);
        refreshData();
        setSelectedEmployee(null);
      } catch (error) {
        showToast('error', 'Delete Failed', 'Could not remove employee.');
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
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-gray-100 text-gray-600',
    on_leave: 'bg-amber-100 text-amber-700',
    terminated: 'bg-red-100 text-red-700'
  };

  const gradients = [
  'from-blue-400 to-indigo-600', 'from-emerald-400 to-teal-600',
  'from-violet-400 to-purple-600', 'from-rose-400 to-pink-600',
  'from-orange-400 to-amber-600', 'from-cyan-400 to-blue-600'];


  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Employee Directory</h3>
          <p className="text-sm text-gray-500">{filtered.length} of {employees.length} employees</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="secondary" icon={<Upload className="w-4 h-4" />} onClick={() => setShowImportModal(true)}>Import</Button>
          <Button variant="secondary" icon={<Download className="w-4 h-4" />} onClick={exportToCSV}>Export</Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Employee</Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:bg-white transition-all" />
            
          </div>
          <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
            <button onClick={() => setViewMode('grid')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-white shadow text-primary-600' : 'text-gray-400 hover:text-gray-600')}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-gray-400 hover:text-gray-600')}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('group')} className={cn('p-2 rounded-lg transition-colors', viewMode === 'group' ? 'bg-white shadow text-primary-600' : 'text-gray-400 hover:text-gray-600')}><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' &&
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((emp, idx) =>
        <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all group">
              <div className={`h-20 bg-gradient-to-r ${gradients[idx % gradients.length]} relative`}>
                <div className="absolute -bottom-6 left-4">
                  <div className="w-14 h-14 rounded-2xl bg-white p-0.5 shadow-lg">
                    <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center text-white text-lg font-bold`}>{emp.name.split(' ').map((n) => n[0]).join('')}</div>
                  </div>
                </div>
                <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[emp.status]}`}>{emp.status.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="pt-8 px-4 pb-4">
                <h4 className="text-sm font-semibold text-gray-900">{emp.name}</h4>
                <p className="text-xs text-gray-500">{emp.designation}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Building2 className="w-3.5 h-3.5" /> {emp.department}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><MapPin className="w-3.5 h-3.5" /> {emp.location}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500"><Mail className="w-3.5 h-3.5" /> <span className="truncate">{emp.email}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{emp.employeeId}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleView(emp)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => handleEdit(emp)} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-600"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => {setSelectedEmployee(emp);setShowDeleteConfirm(true);}} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-danger-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      }

      {viewMode === 'group' &&
      <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-280px)] min-h-[500px]">
            {departments.map((dept, deptIdx) =>
          <div key={dept} className="flex-shrink-0 w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", `bg-gradient-to-br ${gradients[deptIdx % gradients.length]}`)} />
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{dept}</h4>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{groupedEmployees[dept].length}</span>
                </div>
                <Droppable droppableId={dept}>
                  {(provided, snapshot) =>
              <div {...provided.droppableProps} ref={provided.innerRef} className={cn("flex-1 p-2 rounded-2xl border-2 border-dashed transition-all space-y-3 overflow-y-auto", snapshot.isDraggingOver ? "bg-primary-50/50 border-primary-200" : "bg-gray-50/30 border-transparent")}>
                      {groupedEmployees[dept].map((emp, index) =>
                <Draggable key={emp.id} draggableId={emp.id} index={index}>
                          {(provided, snapshot) =>
                  <div ref={provided.innerRef} {...provided.draggableProps} className={cn("bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-shadow", snapshot.isDragging ? "shadow-xl ring-2 ring-primary-500/20 rotate-1" : "hover:shadow-md")}>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold bg-gradient-to-br", gradients[index % gradients.length])}>{emp.name.split(' ').map((n) => n[0]).join('')}</div>
                                  <div><p className="text-xs font-bold text-gray-900">{emp.name}</p><p className="text-[10px] text-gray-500">{emp.designation}</p></div>
                                </div>
                                <div {...provided.dragHandleProps} className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-grab active:cursor-grabbing"><GripVertical className="w-3.5 h-3.5" /></div>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                                <span className="text-[10px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">{emp.employeeId}</span>
                                <div className="flex items-center gap-1">
                                  <button onClick={() => handleView(emp)} className="w-6 h-6 rounded-md hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-600"><Eye className="w-3 h-3" /></button>
                                  <button onClick={() => handleEdit(emp)} className="w-6 h-6 rounded-md hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-600"><Edit className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </div>
                  }
                        </Draggable>
                )}
                      {provided.placeholder}
                    </div>
              }
                </Droppable>
              </div>
          )}
          </div>
        </DragDropContext>
      }

      <Modal isOpen={showImportModal} onClose={handleCloseModal} title="Import Employees" subtitle="Bulk add employees using various formats" size="lg">
        <div className="p-8 space-y-6">
          <div {...getRootProps()} className={cn("border-3 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group", isDragActive ? "border-primary-500 bg-primary-50 scale-[0.99]" : "border-gray-100 hover:border-primary-400 hover:bg-gray-50")}>
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-2xl bg-white shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <FileUp className={cn("w-10 h-10 transition-colors", isDragActive ? "text-primary-600" : "text-gray-400 group-hover:text-primary-500")} />
            </div>
            <h4 className="text-xl font-bold text-gray-900">{isDragActive ? "Drop the file here" : "Drag & Drop File"}</h4>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">Upload <strong>JSON, CSV, or Excel</strong> files directly to onboard your team</p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-gray-400 shadow-sm border border-gray-100">.JSON</span>
              <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-gray-400 shadow-sm border border-gray-100">.CSV</span>
              <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-bold text-gray-400 shadow-sm border border-gray-100">.XLSX</span>
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 flex gap-3"><AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" /><div><p className="text-sm font-semibold text-blue-900">Automatic Detection</p><p className="text-xs text-blue-700 mt-0.5">We'll automatically detect the file format and map headers like <strong>name, email, and department</strong>.</p></div></div>
          {isImporting && <div className="text-center py-4"><div className="w-8 h-8 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" /><p className="text-sm font-medium text-gray-600">Processing your team data...</p></div>}
        </div>
      </Modal>

      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={handleCloseModal} title={isEditing ? 'Edit Employee' : 'Add New Employee'} subtitle={isEditing ? 'Update employee information' : 'Fill in the details to add a new team member'} size="lg" footer={<><Button variant="ghost" onClick={handleCloseModal}>Cancel</Button><Button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add Employee'}</Button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><FormInput label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} placeholder="John Doe" required error={errors.name} /><FormInput label="Email" type="email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} placeholder="john@dms.com" required error={errors.email} /></div>
          <div className="grid grid-cols-2 gap-4"><FormInput label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} placeholder="+1-555-0000" required error={errors.phone} /><FormInput label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} placeholder="San Francisco" /></div>
          <div className="grid grid-cols-2 gap-4"><FormSelect label="Department" value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} options={departments.map((d) => ({ value: d, label: d }))} /><FormInput label="Designation" value={formData.designation} onChange={(v) => setFormData({ ...formData, designation: v })} placeholder="Software Engineer" required error={errors.designation} /></div>
          <div className="grid grid-cols-2 gap-4"><FormSelect label="Employment Type" value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} options={[{ value: 'full_time', label: 'Full Time' }, { value: 'part_time', label: 'Part Time' }, { value: 'contract', label: 'Contract' }, { value: 'intern', label: 'Intern' }]} /><FormInput label="Join Date" type="date" value={formData.joinDate} onChange={(v) => setFormData({ ...formData, joinDate: v })} /></div>
          <div className="grid grid-cols-2 gap-4"><FormInput label="Manager" value={formData.manager} onChange={(v) => setFormData({ ...formData, manager: v })} placeholder="Manager name" /><FormInput label="Salary" type="number" value={formData.salary} onChange={(v) => setFormData({ ...formData, salary: Number(v) })} placeholder="75000" /></div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={showViewModal} onClose={handleCloseModal} title="Employee Details" size="lg" footer={<><Button variant="ghost" onClick={handleCloseModal}>Close</Button><Button onClick={() => {handleCloseModal();if (selectedEmployee) handleEdit(selectedEmployee);}}>Edit</Button></>}>
        {selectedEmployee &&
        <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">{selectedEmployee.name.split(' ').map((n) => n[0]).join('')}</div>
              <div><h3 className="text-xl font-bold text-gray-900">{selectedEmployee.name}</h3><p className="text-sm text-gray-500">{selectedEmployee.designation} · {selectedEmployee.employeeId}</p><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColors[selectedEmployee.status]}`}>{selectedEmployee.status.replace('_', ' ').toUpperCase()}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Email', value: selectedEmployee.email }, { label: 'Phone', value: selectedEmployee.phone }, { label: 'Department', value: selectedEmployee.department }, { label: 'Location', value: selectedEmployee.location }, { label: 'Manager', value: selectedEmployee.manager || 'N/A' }, { label: 'Type', value: 'Full Time' }, { label: 'Join Date', value: new Date(selectedEmployee.joinDate).toLocaleDateString() }, { label: 'Salary', value: `$${selectedEmployee.salary.toLocaleString()}` }].map((item) =>
            <div key={item.label} className="p-3 rounded-xl bg-gray-50"><p className="text-[11px] text-gray-400 font-medium uppercase">{item.label}</p><p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p></div>
            )}
            </div>
          </div>
        }
      </Modal>

      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleDelete} title="Delete Employee" message={`Are you sure you want to remove ${selectedEmployee?.name}? This action cannot be undone.`} type="danger" confirmText="Delete" />
    </div>);

}