// نظام الصلاحيات الكامل

export type Role = "admin" | "manager" | "technician" | "viewer";

export type Permission = 
  | "canView"
  | "canCreate"
  | "canEdit"
  | "canDelete"
  | "canApprove"
  | "canExport";

export interface ModulePermissions {
  [module: string]: {
    [permission in Permission]?: boolean;
  };
}

// تسميات الأدوار بالعربية
export const roleLabels: Record<Role, string> = {
  admin: "مدير النظام",
  manager: "مسؤول الصيانة",
  technician: "فني",
  viewer: "مشاهد",
};

// وصف الأدوار
export const roleDescriptions: Record<Role, string> = {
  admin: "صلاحيات كاملة على جميع وحدات النظام",
  manager: "إدارة الصيانة والمؤشرات والتقارير",
  technician: "إنشاء وتعديل التدخلات وأوامر العمل",
  viewer: "قراءة فقط بدون تعديل",
};

export const rolePermissions: Record<Role, ModulePermissions> = {
  admin: {
    dashboard: { canView: true },
    machines: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    workOrders: { canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true, canExport: true },
    preventiveMaintenance: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    spareParts: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    breakdowns: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
    kpis: { canView: true, canExport: true },
    users: { canView: true, canCreate: true, canEdit: true, canDelete: true },
    auditLogs: { canView: true, canExport: true },
    reports: { canView: true, canExport: true },
    systemTest: { canView: true },
    regulatoryControls: { canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
  },
  manager: {
    dashboard: { canView: true },
    machines: { canView: true, canCreate: true, canEdit: true, canExport: true },
    workOrders: { canView: true, canCreate: true, canEdit: true, canApprove: true, canExport: true },
    preventiveMaintenance: { canView: true, canCreate: true, canEdit: true, canExport: true },
    spareParts: { canView: true, canCreate: true, canEdit: true, canExport: true },
    breakdowns: { canView: true, canCreate: true, canEdit: true, canExport: true },
    kpis: { canView: true, canExport: true },
    users: { canView: true },
    auditLogs: { canView: true, canExport: true },
    reports: { canView: true, canExport: true },
    systemTest: { canView: true },
    regulatoryControls: { canView: true, canCreate: true, canEdit: true, canExport: true },
  },
  technician: {
    dashboard: { canView: true },
    machines: { canView: true },
    workOrders: { canView: true, canCreate: true, canEdit: true },
    preventiveMaintenance: { canView: true, canCreate: true, canEdit: true },
    spareParts: { canView: true },
    breakdowns: { canView: true, canCreate: true, canEdit: true },
    kpis: { canView: true },
    users: { canView: false },
    auditLogs: { canView: false },
    reports: { canView: true },
    systemTest: { canView: false },
    regulatoryControls: { canView: true },
  },
  viewer: {
    dashboard: { canView: true },
    machines: { canView: true },
    workOrders: { canView: true },
    preventiveMaintenance: { canView: true },
    spareParts: { canView: true },
    breakdowns: { canView: true },
    kpis: { canView: true },
    users: { canView: false },
    auditLogs: { canView: false },
    reports: { canView: true },
    systemTest: { canView: false },
    regulatoryControls: { canView: true },
  },
};

export function hasPermission(role: Role, module: string, permission: Permission): boolean {
  const rolePerms = rolePermissions[role];
  if (!rolePerms) return false;
  
  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;
  
  return modulePerms[permission] || false;
}

export function canUser(role: Role, module: string, action: "view" | "create" | "edit" | "delete" | "approve" | "export"): boolean {
  const permissionMap: Record<string, Permission> = {
    view: "canView",
    create: "canCreate",
    edit: "canEdit",
    delete: "canDelete",
    approve: "canApprove",
    export: "canExport",
  };
  
  return hasPermission(role, module, permissionMap[action]);
}