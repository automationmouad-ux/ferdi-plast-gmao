export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: "Admin" | "Manager" | "Technician" | "Viewer";
}

export interface Machine {
  id: string;
  code: string;
  name: string;
  designation: string;
  brand: string;
  model: string;
  serialNumber: string;
  year: number;
  supplier: string;
  location: string;
  productionLine: string;
  energyType: string;
  power: number;
  status: string;
  criticality: string;
  operatingHours: number;
  commissioningDate: string;
  warranty: string;
  documents: string[];
  photos: string[];
}

export interface WorkOrder {
  id: string;
  machineId: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  completedAt: string;
  partsUsed: string[];
  cost: number;
  notes: string;
}

export interface Breakdown {
  id: string;
  machineId: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  cause: string;
  symptom: string;
  diagnosis: string;
  correctiveAction: string;
  technician: string;
  partsUsed: string[];
  cost: number;
  criticality: string;
  status: string;
}

export interface SparePart {
  id: string;
  code: string;
  designation: string;
  reference: string;
  compatibleMachines: string[];
  currentStock: number;
  minStock: number;
  maxStock: number;
  supplier: string;
  price: number;
  location: string;
}

export interface PreventiveTask {
  id: string;
  machineId: string;
  task: string;
  frequency: string;
  lastPerformed: string;
  nextDue: string;
  assignedTo: string;
  checklist: string[];
  duration: number;
  partsNeeded: string[];
  safetyInstructions: string;
  status: string;
}

export interface RegulatoryControl {
  id: string;
  equipment: string;
  controlType: string;
  lastControlDate: string;
  nextDueDate: string;
  organism: string;
  result: string;
  certificate: string;
  observation: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}