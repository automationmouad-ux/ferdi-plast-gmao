import { LayoutDashboard, Wrench, ClipboardList, CalendarCheck, Package, AlertTriangle, BarChart3, Users, History, ShieldCheck, FileText, TestTube2, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "dashboard" | "machines" | "workorders" | "pm" | "spareparts" | "breakdowns" | "kpis" | "users" | "audit" | "reports" | "test" | "regulatory";

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  canViewMachines: boolean;
  canViewWorkOrders: boolean;
  canViewPM: boolean;
  canViewSpareParts: boolean;
  canViewBreakdowns: boolean;
  canViewKPIs: boolean;
  canViewUsers: boolean;
  canViewAudit: boolean;
  canViewReports: boolean;
  canViewTest: boolean;
  canViewRegulatory: boolean;
}

export function Sidebar({
  currentView,
  onNavigate,
  canViewMachines,
  canViewWorkOrders,
  canViewPM,
  canViewSpareParts,
  canViewBreakdowns,
  canViewKPIs,
  canViewUsers,
  canViewAudit,
  canViewReports,
  canViewTest,
  canViewRegulatory,
}: SidebarProps) {
  const navItems = [
    { id: "dashboard" as View, label: "لوحة القيادة", icon: LayoutDashboard, visible: true },
    { id: "machines" as View, label: "الآلات والمعدات", icon: Wrench, visible: canViewMachines },
    { id: "workorders" as View, label: "أوامر العمل", icon: ClipboardList, visible: canViewWorkOrders },
    { id: "pm" as View, label: "الصيانة الوقائية", icon: CalendarCheck, visible: canViewPM },
    { id: "spareparts" as View, label: "قطع الغيار", icon: Package, visible: canViewSpareParts },
    { id: "breakdowns" as View, label: "الأعطال", icon: AlertTriangle, visible: canViewBreakdowns },
    { id: "kpis" as View, label: "مؤشرات الأداء", icon: BarChart3, visible: canViewKPIs },
    { id: "regulatory" as View, label: "المراقبات التنظيمية", icon: ClipboardCheck, visible: canViewRegulatory },
    { id: "reports" as View, label: "التقارير", icon: FileText, visible: canViewReports },
    { id: "users" as View, label: "المستخدمين", icon: Users, visible: canViewUsers },
    { id: "audit" as View, label: "سجل التدقيق", icon: History, visible: canViewAudit },
    { id: "test" as View, label: "اختبار النظام", icon: TestTube2, visible: canViewTest },
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.filter((item) => item.visible).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-amber-600" : "text-slate-400")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-4">
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-medium text-slate-700">عملية الصيانة MNT-PS-02</p>
          </div>
          <p className="text-xs text-slate-500">بطاقة تعريف عملية الصيانة</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-xs text-emerald-600 font-medium">مطابق للمعايير</span>
          </div>
        </div>
      </div>
    </aside>
  );
}