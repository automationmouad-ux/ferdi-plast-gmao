// حساب مؤشرات الأداء من البيانات الحقيقية

import { Machine, Breakdown, WorkOrder, PreventiveTask, MaintenanceKPIs, MachineKPI } from "@/types";

const OPERATING_HOURS_PER_DAY = 24;
const DAYS_PER_MONTH = 30;
const TOTAL_MONTHLY_HOURS = OPERATING_HOURS_PER_DAY * DAYS_PER_MONTH;

export function calculateMaintenanceKPIs(
  machines: Machine[],
  breakdowns: Breakdown[],
  workOrders: WorkOrder[],
  preventiveTasks: PreventiveTask[]
): MaintenanceKPIs {
  // إجمالي وقت التوقف
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);

  // عدد التدخلات (أوامر العمل + الأعطال)
  const totalInterventions = workOrders.length + breakdowns.length;

  // متوسط مدة التدخل
  const averageInterventionDuration = totalInterventions > 0 
    ? totalDowntime / totalInterventions 
    : 0;

  // إجمالي تكلفة الصيانة
  const totalMaintenanceCost = 
    workOrders.reduce((sum, wo) => sum + wo.cost, 0) +
    breakdowns.reduce((sum, bd) => sum + bd.cost, 0);

  // MTTR = إجمالي زمن الإصلاح ÷ عدد الأعطال
  const breakdownCount = breakdowns.length;
  const mttr = breakdownCount > 0 ? totalDowntime / breakdownCount : 0;

  // MTBF = زمن التشغيل ÷ عدد الأعطال
  const totalOperatingTime = machines.length * TOTAL_MONTHLY_HOURS;
  const mtbf = breakdownCount > 0 ? totalOperatingTime / breakdownCount : totalOperatingTime;

  // Disponibilité = (Temps planifié - Temps arrêt) / Temps planifié × 100
  const plannedTime = machines.length * TOTAL_MONTHLY_HOURS;
  const operatingTime = plannedTime - totalDowntime;
  const availability = plannedTime > 0 ? (operatingTime / plannedTime) * 100 : 0;

  // Taux maintenance préventive
  const preventiveWorkOrders = workOrders.filter(wo => 
    wo.title.toLowerCase().includes("préventif") || 
    wo.title.toLowerCase().includes("preventive")
  ).length;
  const preventiveRate = workOrders.length > 0 ? (preventiveWorkOrders / workOrders.length) * 100 : 0;

  // Taux maintenance corrective
  const correctiveRate = 100 - preventiveRate;

  // Taux réalisation PM
  const completedPM = preventiveTasks.filter(task => {
    const nextDue = new Date(task.nextDue);
    return nextDue < new Date();
  }).length;
  const pmCompletionRate = preventiveTasks.length > 0 
    ? ((preventiveTasks.length - completedPM) / preventiveTasks.length) * 100 
    : 0;

  // Backlog (أوامر العمل المفتوحة)
  const backlog = workOrders.filter(wo => 
    wo.status === "Open" || wo.status === "Assigned" || wo.status === "In Progress"
  ).length;

  // التحقق من كفاية البيانات
  const dataSufficient = breakdownCount >= 3 && machines.length > 0;

  return {
    totalDowntime,
    totalInterventions,
    averageInterventionDuration,
    totalMaintenanceCost,
    mttr,
    mtbf,
    availability,
    preventiveRate,
    correctiveRate,
    pmCompletionRate,
    backlog,
    plannedTime,
    operatingTime,
    breakdownCount,
    dataSufficient,
  };
}

export function calculateMachineKPIs(
  machines: Machine[],
  breakdowns: Breakdown[],
  workOrders: WorkOrder[]
): MachineKPI[] {
  return machines.map(machine => {
    const machineBreakdowns = breakdowns.filter(bd => bd.machineId === machine.id);
    const machineWorkOrders = workOrders.filter(wo => wo.machineId === machine.id);
    
    const breakdownCount = machineBreakdowns.length;
    const totalDowntime = machineBreakdowns.reduce((sum, bd) => sum + bd.duration, 0);
    
    // MTTR لكل آلة
    const mttr = breakdownCount > 0 ? totalDowntime / breakdownCount : 0;
    
    // MTBF لكل آلة
    const machineOperatingTime = TOTAL_MONTHLY_HOURS;
    const mtbf = breakdownCount > 0 ? machineOperatingTime / breakdownCount : machineOperatingTime;
    
    // Disponibilité لكل آلة
    const availability = machineOperatingTime > 0 
      ? ((machineOperatingTime - totalDowntime) / machineOperatingTime) * 100 
      : 100;
    
    // تكلفة الصيانة لكل آلة
    const maintenanceCost = 
      machineWorkOrders.reduce((sum, wo) => sum + wo.cost, 0) +
      machineBreakdowns.reduce((sum, bd) => sum + bd.cost, 0);

    return {
      machineId: machine.id,
      machineName: machine.name,
      breakdownCount,
      totalDowntime,
      mttr,
      mtbf,
      availability,
      maintenanceCost,
    };
  });
}

export function calculateMonthlyKPIs(
  breakdowns: Breakdown[],
  workOrders: WorkOrder[],
  month: number,
  year: number
) {
  const monthBreakdowns = breakdowns.filter(bd => {
    const date = new Date(bd.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const monthWorkOrders = workOrders.filter(wo => {
    const date = new Date(wo.createdAt);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const totalDowntime = monthBreakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const breakdownCount = monthBreakdowns.length;
  const mttr = breakdownCount > 0 ? totalDowntime / breakdownCount : 0;
  const mtbf = breakdownCount > 0 ? TOTAL_MONTHLY_HOURS / breakdownCount : TOTAL_MONTHLY_HOURS;
  const availability = TOTAL_MONTHLY_HOURS > 0 
    ? ((TOTAL_MONTHLY_HOURS - totalDowntime) / TOTAL_MONTHLY_HOURS) * 100 
    : 100;
  const totalCost = 
    monthWorkOrders.reduce((sum, wo) => sum + wo.cost, 0) +
    monthBreakdowns.reduce((sum, bd) => sum + bd.cost, 0);

  return {
    month,
    year,
    breakdownCount,
    totalDowntime,
    mttr,
    mtbf,
    availability,
    totalCost,
    workOrderCount: monthWorkOrders.length,
  };
}