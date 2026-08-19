import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Play, 
  RefreshCw, 
  ShieldCheck,
  Database,
  Users,
  Wrench,
  ClipboardList,
  CalendarCheck,
  Package,
  BarChart3,
  FileText,
  Activity
} from "lucide-react";
import { runValidationTests, TestSuite } from "@/lib/testUtils";
import { cn } from "@/lib/utils";

export function SystemTest() {
  const { machines, workOrders, preventiveTasks, spareParts, breakdowns, kpis, users, currentUser } = useApp();
  const [testResults, setTestResults] = useState<TestSuite | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    
    // محاكاة وقت التنفيذ
    setTimeout(() => {
      const results = runValidationTests({
        machines,
        workOrders,
        preventiveTasks,
        spareParts,
        breakdowns,
        kpis,
        users,
        currentUser,
      });
      setTestResults(results);
      setIsRunning(false);
    }, 1000);
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "المصادقة": return Users;
      case "الآلات": return Wrench;
      case "الأعطال": return AlertTriangle;
      case "أوامر العمل": return ClipboardList;
      case "الصيانة الوقائية": return CalendarCheck;
      case "قطع الغيار": return Package;
      case "مؤشرات الأداء": return BarChart3;
      case "التقارير": return FileText;
      case "البيانات الناقصة": return Database;
      case "البيانات الخاطئة": return XCircle;
      case "الصلاحيات": return ShieldCheck;
      default: return Activity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case "fail": return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pass": return "ناجح";
      case "fail": return "فشل";
      case "warning": return "تحذير";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "bg-emerald-100 text-emerald-700";
      case "fail": return "bg-red-100 text-red-700";
      case "warning": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  // تجميع النتائج حسب الوحدة
  const groupedResults = testResults?.tests.reduce((acc, test) => {
    if (!acc[test.module]) {
      acc[test.module] = [];
    }
    acc[test.module].push(test);
    return acc;
  }, {} as Record<string, typeof testResults.tests>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">اختبار النظام</h2>
          <p className="text-sm text-slate-500">التحقق الشامل من سلامة جميع وحدات النظام</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 ml-2 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 ml-2" />
                تشغيل الاختبارات
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ملخص النتائج */}
      {testResults && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">إجمالي الاختبارات</p>
                  <p className="text-2xl font-bold text-slate-900">{testResults.totalTests}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-5 w-5 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 shadow-sm bg-emerald-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600">ناجح</p>
                  <p className="text-2xl font-bold text-emerald-700">{testResults.passedTests}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 shadow-sm bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">فشل</p>
                  <p className="text-2xl font-bold text-red-700">{testResults.failedTests}</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 shadow-sm bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600">تحذيرات</p>
                  <p className="text-2xl font-bold text-amber-700">{testResults.warnings}</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* نسبة النجاح */}
      {testResults && (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900">نسبة نجاح الاختبارات</h3>
                <p className="text-sm text-slate-500">{testResults.description}</p>
              </div>
              <div className="text-3xl font-bold text-amber-600">{testResults.successRate}%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-4">
              <div 
                className={cn(
                  "h-4 rounded-full transition-all duration-1000",
                  testResults.successRate >= 80 ? "bg-emerald-500" :
                  testResults.successRate >= 60 ? "bg-amber-500" : "bg-red-500"
                )}
                style={{ width: `${testResults.successRate}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* نتائج الاختبارات حسب الوحدة */}
      {groupedResults && Object.entries(groupedResults).map(([module, tests]) => {
        const ModuleIcon = getModuleIcon(module);
        const modulePassed = tests.filter(t => t.status === "pass").length;
        const moduleFailed = tests.filter(t => t.status === "fail").length;
        const moduleWarnings = tests.filter(t => t.status === "warning").length;

        return (
          <Card key={module} className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <ModuleIcon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-lg">{module}</span>
                    <div className="flex gap-2 mt-1">
                      <Badge className="bg-emerald-100 text-emerald-700">{modulePassed} ناجح</Badge>
                      {moduleFailed > 0 && (
                        <Badge className="bg-red-100 text-red-700">{moduleFailed} فشل</Badge>
                      )}
                      {moduleWarnings > 0 && (
                        <Badge className="bg-amber-100 text-amber-700">{moduleWarnings} تحذير</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tests.map((test) => (
                  <div 
                    key={test.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <p className="text-sm font-medium text-slate-900">{test.test}</p>
                        <p className="text-xs text-slate-500">{test.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(test.status)}>
                        {getStatusLabel(test.status)}
                      </Badge>
                      <span className="text-xs text-slate-400">{test.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* حالة عدم وجود نتائج */}
      {!testResults && !isRunning && (
        <Card className="border-dashed border-2 border-slate-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">لم يتم تشغيل الاختبارات بعد</h3>
            <p className="text-sm text-slate-500 mb-6">
              اضغط على زر "تشغيل الاختبارات" للتحقق من سلامة جميع وحدات النظام
            </p>
            <Button 
              onClick={runTests}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
            >
              <Play className="h-4 w-4 ml-2" />
              بدء الاختبار
            </Button>
          </CardContent>
        </Card>
      )}

      {/* معلومات الاختبار */}
      {testResults && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">معلومات الاختبار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500">اسم الاختبار</p>
                <p className="font-medium text-slate-900">{testResults.name}</p>
              </div>
              <div>
                <p className="text-slate-500">تاريخ التنفيذ</p>
                <p className="font-medium text-slate-900">
                  {new Date(testResults.timestamp).toLocaleString("ar-DZ")}
                </p>
              </div>
              <div>
                <p className="text-slate-500">الوحدات المختبرة</p>
                <p className="font-medium text-slate-900">
                  {Object.keys(groupedResults || {}).length} وحدة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}