import { useState } from "react";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Lock, User } from "lucide-react";

export function LoginPage() {
  const { login } = useApp();
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password);
    if (!success) {
      setError(t("invalidCredentials"));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500 rounded-2xl mb-4">
            <Factory className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="text-3xl font-bold text-white">{t("ferdiPlast")}</h1>
          <p className="text-slate-400 mt-2">{t("gmaoPro")}</p>
        </div>

        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-white text-center">{t("login")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-300">{t("username")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="admin"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                    placeholder="••••••"
                  />
                </div>
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              >
                {t("loginButton")}
              </Button>
            </form>
            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400 mb-2">Comptes de démonstration :</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                <div>admin / admin123</div>
                <div>manager / manager123</div>
                <div>tech / tech123</div>
                <div>viewer / viewer123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}