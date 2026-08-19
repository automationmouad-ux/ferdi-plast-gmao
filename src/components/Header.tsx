import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, Bell, User, Settings } from "lucide-react";
import { roleLabels } from "@/lib/permissions";
import { toast } from "sonner";

export function Header() {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    toast.success("تم تسجيل الخروج بنجاح");
  };

  return (
    <header className="bg-slate-900 text-white h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
          <span className="text-slate-900 font-bold text-lg">F</span>
        </div>
        <div>
          <h1 className="font-bold text-lg">FERDI PLAST</h1>
          <p className="text-xs text-slate-400">GMAO Pro - نظام إدارة الصيانة</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <Bell className="h-5 w-5 text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-slate-900" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{roleLabels[currentUser.role]}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="h-4 w-4 ml-2" />
          خروج
        </Button>
      </div>
    </header>
  );
}