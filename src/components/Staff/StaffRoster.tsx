import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Clock, CheckCircle2 } from 'lucide-react';
import type { ShiftStatus } from '../../types';

export const StaffRoster: React.FC = () => {
  const { staffMembers, updateStaffStatus, residents, assignStaffToResident } = useApp();

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-700" />
            <span>Staff Assignments & Shift Roster</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage duty shifts, staff-to-resident assignments, and active care teams.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-purple-50 p-2 rounded-xl border border-purple-100">
          <Clock className="w-4 h-4 text-purple-700" />
          <span className="font-semibold text-purple-900">
            Active Shift: <strong>Morning (07:00 - 15:00)</strong>
          </span>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={staff.avatar}
                  alt={staff.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{staff.name}</h3>
                  <p className="text-xs text-slate-500">{staff.jobTitle}</p>
                  <span className="inline-block mt-1 text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                    {staff.role}
                  </span>
                </div>
              </div>

              {/* Status Selector */}
              <select
                value={staff.shiftStatus}
                onChange={(e) => updateStaffStatus(staff.id, e.target.value as ShiftStatus)}
                className={`text-xs font-bold px-2.5 py-1 rounded-full border focus:outline-none ${
                  staff.shiftStatus === 'On Duty'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : staff.shiftStatus === 'On Break'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                <option value="On Duty">On Duty</option>
                <option value="On Break">On Break</option>
                <option value="Off Duty">Off Duty</option>
              </select>
            </div>

            <div className="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p>Email: {staff.email}</p>
              <p>Phone: {staff.phone}</p>
              <p>
                Current Shift: <strong>{staff.currentShift || 'Morning'}</strong>
              </p>
            </div>

            {/* Assigned Residents */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  Assigned Residents ({staff.assignedResidentIds.length}):
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {residents.map((res) => {
                  const isAssigned = staff.assignedResidentIds.includes(res.id);
                  return (
                    <button
                      key={res.id}
                      onClick={() => assignStaffToResident(staff.id, res.id)}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                        isAssigned
                          ? 'bg-purple-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isAssigned && <CheckCircle2 className="w-3 h-3 text-purple-200" />}
                      <span>{res.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
