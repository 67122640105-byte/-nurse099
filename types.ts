
export interface Shift {
  id: string;
  ward: string;
  date: string; // ISO format string "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  partner: string;
  building: string;
  floor: string;
  notes?: string;
}

export interface Activity {
  id: string;
  action: string;
  date: string;
  status: 'Pending' | 'Done' | 'New' | 'Rejected';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  onDuty: boolean;
  ward: string;
  phone?: string;
  unavailableDays?: string[];
  availableDays?: string[];
}

export interface Announcement {
  id: string;
  department: string;
  date: string;
  content: string;
  severity: 'normal' | 'warning';
}
