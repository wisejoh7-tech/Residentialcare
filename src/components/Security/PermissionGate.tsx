import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lock } from 'lucide-react';

interface PermissionGateProps {
  permission:
    | 'view_sensitive_records'
    | 'edit_care_plan'
    | 'manage_staff'
    | 'log_medication'
    | 'delete_record'
    | 'view_all_residents';
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAccessDeniedNotice?: boolean;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  permission,
  children,
  fallback,
  showAccessDeniedNotice = false,
}) => {
  const { hasPermission, currentUser } = useApp();

  const allowed = hasPermission(permission);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDeniedNotice) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm flex items-start space-x-3 my-2">
        <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900">Access Restricted</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Your current role (<strong>{currentUser.role}</strong>) does not have permission to access or edit this resource ({permission.replace(/_/g, ' ')}).
          </p>
        </div>
      </div>
    );
  }

  return null;
};
