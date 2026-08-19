import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Download, Printer } from "lucide-react";
import { useState } from "react";

export function Reports() {
  const { machines, workOrders, breakdowns, spareParts, preventiveTasks, regulatoryControls } = useApp();
  const { t } = useI18n();
  const [reportType, setReportType] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const generateReport = () => {
    const reportData = {
      type: reportType,
      startDate,
      endDate,
      machines: machines.length,
      workOrders: workOrders.length,
      breakdowns: breakdowns.length,
      spareParts: spareParts.length,
      preventiveTasks: preventiveTasks.length,
      regulatoryControls: regulatoryControls.length,
      totalCost: breakdowns.reduce((sum, bd) => sum + bd.cost, 0) + workOrders.reduce((sum, wo) => sum + wo.cost, 0),
      totalDowntime: breakdowns.reduce((sum, bd) => sum + bd.duration, 0),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-${reportType}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const reportTypes = [
    { value: "daily", label: t("dailyReport") },
    { value: "weekly", label: t("weeklyReport") },
    { value: "monthly", label: t("monthlyReport") },
    { value: "annual", label: t("annualReport") },
    { value: "breakdown", label: t("breakdownReport") },
    { value: "intervention", label: t("interventionReport") },
    { value: "pm", label: t("pmReport") },
    { value: "stock", label: t("stockReport") },
    { value: "kpi", label: t("kpiReport") },
    { value: "hse", label: t("hseReport") },
    { value: "regulatory", label: t("regulatoryReport") },
    { value: "process", label: t("processReport") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t("reports")}</h2>
        <p className="text-sm text-slate-500">{t("generateReport")}</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            {t("generateReport")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>{t("reportPeriod")}</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((rt) => (
                    <SelectItem key={rt.value} value={rt.value}>
                      {rt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("startDate")}</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("endDate")}</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={generateReport} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                <Download className="h-4 w-4 mr-2" />
                {t("export")}
              </Button>
              <Button onClick={printReport} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                {t("print")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">{t("totalMachines")}</p>
            <p className="text-2xl font-bold text-slate-900">{machines.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">{t("totalBreakdowns")}</p>
            <p className="text-2xl font-bold text-slate-900">{breakdowns.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">{t("totalDowntime")}</p>
            <p className="text-2xl font-bold text-slate-900">
              {breakdowns.reduce((sum, bd) => sum + bd.duration, 0).toFixed(1)}h
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">{t("totalCost")}</p>
            <p className="text-2xl font-bold text-slate-900">
              {(breakdowns.reduce((sum, bd) => sum + bd.cost, 0) + workOrders.reduce((sum, wo) => sum + wo.cost, 0)).toFixed(0)} DA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Preview */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">{t("details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("type")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("totalBreakdowns")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("totalDowntime")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("totalCost")}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3">{t("breakdowns")}</td>
                  <td className="py-2 px-3">{breakdowns.length}</td>
                  <td className="py-2 px-3">{breakdowns.reduce((sum, bd) => sum + bd.duration, 0).toFixed(1)}h</td>
                  <td className="py-2 px-3">{breakdowns.reduce((sum, bd) => sum + bd.cost, 0).toFixed(0)} DA</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3">{t("workOrders")}</td>
                  <td className="py-2 px-3">{workOrders.length}</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">{workOrders.reduce((sum, wo) => sum + wo.cost, 0).toFixed(0)} DA</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3">{t("preventiveMaintenance")}</td>
                  <td className="py-2 px-3">{preventiveTasks.length}</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">-</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3">{t("spareParts")}</td>
                  <td className="py-2 px-3">{spareParts.length}</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">{spareParts.reduce((sum, sp) => sum + sp.price * sp.currentStock, 0).toFixed(0)} DA</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">{t("regulatoryControls")}</td>
                  <td className="py-2 px-3">{regulatoryControls.length}</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
