import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useLoginUser, useRegisterUser } from "../hooks/useQueries";

const ADMIN_EMAIL = "adityabholath@gmail.com";

function hashPassword(password: string): string {
  return btoa(password);
}

export function AdminLoginPage() {
  const { login } = useAuth();
  const { actor } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = actor as unknown as Record<string, any>;

  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");

  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter email and password.");
      return;
    }
    // Only admin email can login here
    if (loginEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setLoginError("Admin access is restricted to authorized personnel only.");
      return;
    }
    try {
      const token = await loginMutation.mutateAsync({
        email: loginEmail.trim().toLowerCase(),
        passwordHash: hashPassword(loginPassword),
      });
      const user = await a.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoginError(
        msg.includes("Invalid")
          ? "Invalid email or password."
          : "Login failed. Please try again.",
      );
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    // Strict admin email check before calling backend
    if (regEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setRegError("Admin access is restricted. Please contact support.");
      return;
    }
    if (!regName || !regPassword) {
      setRegError("Please fill in all required fields.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    try {
      const token = await registerMutation.mutateAsync({
        email: regEmail.trim().toLowerCase(),
        passwordHash: hashPassword(regPassword),
        name: regName.trim(),
        phone: null,
      });
      const user = await a.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Admin account created. Welcome, ${user.name}!`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        setRegError("An admin account already exists. Please login instead.");
      } else {
        setRegError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <main
      data-ocid="admin.login.page"
      className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4 py-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, oklch(0.25 0.08 250 / 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, oklch(0.2 0.06 280 / 0.3) 0%, transparent 50%)",
      }}
    >
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold/60 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/20">
              <Shield className="w-10 h-10 text-navy-dark" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#0a0f1e] flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">
            Bobby<span className="text-gold">Travels</span>
          </h1>
          <p className="text-white/50 mt-1 text-sm tracking-wider uppercase">
            Admin Panel
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-xs font-medium">
              Restricted Access
            </span>
          </div>
        </div>

        <Card className="border border-white/10 shadow-2xl rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                data-ocid="admin.login.tab"
                className="w-full rounded-none h-12 bg-white/5 border-b border-white/10"
              >
                <TabsTrigger
                  value="login"
                  data-ocid="admin.login.login.tab"
                  className="flex-1 rounded-none text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10"
                >
                  Admin Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  data-ocid="admin.login.register.tab"
                  className="flex-1 rounded-none text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* LOGIN TAB */}
              <TabsContent value="login" className="p-6 space-y-4 mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="admin-login-email"
                      className="text-white/70"
                    >
                      Admin Email
                    </Label>
                    <Input
                      id="admin-login-email"
                      data-ocid="admin.login.email.input"
                      type="email"
                      placeholder="admin@bobbytravels.online"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="admin-login-password"
                      className="text-white/70"
                    >
                      Password
                    </Label>
                    <Input
                      id="admin-login-password"
                      data-ocid="admin.login.password.input"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  {loginError && (
                    <div
                      data-ocid="admin.login.error_state"
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {loginError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    data-ocid="admin.login.submit_button"
                    className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In to Admin Panel"
                    )}
                  </Button>
                </form>
                <p className="text-center text-xs text-white/30">
                  Authorized personnel only. Unauthorized access attempts are
                  logged.
                </p>
              </TabsContent>

              {/* REGISTER TAB */}
              <TabsContent value="register" className="p-6 space-y-4 mt-0">
                <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300">
                    Registration is restricted to the designated admin email
                    only.
                  </p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="admin-reg-name" className="text-white/70">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="admin-reg-name"
                      data-ocid="admin.register.name.input"
                      placeholder="Your full name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-reg-email" className="text-white/70">
                      Admin Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="admin-reg-email"
                      data-ocid="admin.register.email.input"
                      type="email"
                      placeholder={ADMIN_EMAIL}
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="admin-reg-password"
                      className="text-white/70"
                    >
                      Password <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="admin-reg-password"
                      data-ocid="admin.register.password.input"
                      type="password"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="admin-reg-confirm"
                      className="text-white/70"
                    >
                      Confirm Password <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="admin-reg-confirm"
                      data-ocid="admin.register.confirm_password.input"
                      type="password"
                      placeholder="Repeat password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-gold"
                    />
                  </div>
                  {regError && (
                    <div
                      data-ocid="admin.register.error_state"
                      className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {regError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    data-ocid="admin.register.submit_button"
                    className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      "Create Admin Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-white/20 text-xs mt-6">
          &copy; {new Date().getFullYear()} BobbyTravels. Admin portal.
        </p>
      </div>
      <Toaster richColors position="top-right" />
    </main>
  );
}
