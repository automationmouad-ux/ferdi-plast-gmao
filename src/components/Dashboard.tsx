import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, AlertTriangle, CalendarClock, Package, TrendingUp, Activity, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const { machines, workOrders, breakdowns, spareParts, preventiveTasks } = useApp();
  const { t } = useI18n();

  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const totalCost = breakdowns.reduce((sum, bd) => sum + bd.cost, 0) + workOrders.reduce((sum, wo) => sum + wo.cost, 0);
  const criticalMachines = machines.filter((m) => m.criticality === "Critique").length;
  const openWorkOrders = workOrders.filter((wo) => wo.status === "Ouvert" || wo.status === "En cours").length;
  const lowStockParts = spareParts.filter((sp) => sp.currentStock < sp.minStock).length;
  const overduePM = preventiveTasks.filter((task) => {
    const nextDate = new Date(task.nextDue);
    return nextDate < new Date() && task.status !== "Terminé";
  }).length;

  const mttr = breakdowns.length > 0 ? totalDowntime / breakdowns.length : 0;
  const mtbf = breakdowns.length > 0 ? machines.reduce((sum, m) => sum + m.operatingHours, 0) / breakdowns.length : 0;
  const availability = machines.length > 0 ? ((machines.reduce((sum, m) => sum + m.operatingHours, 0) - totalDowntime) / machines.reduce((sum, m) => sum + m.operatingHours, 0)) * 100 : 0;

  const stats = [
    { label: t("totalMachines"), value: machines.length, icon: Wrench, color: "bg-amber-100 text-amber-600" },
    { label: t("totalBreakdowns"), value: breakdowns.length, icon: AlertTriangle, color: "bg-red-100 text-red-600" },
    { label: t("totalDowntime"), value: `${totalDowntime.toFixed(1)}h`, icon: Clock, color: "bg-orange-100 text-orange-600" },
    { label: t("totalCost"), value: `${totalCost.toFixed(0)} DA`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  ];

  const kpis = [
    { label: t("mttr"), value: `${mttr.toFixed(1)}h`, icon: Activity, color: "text-blue-600" },
    { label: t("mtbf"), value: `${mtbf.toFixed(0)}h`, icon: TrendingUp, color: "text-emerald-600" },
    { label: t("availability"), value: `${availability.toFixed(1)}%`, icon: TrendingUp, color: "text-amber-600" },
    { label: t("criticalMachines"), value: criticalMachines, icon: AlertTriangle, color: "text-red-600" },
  ];

  const alerts = [
    { type: "warning", count: openWorkOrders, label: t("workOrders") },
    { type: "danger", count: lowStockParts, label: t("stockAlert") },
    { type: "warning", count: overduePM, label: t("pmOverdue") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t("dashboard")}</h2>
        <p className="text-sm text-slate-500">{t("welcome")} FERDI PLAST</p>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {alerts.map((alert, index) => (
          <Card key={index} className={cn(
            "border shadow-sm",
            alert.type === "danger" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
          )}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{alert.label}</p>
                <p className="text-2xl font-bold text-slate-900">{alert.count}</p>
              </div>
              <Badge className={cn(
                alert.type === "danger" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
              )}>
                {alert.type === "danger" ? t("danger") : t("warning")}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <kpi.icon className={cn("h-5 w-5", kpi.color)} />
                <div>
                  <p className="text-sm text-slate-500">{kpi.label}</p>
                  <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("workOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workOrders.slice(0, 5).map((wo) => {
                const machine = machines.find((m) => m.id === wo.machineId);
                return (
                  <div key={wo.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{wo.title}</p>
                      <p className="text-xs text-slate-500">{machine?.name} • {wo.status}</p>
                    </div>
                    <Badge className={cn(
                      wo.priority === "Critique" && "bg-red-100 text-red-700",
                      wo.priority === "Haute" && "bg-orange-100 text-orange-700",
                      wo.priority === "Moyenne" && "bg-yellow-100 text-yellow-700",
                      wo.priority === "Basse" && "bg-green-100 text-green-700"
                    )}>
                      {wo.priority}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("breakdowns")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakdowns.slice(0, 5).map((bd) => {
                const machine = machines.find((m) => m.id === bd.machineId);
                return (
                  <div key={bd.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{machine?.name}</p>
                      <p className="text-xs text-slate-500">{bd.type} • {bd.duration}h</p>
                    </div>
                    <Badge className={cn(
                      bd.status === "Résolu" && "bg-emerald-100 text-emerald-700",
                      bd.status === "En cours" && "bg-amber-100 text-amber-700",
                      bd.status === "Ouvert" && "bg-red-100 text-red-700"
                    )}>
                      {bd.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
