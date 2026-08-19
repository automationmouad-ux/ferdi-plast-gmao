import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, Clock, Activity, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

export function KPIs() {
  const { machines, breakdowns, workOrders, preventiveTasks } = useApp();

  // حساب مؤشرات الأداء من البيانات الفعلية
  const totalBreakdowns = breakdowns.length;
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const totalRepairTime = breakdowns
    .filter((bd) => bd.status === "Résolu")
    .reduce((sum, bd) => sum + bd.duration, 0);
  
  const mttr = totalBreakdowns > 0 ? totalRepairTime / totalBreakdowns : 0;
  const mtbf = totalBreakdowns > 0 ? (720 - totalDowntime) / totalBreakdowns : 720;
  const availability = 720 > 0 ? ((720 - totalDowntime) / 720) * 100 : 0;
  
  const preventiveCount = workOrders.filter((wo) => wo.type === "Préventif").length;
  const correctiveCount = workOrders.filter((wo) => wo.type === "Correctif").length;
  const totalOrders = workOrders.length;
  const preventiveRate = totalOrders > 0 ? (preventiveCount / totalOrders) * 100 : 0;
  const correctiveRate = totalOrders > 0 ? (correctiveCount / totalOrders) * 100 : 0;
  
  const pmCompleted = preventiveTasks.filter((task) => {
    const nextDue = new Date(task.nextDue);
    const now = new Date();
    return nextDue < now;
  }).length;
  const pmRate = preventiveTasks.length > 0 ? (pmCompleted / preventiveTasks.length) * 100 : 0;

  const totalCost = breakdowns.reduce((sum, bd) => sum + bd.cost, 0) + 
    workOrders.reduce((sum, wo) => sum + wo.cost, 0);

  const criticalMachines = machines.filter((m) => m.criticality === "Critique").length;

  const kpiData = [
    {
      name: "MTBF",
      label: "متوسط الوقت بين الأعطال",
      value: mtbf.toFixed(1),
      unit: "ساعة",
      target: 150,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      name: "MTTR",
      label: "متوسط وقت الإصلاح",
      value: mttr.toFixed(1),
      unit: "ساعة",
      target: 4,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      name: "Disponibilité",
      label: "نسبة التوفر",
      value: availability.toFixed(1),
      unit: "%",
      target: 97,
      icon: Percent,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      name: "Taux préventif",
      label: "نسبة الصيانة الوقائية",
      value: preventiveRate.toFixed(1),
      unit: "%",
      target: 70,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      name: "Taux correctif",
      label: "نسبة الصيانة التصحيحية",
      value: correctiveRate.toFixed(1),
      unit: "%",
      target: 30,
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      name: "Taux réalisation PM",
      label: "نسبة إنجاز الصيانة الوقائية",
      value: pmRate.toFixed(1),
      unit: "%",
      target: 90,
      icon: BarChart3,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const getStatus = (value: number, target: number, isLowerBetter = false) => {
    if (isLowerBetter) {
      return value <= target ? "good" : value <= target * 1.2 ? "warning" : "danger";
    }
    return value >= target ? "good" : value >= target * 0.8 ? "warning" : "danger";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">مؤشرات الأداء</h2>
        <p className="text-sm text-slate-500">مؤشرات الصيانة - جانفي 2026</p>
      </div>

      {/* بطاقات مؤشرات الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          const status = getStatus(parseFloat(kpi.value), kpi.target, kpi.name === "MTTR" || kpi.name === "Taux correctif");
          
          return (
            <Card key={kpi.name} className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", kpi.bg)}>
                      <Icon className={cn("h-5 w-5", kpi.color)} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600">{kpi.label}</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {kpi.value}
                        <span className="text-sm font-normal text-slate-500 mr-1">{kpi.unit}</span>
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      status === "good" && "bg-emerald-100 text-emerald-700",
                      status === "warning" && "bg-amber-100 text-amber-700",
                      status === "danger" && "bg-red-100 text-red-700"
                    )}
                  >
                    {status === "good" ? "🟢" : status === "warning" ? "🟠" : "🔴"}
                  </Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>الهدف: {kpi.target}</span>
                    <span>الحالي: {kpi.value}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        status === "good" && "bg-emerald-500",
                        status === "warning" && "bg-amber-500",
                        status === "danger" && "bg-red-500"
                      )}
                      style={{
                        width: `${Math.min((parseFloat(kpi.value) / kpi.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* إحصائيات إضافية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">عدد الأعطال</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalBreakdowns}</p>
            <p className="text-xs text-slate-400 mt-1">هذا الشهر</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">مدة التوقف</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalDowntime.toFixed(1)} ساعة</p>
            <p className="text-xs text-slate-400 mt-1">إجمالي التوقفات</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">تكلفة الصيانة</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalCost.toFixed(0)} دج</p>
            <p className="text-xs text-slate-400 mt-1">أعطال + تدخلات</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">الآلات الحرجة</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{criticalMachines}</p>
            <p className="text-xs text-slate-400 mt-1">أهمية حرجة</p>
          </CardContent>
        </Card>
      </div>

      {/* تحليل باريتو */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">تحليل باريتو للأعطال</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { type: "ميكانيكي", key: "Mécanique" },
              { type: "كهربائي", key: "Électrique" },
              { type: "هوائي", key: "Pneumatique" },
              { type: "هيدروليكي", key: "Hydraulique" },
              { type: "آخر", key: "Autre" },
            ].map((item, index) => {
              const count = breakdowns.filter((bd) => bd.type === item.key).length;
              const percentage = totalBreakdowns > 0 ? (count / totalBreakdowns) * 100 : 0;
              const colors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-slate-400"];
              
              return (
                <div key={item.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{item.type}</span>
                    <span className="text-slate-500">{percentage.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", colors[index])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}