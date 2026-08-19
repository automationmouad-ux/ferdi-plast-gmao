import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, Users, History } from "lucide-react";
import { useState } from "react";
import { User } from "@/types";

export function Settings() {
  const { users, addUser, exportBackup, importBackup, auditLogs, currentUser } = useApp();
  const { t } = useI18n();
  const [newUser, setNewUser] = useState<Partial<User>>({});
  const [importData, setImportData] = useState("");

  const handleAddUser = () => {
    if (newUser.username && newUser.password && newUser.name && newUser.role) {
      addUser({
        id: `U-${Date.now()}`,
        username: newUser.username,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role as User["role"],
      });
      setNewUser({});
    }
  };

  const handleImport = () => {
    if (importData) {
      importBackup(importData);
      setImportData("");
    }
  };

  if (currentUser?.role !== "Admin") {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">{t("settings")}</h2>
        <Card className="border-slate-200">
          <CardContent className="p-8 text-center text-slate-500">
            {t("noData")}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t("settings")}</h2>
        <p className="text-sm text-slate-500">FERDI PLAST GMAO PRO</p>
      </div>

      {/* Users Management */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            {t("users")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <Label>{t("username")}</Label>
              <Input
                value={newUser.username || ""}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("password")}</Label>
              <Input
                type="password"
                value={newUser.password || ""}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("name")}</Label>
              <Input
                value={newUser.name || ""}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div>
              <Label>{t("role")}</Label>
              <Select
                value={newUser.role || "Viewer"}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as User["role"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddUser} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                {t("addUser")}
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("name")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("username")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("role")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="py-2 px-3">{user.name}</td>
                    <td className="py-2 px-3">{user.username}</td>
                    <td className="py-2 px-3">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs">{user.role}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-amber-500" />
            {t("exportBackup")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={exportBackup} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Download className="h-4 w-4 mr-2" />
              {t("exportBackup")}
            </Button>
            <div className="flex-1">
              <Input
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder={t("importBackup")}
              />
            </div>
            <Button onClick={handleImport} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              {t("importBackup")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-500" />
            {t("auditLogs")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">{t("name")}</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Action</th>
                  <th className="text-left py-2 px-3 font-medium text-slate-500">Entity</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="border-b border-slate-100">
                    <td className="py-2 px-3">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-3">{log.userName}</td>
                    <td className="py-2 px-3">{log.action}</td>
                    <td className="py-2 px-3">{log.entity} - {log.entityId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}