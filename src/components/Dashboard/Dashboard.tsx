import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Clock,
  Pill,
  Calendar,
  Heart,
  MessageSquare,
  ArrowRight,
  PlusCircle,
  Activity,
  Check,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string, residentId?: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const {
    residents,
    tasks,
    carePlans,
    staffMembers,
    updateTaskStatus,
    familyUpdates,
    currentUser,
  } = useApp();

  const [taskFilter, setTaskFilter] = useState<'All' | 'Pending' | 'Completed' | 'Medication'>('All');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((t) => t.date === todayStr || !t.date);

  const filteredTasks = todayTasks.filter((task) => {
    if (taskFilter === 'Pending') return task.status === 'Pending' || task.status === 'In Progress';
    if (taskFilter === 'Completed') return task.status === 'Completed';
    if (taskFilter === 'Medication') return task.category === 'Medication';
    return true;
  });

  const completedCount = todayTasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = todayTasks.filter((t) => t.status === 'Pending').length;
  const inProgressCount = todayTasks.filter((t) => t.status === 'In Progress').length;

  const medicationTasks = todayTasks.filter((t) => t.category === 'Medication');
  const medCompletedCount = medicationTasks.filter((t) => t.status === 'Completed').length;

  const activeStaff = staffMembers.filter((s) => s.shiftStatus === 'On Duty');

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Stats */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 rounded-2xl text-white p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-purple-700/60 text-purple-200 text-xs font-semibold mb-2">
              Log My Care Digital Care Platform
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {' • '}
              <strong>{activeStaff.length}</strong> care team members active on morning shift
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tasks')}
              className="px-4 py-2 bg-white text-purple-900 rounded-xl text-xs font-bold hover:bg-purple-50 transition shadow-xs flex items-center space-x-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Care Activity</span>
            </button>
            <button
              onClick={() => onNavigate('residents')}
              className="px-4 py-2 bg-purple-700/80 hover:bg-purple-700 text-white border border-purple-500/50 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Resident Profiles</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid inside banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-purple-700/50">
          <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-700/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-200">Total Residents</span>
              <Users className="w-4 h-4 text-purple-300" />
            </div>
            <p className="text-2xl font-extrabold mt-1">{residents.length}</p>
          </div>

          <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-700/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-200">Tasks Done Today</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-extrabold mt-1 text-emerald-300">
              {completedCount} <span className="text-xs text-purple-300 font-normal">/ {todayTasks.length}</span>
            </p>
          </div>

          <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-700/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-200">Pending To-Dos</span>
              <Clock className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-2xl font-extrabold mt-1 text-amber-200">{pendingCount + inProgressCount}</p>
          </div>

          <div className="bg-purple-800/40 p-3 rounded-xl border border-purple-700/40">
            <div className="flex items-center justify-between">
              <span className="text-xs text-purple-200">Meds Administered</span>
              <Pill className="w-4 h-4 text-blue-300" />
            </div>
            <p className="text-2xl font-extrabold mt-1 text-blue-200">
              {medCompletedCount} <span className="text-xs text-purple-300 font-normal">/ {medicationTasks.length}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Residents Avatar Quick Selector Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
            <Users className="w-4 h-4 text-purple-700" />
            <span>Residents Overview</span>
          </h2>
          <button
            onClick={() => onNavigate('residents')}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center space-x-1 cursor-pointer"
          >
            <span>View All ({residents.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {residents.map((res) => (
            <div
              key={res.id}
              onClick={() => onNavigate('residents', res.id)}
              className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-purple-50 hover:border-purple-200 cursor-pointer transition"
            >
              <img
                src={res.photoUrl}
                alt={res.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{res.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{res.roomNumber}</p>
                <span className="inline-block mt-0.5 text-[10px] font-medium px-1.5 py-0.2 rounded bg-purple-100 text-purple-800">
                  {res.careLevel} Care
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: To-Dos & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's To-Dos (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-700" />
                  <span>Today's To-Dos & Shift Log</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time care tasks logged by care workers and nurses.
                </p>
              </div>

              {/* Task Filter Pills */}
              <div className="flex items-center space-x-1 bg-slate-200/60 p-1 rounded-lg text-xs font-medium">
                {(['All', 'Pending', 'Completed', 'Medication'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTaskFilter(filter)}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                      taskFilter === filter
                        ? 'bg-white text-purple-900 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No care tasks match the selected filter.
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start space-x-3">
                      {task.residentPhoto ? (
                        <img
                          src={task.residentPhoto}
                          alt={task.residentName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                          {task.residentName.charAt(0)}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">
                            {task.residentName}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                            {task.scheduledTime}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              task.category === 'Medication'
                                ? 'bg-blue-100 text-blue-800'
                                : task.category === 'Personal Care'
                                ? 'bg-purple-100 text-purple-800'
                                : task.category === 'Hydration & Nutrition'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.category}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-800 mt-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>

                        {task.notes && (
                          <p className="text-[11px] bg-slate-100 text-slate-700 p-1.5 rounded mt-1 border-l-2 border-purple-500">
                            <strong>Note:</strong> {task.notes}
                          </p>
                        )}

                        {task.vitalSigns && (
                          <div className="flex items-center space-x-3 text-[11px] text-purple-900 bg-purple-50 p-1.5 rounded mt-1 font-mono">
                            {task.vitalSigns.bp && <span>BP: {task.vitalSigns.bp}</span>}
                            {task.vitalSigns.pulse && <span>Pulse: {task.vitalSigns.pulse} bpm</span>}
                            {task.vitalSigns.temperature && <span>Temp: {task.vitalSigns.temperature}°C</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Task Actions */}
                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          task.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : task.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : task.status === 'Missed'
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {task.status}
                      </span>

                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'Completed')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                          title="Mark Task Complete"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Done</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column Widgets */}
        <div className="space-y-6">
          {/* Active Care Team Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-700" />
                <span>Team on Duty</span>
              </h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                {activeStaff.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {activeStaff.map((staff) => (
                <div key={staff.id} className="flex items-center space-x-3">
                  <img
                    src={staff.avatar}
                    alt={staff.name}
                    className="w-8 h-8 rounded-full object-cover border border-purple-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{staff.name}</p>
                    <p className="text-[11px] text-slate-500">{staff.jobTitle}</p>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded border border-purple-200">
                    {staff.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Care Plans Overview Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-700" />
                <span>Active Care Plans</span>
              </h3>
              <button
                onClick={() => onNavigate('careplans')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {carePlans.slice(0, 3).map((cp) => (
                <div key={cp.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{cp.residentName}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-medium">
                      {cp.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium mt-1">{cp.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{cp.instructions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Family Feed Activity Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-purple-700" />
                <span>Family Portal Feed</span>
              </h3>
              <button
                onClick={() => onNavigate('family')}
                className="text-xs text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
              >
                View Feed
              </button>
            </div>

            <div className="space-y-3">
              {familyUpdates.slice(0, 2).map((feed) => (
                <div key={feed.id} className="p-2.5 bg-purple-50/50 rounded-lg border border-purple-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-purple-900">
                    <span>{feed.residentName}</span>
                    <span className="text-[10px] text-purple-600">{feed.timestamp}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{feed.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Posted by {feed.authorName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Birthdays & Events Widget */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-4">
            <h3 className="text-sm font-bold text-purple-900 flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-pink-600" />
              <span>Resident Birthdays & Events</span>
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-pink-100">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="font-semibold text-slate-800">Arthur Pendelton</span>
                </div>
                <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                  May 14 (85th)
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/80 p-2 rounded-lg border border-pink-100">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="font-semibold text-slate-800">Margaret Harris</span>
                </div>
                <span className="text-[10px] bg-pink-100 text-pink-800 px-2 py-0.5 rounded-full font-bold">
                  March 30 (92nd)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
