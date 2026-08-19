import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { Machines } from "@/components/Machines";
import { WorkOrders } from "@/components/WorkOrders";
import { PreventiveMaintenance } from "@/components/PreventiveMaintenance";
import { Breakdowns } from "@/components/Breakdowns";
import { SpareParts } from "@/components/SpareParts";
import { RegulatoryControls } from "@/components/RegulatoryControls";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import { useState } from "react";
import { LayoutDashboard, Wrench, CalendarClock, AlertTriangle, Package, ShieldCheck, FileText, Settings as SettingsIcon, LogOut, Globe, Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Page = "dashboard" | "machines" | "workorders" | "preventive" | "breakdowns" | "spareparts" | "regulatory" | "reports" | "settings";

export default function App() {
  const { currentUser, logout, isOnline } = useApp();
  const { t, language, setLanguage } = useI18n();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  const navigation = [
    { id: "dashboard" as Page, label: t("dashboard"), icon: LayoutDashboard },
    { id: "machines" as Page, label: t("machines"), icon: Wrench },
    { id: "workorders" as Page, label: t("workOrders"), icon: FileText },
    { id: "preventive" as Page, label: t("preventiveMaintenance"), icon: CalendarClock },
    { id: "breakdowns" as Page, label: t("breakdowns"), icon: AlertTriangle },
    { id: "spareparts" as Page, label: t("spareParts"), icon: Package },
    { id: "regulatory" as Page, label: t("regulatoryControls"), icon: ShieldCheck },
    { id: "reports" as Page, label: t("reports"), icon: FileText },
    { id: "settings" as Page, label: t("settings"), icon: SettingsIcon },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "machines":
        return <Machines />;
      case "workorders":
        return <WorkOrders />;
      case "preventive":
        return <PreventiveMaintenance />;
      case "breakdowns":
        return <Breakdowns />;
      case "spareparts":
        return <SpareParts />;
      case "regulatory":
        return <RegulatoryControls />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-amber-400">{t("ferdiPlast")}</h1>
              <p className="text-xs text-slate-400">{t("gmaoPro")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={cn(
              "hidden sm:flex",
              isOnline ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            )}>
              {isOnline ? t("online") : t("offline")}
            </Badge>
            <button
              onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm"
            >
              <Globe className="h-4 w-4" />
              {language === "fr" ? "العربية" : "Français"}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-slate-400">{currentUser.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-800 rounded-lg"
              title={t("logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-64px)]",
          "fixed lg:sticky top-16 bottom-0 z-40 transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  currentPage === item.id
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
