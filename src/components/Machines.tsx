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
import { Plus, Search, Wrench, QrCode } from "lucide-react";
import { Machine } from "@/types";
import { cn } from "@/lib/utils";

export function Machines() {
  const { machines, addMachine, updateMachine, deleteMachine } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState<Partial<Machine>>({});

  const filteredMachines = machines.filter(
    (m) =>
      m.code.toLowerCase().includes(search.toLowerCase()) ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.designation.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    if (editingMachine) {
      updateMachine(editingMachine.id, formData);
    } else {
      const newMachine: Machine = {
        id: `M-${String(machines.length + 1).padStart(3, "0")}`,
        code: formData.code || `M-${String(machines.length + 1).padStart(3, "0")}`,
        name: formData.name || "",
        designation: formData.designation || "",
        brand: formData.brand || "",
        model: formData.model || "",
        serialNumber: formData.serialNumber || "",
        year: formData.year || new Date().getFullYear(),
        supplier: formData.supplier || "",
        location: formData.location || "",
        productionLine: formData.productionLine || "",
        energyType: formData.energyType || "Électrique",
        power: formData.power || 0,
        status: formData.status || "Opérationnelle",
        criticality: formData.criticality || "Moyenne",
        operatingHours: formData.operatingHours || 0,
        commissioningDate: formData.commissioningDate || new Date().toISOString().split("T")[0],
        warranty: formData.warranty || "",
        documents: [],
        photos: [],
      };
      addMachine(newMachine);
    }
    setIsDialogOpen(false);
    setEditingMachine(null);
    setFormData({});
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData(machine);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteMachine(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Opérationnelle":
        return <Badge className="bg-emerald-100 text-emerald-700">{t("good")}</Badge>;
      case "En maintenance":
        return <Badge className="bg-amber-100 text-amber-700">{t("inProgress")}</Badge>;
      case "En panne":
        return <Badge className="bg-red-100 text-red-700">{t("machineDown")}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{status}</Badge>;
    }
  };

  const getCriticalityBadge = (criticality: string) => {
    switch (criticality) {
      case "Critique":
        return <Badge className="bg-red-100 text-red-700">{t("danger")}</Badge>;
      case "Haute":
        return <Badge className="bg-orange-100 text-orange-700">{t("warning")}</Badge>;
      case "Moyenne":
        return <Badge className="bg-yellow-100 text-yellow-700">{t("medium")}</Badge>;
      case "Basse":
        return <Badge className="bg-green-100 text-green-700">{t("low")}</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">{criticality}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("machines")}</h2>
          <p className="text-sm text-slate-500">{t("machines")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("addMachine")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMachine ? t("editMachine") : t("addMachine")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("machineCode")}</Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="M-001"
                />
              </div>
              <div>
                <Label>{t("machineName")}</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("designation")}</Label>
                <Input
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("brand")}</Label>
                <Input
                  value={formData.brand || ""}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("model")}</Label>
                <Input
                  value={formData.model || ""}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("serialNumber")}</Label>
                <Input
                  value={formData.serialNumber || ""}
                  onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("year")}</Label>
                <Input
                  type="number"
                  value={formData.year || new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("supplier")}</Label>
                <Input
                  value={formData.supplier || ""}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("location")}</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("productionLine")}</Label>
                <Input
                  value={formData.productionLine || ""}
                  onChange={(e) => setFormData({ ...formData, productionLine: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("energyType")}</Label>
                <Select
                  value={formData.energyType || "Électrique"}
                  onValueChange={(value) => setFormData({ ...formData, energyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Électrique">Électrique</SelectItem>
                    <SelectItem value="Pneumatique">Pneumatique</SelectItem>
                    <SelectItem value="Hydraulique">Hydraulique</SelectItem>
                    <SelectItem value="Gaz">Gaz</SelectItem>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("power")}</Label>
                <Input
                  type="number"
                  value={formData.power || 0}
                  onChange={(e) => setFormData({ ...formData, power: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("status")}</Label>
                <Select
                  value={formData.status || "Opérationnelle"}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Opérationnelle">Opérationnelle</SelectItem>
                    <SelectItem value="En maintenance">En maintenance</SelectItem>
                    <SelectItem value="En panne">En panne</SelectItem>
                    <SelectItem value="Hors service">Hors service</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="Critique">{t("danger")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("operatingHours")}</Label>
                <Input
                  type="number"
                  value={formData.operatingHours || 0}
                  onChange={(e) => setFormData({ ...formData, operatingHours: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("commissioningDate")}</Label>
                <Input
                  type="date"
                  value={formData.commissioningDate || ""}
                  onChange={(e) => setFormData({ ...formData, commissioningDate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("warranty")}</Label>
                <Input
                  value={formData.warranty || ""}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMachines.map((machine) => (
          <Card key={machine.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{machine.name}</p>
                    <p className="text-sm text-slate-500">{machine.code} • {machine.brand}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(machine.status)}
                  {getCriticalityBadge(machine.criticality)}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500">{t("model")}</p>
                  <p className="font-medium">{machine.model || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("location")}</p>
                  <p className="font-medium">{machine.location || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("productionLine")}</p>
                  <p className="font-medium">{machine.productionLine || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("operatingHours")}</p>
                  <p className="font-medium">{machine.operatingHours}h</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(machine)}>
                  {t("edit")}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(machine.id)}>
                  {t("delete")}
                </Button>
                <Button variant="outline" size="sm" className="ml-auto">
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachines.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}