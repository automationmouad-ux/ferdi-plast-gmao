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
import { Plus, Search, ShieldCheck, AlertTriangle } from "lucide-react";
import { RegulatoryControl } from "@/types";
import { cn } from "@/lib/utils";

export function RegulatoryControls() {
  const { regulatoryControls, addRegulatoryControl, updateRegulatoryControl, deleteRegulatoryControl } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingControl, setEditingControl] = useState<RegulatoryControl | null>(null);
  const [formData, setFormData] = useState<Partial<RegulatoryControl>>({});

  const filteredControls = regulatoryControls.filter(
    (rc) =>
      rc.equipment.toLowerCase().includes(search.toLowerCase()) ||
      rc.controlType.toLowerCase().includes(search.toLowerCase()) ||
      rc.organism.toLowerCase().includes(search.toLowerCase())
  );

  const today = new Date();
  const upcomingControls = regulatoryControls.filter((rc) => {
    const nextDate = new Date(rc.nextDueDate);
    const diffDays = (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 30 && diffDays >= 0;
  });

  const expiredControls = regulatoryControls.filter((rc) => {
    const nextDate = new Date(rc.nextDueDate);
    return nextDate < today;
  });

  const handleSubmit = () => {
    if (editingControl) {
      updateRegulatoryControl(editingControl.id, formData);
    } else {
      const newControl: RegulatoryControl = {
        id: `RC-${String(regulatoryControls.length + 1).padStart(3, "0")}`,
        equipment: formData.equipment || "",
        controlType: formData.controlType || "",
        lastControlDate: formData.lastControlDate || new Date().toISOString().split("T")[0],
        nextDueDate: formData.nextDueDate || "",
        organism: formData.organism || "",
        result: formData.result || "En attente",
        certificate: formData.certificate || "",
        observation: formData.observation || "",
      };
      addRegulatoryControl(newControl);
    }
    setIsDialogOpen(false);
    setEditingControl(null);
    setFormData({});
  };

  const handleEdit = (control: RegulatoryControl) => {
    setEditingControl(control);
    setFormData(control);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteRegulatoryControl(id);
    }
  };

  const getStatusBadge = (control: RegulatoryControl) => {
    const nextDate = new Date(control.nextDueDate);
    const diffDays = (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diffDays < 0) {
      return <Badge className="bg-red-100 text-red-700">{t("certificateExpired")}</Badge>;
    } else if (diffDays <= 30) {
      return <Badge className="bg-amber-100 text-amber-700">{t("regulatoryUpcoming")}</Badge>;
    } else {
      return <Badge className="bg-emerald-100 text-emerald-700">{t("good")}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("regulatoryControls")}</h2>
          <p className="text-sm text-slate-500">{t("regulatoryControls")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("addRegulatoryControl")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingControl ? t("edit") : t("addRegulatoryControl")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("equipment")}</Label>
                <Input
                  value={formData.equipment || ""}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("controlType")}</Label>
                <Select
                  value={formData.controlType || ""}
                  onValueChange={(value) => setFormData({ ...formData, controlType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectAll")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Électricité">Électricité</SelectItem>
                    <SelectItem value="Extincteurs">Extincteurs</SelectItem>
                    <SelectItem value="Compresseurs">Compresseurs</SelectItem>
                    <SelectItem value="Chaudières">Chaudières</SelectItem>
                    <SelectItem value="Levage">Levage</SelectItem>
                    <SelectItem value="Installations sous pression">Installations sous pression</SelectItem>
                    <SelectItem value="Autres">Autres</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("lastControlDate")}</Label>
                <Input
                  type="date"
                  value={formData.lastControlDate || ""}
                  onChange={(e) => setFormData({ ...formData, lastControlDate: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("nextDueDate")}</Label>
                <Input
                  type="date"
                  value={formData.nextDueDate || ""}
                  onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("organism")}</Label>
                <Input
                  value={formData.organism || ""}
                  onChange={(e) => setFormData({ ...formData, organism: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("result")}</Label>
                <Select
                  value={formData.result || "En attente"}
                  onValueChange={(value) => setFormData({ ...formData, result: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conforme">Conforme</SelectItem>
                    <SelectItem value="Non conforme">Non conforme</SelectItem>
                    <SelectItem value="En attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{t("certificate")}</Label>
                <Input
                  value={formData.certificate || ""}
                  onChange={(e) => setFormData({ ...formData, certificate: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Label>{t("observation")}</Label>
                <Input
                  value={formData.observation || ""}
                  onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
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
      {(upcomingControls.length > 0 || expiredControls.length > 0) && (
        <div className="space-y-2">
          {expiredControls.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-700">{t("certificateExpired")}</h3>
                </div>
                <div className="space-y-2">
                  {expiredControls.map((rc) => (
                    <div key={rc.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{rc.equipment}</p>
                        <p className="text-xs text-slate-500">{rc.controlType} • {rc.nextDueDate}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-700">{t("certificateExpired")}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {upcomingControls.length > 0 && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="font-semibold text-amber-700">{t("regulatoryUpcoming")}</h3>
                </div>
                <div className="space-y-2">
                  {upcomingControls.map((rc) => (
                    <div key={rc.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{rc.equipment}</p>
                        <p className="text-xs text-slate-500">{rc.controlType} • {rc.nextDueDate}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">{t("regulatoryUpcoming")}</Badge>
                    </div>
                  ))}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredControls.map((rc) => (
          <Card key={rc.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{rc.equipment}</p>
                    <p className="text-sm text-slate-500">{rc.controlType}</p>
                  </div>
                </div>
                {getStatusBadge(rc)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500">{t("lastControlDate")}</p>
                  <p className="font-medium">{rc.lastControlDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("nextDueDate")}</p>
                  <p className="font-medium">{rc.nextDueDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("organism")}</p>
                  <p className="font-medium">{rc.organism || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("result")}</p>
                  <p className="font-medium">{rc.result}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(rc)}>
                  {t("edit")}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(rc.id)}>
                  {t("delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredControls.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}