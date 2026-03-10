import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Loader2, MessageCircle, Plane } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useLoginUser, useRegisterUser } from "../hooks/useQueries";
import type { UserPage as Page } from "./UserApp";

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

  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");

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
      const user = await a.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
        onNavigate("home");
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
    setEmailExists(false);
    setExistingEmail("");
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
        onNavigate("home");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("already exists")) {
        setEmailExists(true);
        setExistingEmail(regEmail.trim().toLowerCase());
      } else {
        setRegError("Registration failed. Please try again.");
      }
    }
  };

  const switchToLoginWithEmail = () => {
    setLoginEmail(existingEmail);
    setLoginPassword("");
    setLoginError("");
    setEmailExists(false);
    setRegError("");
    setActiveTab("login");
  };

  const forgotPasswordWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi, I forgot my password for my BobbyTravels account. My registered email is: ${loginEmail}`,
    );
    window.open(`https://wa.me/919815480825?text=${msg}`, "_blank");
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                ref={tabsRef as React.RefObject<HTMLDivElement>}
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

              {/* LOGIN TAB */}
              <TabsContent value="login" className="p-6 space-y-4 mt-0">
                {!showForgotPassword ? (
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <button
                          type="button"
                          data-ocid="login.forgot_password.button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-gold hover:underline focus:outline-none"
                        >
                          Forgot password?
                        </button>
                      </div>
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
                ) : (
                  <div
                    data-ocid="login.forgot_password.panel"
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-gold" />
                      </div>
                      <h3 className="font-semibold text-base">
                        Forgot your password?
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        No worries! Contact our support team on WhatsApp and
                        we'll help you reset your password.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="forgot-email">
                        Your registered email (optional)
                      </Label>
                      <Input
                        id="forgot-email"
                        data-ocid="login.forgot_email.input"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button
                      type="button"
                      data-ocid="login.forgot_whatsapp.button"
                      onClick={forgotPasswordWhatsApp}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Support on WhatsApp
                    </Button>
                    <button
                      type="button"
                      data-ocid="login.back_to_login.button"
                      onClick={() => setShowForgotPassword(false)}
                      className="w-full text-sm text-muted-foreground hover:text-foreground text-center focus:outline-none"
                    >
                      &larr; Back to login
                    </button>
                  </div>
                )}
              </TabsContent>

              {/* REGISTER TAB */}
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
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        setEmailExists(false);
                      }}
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

                  {/* Email already exists banner */}
                  {emailExists && (
                    <div
                      data-ocid="login.email_exists.error_state"
                      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-800 font-medium">
                          An account with this email already exists.
                        </p>
                      </div>
                      <p className="text-xs text-amber-700 pl-6">
                        Please login with your existing account, or use a
                        different email to register.
                      </p>
                      <Button
                        type="button"
                        data-ocid="login.switch_to_login.button"
                        onClick={switchToLoginWithEmail}
                        size="sm"
                        className="ml-6 bg-gold hover:bg-gold/90 text-navy-dark font-semibold"
                      >
                        Login instead
                      </Button>
                    </div>
                  )}

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
