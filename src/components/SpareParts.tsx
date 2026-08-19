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
import { Plus, Search, AlertTriangle, Package } from "lucide-react";
import { SparePart } from "@/types";
import { cn } from "@/lib/utils";

export function SpareParts() {
  const { spareParts, machines, addSparePart, updateSparePart, deleteSparePart } = useApp();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [formData, setFormData] = useState<Partial<SparePart>>({});

  const filteredParts = spareParts.filter(
    (sp) =>
      sp.code.toLowerCase().includes(search.toLowerCase()) ||
      sp.designation.toLowerCase().includes(search.toLowerCase()) ||
      sp.reference.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockParts = spareParts.filter((sp) => sp.currentStock < sp.minStock);

  const handleSubmit = () => {
    if (editingPart) {
      updateSparePart(editingPart.id, formData);
    } else {
      const newPart: SparePart = {
        id: `SP-${String(spareParts.length + 1).padStart(3, "0")}`,
        code: formData.code || `SP-${String(spareParts.length + 1).padStart(3, "0")}`,
        designation: formData.designation || "",
        reference: formData.reference || "",
        compatibleMachines: formData.compatibleMachines || [],
        currentStock: formData.currentStock || 0,
        minStock: formData.minStock || 0,
        maxStock: formData.maxStock || 0,
        supplier: formData.supplier || "",
        price: formData.price || 0,
        location: formData.location || "",
      };
      addSparePart(newPart);
    }
    setIsDialogOpen(false);
    setEditingPart(null);
    setFormData({});
  };

  const handleEdit = (part: SparePart) => {
    setEditingPart(part);
    setFormData(part);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm(t("confirmDelete"))) {
      deleteSparePart(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("spareParts")}</h2>
          <p className="text-sm text-slate-500">{t("spareParts")}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 mr-2" />
              {t("addSparePart")}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPart ? t("edit") : t("addSparePart")}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("code")}</Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SP-001"
                />
              </div>
              <div>
                <Label>{t("designation")}</Label>
                <Input
                  value={formData.designation || ""}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("reference")}</Label>
                <Input
                  value={formData.reference || ""}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
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
                <Label>{t("currentStock")}</Label>
                <Input
                  type="number"
                  value={formData.currentStock || 0}
                  onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("minStock")}</Label>
                <Input
                  type="number"
                  value={formData.minStock || 0}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("maxStock")}</Label>
                <Input
                  type="number"
                  value={formData.maxStock || 0}
                  onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("price")}</Label>
                <Input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>{t("stockLocation")}</Label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <Label>{t("compatibleMachines")}</Label>
                <Select
                  value={formData.compatibleMachines?.[0] || ""}
                  onValueChange={(value) => setFormData({ ...formData, compatibleMachines: [value] })}
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

      {/* Stock Alerts */}
      {lowStockParts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-700">{t("stockAlert")}</h3>
            </div>
            <div className="space-y-2">
              {lowStockParts.map((sp) => (
                <div key={sp.id} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{sp.designation}</p>
                    <p className="text-xs text-slate-500">{sp.code} • {t("currentStock")}: {sp.currentStock}</p>
                  </div>
                  <Badge className="bg-red-100 text-red-700">{t("stockLow")}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
        {filteredParts.map((sp) => (
          <Card key={sp.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{sp.designation}</p>
                    <p className="text-sm text-slate-500">{sp.code} • {sp.reference}</p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    sp.currentStock < sp.minStock
                      ? "bg-red-100 text-red-700"
                      : sp.currentStock <= sp.minStock * 1.5
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {sp.currentStock} / {sp.minStock}
                </Badge>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-500">{t("supplier")}</p>
                  <p className="font-medium">{sp.supplier || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("price")}</p>
                  <p className="font-medium">{sp.price} DA</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("stockLocation")}</p>
                  <p className="font-medium">{sp.location || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500">{t("maxStock")}</p>
                  <p className="font-medium">{sp.maxStock}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(sp)}>
                  {t("edit")}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(sp.id)}>
                  {t("delete")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParts.length === 0 && (
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
