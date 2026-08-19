import { useState } from "react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { roleLabels } from "@/lib/permissions";
import { toast } from "sonner";
import { Factory, ShieldCheck, Wrench, BarChart3 } from "lucide-react";

export function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast.success("تم تسجيل الدخول بنجاح");
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* الجانب الأيمن - معلومات النظام */}
        <div className="hidden md:block">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Factory className="h-6 w-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">FERDI PLAST</h1>
                <p className="text-sm text-slate-400">GMAO Pro</p>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-4">نظام إدارة الصيانة المتكامل</h2>
            <p className="text-slate-400 text-sm mb-6">
              إدارة الصيانة الوقائية والتصحيحية، الأعطال، قطع الغيار، مؤشرات الأداء، والسلامة المهنية
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">إدارة الآلات والمعدات</p>
                  <p className="text-xs text-slate-500">سجل كامل مع QR Code</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">مؤشرات الأداء</p>
                  <p className="text-xs text-slate-500">MTBF, MTTR, التوفر</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">السلامة HSE</p>
                  <p className="text-xs text-slate-500">مطابق لمعايير ISO 9001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الجانب الأيسر - نموذج تسجيل الدخول */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Factory className="h-8 w-8 text-slate-900" />
            </div>
            <CardTitle className="text-2xl font-bold">تسجيل الدخول</CardTitle>
            <CardDescription>أدخل بياناتك للوصول إلى النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username">اسم المستخدم</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="mt-1"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900"
              >
                {isLoading ? "جاري الدخول..." : "دخول"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">حسابات تجريبية:</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p>Admin: admin / admin123</p>
                <p>Manager: manager / manager123</p>
                <p>Technician: tech / tech123</p>
                <p>Viewer: viewer / viewer123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}