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
import { Plus, Search, FileText } from "lucide-react";
import { WorkOrder } from "@/types";
import { cn } from "@/lib/utils";

export function WorkOrders() {
  const { workOrders, machines, users, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState<Partial<WorkOrder>>({});

  const filteredOrders = workOrders.filter(
    (wo) =>
      wo.title.toLowerCase().includes(search.toLowerCase()) ||
      wo.id.toLowerCase().includes(search.toLowerCase()) ||
      wo.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingOrder) {
      updateWorkOrder(editingOrder.id, formData);
    } else {
      const newOrder: WorkOrder = {
        id: `WO-${String(workOrders.length + 1).padStart(3, "0")}`,
        machineId: formData.machineId || "",
        title: formData.title || "",
        description: formData.description || "",
        priority: formData.priority || "Moyenne",
        status: "Ouvert",
        assignedTo: formData.assignedTo || "",
        createdBy: "Admin",
        createdAt: new Date().toISOString(),
        dueDate: formData.dueDate || "",
        completedAt: "",
        partsUsed: [],
        cost: formData.cost || 0,
        notes: formData.notes || "",
      };
      addWorkOrder(newOrder);
    }
    setIsDialogOpen(false);
    setEditingOrder(null);
    setFormData({});
  };

  const handleEdit = (order: WorkOrder) => {
    setEditingOrder(order);
    setFormData(order);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteWorkOrder(id);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateWorkOrder(id, { status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Ouvert":
        return <Badge className="bg-blue-100 text-blue-700">{t("open")}</Badge>;
      case "En cours":
        return <Badge className="bg-amber-100 text-amber-700">{t("inProgress")}</Badge>;
      case "Terminé":
        return <Badge className="bg-emerald-100 text-emerald-700">{t("completed")}</Badge>;
      case "Annulé":
        return <Badge className="bg-red-100 text-red-700">{t("cancelled")}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("workOrders")}</h2>
          <p className="text-sm text-slate-500">{t("workOrders")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("addWorkOrder")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingOrder ? t("edit") : t("addWorkOrder")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>{t("title")}</Label>
                <Input
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("description")}</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
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
              <div>
                <Label>{t("priority")}</Label>
                <Select
                  value={formData.priority || "Moyenne"}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Haute">{t("high")}</SelectItem>
                    <SelectItem value="Moyenne">{t("medium")}</SelectItem>
                    <SelectItem value="Basse">{t("low")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("assignedTo")}</Label>
                <Select
                  value={formData.assignedTo || ""}
                  onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectAll")} />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u.id} value={u.name}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("dueDate")}</Label>
                <Input
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("cost")}</Label>
                <Input
                  type="number"
                  value={formData.cost || 0}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("notes")}</Label>
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-3">
        {filteredOrders.map((wo) => {
          const machine = machines.find((m) => m.id === wo.machineId);
          return (
            <Card key={wo.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{wo.title}</p>
                      <p className="text-sm text-slate-500">
                        {wo.id} • {machine?.name} • {wo.createdAt.split("T")[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(wo.status)}
                    <Select
                      value={wo.status}
                      onValueChange={(value) => handleStatusChange(wo.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ouvert">{t("open")}</SelectItem>
                        <SelectItem value="En cours">{t("inProgress")}</SelectItem>
                        <SelectItem value="Terminé">{t("completed")}</SelectItem>
                        <SelectItem value="Annulé">{t("cancelled")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-slate-500">{t("priority")}</p>
                    <p className="font-medium">{wo.priority}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("assignedTo")}</p>
                    <p className="font-medium">{wo.assignedTo || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("dueDate")}</p>
                    <p className="font-medium">{wo.dueDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">{t("cost")}</p>
                    <p className="font-medium">{wo.cost}€</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(wo)}>
                    {t("edit")}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(wo.id)}>
                    {t("delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}