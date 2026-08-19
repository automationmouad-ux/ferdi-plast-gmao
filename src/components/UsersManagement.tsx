import { useState } from "react";
import { useApp } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Users, Trash2 } from "lucide-react";
import { User } from "@/types";
import { cn } from "@/lib/utils";

export function UsersManagement() {
  const { users, addUser, deleteUser, currentUser } = useApp();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = () => {
    const newUser: User = {
      id: String(Date.now()),
      username: formData.username || "",
      password: formData.password || "password123",
      name: formData.name || "",
      role: formData.role || "Viewer",
      email: formData.email || "",
    };
    addUser(newUser);
    setIsDialogOpen(false);
    setFormData({});
  };

  const roleColors: Record<string, string> = {
    Admin: "bg-red-100 text-red-700",
    Manager: "bg-blue-100 text-blue-700",
    Technician: "bg-emerald-100 text-emerald-700",
    Viewer: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">إدارة المستخدمين</h2>
          <p className="text-sm text-slate-500">إدارة الصلاحيات والأدوار</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Plus className="h-4 w-4 ml-2" />
              إضافة مستخدم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة مستخدم جديد</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>الاسم</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="الاسم الكامل"
                />
              </div>
              <div>
                <Label>اسم المستخدم</Label>
                <Input
                  value={formData.username || ""}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="اسم المستخدم"
                />
              </div>
              <div>
                <Label>كلمة المرور</Label>
                <Input
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="كلمة المرور"
                />
              </div>
              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>الدور</Label>
                <Select
                  value={formData.role || "Viewer"}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">مدير النظام</SelectItem>
                    <SelectItem value="Manager">مدير</SelectItem>
                    <SelectItem value="Technician">فني</SelectItem>
                    <SelectItem value="Viewer">مشاهد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleSubmit} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                حفظ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="بحث عن مستخدم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">@{user.username}</p>
                  </div>
                </div>
                <Badge className={cn(roleColors[user.role])}>
                  {user.role}
                </Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-sm text-slate-600">{user.email}</p>
                {currentUser?.id !== user.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}