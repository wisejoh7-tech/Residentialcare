import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Filter,
  Plus,
  User,
  Phone,
  AlertCircle,
  ChevronRight,
  Heart,
  X,
  PlusCircle,
} from 'lucide-react';
import { SensitiveRecordGuard } from '../Security/SensitiveRecordGuard';
import { PermissionGate } from '../Security/PermissionGate';
import type { CareLevel, ResidentStatus } from '../../types';

interface ResidentListProps {
  selectedResidentId?: string | null;
  onSelectResident: (id: string | null) => void;
}

export const ResidentList: React.FC<ResidentListProps> = ({
  selectedResidentId,
  onSelectResident,
}) => {
  const { residents, addResident, carePlans, tasks } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [careLevelFilter, setCareLevelFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'careplans' | 'contacts' | 'sensitive'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new resident
  const [newForm, setNewForm] = useState({
    name: '',
    roomNumber: '',
    age: 80,
    gender: 'Male',
    dateOfBirth: '1945-01-01',
    admissionDate: new Date().toISOString().split('T')[0],
    careLevel: 'Medium' as CareLevel,
    status: 'Active' as ResidentStatus,
    summaryNote: '',
    allergies: 'Penicillin',
    dietaryRequirements: 'Regular',
    mobilityStatus: 'Independent',
    dnacprStatus: false,
    doctorName: 'Dr. Emily Watson',
    doctorPhone: '+44 20 7946 0912',
    doctorClinic: 'St. Jude Community Health Practice',
    nhsNumber: '123-456-7890',
  });

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.allergies.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCareLevel = careLevelFilter === 'All' || r.careLevel === careLevelFilter;
    return matchesSearch && matchesCareLevel;
  });

  const selectedResident = residents.find((r) => r.id === selectedResidentId) || residents[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addResident({
      name: newForm.name,
      roomNumber: newForm.roomNumber,
      photoUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      age: Number(newForm.age),
      gender: newForm.gender,
      dateOfBirth: newForm.dateOfBirth,
      admissionDate: newForm.admissionDate,
      careLevel: newForm.careLevel,
      status: newForm.status,
      summaryNote: newForm.summaryNote,
      allergies: newForm.allergies.split(',').map((a) => a.trim()),
      dietaryRequirements: newForm.dietaryRequirements.split(',').map((d) => d.trim()),
      mobilityStatus: newForm.mobilityStatus,
      dnacprStatus: newForm.dnacprStatus,
      primaryPhysician: {
        name: newForm.doctorName,
        phone: newForm.doctorPhone,
        clinic: newForm.doctorClinic,
      },
      familyContacts: [
        {
          id: `fc-${Date.now()}`,
          name: 'Primary Contact',
          relation: 'Next of Kin',
          phone: '+44 7700 900000',
          email: 'family@example.com',
          isPrimary: true,
        },
      ],
      sensitiveData: {
        nhsNumber: newForm.nhsNumber,
        financialNotes: 'Standard Home Funding Package',
        confidentialMedicalHistory: 'Initial clinical assessment on admission.',
      },
    });
    setShowAddModal(false);
  };

  const residentCarePlans = carePlans.filter((cp) => cp.residentId === selectedResident?.id);
  const residentTasks = tasks.filter((t) => t.residentId === selectedResident?.id);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <User className="w-6 h-6 text-purple-700" />
            <span>Resident Directory & Profiles</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage resident records, clinical details, family contacts, and secure records.
          </p>
        </div>

        <PermissionGate permission="edit_care_plan">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Resident</span>
          </button>
        </PermissionGate>
      </div>

      {/* Main Split Layout: Resident List (Left) + Detailed Profile (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Directory List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col space-y-4">
          {/* Search & Filter Controls */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name, room, allergy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={careLevelFilter}
                onChange={(e) => setCareLevelFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 text-slate-700 focus:outline-none"
                aria-label="Filter by Care Level"
              >
                <option value="All">All Care Levels</option>
                <option value="High">High Care</option>
                <option value="Medium">Medium Care</option>
                <option value="Low">Low Care</option>
                <option value="Palliative">Palliative Care</option>
              </select>
            </div>
          </div>

          {/* List Items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px] pr-1">
            {filteredResidents.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-400">No residents match search.</p>
            ) : (
              filteredResidents.map((res) => {
                const isSelected = selectedResident?.id === res.id;
                return (
                  <div
                    key={res.id}
                    onClick={() => onSelectResident(res.id)}
                    className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between space-x-3 my-1 ${
                      isSelected
                        ? 'bg-purple-50 border-2 border-purple-500 shadow-2xs'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={res.photoUrl}
                        alt={res.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-purple-200 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{res.name}</p>
                        <p className="text-[11px] text-slate-500">{res.roomNumber}</p>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              res.careLevel === 'High'
                                ? 'bg-red-100 text-red-800'
                                : res.careLevel === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {res.careLevel}
                          </span>
                          {res.dnacprStatus && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-white font-bold">
                              DNACPR
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Resident Profile */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 flex flex-col">
          {selectedResident ? (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedResident.photoUrl}
                    alt={selectedResident.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-200 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-slate-900">{selectedResident.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900">
                        Room {selectedResident.roomNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Age: <strong>{selectedResident.age}</strong> ({selectedResident.gender}) • Admitted:{' '}
                      {selectedResident.admissionDate}
                    </p>

                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        Status: {selectedResident.status}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                        {selectedResident.careLevel} Care Level
                      </span>
                      {selectedResident.dnacprStatus && (
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                          DNACPR Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'overview'
                      ? 'border-purple-700 text-purple-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Overview & Medical
                </button>
                <button
                  onClick={() => setActiveTab('careplans')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'careplans'
                      ? 'border-purple-700 text-purple-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Care Plans ({residentCarePlans.length})
                </button>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'contacts'
                      ? 'border-purple-700 text-purple-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Family & Contacts
                </button>
                <button
                  onClick={() => setActiveTab('sensitive')}
                  className={`pb-2.5 transition border-b-2 cursor-pointer ${
                    activeTab === 'sensitive'
                      ? 'border-purple-700 text-purple-900 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Confidential File
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-5 text-xs text-slate-800">
                  <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-purple-900 text-sm mb-1">Care Summary Note</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedResident.summaryNote}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Allergies Card */}
                    <div className="bg-red-50/60 p-4 rounded-xl border border-red-100">
                      <h4 className="font-bold text-red-900 flex items-center space-x-1.5 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span>Allergies & Sensitivities</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResident.allergies.map((allergy, i) => (
                          <span key={i} className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Dietary Requirements */}
                    <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-100">
                      <h4 className="font-bold text-amber-900 flex items-center space-x-1.5 mb-2">
                        <Heart className="w-4 h-4 text-amber-600" />
                        <span>Dietary Requirements</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedResident.dietaryRequirements.map((diet, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-100 text-amber-800 rounded font-semibold">
                            {diet}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Mobility */}
                    <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 md:col-span-2">
                      <h4 className="font-bold text-blue-900 mb-1">Mobility & Transfer Assessment</h4>
                      <p className="text-slate-700">{selectedResident.mobilityStatus}</p>
                    </div>

                    {/* Primary Physician */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 md:col-span-2">
                      <h4 className="font-bold text-slate-900 mb-1">Primary Registered Physician</h4>
                      <p className="text-slate-700">
                        <strong>{selectedResident.primaryPhysician.name}</strong> •{' '}
                        {selectedResident.primaryPhysician.clinic}
                      </p>
                      <p className="text-slate-500 mt-0.5">Phone: {selectedResident.primaryPhysician.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'careplans' && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">Active Care Plans</h3>
                  {residentCarePlans.length === 0 ? (
                    <p className="text-slate-500">No active care plans defined for this resident.</p>
                  ) : (
                    residentCarePlans.map((cp) => (
                      <div key={cp.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 text-sm">{cp.title}</h4>
                          <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                            {cp.frequency}
                          </span>
                        </div>
                        <p className="text-slate-700">{cp.instructions}</p>
                        <div className="text-slate-400 text-[11px] flex items-center justify-between pt-2 border-t border-slate-200">
                          <span>Created by {cp.createdByName}</span>
                          <span>Next Review: {cp.nextReview}</span>
                        </div>
                      </div>
                    ))
                  )}

                  <h3 className="font-bold text-slate-900 text-sm pt-3">Scheduled Care Tasks for Today</h3>
                  <div className="space-y-2">
                    {residentTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{t.title}</span>
                            <span className="text-slate-500">({t.scheduledTime})</span>
                          </div>
                          <p className="text-slate-500 mt-0.5">{t.description}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            t.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm">Emergency & Family Contacts</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedResident.familyContacts.map((c) => (
                      <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{c.name}</span>
                          {c.isPrimary && (
                            <span className="bg-purple-700 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                              Primary Contact
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">Relationship: {c.relation}</p>
                        <p className="text-slate-700 flex items-center space-x-1 pt-1">
                          <Phone className="w-3.5 h-3.5 text-purple-700" />
                          <span>{c.phone}</span>
                        </p>
                        <p className="text-slate-500">{c.email}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'sensitive' && (
                <div className="space-y-4">
                  <SensitiveRecordGuard
                    residentId={selectedResident.id}
                    residentName={selectedResident.name}
                    sensitiveData={selectedResident.sensitiveData}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              Select a resident from the list to view their detailed profile.
            </div>
          )}
        </div>
      </div>

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-purple-700" />
                <span>Add New Resident Profile</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    placeholder="e.g. Florence Nightingale"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Room Number & Wing</label>
                  <input
                    type="text"
                    required
                    value={newForm.roomNumber}
                    onChange={(e) => setNewForm({ ...newForm, roomNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    placeholder="e.g. 105 - Maple Wing"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={newForm.age}
                    onChange={(e) => setNewForm({ ...newForm, age: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newForm.gender}
                    onChange={(e) => setNewForm({ ...newForm, gender: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Care Level</label>
                  <select
                    value={newForm.careLevel}
                    onChange={(e) => setNewForm({ ...newForm, careLevel: e.target.value as CareLevel })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Low">Low Care</option>
                    <option value="Medium">Medium Care</option>
                    <option value="High">High Care</option>
                    <option value="Palliative">Palliative Care</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Summary Care Note</label>
                <textarea
                  rows={2}
                  value={newForm.summaryNote}
                  onChange={(e) => setNewForm({ ...newForm, summaryNote: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  placeholder="Key care needs, mobility preferences, hobbies..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Allergies (comma separated)</label>
                  <input
                    type="text"
                    value={newForm.allergies}
                    onChange={(e) => setNewForm({ ...newForm, allergies: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NHS Number</label>
                  <input
                    type="text"
                    value={newForm.nhsNumber}
                    onChange={(e) => setNewForm({ ...newForm, nhsNumber: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="dnacpr"
                  checked={newForm.dnacprStatus}
                  onChange={(e) => setNewForm({ ...newForm, dnacprStatus: e.target.checked })}
                  className="rounded text-purple-700 focus:ring-purple-500"
                />
                <label htmlFor="dnacpr" className="font-bold text-slate-800">
                  DNACPR Order Registered
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg cursor-pointer"
                >
                  Save Resident Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
