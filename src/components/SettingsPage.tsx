import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, Globe, Save } from "lucide-react";

export function SettingsPage() {
  const { loadData } = useApp();
  const [language, setLanguage] = useState("ar");
  const [companyName, setCompanyName] = useState("FERDI PLAST");
  const [companyAddress, setCompanyAddress] = useState("Zone Industrielle, Casablanca");
  const [companyPhone, setCompanyPhone] = useState("+212 522 000 000");

  const handleExport = () => {
    const data = localStorage.getItem("ferdiPlastGmaoData");
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ferdi-plast-gmao-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result as string;
        if (data) {
          localStorage.setItem("ferdiPlastGmaoData", data);
          loadData();
          alert("تم استيراد البيانات بنجاح");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    alert("تم حفظ الإعدادات بنجاح");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">الإعدادات</h2>
        <p className="text-sm text-slate-500">إعدادات النظام والنسخ الاحتياطي</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-amber-500" />
              إعدادات عامة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>اسم الشركة</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>العنوان</Label>
              <Input
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>الهاتف</Label>
              <Input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>اللغة</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Save className="h-4 w-4 ml-2" />
              حفظ الإعدادات
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4 text-amber-500" />
              النسخ الاحتياطي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>تصدير البيانات</Label>
              <p className="text-sm text-slate-500 mb-2">
                قم بتصدير نسخة احتياطية من جميع البيانات
              </p>
              <Button variant="outline" onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 ml-2" />
                تصدير نسخة احتياطية
              </Button>
            </div>
            <div>
              <Label>استيراد البيانات</Label>
              <p className="text-sm text-slate-500 mb-2">
                استيراد نسخة احتياطية سابقة
              </p>
              <label className="w-full">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="h-4 w-4 ml-2" />
                    استيراد نسخة احتياطية
                  </span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}