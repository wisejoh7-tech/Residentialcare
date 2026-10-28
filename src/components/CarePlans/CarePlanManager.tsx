import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Plus, FileText, X, Check } from 'lucide-react';
import { PermissionGate } from '../Security/PermissionGate';
import type { CareTaskCategory } from '../../types';

export const CarePlanManager: React.FC = () => {
  const { carePlans, residents, addCarePlan, updateCarePlan, currentUser } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    residentId: residents[0]?.id || '',
    title: '',
    category: 'Medication' as CareTaskCategory,
    frequency: 'Daily' as 'Daily' | 'Weekly' | 'As Needed',
    timesOfDay: '08:00 AM, 08:00 PM',
    instructions: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = residents.find((r) => r.id === form.residentId);
    if (!res) return;

    addCarePlan({
      residentId: res.id,
      residentName: res.name,
      title: form.title,
      category: form.category,
      frequency: form.frequency,
      timesOfDay: form.timesOfDay.split(',').map((t) => t.trim()),
      instructions: form.instructions,
      lastReviewed: new Date().toISOString().split('T')[0],
      nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      createdByName: `${currentUser.name} (${currentUser.role})`,
      isActive: true,
    });

    setShowModal(false);
    setForm({
      residentId: residents[0]?.id || '',
      title: '',
      category: 'Medication',
      frequency: 'Daily',
      timesOfDay: '08:00 AM, 08:00 PM',
      instructions: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-purple-700" />
            <span>Structured Care Plans & Protocols</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define long-term care plans, review schedules, and category instructions for staff.
          </p>
        </div>

        <PermissionGate permission="edit_care_plan" showAccessDeniedNotice={false}>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Care Plan</span>
          </button>
        </PermissionGate>
      </div>

      {/* Care Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carePlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                  {plan.residentName}
                </span>
                <h3 className="font-bold text-slate-900 text-base mt-1.5">{plan.title}</h3>
              </div>

              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  plan.isActive
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {plan.isActive ? 'Active' : 'Archived'}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {plan.instructions}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                Category: {plan.category}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                Freq: {plan.frequency}
              </span>
              <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded font-mono">
                Times: {plan.timesOfDay.join(', ')}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: {plan.createdByName}</span>
              <span>Next Review: {plan.nextReview}</span>
            </div>

            <PermissionGate permission="edit_care_plan">
              <div className="pt-2 flex justify-end space-x-2">
                <button
                  onClick={() =>
                    updateCarePlan(plan.id, {
                      lastReviewed: new Date().toISOString().split('T')[0],
                    })
                  }
                  className="px-3 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Reviewed Today</span>
                </button>
              </div>
            </PermissionGate>
          </div>
        ))}
      </div>

      {/* Modal to Create Care Plan */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-700" />
                <span>Create Structured Care Plan</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Select Resident</label>
                <select
                  value={form.residentId}
                  onChange={(e) => setForm({ ...form, residentId: e.target.value })}
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
                <label className="font-semibold text-slate-700 block mb-1">Care Plan Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Morning Hypertension Protocol & Fluid Intake"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value as CareTaskCategory })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Medication">Medication</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Hydration & Nutrition">Hydration & Nutrition</option>
                    <option value="Mobility & Activity">Mobility & Activity</option>
                    <option value="Wellbeing & Social">Wellbeing & Social</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Frequency</label>
                  <select
                    value={form.frequency}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        frequency: e.target.value as 'Daily' | 'Weekly' | 'As Needed',
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As Needed">As Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Times of Day (comma separated)
                </label>
                <input
                  type="text"
                  value={form.timesOfDay}
                  onChange={(e) => setForm({ ...form, timesOfDay: e.target.value })}
                  placeholder="e.g. 08:00 AM, 01:00 PM, 08:00 PM"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Detailed Instructions & Protocols for Staff
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.instructions}
                  onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                  placeholder="Explicit care instructions..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Save Care Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
