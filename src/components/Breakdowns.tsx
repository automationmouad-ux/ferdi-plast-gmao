import { useState } from "react";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Breakdown } from "@/types";
import { cn } from "@/lib/utils";

export function Breakdowns() {
  const { breakdowns, machines, addBreakdown } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Breakdown>>({});

  const filteredBreakdowns = breakdowns.filter(
    (bd) =>
      bd.cause.toLowerCase().includes(search.toLowerCase()) ||
      bd.type.toLowerCase().includes(search.toLowerCase()) ||
      bd.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

    const newBreakdown: Breakdown = {
      id: `BD-${String(breakdowns.length + 1).padStart(3, "0")}`,
      machineId: formData.machineId || "",
      date: formData.date || new Date().toISOString().split("T")[0],
      startTime: formData.startTime || "08:00",
      endTime: formData.endTime || "12:00",
      duration: duration,
      type: formData.type || "Mécanique",
      cause: formData.cause || "",
      symptom: formData.symptom || "",
      diagnosis: formData.diagnosis || "",
      correctiveAction: formData.correctiveAction || "",
      technician: formData.technician || "",
      partsUsed: [],
      cost: formData.cost || 0,
      criticality: formData.criticality || "Moyenne",
      status: "Ouvert",
    };
    addBreakdown(newBreakdown);
    setIsDialogOpen(false);
    setFormData({});
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Mécanique": return t("mechanical");
      case "Électrique": return t("electrical");
      case "Pneumatique": return t("pneumatic");
      case "Hydraulique": return t("hydraulic");
      default: return t("other");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("breakdowns")}</h2>
          <p className="text-sm text-slate-500">{t("breakdownManagement")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("declareBreakdown")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("declareBreakdown")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>{t("machine")}</Label>
                <Select
                  value={formData.machineId || ""}
                  onValueChange={(value) => setFormData({ ...formData, machineId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("machine")} />
                  </SelectTrigger>
                  <SelectContent>
                    {machines.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.code} - {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("date")}</Label>
                <Input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("breakdownType")}</Label>
                <Select
                  value={formData.type || "Mécanique"}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mécanique">{t("mechanical")}</SelectItem>
                    <SelectItem value="Électrique">{t("electrical")}</SelectItem>
                    <SelectItem value="Pneumatique">{t("pneumatic")}</SelectItem>
                    <SelectItem value="Hydraulique">{t("hydraulic")}</SelectItem>
                    <SelectItem value="Autre">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("startTime")}</Label>
                <Input
                  type="time"
                  value={formData.startTime || "08:00"}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("endTime")}</Label>
                <Input
                  type="time"
                  value={formData.endTime || "12:00"}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("cause")}</Label>
                <Input
                  value={formData.cause || ""}
                  onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
                  placeholder={t("cause")}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("symptom")}</Label>
                <Textarea
                  value={formData.symptom || ""}
                  onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                  placeholder={t("symptom")}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("diagnosis")}</Label>
                <Textarea
                  value={formData.diagnosis || ""}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder={t("diagnosis")}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("correctiveAction")}</Label>
                <Textarea
                  value={formData.correctiveAction || ""}
                  onChange={(e) => setFormData({ ...formData, correctiveAction: e.target.value })}
                  placeholder={t("correctiveAction")}
                />
              </div>
              <div>
                <Label>{t("technician")}</Label>
                <Input
                  value={formData.technician || ""}
                  onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                  placeholder={t("technician")}
                />
              </div>
              <div>
                <Label>{t("criticality")}</Label>
                <Select
                  value={formData.criticality || "Moyenne"}
                  onValueChange={(value) => setFormData({ ...formData, criticality: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">{t("low")}</SelectItem>
                    <SelectItem value="Moyenne">{t("medium")}</SelectItem>
                    <SelectItem value="Haute">{t("high")}</SelectItem>
                    <SelectItem value="Critique">{t("critical")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("cost")}</Label>
                <Input
                  type="number"
                  value={formData.cost || 0}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("cancel")}
              </Button>
              <Button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                {t("save")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t("searchBreakdown")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredBreakdowns.map((bd) => {
          const machine = machines.find((m) => m.id === bd.machineId);
          return (
            <Card key={bd.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{machine?.name}</p>
                      <p className="text-sm text-slate-500">
                        {bd.id} • {getTypeLabel(bd.type)} • {bd.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={cn(
                      bd.criticality === "Critique" && "bg-red-100 text-red-700",
                      bd.criticality === "Haute" && "bg-orange-100 text-orange-700",
                      bd.criticality === "Moyenne" && "bg-yellow-100 text-yellow-700",
                      bd.criticality === "Basse" && "bg-green-100 text-green-700"
                    )}>
                      {bd.criticality === "Critique" ? t("critical") :
                       bd.criticality === "Haute" ? t("high") :
                       bd.criticality === "Moyenne" ? t("medium") : t("low")}
                    </Badge>
                    <Badge className={cn(
                      bd.status === "Résolu" && "bg-emerald-100 text-emerald-700",
                      bd.status === "Ouvert" && "bg-red-100 text-red-700"
                    )}>
                      {bd.status === "Résolu" ? t("resolved") : t("open")}
                    </Badge>
                    <span className="text-sm text-slate-500">
                      {t("durationLabel")}: {bd.duration.toFixed(1)}h
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-slate-600">
                  <p><strong>{t("cause")}:</strong> {bd.cause}</p>
                  <p><strong>{t("correctiveAction")}:</strong> {bd.correctiveAction}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}