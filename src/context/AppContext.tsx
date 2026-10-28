import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  Resident,
  CareTask,
  CarePlan,
  StaffMember,
  ShiftAssignment,
  AuditLog,
  FamilyUpdateFeed,
  CareTaskStatus,
  ShiftStatus,
  UserRole,
  VitalSigns,
} from '../types';
import {
  initialUsers,
  initialResidents,
  initialTasks,
  initialCarePlans,
  initialStaffMembers,
  initialShiftAssignments,
  initialAuditLogs,
  initialFamilyUpdates,
} from '../data/seedData';

type Permission =
  | 'view_sensitive_records'
  | 'edit_care_plan'
  | 'manage_staff'
  | 'log_medication'
  | 'delete_record'
  | 'view_all_residents';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  availableUsers: User[];
  residents: Resident[];
  addResident: (resident: Omit<Resident, 'id'>) => void;
  updateResident: (id: string, updated: Partial<Resident>) => void;
  tasks: CareTask[];
  addTask: (task: Omit<CareTask, 'id'>) => void;
  updateTaskStatus: (
    taskId: string,
    status: CareTaskStatus,
    notes?: string,
    vitals?: VitalSigns
  ) => void;
  carePlans: CarePlan[];
  addCarePlan: (plan: Omit<CarePlan, 'id'>) => void;
  updateCarePlan: (id: string, updated: Partial<CarePlan>) => void;
  staffMembers: StaffMember[];
  updateStaffStatus: (staffId: string, status: ShiftStatus) => void;
  shiftAssignments: ShiftAssignment[];
  assignStaffToResident: (staffId: string, residentId: string) => void;
  auditLogs: AuditLog[];
  logAuditAction: (
    action: string,
    targetResidentId?: string,
    targetResidentName?: string,
    details?: string,
    isSensitive?: boolean
  ) => void;
  familyUpdates: FamilyUpdateFeed[];
  addFamilyUpdate: (update: Omit<FamilyUpdateFeed, 'id' | 'timestamp'>) => void;
  hasPermission: (permission: Permission) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('lmc_currentUser');
    return saved ? JSON.parse(saved) : initialUsers[0];
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem('lmc_residents');
    return saved ? JSON.parse(saved) : initialResidents;
  });

  const [tasks, setTasks] = useState<CareTask[]>(() => {
    const saved = localStorage.getItem('lmc_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [carePlans, setCarePlans] = useState<CarePlan[]>(() => {
    const saved = localStorage.getItem('lmc_carePlans');
    return saved ? JSON.parse(saved) : initialCarePlans;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('lmc_staffMembers');
    return saved ? JSON.parse(saved) : initialStaffMembers;
  });

  const [shiftAssignments] = useState<ShiftAssignment[]>(() => {
    const saved = localStorage.getItem('lmc_shiftAssignments');
    return saved ? JSON.parse(saved) : initialShiftAssignments;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('lmc_auditLogs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [familyUpdates, setFamilyUpdates] = useState<FamilyUpdateFeed[]>(() => {
    const saved = localStorage.getItem('lmc_familyUpdates');
    return saved ? JSON.parse(saved) : initialFamilyUpdates;
  });

  useEffect(() => {
    localStorage.setItem('lmc_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lmc_residents', JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    localStorage.setItem('lmc_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lmc_carePlans', JSON.stringify(carePlans));
  }, [carePlans]);

  useEffect(() => {
    localStorage.setItem('lmc_staffMembers', JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem('lmc_shiftAssignments', JSON.stringify(shiftAssignments));
  }, [shiftAssignments]);

  useEffect(() => {
    localStorage.setItem('lmc_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('lmc_familyUpdates', JSON.stringify(familyUpdates));
  }, [familyUpdates]);

  const logAuditAction = (
    action: string,
    targetResidentId?: string,
    targetResidentName?: string,
    details?: string,
    isSensitive: boolean = false
  ) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: timeStr,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      targetResidentId,
      targetResidentName,
      details: details || `Performed action: ${action}`,
      isSensitiveAccess: isSensitive,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const hasPermission = (permission: Permission): boolean => {
    const role: UserRole = currentUser.role;
    switch (permission) {
      case 'view_sensitive_records':
        return role === 'Admin' || role === 'Nurse';
      case 'edit_care_plan':
        return role === 'Admin' || role === 'Nurse';
      case 'manage_staff':
        return role === 'Admin';
      case 'log_medication':
        return role === 'Admin' || role === 'Nurse' || role === 'Carer';
      case 'delete_record':
        return role === 'Admin';
      case 'view_all_residents':
        return role !== 'Family';
      default:
        return false;
    }
  };

  const addResident = (residentData: Omit<Resident, 'id'>) => {
    const newRes: Resident = {
      ...residentData,
      id: `res-${Date.now()}`,
    };
    setResidents((prev) => [...prev, newRes]);
    logAuditAction(
      'CREATE_RESIDENT',
      newRes.id,
      newRes.name,
      `Created new resident profile for ${newRes.name}`
    );
  };

  const updateResident = (id: string, updated: Partial<Resident>) => {
    setResidents((prev) =>
      prev.map((res) => (res.id === id ? { ...res, ...updated } : res))
    );
    const target = residents.find((r) => r.id === id);
    logAuditAction(
      'UPDATE_RESIDENT',
      id,
      target?.name,
      `Updated resident profile details`
    );
  };

  const addTask = (taskData: Omit<CareTask, 'id'>) => {
    const newTask: CareTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
    logAuditAction(
      'CREATE_TASK',
      newTask.residentId,
      newTask.residentName,
      `Scheduled new care task: ${newTask.title}`
    );
  };

  const updateTaskStatus = (
    taskId: string,
    status: CareTaskStatus,
    notes?: string,
    vitals?: VitalSigns
  ) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    let targetTask: CareTask | undefined;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          targetTask = t;
          return {
            ...t,
            status,
            completedAt: status === 'Completed' ? timeStr : t.completedAt,
            completedByStaffId: status === 'Completed' ? currentUser.id : t.completedByStaffId,
            completedByStaffName:
              status === 'Completed' ? currentUser.name : t.completedByStaffName,
            notes: notes !== undefined ? notes : t.notes,
            vitalSigns: vitals ? { ...t.vitalSigns, ...vitals } : t.vitalSigns,
          };
        }
        return t;
      })
    );

    if (targetTask) {
      logAuditAction(
        'UPDATE_TASK_STATUS',
        targetTask.residentId,
        targetTask.residentName,
        `Marked task "${targetTask.title}" as ${status}. Notes: ${notes || 'None'}`
      );
    }
  };

  const addCarePlan = (planData: Omit<CarePlan, 'id'>) => {
    const newPlan: CarePlan = {
      ...planData,
      id: `cp-${Date.now()}`,
    };
    setCarePlans((prev) => [...prev, newPlan]);
    logAuditAction(
      'CREATE_CARE_PLAN',
      newPlan.residentId,
      newPlan.residentName,
      `Created care plan: ${newPlan.title}`
    );
  };

  const updateCarePlan = (id: string, updated: Partial<CarePlan>) => {
    setCarePlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    const target = carePlans.find((cp) => cp.id === id);
    logAuditAction(
      'UPDATE_CARE_PLAN',
      target?.residentId,
      target?.residentName,
      `Updated care plan: ${target?.title}`
    );
  };

  const updateStaffStatus = (staffId: string, status: ShiftStatus) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, shiftStatus: status } : s))
    );
  };

  const assignStaffToResident = (staffId: string, residentId: string) => {
    setStaffMembers((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const exists = s.assignedResidentIds.includes(residentId);
          const updatedIds = exists
            ? s.assignedResidentIds.filter((id) => id !== residentId)
            : [...s.assignedResidentIds, residentId];
          return { ...s, assignedResidentIds: updatedIds };
        }
        return s;
      })
    );
  };

  const addFamilyUpdate = (updateData: Omit<FamilyUpdateFeed, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const newFeed: FamilyUpdateFeed = {
      ...updateData,
      id: `fup-${Date.now()}`,
      timestamp: timeStr,
    };
    setFamilyUpdates((prev) => [newFeed, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        availableUsers: initialUsers,
        residents,
        addResident,
        updateResident,
        tasks,
        addTask,
        updateTaskStatus,
        carePlans,
        addCarePlan,
        updateCarePlan,
        staffMembers,
        updateStaffStatus,
        shiftAssignments,
        assignStaffToResident,
        auditLogs,
        logAuditAction,
        familyUpdates,
        addFamilyUpdate,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
