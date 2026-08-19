import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Machine, WorkOrder, Breakdown, SparePart, PreventiveTask, RegulatoryControl, User, AuditLog } from "@/types";

interface AppState {
  currentUser: User | null;
  users: User[];
  machines: Machine[];
  workOrders: WorkOrder[];
  breakdowns: Breakdown[];
  spareParts: SparePart[];
  preventiveTasks: PreventiveTask[];
  regulatoryControls: RegulatoryControl[];
  auditLogs: AuditLog[];
  isOnline: boolean;
  lastSync: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addMachine: (machine: Machine) => void;
  updateMachine: (id: string, data: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  addWorkOrder: (wo: WorkOrder) => void;
  updateWorkOrder: (id: string, data: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;
  addBreakdown: (bd: Breakdown) => void;
  updateBreakdown: (id: string, data: Partial<Breakdown>) => void;
  deleteBreakdown: (id: string) => void;
  addSparePart: (sp: SparePart) => void;
  updateSparePart: (id: string, data: Partial<SparePart>) => void;
  deleteSparePart: (id: string) => void;
  addPreventiveTask: (task: PreventiveTask) => void;
  updatePreventiveTask: (id: string, data: Partial<PreventiveTask>) => void;
  deletePreventiveTask: (id: string) => void;
  addRegulatoryControl: (rc: RegulatoryControl) => void;
  updateRegulatoryControl: (id: string, data: Partial<RegulatoryControl>) => void;
  deleteRegulatoryControl: (id: string) => void;
  exportBackup: () => void;
  importBackup: (data: string) => void;
  addAuditLog: (action: string, entity: string, entityId: string, oldValue?: string, newValue?: string) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

const defaultUsers: User[] = [
  { id: "1", username: "admin", password: "admin123", name: "Admin", role: "Admin" },
  { id: "2", username: "manager", password: "manager123", name: "Manager", role: "Manager" },
  { id: "3", username: "tech", password: "tech123", name: "Technicien", role: "Technician" },
  { id: "4", username: "viewer", password: "viewer123", name: "Viewer", role: "Viewer" },
];

const defaultMachines: Machine[] = [
  {
    id: "M-001",
    code: "M-001",
    name: "Extrudeuse EX-2000",
    designation: "Extrudeuse double vis",
    brand: "Bühler",
    model: "EX-2000",
    serialNumber: "SN-2023-001",
    year: 2023,
    supplier: "Bühler SA",
    location: "Atelier 1",
    productionLine: "Ligne 1",
    energyType: "Électrique",
    power: 250,
    status: "Opérationnelle",
    criticality: "Critique",
    operatingHours: 4500,
    commissioningDate: "2023-03-15",
    warranty: "2026-03-15",
    documents: [],
    photos: [],
  },
  {
    id: "M-002",
    code: "M-002",
    name: "Injection Presse IP-500",
    designation: "Presse à injection",
    brand: "Arburg",
    model: "IP-500",
    serialNumber: "SN-2022-015",
    year: 2022,
    supplier: "Arburg GmbH",
    location: "Atelier 2",
    productionLine: "Ligne 2",
    energyType: "Électrique",
    power: 180,
    status: "En maintenance",
    criticality: "Haute",
    operatingHours: 6200,
    commissioningDate: "2022-07-20",
    warranty: "2025-07-20",
    documents: [],
    photos: [],
  },
  {
    id: "M-003",
    code: "M-003",
    name: "Compresseur CP-100",
    designation: "Compresseur à vis",
    brand: "Atlas Copco",
    model: "CP-100",
    serialNumber: "SN-2024-008",
    year: 2024,
    supplier: "Atlas Copco",
    location: "Local technique",
    productionLine: "Ligne 1",
    energyType: "Électrique",
    power: 75,
    status: "Opérationnelle",
    criticality: "Moyenne",
    operatingHours: 1200,
    commissioningDate: "2024-01-10",
    warranty: "2027-01-10",
    documents: [],
    photos: [],
  },
];

const defaultWorkOrders: WorkOrder[] = [
  {
    id: "WO-001",
    machineId: "M-002",
    title: "Maintenance préventive presse",
    description: "Vérification complète de la presse à injection",
    priority: "Haute",
    status: "En cours",
    assignedTo: "Technicien",
    createdBy: "Manager",
    createdAt: "2026-01-15T08:00:00",
    dueDate: "2026-01-20",
    completedAt: "",
    partsUsed: [],
    cost: 0,
    notes: "",
  },
  {
    id: "WO-002",
    machineId: "M-001",
    title: "Réparation système refroidissement",
    description: "Fuite détectée sur le circuit de refroidissement",
    priority: "Critique",
    status: "Ouvert",
    assignedTo: "Technicien",
    createdBy: "Admin",
    createdAt: "2026-01-16T09:30:00",
    dueDate: "2026-01-18",
    completedAt: "",
    partsUsed: [],
    cost: 0,
    notes: "",
  },
];

const defaultBreakdowns: Breakdown[] = [
  {
    id: "BD-001",
    machineId: "M-001",
    date: "2026-01-15",
    startTime: "08:00",
    endTime: "10:30",
    duration: 2.5,
    type: "Mécanique",
    cause: "Usure courroie",
    symptom: "Bruit anormal",
    diagnosis: "Courroie d'entraînement usée",
    correctiveAction: "Remplacement courroie",
    technician: "Technicien",
    partsUsed: ["SP-001"],
    cost: 150,
    criticality: "Haute",
    status: "Résolu",
  },
  {
    id: "BD-002",
    machineId: "M-002",
    date: "2026-01-16",
    startTime: "14:00",
    endTime: "16:00",
    duration: 2,
    type: "Électrique",
    cause: "Surchauffe moteur",
    symptom: "Arrêt automatique",
    diagnosis: "Ventilation insuffisante",
    correctiveAction: "Nettoyage ventilateur",
    technician: "Technicien",
    partsUsed: [],
    cost: 80,
    criticality: "Moyenne",
    status: "En cours",
  },
];

const defaultSpareParts: SparePart[] = [
  {
    id: "SP-001",
    code: "SP-001",
    designation: "Courroie trapézoïdale",
    reference: "CT-100",
    compatibleMachines: ["M-001"],
    currentStock: 5,
    minStock: 10,
    maxStock: 50,
    supplier: "Bühler SA",
    price: 25,
    location: "Rack A-01",
  },
  {
    id: "SP-002",
    code: "SP-002",
    designation: "Filtre hydraulique",
    reference: "FH-200",
    compatibleMachines: ["M-002"],
    currentStock: 15,
    minStock: 5,
    maxStock: 30,
    supplier: "Arburg GmbH",
    price: 45,
    location: "Rack A-02",
  },
];

const defaultPreventiveTasks: PreventiveTask[] = [
  {
    id: "PM-001",
    machineId: "M-001",
    task: "Lubrification générale",
    frequency: "Mensuelle",
    lastPerformed: "2025-12-20",
    nextDue: "2026-01-20",
    assignedTo: "Technicien",
    checklist: ["Vérifier niveau huile", "Graisser les points de lubrification"],
    duration: 2,
    partsNeeded: ["SP-001"],
    safetyInstructions: "Machine arrêtée et consignée",
    status: "Planifié",
  },
  {
    id: "PM-002",
    machineId: "M-002",
    task: "Contrôle électrique",
    frequency: "Trimestrielle",
    lastPerformed: "2025-10-15",
    nextDue: "2026-01-15",
    assignedTo: "Technicien",
    checklist: ["Vérifier câblage", "Tester les protections"],
    duration: 4,
    partsNeeded: [],
    safetyInstructions: "Couper l'alimentation électrique",
    status: "En cours",
  },
];

const defaultRegulatoryControls: RegulatoryControl[] = [
  {
    id: "RC-001",
    equipment: "Extincteurs Atelier 1",
    controlType: "Extincteurs",
    lastControlDate: "2025-07-15",
    nextDueDate: "2026-07-15",
    organism: "Bureau Veritas",
    result: "Conforme",
    certificate: "CV-2025-001",
    observation: "",
  },
  {
    id: "RC-002",
    equipment: "Compresseur CP-100",
    controlType: "Compresseurs",
    lastControlDate: "2025-12-01",
    nextDueDate: "2026-06-01",
    organism: "APAVE",
    result: "Conforme",
    certificate: "AP-2025-002",
    observation: "",
  },
];

const defaultAuditLogs: AuditLog[] = [];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [machines, setMachines] = useState<Machine[]>(defaultMachines);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(defaultWorkOrders);
  const [breakdowns, setBreakdowns] = useState<Breakdown[]>(defaultBreakdowns);
  const [spareParts, setSpareParts] = useState<SparePart[]>(defaultSpareParts);
  const [preventiveTasks, setPreventiveTasks] = useState<PreventiveTask[]>(defaultPreventiveTasks);
  const [regulatoryControls, setRegulatoryControls] = useState<RegulatoryControl[]>(defaultRegulatoryControls);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(defaultAuditLogs);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastSync, setLastSync] = useState<string>(new Date().toISOString());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const addAuditLog = (action: string, entity: string, entityId: string, oldValue?: string, newValue?: string) => {
    const log: AuditLog = {
      id: `LOG-${Date.now()}`,
      userId: currentUser?.id || "system",
      userName: currentUser?.name || "System",
      action,
      entity,
      entityId,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const login = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      addAuditLog("login", "user", user.id);
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog("logout", "user", currentUser.id);
    }
    setCurrentUser(null);
  };

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    addAuditLog("create", "user", user.id);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    addAuditLog("update", "user", id);
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addAuditLog("delete", "user", id);
  };

  const addMachine = (machine: Machine) => {
    setMachines((prev) => [...prev, machine]);
    addAuditLog("create", "machine", machine.id);
  };

  const updateMachine = (id: string, data: Partial<Machine>) => {
    setMachines((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    addAuditLog("update", "machine", id);
  };

  const deleteMachine = (id: string) => {
    setMachines((prev) => prev.filter((m) => m.id !== id));
    addAuditLog("delete", "machine", id);
  };

  const addWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => [...prev, wo]);
    addAuditLog("create", "workorder", wo.id);
  };

  const updateWorkOrder = (id: string, data: Partial<WorkOrder>) => {
    setWorkOrders((prev) => prev.map((wo) => (wo.id === id ? { ...wo, ...data } : wo)));
    addAuditLog("update", "workorder", id);
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders((prev) => prev.filter((wo) => wo.id !== id));
    addAuditLog("delete", "workorder", id);
  };

  const addBreakdown = (bd: Breakdown) => {
    setBreakdowns((prev) => [...prev, bd]);
    addAuditLog("create", "breakdown", bd.id);
  };

  const updateBreakdown = (id: string, data: Partial<Breakdown>) => {
    setBreakdowns((prev) => prev.map((bd) => (bd.id === id ? { ...bd, ...data } : bd)));
    addAuditLog("update", "breakdown", id);
  };

  const deleteBreakdown = (id: string) => {
    setBreakdowns((prev) => prev.filter((bd) => bd.id !== id));
    addAuditLog("delete", "breakdown", id);
  };

  const addSparePart = (sp: SparePart) => {
    setSpareParts((prev) => [...prev, sp]);
    addAuditLog("create", "sparepart", sp.id);
  };

  const updateSparePart = (id: string, data: Partial<SparePart>) => {
    setSpareParts((prev) => prev.map((sp) => (sp.id === id ? { ...sp, ...data } : sp)));
    addAuditLog("update", "sparepart", id);
  };

  const deleteSparePart = (id: string) => {
    setSpareParts((prev) => prev.filter((sp) => sp.id !== id));
    addAuditLog("delete", "sparepart", id);
  };

  const addPreventiveTask = (task: PreventiveTask) => {
    setPreventiveTasks((prev) => [...prev, task]);
    addAuditLog("create", "preventive", task.id);
  };

  const updatePreventiveTask = (id: string, data: Partial<PreventiveTask>) => {
    setPreventiveTasks((prev) => prev.map((task) => (task.id === id ? { ...task, ...data } : task)));
    addAuditLog("update", "preventive", id);
  };

  const deletePreventiveTask = (id: string) => {
    setPreventiveTasks((prev) => prev.filter((task) => task.id !== id));
    addAuditLog("delete", "preventive", id);
  };

  const addRegulatoryControl = (rc: RegulatoryControl) => {
    setRegulatoryControls((prev) => [...prev, rc]);
    addAuditLog("create", "regulatory", rc.id);
  };

  const updateRegulatoryControl = (id: string, data: Partial<RegulatoryControl>) => {
    setRegulatoryControls((prev) => prev.map((rc) => (rc.id === id ? { ...rc, ...data } : rc)));
    addAuditLog("update", "regulatory", id);
  };

  const deleteRegulatoryControl = (id: string) => {
    setRegulatoryControls((prev) => prev.filter((rc) => rc.id !== id));
    addAuditLog("delete", "regulatory", id);
  };

  const exportBackup = () => {
    const data = {
      users,
      machines,
      workOrders,
      breakdowns,
      spareParts,
      preventiveTasks,
      regulatoryControls,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ferdi-plast-gmao-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog("export", "backup", "all");
  };

  const importBackup = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.users) setUsers(parsed.users);
      if (parsed.machines) setMachines(parsed.machines);
      if (parsed.workOrders) setWorkOrders(parsed.workOrders);
      if (parsed.breakdowns) setBreakdowns(parsed.breakdowns);
      if (parsed.spareParts) setSpareParts(parsed.spareParts);
      if (parsed.preventiveTasks) setPreventiveTasks(parsed.preventiveTasks);
      if (parsed.regulatoryControls) setRegulatoryControls(parsed.regulatoryControls);
      if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      addAuditLog("import", "backup", "all");
    } catch (error) {
      console.error("Error importing backup:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        machines,
        workOrders,
        breakdowns,
        spareParts,
        preventiveTasks,
        regulatoryControls,
        auditLogs,
        isOnline,
        lastSync,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        addMachine,
        updateMachine,
        deleteMachine,
        addWorkOrder,
        updateWorkOrder,
        deleteWorkOrder,
        addBreakdown,
        updateBreakdown,
        deleteBreakdown,
        addSparePart,
        updateSparePart,
        deleteSparePart,
        addPreventiveTask,
        updatePreventiveTask,
        deletePreventiveTask,
        addRegulatoryControl,
        updateRegulatoryControl,
        deleteRegulatoryControl,
        exportBackup,
        importBackup,
        addAuditLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}