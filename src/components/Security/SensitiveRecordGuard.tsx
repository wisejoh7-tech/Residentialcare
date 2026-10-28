import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';
import type { SensitiveRecord } from '../../types';

interface SensitiveRecordGuardProps {
  residentId: string;
  residentName: string;
  sensitiveData: SensitiveRecord;
}

export const SensitiveRecordGuard: React.FC<SensitiveRecordGuardProps> = ({
  residentId,
  residentName,
  sensitiveData,
}) => {
  const { hasPermission, currentUser, logAuditAction } = useApp();
  const [isRevealed, setIsRevealed] = useState(false);

  const canView = hasPermission('view_sensitive_records');

  const handleToggleReveal = () => {
    if (!canView) return;

    if (!isRevealed) {
      logAuditAction(
        'SENSITIVE_RECORD_VIEW',
        residentId,
        residentName,
        `Accessed sensitive medical and financial records for ${residentName}`,
        true
      );
    }
    setIsRevealed(!isRevealed);
  };

  if (!canView) {
    return (
      <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
        <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-base font-bold text-slate-700">Restricted Confidential File</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-3">
          This record contains sensitive medical history, NHS details, and financial arrangements. Your current role (<strong>{currentUser.role}</strong>) does not have access permissions.
        </p>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-700">
          <Lock className="w-3 h-3 mr-1" /> View Restricted by Policy
        </span>
      </div>
    );
  }

  return (
    <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-5 relative shadow-xs">
      <div className="flex items-center justify-between border-b border-purple-200 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-purple-950">
              Confidential Resident Records & NHS Data
            </h4>
            <p className="text-xs text-purple-700">
              Access is monitored and recorded in audit compliance logs.
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleReveal}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-semibold transition-colors focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hide Confidential Data</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Reveal & Audit Log Access</span>
            </>
          )}
        </button>
      </div>

      {isRevealed ? (
        <div className="space-y-4 text-xs text-slate-800 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-200 rounded-md p-2.5 flex items-center space-x-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Access verified for <strong>{currentUser.name}</strong> ({currentUser.role}). Event logged in security register.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
              <span className="font-semibold text-purple-900 block mb-1">NHS Number:</span>
              <span className="font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-sm">
                {sensitiveData.nhsNumber}
              </span>
            </div>

            {sensitiveData.financialNotes && (
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
                <span className="font-semibold text-purple-900 block mb-1">Financial & Funding:</span>
                <p className="text-slate-700">{sensitiveData.financialNotes}</p>
              </div>
            )}

            {sensitiveData.confidentialMedicalHistory && (
              <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs md:col-span-2">
                <span className="font-semibold text-purple-900 block mb-1">Confidential Clinical History:</span>
                <p className="text-slate-700 leading-relaxed">{sensitiveData.confidentialMedicalHistory}</p>
              </div>
            )}

            {sensitiveData.safeguardingNotes && (
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 md:col-span-2">
                <span className="font-semibold text-amber-900 block mb-1">Safeguarding & DoLS Notes:</span>
                <p className="text-amber-800">{sensitiveData.safeguardingNotes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/80 p-4 rounded-lg border border-purple-100 text-center text-slate-500 text-xs">
          <p className="font-medium text-slate-700">Protected Fields Masked</p>
          <p className="mt-0.5">Click "Reveal & Audit Log Access" above to view NHS Number, medical history, and financial details.</p>
        </div>
      )}
    </div>
  );
};
