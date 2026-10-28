import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle2,
  Clock,
  PlusCircle,
  Filter,
  Activity,
  X,
  FileCheck2,
} from 'lucide-react';
import type { CareTaskCategory } from '../../types';

export const TaskList: React.FC = () => {
  const { tasks, residents, updateTaskStatus, addTask, currentUser } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [residentFilter, setResidentFilter] = useState<string>('All');

  // Modal for logging completion with vitals / notes
  const [logTaskModal, setLogTaskModal] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [logBp, setLogBp] = useState('');
  const [logPulse, setLogPulse] = useState<number | ''>('');
  const [logTemp, setLogTemp] = useState<number | ''>('');

  // Modal for creating a new scheduled task
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    residentId: residents[0]?.id || '',
    title: '',
    description: '',
    category: 'Medication' as CareTaskCategory,
    scheduledTime: '10:00 AM',
    date: new Date().toISOString().split('T')[0],
  });

  const filteredTasks = tasks.filter((t) => {
    const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesResident = residentFilter === 'All' || t.residentId === residentFilter;
    return matchesCat && matchesStatus && matchesResident;
  });

  const selectedTaskToLog = tasks.find((t) => t.id === logTaskModal);

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logTaskModal) return;

    updateTaskStatus(
      logTaskModal,
      'Completed',
      logNotes,
      logBp || logPulse || logTemp
        ? {
            bp: logBp || undefined,
            pulse: logPulse !== '' ? Number(logPulse) : undefined,
            temperature: logTemp !== '' ? Number(logTemp) : undefined,
          }
        : undefined
    );

    setLogTaskModal(null);
    setLogNotes('');
    setLogBp('');
    setLogPulse('');
    setLogTemp('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find((r) => r.id === newTaskForm.residentId);
    if (!res) return;

    addTask({
      residentId: res.id,
      residentName: res.name,
      residentPhoto: res.photoUrl,
      title: newTaskForm.title,
      description: newTaskForm.description,
      category: newTaskForm.category,
      scheduledTime: newTaskForm.scheduledTime,
      date: newTaskForm.date,
      status: 'Pending',
    });

    setShowCreateModal(false);
    setNewTaskForm({
      residentId: residents[0]?.id || '',
      title: '',
      description: '',
      category: 'Medication',
      scheduledTime: '10:00 AM',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-purple-700" />
            <span>Care Task Logging & "Log My Care" Interface</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record real-time care delivery, medication, vital signs, and shift notes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Task</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 text-xs">
        <div className="flex items-center space-x-2 flex-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-bold text-slate-700">Filters:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-2">
          <select
            value={residentFilter}
            onChange={(e) => setResidentFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            aria-label="Filter by Resident"
          >
            <option value="All">All Residents ({residents.length})</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.roomNumber})
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            aria-label="Filter by Category"
          >
            <option value="All">All Categories</option>
            <option value="Medication">Medication</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Hydration & Nutrition">Hydration & Nutrition</option>
            <option value="Mobility & Activity">Mobility & Activity</option>
            <option value="Wellbeing & Social">Wellbeing & Social</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending / In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Missed">Missed</option>
          </select>
        </div>
      </div>

      {/* Task List Grid */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No care tasks match the selected criteria.
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-purple-200 shadow-2xs transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={
                    task.residentPhoto ||
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={task.residentName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{task.residentName}</span>
                    <span className="text-xs bg-purple-50 text-purple-800 px-2 py-0.5 rounded-full font-semibold border border-purple-200">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {task.scheduledTime} ({task.date})
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        task.category === 'Medication'
                          ? 'bg-blue-100 text-blue-800'
                          : task.category === 'Personal Care'
                          ? 'bg-purple-100 text-purple-800'
                          : task.category === 'Hydration & Nutrition'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {task.category}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800">{task.title}</h3>
                  <p className="text-xs text-slate-600">{task.description}</p>

                  {task.medicationDetails && (
                    <div className="text-[11px] bg-blue-50 border border-blue-200 text-blue-900 p-2 rounded-lg font-mono mt-1">
                      Dosage: {task.medicationDetails.dosage} • Route: {task.medicationDetails.route}
                      {task.medicationDetails.witnessName && (
                        <span> • Witnessed by: {task.medicationDetails.witnessName}</span>
                      )}
                    </div>
                  )}

                  {task.notes && (
                    <p className="text-[11px] bg-slate-50 text-slate-700 p-2 rounded border-l-2 border-purple-600 italic">
                      " {task.notes} " - <span className="font-semibold">{task.completedByStaffName || 'Carer'}</span>
                    </p>
                  )}

                  {task.vitalSigns && (
                    <div className="flex items-center space-x-3 text-[11px] bg-purple-50 text-purple-900 p-1.5 rounded border border-purple-200 font-mono">
                      <Activity className="w-3.5 h-3.5 text-purple-700" />
                      {task.vitalSigns.bp && <span>BP: {task.vitalSigns.bp}</span>}
                      {task.vitalSigns.pulse && <span>Pulse: {task.vitalSigns.pulse} bpm</span>}
                      {task.vitalSigns.temperature && <span>Temp: {task.vitalSigns.temperature}°C</span>}
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Log Button */}
              <div className="flex items-center space-x-3 self-end md:self-center flex-shrink-0">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold border ${
                    task.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : task.status === 'In Progress'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {task.status}
                </span>

                {task.status !== 'Completed' ? (
                  <button
                    onClick={() => {
                      setLogTaskModal(task.id);
                      setLogNotes(task.notes || '');
                    }}
                    className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Log Completion</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    Done at {task.completedAt?.split(' ')[1]}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completion Modal */}
      {selectedTaskToLog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Log Task Completion</span>
              </h3>
              <button
                onClick={() => setLogTaskModal(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs text-purple-900 space-y-1">
              <p className="font-bold">{selectedTaskToLog.residentName}</p>
              <p className="font-semibold text-slate-800">{selectedTaskToLog.title}</p>
              <p className="text-slate-600">{selectedTaskToLog.description}</p>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Carer / Staff Signature
                </label>
                <input
                  type="text"
                  disabled
                  value={`${currentUser.name} (${currentUser.role})`}
                  className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Care Log Notes / Observations
                </label>
                <textarea
                  rows={3}
                  required
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Record resident response, fluid amount, or medication outcome..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Optional Vitals */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <span className="font-bold text-slate-800 block text-xs">
                  Record Vital Signs (Optional)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block">BP (mmHg)</label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={logBp}
                      onChange={(e) => setLogBp(e.target.value)}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Pulse (bpm)</label>
                    <input
                      type="number"
                      placeholder="72"
                      value={logPulse}
                      onChange={(e) => setLogPulse(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Temp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="36.6"
                      value={logTemp}
                      onChange={(e) => setLogTemp(e.target.value ? Number(e.target.value) : '')}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLogTaskModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  Submit Care Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-purple-700" />
                <span>Schedule New Care Task</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Resident</label>
                <select
                  value={newTaskForm.residentId}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, residentId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  {residents.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.roomNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  placeholder="e.g. Afternoon Medication Round"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newTaskForm.description}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                  placeholder="Detailed instructions for carers..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newTaskForm.category}
                    onChange={(e) =>
                      setNewTaskForm({
                        ...newTaskForm,
                        category: e.target.value as CareTaskCategory,
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Medication">Medication</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Hydration & Nutrition">Hydration & Nutrition</option>
                    <option value="Mobility & Activity">Mobility & Activity</option>
                    <option value="Wellbeing & Social">Wellbeing & Social</option>
                    <option value="Night Check">Night Check</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    required
                    value={newTaskForm.scheduledTime}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, scheduledTime: e.target.value })}
                    placeholder="e.g. 02:00 PM"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
