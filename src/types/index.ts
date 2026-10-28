export type UserRole = 'Admin' | 'Nurse' | 'Carer' | 'Family';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  email: string;
  title: string;
  assignedResidentIds?: string[];
}

export type CareLevel = 'Low' | 'Medium' | 'High' | 'Palliative';
export type ResidentStatus = 'Active' | 'Hospitalized' | 'On Leave';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface SensitiveRecord {
  nhsNumber: string;
  financialNotes?: string;
  confidentialMedicalHistory?: string;
  safeguardingNotes?: string;
  restrictedNotes?: string;
}

export interface Resident {
  id: string;
  name: string;
  roomNumber: string;
  photoUrl: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  admissionDate: string;
  careLevel: CareLevel;
  status: ResidentStatus;
  summaryNote: string;
  allergies: string[];
  dietaryRequirements: string[];
  mobilityStatus: string;
  dnacprStatus: boolean;
  primaryPhysician: {
    name: string;
    phone: string;
    clinic: string;
  };
  familyContacts: EmergencyContact[];
  sensitiveData: SensitiveRecord;
}

export type CareTaskCategory =
  | 'Medication'
  | 'Personal Care'
  | 'Hydration & Nutrition'
  | 'Mobility & Activity'
  | 'Wellbeing & Social'
  | 'Night Check';

export type CareTaskStatus = 'Pending' | 'Completed' | 'Missed' | 'In Progress';

export interface VitalSigns {
  bp?: string;
  pulse?: number;
  temperature?: number;
  oxygenSat?: number;
}

export interface MedicationDetails {
  dosage: string;
  route: string; // e.g. Oral, Topical
  frequency: string;
  requiresWitness?: boolean;
  witnessName?: string;
}

export interface CareTask {
  id: string;
  residentId: string;
  residentName: string;
  residentPhoto?: string;
  title: string;
  description: string;
  category: CareTaskCategory;
  scheduledTime: string; // e.g., "08:00 AM"
  date: string; // YYYY-MM-DD
  status: CareTaskStatus;
  completedAt?: string;
  completedByStaffId?: string;
  completedByStaffName?: string;
  notes?: string;
  medicationDetails?: MedicationDetails;
  vitalSigns?: VitalSigns;
  flagged?: boolean;
  flagReason?: string;
}

export interface CarePlan {
  id: string;
  residentId: string;
  residentName: string;
  title: string;
  category: CareTaskCategory;
  frequency: 'Daily' | 'Weekly' | 'As Needed';
  timesOfDay: string[];
  instructions: string;
  lastReviewed: string;
  nextReview: string;
  createdByName: string;
  isActive: boolean;
}

export type ShiftType = 'Morning' | 'Afternoon' | 'Night';
export type ShiftStatus = 'On Duty' | 'Off Duty' | 'On Break';

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  jobTitle: string;
  avatar: string;
  phone: string;
  email: string;
  shiftStatus: ShiftStatus;
  currentShift?: ShiftType;
  assignedResidentIds: string[];
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: UserRole;
  shiftType: ShiftType;
  date: string;
  assignedResidentIds: string[];
  status: 'Scheduled' | 'Active' | 'Completed';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  targetResidentId?: string;
  targetResidentName?: string;
  details: string;
  isSensitiveAccess: boolean;
}

export interface FamilyUpdateFeed {
  id: string;
  residentId: string;
  residentName: string;
  timestamp: string;
  authorName: string;
  message: string;
  category: 'General' | 'Activity' | 'Health' | 'Meal';
  photoUrl?: string;
}
