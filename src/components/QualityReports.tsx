import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Printer, TrendingUp, Activity, Gauge } from "lucide-react";

export function QualityReports() {
  const { machines, workOrders, breakdowns, preventiveTasks, spareParts } = useApp();
  const [period, setPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("reliability");

  // Calculate KPIs
  const totalMachines = machines.length;
  const totalBreakdowns = breakdowns.length;
  const totalDowntime = breakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const totalWorkOrders = workOrders.length;
  const completedWorkOrders = workOrders.filter((wo) => wo.status === "Terminé" || wo.status === "Fermé").length;
  const preventiveCompleted = preventiveTasks.filter((task) => {
    const nextDue = new Date(task.nextDue);
    const now = new Date();
    return nextDue > now;
  }).length;

  // Calculate MTTR, MTBF, Availability
  const mttr = totalBreakdowns > 0 ? totalDowntime / totalBreakdowns : 0;
  const mtbf = totalBreakdowns > 0 ? (30 * 24 - totalDowntime) / totalBreakdowns : 30 * 24;
  const availability = ((30 * 24 - totalDowntime) / (30 * 24)) * 100;
  const preventiveRate = totalWorkOrders > 0 ? (preventiveCompleted / totalWorkOrders) * 100 : 0;
  const workOrderCompletionRate = totalWorkOrders > 0 ? (completedWorkOrders / totalWorkOrders) * 100 : 0;

  // Low stock parts
  const lowStockParts = spareParts.filter((sp) => sp.currentStock < sp.minStock);

  const generatePDF = () => {
    const reportContent = `
      FERDI PLAST - GMAO PRO
      Rapport de Qualité - ${period}
      Type: ${reportType}
      Date: ${new Date().toLocaleDateString("fr-FR")}
      
      =================================
      INDICATEURS DE PERFORMANCE
      =================================
      
      Disponibilité: ${availability.toFixed(1)}%
      MTTR: ${mttr.toFixed(2)} heures
      MTBF: ${mtbf.toFixed(2)} heures
      Taux de prévention: ${preventiveRate.toFixed(1)}%
      Taux de réalisation: ${workOrderCompletionRate.toFixed(1)}%
      
      =================================
      DONNÉES DÉTAILLÉES
      =================================
      
      Machines totales: ${totalMachines}
      Pannes enregistrées: ${totalBreakdowns}
      Temps d'arrêt total: ${totalDowntime} heures
      Ordres de travail: ${totalWorkOrders}
      Ordres complétés: ${completedWorkOrders}
      
      =================================
      PIÈCES DE RECHANGE
      =================================
      
      Pièces en stock faible: ${lowStockParts.length}
      ${lowStockParts.map((p) => `- ${p.code}: ${p.currentStock}/${p.minStock}`).join("\n")}
      
      =================================
      RAPPORT GÉNÉRÉ AUTOMATIQUEMENT
      =================================
      FERDI PLAST GMAO PRO - Système de Gestion de Maintenance
    `;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-qualite-${reportType}-${period}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const exportExcel = () => {
    const csvContent = [
      ["Indicateur", "Valeur", "Unité"],
      ["Disponibilité", availability.toFixed(1), "%"],
      ["MTTR", mttr.toFixed(2), "heures"],
      ["MTBF", mtbf.toFixed(2), "heures"],
      ["Taux préventif", preventiveRate.toFixed(1), "%"],
      ["Taux correctif", (100 - preventiveRate).toFixed(1), "%"],
      ["Taux réalisation", workOrderCompletionRate.toFixed(1), "%"],
      ["Nombre de pannes", totalBreakdowns, ""],
      ["Temps d'arrêt", totalDowntime, "heures"],
      ["Machines", totalMachines, ""],
      ["Ordres de travail", totalWorkOrders, ""],
      ["Ordres complétés", completedWorkOrders, ""],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kpi-${reportType}-${period}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">تقارير الجودة</h2>
        <p className="text-sm text-slate-500">تقارير الاعتمادية ومؤشرات الأداء - ISO 9001</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            إعدادات التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">الفترة</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">يومي</SelectItem>
                  <SelectItem value="weekly">أسبوعي</SelectItem>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">نوع التقرير</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reliability">الاعتمادية</SelectItem>
                  <SelectItem value="kpi">مؤشرات الأداء</SelectItem>
                  <SelectItem value="maintenance">الصيانة</SelectItem>
                  <SelectItem value="stock">المخزون</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={generatePDF} className="bg-amber-500 hover:bg-amber-600 text-slate-900 flex-1">
                <Download className="h-4 w-4 ml-2" />
                تصدير PDF
              </Button>
              <Button variant="outline" onClick={exportExcel} className="flex-1">
                <FileText className="h-4 w-4 ml-2" />
                Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Disponibilité</p>
                <p className="text-2xl font-bold text-emerald-600">{availability.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">MTTR</p>
                <p className="text-2xl font-bold text-slate-900">{mttr.toFixed(2)}h</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gauge className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">MTBF</p>
                <p className="text-2xl font-bold text-slate-900">{mtbf.toFixed(2)}h</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Taux préventif</p>
                <p className="text-2xl font-bold text-slate-900">{preventiveRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-medium">تفاصيل المؤشرات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Taux de réalisation PM</span>
              <Badge className="bg-emerald-100 text-emerald-700">
                {workOrderCompletionRate.toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Nombre de pannes</span>
              <Badge className="bg-red-100 text-red-700">{totalBreakdowns}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Temps d'arrêt total</span>
              <Badge className="bg-orange-100 text-orange-700">{totalDowntime} heures</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Pièces en stock faible</span>
              <Badge className="bg-yellow-100 text-yellow-700">{lowStockParts.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}