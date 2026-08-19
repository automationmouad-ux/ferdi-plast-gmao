import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Wrench, 
  AlertTriangle, 
  CalendarCheck, 
  Package, 
  FileText, 
  Camera,
  Plus,
  History,
  ClipboardList,
  QrCode,
  MapPin,
  Factory,
  Zap,
  Euro,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Machine, Breakdown, WorkOrder, PreventiveTask, SparePart } from "@/types";
import { MachineQRCode } from "@/components/MachineQRCode";

interface MachineFicheProps {
  machine: Machine;
  onClose: () => void;
}

export function MachineFiche({ machine, onClose }: MachineFicheProps) {
  const { breakdowns, workOrders, preventiveTasks, spareParts, addBreakdown, addWorkOrder } = useApp();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showInterventionForm, setShowInterventionForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [interventionForm, setInterventionForm] = useState({
    type: "Mécanique",
    description: "",
    priority: "Moyenne" as "Basse" | "Moyenne" | "Haute" | "Critique",
  });

  // بيانات الآلة المرتبطة
  const machineBreakdowns = breakdowns.filter(bd => bd.machineId === machine.id);
  const machineWorkOrders = workOrders.filter(wo => wo.machineId === machine.id);
  const machinePM = preventiveTasks.filter(pm => pm.machineId === machine.id);
  const machineParts = spareParts.filter(sp => sp.machineId === machine.id);

  // حساب مؤشرات الآلة
  const totalDowntime = machineBreakdowns.reduce((sum, bd) => sum + bd.duration, 0);
  const totalCost = 
    machineWorkOrders.reduce((sum, wo) => sum + wo.cost, 0) +
    machineBreakdowns.reduce((sum, bd) => sum + bd.cost, 0);

  const getStatusBadge = () => {
    switch (machine.status) {
      case "running":
        return <Badge className="bg-emerald-100 text-emerald-700">تشغيل</Badge>;
      case "maintenance":
        return <Badge className="bg-amber-100 text-amber-700">صيانة</Badge>;
      case "breakdown":
        return <Badge className="bg-red-100 text-red-700">عطل</Badge>;
      case "stopped":
        return <Badge className="bg-slate-100 text-slate-700">متوقفة</Badge>;
    }
  };

  const getCriticalityBadge = () => {
    switch (machine.criticality) {
      case "Critique":
        return <Badge className="bg-red-100 text-red-700">حرجة</Badge>;
      case "Haute":
        return <Badge className="bg-orange-100 text-orange-700">عالية</Badge>;
      case "Moyenne":
        return <Badge className="bg-yellow-100 text-yellow-700">متوسطة</Badge>;
      case "Basse":
        return <Badge className="bg-green-100 text-green-700">منخفضة</Badge>;
    }
  };

  const handleCreateIntervention = () => {
    if (!interventionForm.description) {
      toast.error("يرجى إدخال وصف التدخل");
      return;
    }

    const newWO: WorkOrder = {
      id: `WO-${String(workOrders.length + 1).padStart(3, "0")}`,
      title: interventionForm.description.slice(0, 50),
      description: interventionForm.description,
      machineId: machine.id,
      status: "Open",
      priority: interventionForm.priority,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "tech",
      assignedTo: "",
      cost: 0,
    };

    addWorkOrder(newWO);
    toast.success("تم إنشاء طلب التدخل بنجاح");
    setShowInterventionForm(false);
    setInterventionForm({ type: "Mécanique", description: "", priority: "Moyenne" });
  };

  const handleDeclareBreakdown = () => {
    const newBreakdown: Breakdown = {
      id: `BD-${String(breakdowns.length + 1).padStart(3, "0")}`,
      machineId: machine.id,
      date: new Date().toISOString().split("T")[0],
      startTime: new Date().toTimeString().slice(0, 5),
      endTime: "",
      duration: 0,
      type: "Mécanique",
      cause: "",
      symptom: interventionForm.description,
      diagnosis: "",
      correctiveAction: "",
      technician: "tech",
      partsUsed: [],
      cost: 0,
      criticality: interventionForm.priority,
      status: "Ouvert",
    };

    addBreakdown(newBreakdown);
    toast.success("تم تسجيل العطل");
    setShowInterventionForm(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Factory className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{machine.name}</DialogTitle>
                <p className="text-sm text-slate-500">{machine.code} • {machine.designation}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {getCriticalityBadge()}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات الآلة */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-amber-600" />
                  معلومات عامة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">العلامة</p>
                    <p className="font-medium">{machine.brand}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الموديل</p>
                    <p className="font-medium">{machine.model}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الرقم التسلسلي</p>
                    <p className="font-medium">{machine.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">السنة</p>
                    <p className="font-medium">{machine.year}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">المورد</p>
                    <p className="font-medium">{machine.supplier}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الطاقة</p>
                    <p className="font-medium">{machine.energyType} • {machine.power} kW</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" />
                  الموقع والتشغيل
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">الموقع</p>
                    <p className="font-medium">{machine.location}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الخط</p>
                    <p className="font-medium">{machine.line}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الورشة</p>
                    <p className="font-medium">{machine.workshop}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">تاريخ التشغيل</p>
                    <p className="font-medium">{machine.commissionDate}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">الضمان</p>
                    <p className="font-medium">{machine.warranty}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">تكلفة الصيانة</p>
                    <p className="font-medium text-amber-600">{totalCost.toLocaleString()} €</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* مؤشرات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{machineBreakdowns.length}</p>
              <p className="text-xs text-red-600">الأعطال</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{totalDowntime.toFixed(1)}h</p>
              <p className="text-xs text-amber-600">وقت التوقف</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{machineWorkOrders.length}</p>
              <p className="text-xs text-blue-600">أوامر العمل</p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{machinePM.length}</p>
              <p className="text-xs text-emerald-600">مهام PM</p>
            </div>
          </div>

          {/* آخر الأعطال */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                آخر الأعطال
              </CardTitle>
            </CardHeader>
            <CardContent>
              {machineBreakdowns.length > 0 ? (
                <div className="space-y-2">
                  {machineBreakdowns.slice(0, 3).map((bd) => (
                    <div key={bd.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{bd.cause}</p>
                        <p className="text-xs text-slate-500">{bd.date} • {bd.duration}h</p>
                      </div>
                      <Badge className={cn(
                        bd.criticality === "Critique" && "bg-red-100 text-red-700",
                        bd.criticality === "Haute" && "bg-orange-100 text-orange-700",
                        bd.criticality === "Moyenne" && "bg-yellow-100 text-yellow-700"
                      )}>
                        {bd.criticality}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">لا توجد أعطال مسجلة</p>
              )}
            </CardContent>
          </Card>

          {/* الصيانة الوقائية القادمة */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-emerald-500" />
                الصيانة الوقائية القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {machinePM.length > 0 ? (
                <div className="space-y-2">
                  {machinePM.map((pm) => (
                    <div key={pm.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{pm.task}</p>
                        <p className="text-xs text-slate-500">التكرار: {pm.frequency}</p>
                      </div>
                      <div className="text-left">
                        <p className="text-xs text-slate-500">الاستحقاق</p>
                        <p className="text-sm font-medium text-amber-600">{pm.nextDue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">لا توجد مهام صيانة وقائية</p>
              )}
            </CardContent>
          </Card>

          {/* قطع الغيار */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                قطع الغيار المرتبطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {machineParts.length > 0 ? (
                <div className="space-y-2">
                  {machineParts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{part.name}</p>
                        <p className="text-xs text-slate-500">المرجع: {part.reference}</p>
                      </div>
                      <Badge className={cn(
                        part.currentStock < part.minStock ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                      )}>
                        المخزون: {part.currentStock}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">لا توجد قطع غيار مرتبطة</p>
              )}
            </CardContent>
          </Card>

          {/* أزرار الإجراءات */}
          <div className="flex flex-wrap gap-2">
            <Button
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
              onClick={() => setShowInterventionForm(true)}
            >
              <Plus className="h-4 w-4 ml-2" />
              طلب تدخل
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowQRCode(true)}
            >
              <QrCode className="h-4 w-4 ml-2" />
              QR Code
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPhotoUpload(true)}
            >
              <Camera className="h-4 w-4 ml-2" />
              إضافة صورة
            </Button>
          </div>
        </div>

        {/* نافذة إنشاء تدخل */}
        <Dialog open={showInterventionForm} onOpenChange={setShowInterventionForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء طلب تدخل - {machine.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>نوع التدخل</Label>
                <Select
                  value={interventionForm.type}
                  onValueChange={(value) => setInterventionForm({ ...interventionForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mécanique">ميكانيكي</SelectItem>
                    <SelectItem value="Électrique">كهربائي</SelectItem>
                    <SelectItem value="Pneumatique">هوائي</SelectItem>
                    <SelectItem value="Hydraulique">هيدروليكي</SelectItem>
                    <SelectItem value="Autre">آخر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>الأولوية</Label>
                <Select
                  value={interventionForm.priority}
                  onValueChange={(value) => setInterventionForm({ ...interventionForm, priority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basse">منخفضة</SelectItem>
                    <SelectItem value="Moyenne">متوسطة</SelectItem>
                    <SelectItem value="Haute">عالية</SelectItem>
                    <SelectItem value="Critique">حرجة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>وصف التدخل</Label>
                <Textarea
                  value={interventionForm.description}
                  onChange={(e) => setInterventionForm({ ...interventionForm, description: e.target.value })}
                  placeholder="وصف المشكلة أو التدخل المطلوب..."
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDeclareBreakdown}
                >
                  <AlertTriangle className="h-4 w-4 ml-2" />
                  تسجيل كعطل
                </Button>
                <Button
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
                  onClick={handleCreateIntervention}
                >
                  <ClipboardList className="h-4 w-4 ml-2" />
                  إنشاء أمر عمل
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* نافذة رفع الصور */}
        <Dialog open={showPhotoUpload} onOpenChange={setShowPhotoUpload}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة صورة - {machine.code}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">انقر لالتقاط صورة أو رفعها</p>
                <p className="text-xs text-slate-400">JPG, PNG, GIF - بحد أقصى 10MB</p>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                  onClick={() => {
                    toast.success("تم رفع الصورة بنجاح");
                    setShowPhotoUpload(false);
                  }}
                >
                  رفع الصورة
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* نافذة QR Code */}
        <MachineQRCode
          machine={machine}
          open={showQRCode}
          onClose={() => setShowQRCode(false)}
        />
      </DialogContent>
    </Dialog>
  );
}