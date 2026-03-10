import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, Plane } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useLoginUser, useRegisterUser } from "../hooks/useQueries";

function hashPassword(password: string): string {
  return btoa(password);
}

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const { actor } = useActor();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const a = actor as unknown as Record<string, any>;

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
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
    try {
      const token = await loginMutation.mutateAsync({
        email: loginEmail.trim().toLowerCase(),
        passwordHash: hashPassword(loginPassword),
      });
      // Get user info
      const user = await a.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
        onNavigate(user.isAdmin ? "dashboard" : "home");
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
    if (!regName || !regEmail || !regPassword) {
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
        phone: regPhone.trim() || null,
      });
      const user = await a.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Welcome, ${user.name}! Account created successfully.`);
        onNavigate(user.isAdmin ? "dashboard" : "home");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        setRegError(
          "An account with this email already exists. Please login instead.",
        );
      } else {
        setRegError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <main
      data-ocid="login.page"
      className="min-h-screen bg-gradient-to-br from-navy-dark to-navy pt-24 pb-16 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Plane className="w-8 h-8 text-navy-dark" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Bobby<span className="text-gold">Travels</span>
          </h1>
          <p className="text-white/60 mt-1 text-sm">Sign in to your account</p>
        </div>

        <Card className="border-0 shadow-2xl rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList
                data-ocid="login.tab"
                className="w-full rounded-none h-12 bg-muted/50"
              >
                <TabsTrigger
                  value="login"
                  className="flex-1 rounded-none"
                  data-ocid="login.login.tab"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1 rounded-none"
                  data-ocid="login.register.tab"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="p-6 space-y-4 mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email Address</Label>
                    <Input
                      id="login-email"
                      data-ocid="login.email.input"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      data-ocid="login.password.input"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {loginError && (
                    <div
                      data-ocid="login.error_state"
                      className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {loginError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    data-ocid="login.submit_button"
                    className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="p-6 space-y-4 mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="reg-name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-name"
                      data-ocid="login.name.input"
                      placeholder="Your full name"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-email"
                      data-ocid="login.reg_email.input"
                      type="email"
                      placeholder="you@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-phone">Phone Number</Label>
                    <Input
                      id="reg-phone"
                      data-ocid="login.phone.input"
                      type="tel"
                      placeholder="+91 9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">
                      Password <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-password"
                      data-ocid="login.reg_password.input"
                      type="password"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reg-confirm">
                      Confirm Password{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="reg-confirm"
                      data-ocid="login.confirm_password.input"
                      type="password"
                      placeholder="Repeat password"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {regError && (
                    <div
                      data-ocid="login.reg_error_state"
                      className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-3 py-2"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {regError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    data-ocid="login.register.submit_button"
                    className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
