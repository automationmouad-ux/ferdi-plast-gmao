import type { Machine, WorkOrder, Breakdown, PreventiveTask, SparePart } from "@/types";

// Local storage based sync service
export class SyncService {
  private static instance: SyncService;

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  startAutoSync() {
    return;
  }

  stopAutoSync() {
    return;
  }

  async syncAll() {
    return;
  }

  private saveToLocalStorage(key: string, data: any) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  private loadFromLocalStorage(key: string): any | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return null;
    }
  }

  async pushMachine(machine: Machine) {
    const machines = this.loadFromLocalStorage("machines") || [];
    const index = machines.findIndex((m: Machine) => m.id === machine.id);
    if (index >= 0) {
      machines[index] = machine;
    } else {
      machines.push(machine);
    }
    this.saveToLocalStorage("machines", machines);
  }

  async pushWorkOrder(workOrder: WorkOrder) {
    const workOrders = this.loadFromLocalStorage("workOrders") || [];
    const index = workOrders.findIndex((w: WorkOrder) => w.id === workOrder.id);
    if (index >= 0) {
      workOrders[index] = workOrder;
    } else {
      workOrders.push(workOrder);
    }
    this.saveToLocalStorage("workOrders", workOrders);
  }

  async pushBreakdown(breakdown: Breakdown) {
    const breakdowns = this.loadFromLocalStorage("breakdowns") || [];
    const index = breakdowns.findIndex((b: Breakdown) => b.id === breakdown.id);
    if (index >= 0) {
      breakdowns[index] = breakdown;
    } else {
      breakdowns.push(breakdown);
    }
    this.saveToLocalStorage("breakdowns", breakdowns);
  }

  async pushPreventiveTask(task: PreventiveTask) {
    const tasks = this.loadFromLocalStorage("preventiveTasks") || [];
    const index = tasks.findIndex((t: PreventiveTask) => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    this.saveToLocalStorage("preventiveTasks", tasks);
  }

  async pushSparePart(part: SparePart) {
    const parts = this.loadFromLocalStorage("spareParts") || [];
    const index = parts.findIndex((p: SparePart) => p.id === part.id);
    if (index >= 0) {
      parts[index] = part;
    } else {
      parts.push(part);
    }
    this.saveToLocalStorage("spareParts", parts);
  }

  exportBackup(): string {
    const data = {
      machines: this.loadFromLocalStorage("machines") || [],
      workOrders: this.loadFromLocalStorage("workOrders") || [],
      breakdowns: this.loadFromLocalStorage("breakdowns") || [],
      preventiveTasks: this.loadFromLocalStorage("preventiveTasks") || [],
      spareParts: this.loadFromLocalStorage("spareParts") || [],
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  importBackup(json: string): boolean {
    try {
      const data = JSON.parse(json);
      if (data.machines) this.saveToLocalStorage("machines", data.machines);
      if (data.workOrders) this.saveToLocalStorage("workOrders", data.workOrders);
      if (data.breakdowns) this.saveToLocalStorage("breakdowns", data.breakdowns);
      if (data.preventiveTasks) this.saveToLocalStorage("preventiveTasks", data.preventiveTasks);
      if (data.spareParts) this.saveToLocalStorage("spareParts", data.spareParts);
      return true;
    } catch (error) {
      console.error("Error importing backup:", error);
      return false;
    }
  }
}

export const syncService = SyncService.getInstance();
export const isSupabaseConfigured = false;