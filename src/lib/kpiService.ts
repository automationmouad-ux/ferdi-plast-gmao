import { Machine, WorkOrder, PreventiveTask, SparePart, Breakdown, RegulatoryControl } from "@/types";

// ============================================
// KPI Service - طبقة موحدة لحساب جميع المؤشرات
// ============================================

export interface MachineKPI {
  machineId: string;
  machineCode: string;
  machineName: string;
  totalDowntime: number;
  breakdownCount: number;
  interventionCount: number;
  totalRepairTime: number;
  mttr: number | null;
  mtbf: number | null;
  availability: number | null;
  totalCost: number;
  pmCount: number;
  pmCompleted: number;
  pmRate: number | null;
  correctiveCount: number;
  preventiveCount: number;
  correctiveRate: number | null;
  preventiveRate: number | null;
  backlog: number;
  status: string;
}

export interface GlobalKPI {
  totalInterventions: number;
  totalDowntime: number;
  totalCost: number;
  averageDuration: number;
  mttr: number | null;
  mtbf: number | null;
  availability: number | null;
  backlog: number;
  pmRate: number | null;
  correctiveRate: number | null;
  preventiveRate: number | null;
  breakdownCount: number;
  machineStatus: {
    running: number;
    stopped: number;
    maintenance: number;
    breakdown: number;
  };
  alerts: {
    breakdowns: number;
    lowStock: number;
    overduePM: number;
    overdueWO: number;
    expiringControls: number;
  };
}

// حساب MTTR: إجمالي زمن الإصلاح / عدد الأعطال
export function calculateMTTR(breakdowns: Breakdown[]): number | null {
  const resolvedBreakdowns = breakdowns.filter(bd => bd.status === "Résolu" && bd.duration > 0);
  if (resolvedBreakdowns.length === 0) return null;
  
  const totalRepairTime = resolvedBreakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  return totalRepairTime / resolvedBreakdowns.length;
}

// حساب MTBF: زمن التشغيل / عدد الأعطال
export function calculateMTBF(breakdowns: Breakdown[], plannedHours: number): number | null {
  const breakdownCount = breakdowns.length;
  if (breakdownCount === 0) return null;
  
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const operatingTime = plannedHours - totalDowntime;
  
  if (operatingTime <= 0) return null;
  
  return operatingTime / breakdownCount;
}

// حساب Disponibilité: (Temps planifié - Temps arrêt) / Temps planifié × 100
export function calculateAvailability(breakdowns: Breakdown[], plannedHours: number): number | null {
  if (plannedHours <= 0) return null;
  
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const operatingTime = plannedHours - totalDowntime;
  
  if (operatingTime < 0) return null;
  
  return (operatingTime / plannedHours) * 100;
}

// حساب معدل إنجاز PM
export function calculatePMRate(preventiveTasks: PreventiveTask[]): number | null {
  const totalTasks = preventiveTasks.length;
  if (totalTasks === 0) return null;
  
  const completedTasks = preventiveTasks.filter(task => task.lastPerformed && task.lastPerformed !== "").length;
  return (completedTasks / totalTasks) * 100;
}

// حساب معدل الصيانة التصحيحية
export function calculateCorrectiveRate(workOrders: WorkOrder[], breakdowns: Breakdown[]): number | null {
  const correctiveWO = workOrders.filter(wo => wo.status === "Completed" && wo.priority === "Critique").length;
  const totalWO = workOrders.filter(wo => wo.status === "Completed").length;
  
  if (totalWO === 0) return null;
  
  return (correctiveWO / totalWO) * 100;
}

// حساب معدل الصيانة الوقائية
export function calculatePreventiveRate(workOrders: WorkOrder[], preventiveTasks: PreventiveTask[]): number | null {
  const preventiveWO = workOrders.filter(wo => wo.status === "Completed" && wo.priority !== "Critique").length;
  const totalWO = workOrders.filter(wo => wo.status === "Completed").length;
  
  if (totalWO === 0) return null;
  
  return (preventiveWO / totalWO) * 100;
}

// حساب Backlog: أوامر العمل المفتوحة
export function calculateBacklog(workOrders: WorkOrder[]): number {
  return workOrders.filter(wo => wo.status === "Open" || wo.status === "Assigned" || wo.status === "In Progress").length;
}

// حساب مؤشرات آلة واحدة
export function calculateMachineKPI(
  machine: Machine,
  breakdowns: Breakdown[],
  workOrders: WorkOrder[],
  preventiveTasks: PreventiveTask[],
  plannedHours: number
): MachineKPI {
  const machineBreakdowns = breakdowns.filter(bd => bd.machineId === machine.id);
  const machineWorkOrders = workOrders.filter(wo => wo.machineId === machine.id);
  const machinePM = preventiveTasks.filter(pm => pm.machineId === machine.id);
  
  const totalDowntime = machineBreakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const breakdownCount = machineBreakdowns.length;
  const interventionCount = machineWorkOrders.length;
  
  // MTTR: فقط من الأعطال المحلولة
  const resolvedBreakdowns = machineBreakdowns.filter(bd => bd.status === "Résolu" && bd.duration > 0);
  const mttr = resolvedBreakdowns.length > 0 
    ? resolvedBreakdowns.reduce((sum, bd) => sum + bd.duration, 0) / resolvedBreakdowns.length 
    : null;
  
  // MTBF: فقط إذا كان هناك أعطال
  const mtbf = breakdownCount > 0 && plannedHours > 0
    ? (plannedHours - totalDowntime) / breakdownCount
    : null;
  
  // Disponibilité
  const availability = plannedHours > 0
    ? ((plannedHours - totalDowntime) / plannedHours) * 100
    : null;
  
  const totalCost = 
    machineWorkOrders.reduce((sum, wo) => sum + wo.cost, 0) +
    machineBreakdowns.reduce((sum, bd) => sum + bd.cost, 0);
  
  const pmCompleted = machinePM.filter(pm => pm.lastPerformed && pm.lastPerformed !== "").length;
  const pmRate = machinePM.length > 0 ? (pmCompleted / machinePM.length) * 100 : null;
  
  const correctiveCount = machineWorkOrders.filter(wo => wo.priority === "Critique").length;
  const preventiveCount = machineWorkOrders.filter(wo => wo.priority !== "Critique").length;
  
  const correctiveRate = interventionCount > 0 ? (correctiveCount / interventionCount) * 100 : null;
  const preventiveRate = interventionCount > 0 ? (preventiveCount / interventionCount) * 100 : null;
  
  const backlog = machineWorkOrders.filter(wo => wo.status === "Open" || wo.status === "Assigned" || wo.status === "In Progress").length;
  
  return {
    machineId: machine.id,
    machineCode: machine.code,
    machineName: machine.name,
    totalDowntime,
    breakdownCount,
    interventionCount,
    totalRepairTime: resolvedBreakdowns.reduce((sum, bd) => sum + bd.duration, 0),
    mttr,
    mtbf,
    availability,
    totalCost,
    pmCount: machinePM.length,
    pmCompleted,
    pmRate,
    correctiveCount,
    preventiveCount,
    correctiveRate,
    preventiveRate,
    backlog,
    status: machine.status,
  };
}

// حساب المؤشرات العامة
export function calculateGlobalKPI(
  machines: Machine[],
  breakdowns: Breakdown[],
  workOrders: WorkOrder[],
  preventiveTasks: PreventiveTask[],
  spareParts: SparePart[],
  regulatoryControls: RegulatoryControl[],
  plannedHours: number
): GlobalKPI {
  const totalInterventions = workOrders.length;
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const totalCost = 
    workOrders.reduce((sum, wo) => sum + wo.cost, 0) +
    breakdowns.reduce((sum, bd) => sum + bd.cost, 0);
  
  const completedWO = workOrders.filter(wo => wo.status === "Completed" && wo.startTime && wo.endTime);
  const averageDuration = completedWO.length > 0
    ? completedWO.reduce((sum, wo) => {
        const start = new Date(wo.startTime).getTime();
        const end = new Date(wo.endTime).getTime();
        return sum + (end - start) / (1000 * 60 * 60);
      }, 0) / completedWO.length
    : null;
  
  const mttr = calculateMTTR(breakdowns);
  const mtbf = calculateMTBF(breakdowns, plannedHours);
  const availability = calculateAvailability(breakdowns, plannedHours);
  const backlog = calculateBacklog(workOrders);
  const pmRate = calculatePMRate(preventiveTasks);
  const correctiveRate = calculateCorrectiveRate(workOrders, breakdowns);
  const preventiveRate = calculatePreventiveRate(workOrders, preventiveTasks);
  
  const machineStatus = {
    running: machines.filter(m => m.status === "running").length,
    stopped: machines.filter(m => m.status === "stopped").length,
    maintenance: machines.filter(m => m.status === "maintenance").length,
    breakdown: machines.filter(m => m.status === "breakdown").length,
  };
  
  const alerts = {
    breakdowns: breakdowns.filter(bd => bd.status === "Ouvert").length,
    lowStock: spareParts.filter(sp => sp.currentStock < sp.minStock).length,
    overduePM: preventiveTasks.filter(pm => {
      const dueDate = new Date(pm.nextDue);
      return dueDate < new Date();
    }).length,
    overdueWO: workOrders.filter(wo => {
      if (wo.status === "Completed" || wo.status === "Closed") return false;
      const createdDate = new Date(wo.createdAt);
      const daysSince = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 7;
    }).length,
    expiringControls: regulatoryControls.filter(rc => {
      const dueDate = new Date(rc.nextDueDate);
      const daysUntil = (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntil < 30;
    }).length,
  };
  
  return {
    totalInterventions,
    totalDowntime,
    totalCost,
    averageDuration: averageDuration || 0,
    mttr,
    mtbf,
    availability,
    backlog,
    pmRate,
    correctiveRate,
    preventiveRate,
    breakdownCount: breakdowns.length,
    machineStatus,
    alerts,
  };
}

// تنسيق القيم
export function formatKPIValue(value: number | null, unit: string = ""): string {
  if (value === null || value === undefined) return "Données insuffisantes";
  if (isNaN(value)) return "Données insuffisantes";
  
  if (unit === "%") return `${value.toFixed(1)}%`;
  if (unit === "h") return `${value.toFixed(1)}h`;
  if (unit === "€") return `${value.toLocaleString()} DA`;
  
  return value.toFixed(1);
}
