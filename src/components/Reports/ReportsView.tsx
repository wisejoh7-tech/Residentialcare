import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, ShieldAlert, CheckCircle2, Lock, Download, Filter } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { tasks, auditLogs, residents, carePlans } = useApp();

  const [auditFilter, setAuditFilter] = useState<'All' | 'SensitiveOnly'>('All');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending' || t.status === 'In Progress').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredLogs = auditLogs.filter((log) => {
    if (auditFilter === 'SensitiveOnly') return log.isSensitiveAccess;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-purple-700" />
            <span>Compliance Reporting & Security Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            CQC quality metric dashboards, task completion rates, and immutable access security logs.
          </p>
        </div>

        <button
          onClick={() => alert('Compliance summary report exported as PDF/CSV.')}
          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Compliance Report</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Overall Task Completion</span>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-extrabold text-purple-900">{completionRate}%</p>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              High Adherence
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-purple-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Care Tasks Executed</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">
            {completedTasks}{' '}
            <span className="text-xs font-normal text-slate-400">/ {totalTasks} today</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">{pendingTasks} pending tasks remaining</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Active Care Plans</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{carePlans.length}</p>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">100% up to date with review cycles</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-semibold">Monitored Residents</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{residents.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Full profile records active</p>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-800">Care Category Delivery Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Medication Round</span>
              <span className="text-purple-700">100%</span>
            </div>
            <p className="text-slate-500 text-[11px]">All morning dosages signed off with witness</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Personal Hygiene</span>
              <span className="text-purple-700">100%</span>
            </div>
            <p className="text-slate-500 text-[11px]">Dressing & wash assistance completed</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between font-bold text-slate-800 mb-1">
              <span>Nutrition & Hydration</span>
              <span className="text-purple-700">75%</span>
            </div>
            <p className="text-slate-500 text-[11px]">Fluid charts active for afternoon check</p>
          </div>
        </div>
      </div>

      {/* Compliance & Audit Trail Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-purple-700" />
              <span>Immutable Access & Activity Audit Log</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks every access to sensitive medical records, task changes, and care plan edits.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() =>
                setAuditFilter(auditFilter === 'All' ? 'SensitiveOnly' : 'All')
              }
              className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                auditFilter === 'SensitiveOnly'
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {auditFilter === 'SensitiveOnly' ? 'Showing Sensitive Accesses Only' : 'Show All Events'}
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="p-2.5 font-bold">Timestamp</th>
                <th className="p-2.5 font-bold">User & Role</th>
                <th className="p-2.5 font-bold">Action Event</th>
                <th className="p-2.5 font-bold">Target Resident</th>
                <th className="p-2.5 font-bold">Details</th>
                <th className="p-2.5 font-bold text-right">Sensitivity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-2.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-2.5 font-semibold">
                    {log.userName}{' '}
                    <span className="text-[10px] text-purple-800 bg-purple-100 px-1.5 py-0.2 rounded font-normal">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-2.5 font-medium">{log.targetResidentName || 'N/A'}</td>
                  <td className="p-2.5 text-slate-600 max-w-xs truncate">{log.details}</td>
                  <td className="p-2.5 text-right whitespace-nowrap">
                    {log.isSensitiveAccess ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        <Lock className="w-3 h-3 mr-1" /> Confidential
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Standard
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
