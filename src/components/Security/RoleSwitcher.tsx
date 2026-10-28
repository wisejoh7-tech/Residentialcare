import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserCheck } from 'lucide-react';
import type { UserRole } from '../../types';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, setCurrentUser, availableUsers } = useApp();

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = availableUsers.find((u) => u.id === e.target.value);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Nurse':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Carer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Family':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-sm flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center space-x-2">
        <Shield className="w-4 h-4 text-purple-400" />
        <span className="font-medium text-slate-300">RBAC Security Mode:</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
            currentUser.role
          )}`}
        >
          {currentUser.role} Role
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400 hidden sm:inline">Active User:</span>
        </div>
        <select
          value={currentUser.id}
          onChange={handleUserChange}
          className="bg-slate-800 border border-slate-700 text-white text-xs rounded-md px-2 py-1 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          aria-label="Switch User Role Persona"
        >
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role} - {user.title})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
