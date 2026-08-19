import { useState } from "react";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, CalendarClock, AlertTriangle } from "lucide-react";
import { PreventiveTask } from "@/types";
import { cn } from "@/lib/utils";

export function PreventiveMaintenance() {
  const { preventiveTasks, machines, addPreventiveTask, updatePreventiveTask, deletePreventiveTask } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PreventiveTask | null>(null);
  const [formData, setFormData] = useState<Partial<PreventiveTask>>({});

  const filteredTasks = preventiveTasks.filter(
    (task) =>
      task.task.toLowerCase().includes(search.toLowerCase()) ||
      task.id.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();
  const upcomingTasks = preventiveTasks.filter((task) => {
    const nextDate = new Date(task.nextDue);
    const diffDays = (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && diffDays >= 0;
  });

  const overdueTasks = preventiveTasks.filter((task) => {
    const nextDate = new Date(task.nextDue);
    return nextDate < today && task.status !== "Terminé";
  });

  const handleSubmit = () => {
    if (editingTask) {
      updatePreventiveTask(editingTask.id, formData);
    } else {
      const newTask: PreventiveTask = {
        id: `PM-${String(preventiveTasks.length + 1).padStart(3, "0")}`,
        machineId: formData.machineId || "",
        task: formData.task || "",
        frequency: formData.frequency || "Mensuelle",
        lastPerformed: formData.lastPerformed || "",
        nextDue: formData.nextDue || "",
        assignedTo: formData.assignedTo || "",
        checklist: formData.checklist || [],
        duration: formData.duration || 1,
        partsNeeded: formData.partsNeeded || [],
        safetyInstructions: formData.safetyInstructions || "",
        status: "Planifié",
      };
      addPreventiveTask(newTask);
    }
    setIsDialogOpen(false);
    setEditingTask(null);
    setFormData({});
  };

  const handleEdit = (task: PreventiveTask) => {
    setEditingTask(task);
    setFormData(task);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deletePreventiveTask(id);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updatePreventiveTask(id, { status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Planifié":
        return <Badge className="bg-blue-100 text-blue-700">{t("open")}</Badge>;
      case "En cours":
        return <Badge className="bg-amber-100 text-amber-700">{t("inProgress")}</Badge>;
      case "Terminé":
        return <Badge className="bg-emerald-100 text-emerald-700">{t("completed")}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("preventiveMaintenance")}</h2>
          <p className="text-sm text-slate-500">{t("preventiveMaintenance")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("addPreventiveTask")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTask ? t("edit") : t("addPreventiveTask")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>{t("machines")}</Label>
                <Select
                  value={formData.machineId || ""}
                  onValueChange={(value) => setFormData({ ...formData, machineId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectAll")} />
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
              <div className="col-span-2">
                <Label>{t("title")}</Label>
                <Input
                  value={formData.task || ""}
                  onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("frequency")}</Label>
                <Select
                  value={formData.frequency || "Mensuelle"}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Journalière">Journalière</SelectItem>
                    <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                    <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                    <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                    <SelectItem value="Semestrielle">Semestrielle</SelectItem>
                    <SelectItem value="Annuelle">Annuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("duration")}</Label>
                <Input
                  type="number"
                  value={formData.duration || 1}
                  onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("lastPerformed")}</Label>
                <Input
                  type="date"
                  value={formData.lastPerformed || ""}
                  onChange={(e) => setFormData({ ...formData, lastPerformed: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("nextDue")}</Label>
                <Input
                  type="date"
                  value={formData.nextDue || ""}
                  onChange={(e) => setFormData({ ...formData, nextDue: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("safetyInstructions")}</Label>
                <Textarea
                  value={formData.safetyInstructions || ""}
                  onChange={(e) => setFormData({ ...formData, safetyInstructions: e.target.value })}
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

      {/* Alerts */}
      {(upcomingTasks.length > 0 || overdueTasks.length > 0) && (
        <div className="space-y-2">
          {overdueTasks.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-700">{t("pmOverdue")}</h3>
                </div>
                <div className="space-y-2">
                  {overdueTasks.map((task) => {
                    const machine = machines.find((m) => m.id === task.machineId);
                    return (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{task.task}</p>
                          <p className="text-xs text-slate-500">{machine?.name} • {task.nextDue}</p>
                        </div>
                        <Badge className="bg-red-100 text-red-700">{t("pmOverdue")}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          {upcomingTasks.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-700">{t("pmUpcoming")}</h3>
                </div>
                <div className="space-y-2">
                  {upcomingTasks.map((task) => {
                    const machine = machines.find((m) => m.id === task.machineId);
                    return (
                      <div key={task.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{task.task}</p>
                          <p className="text-xs text-slate-500">{machine?.name} • {task.nextDue}</p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-700">{t("pmUpcoming")}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const machine = machines.find((m) => m.id === task.machineId);
          return (
            <Card key={task.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CalendarClock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{task.task}</p>
                      <p className="text-sm text-slate-500">
                        {task.id} • {machine?.name} • {task.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(task.status)}
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleStatusChange(task.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planifié">{t("open")}</SelectItem>
                        <SelectItem value="En cours">{t("inProgress")}</SelectItem>
                        <SelectItem value="Terminé">{t("completed")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500">{t("lastPerformed")}</p>
                    <p className="font-medium">{task.lastPerformed || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("nextDue")}</p>
                    <p className="font-medium">{task.nextDue || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("duration")}</p>
                    <p className="font-medium">{task.duration}h</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("assignedTo")}</p>
                    <p className="font-medium">{task.assignedTo || "-"}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(task)}>
                    {t("edit")}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(task.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}