import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { sha256 } from "../utils/crypto";
import type { UserPage } from "./UserApp";

const ADMIN_EMAIL = "adityabholath@gmail.com";
const isAdminSubdomain =
  window.location.hostname.startsWith("admin.") ||
  window.location.hostname === "admin.bobbytravels.online";

export function LoginPage({
  onNavigate,
}: { onNavigate: (page: UserPage) => void }) {
  const { actor } = useActor();
  const { login } = useAuth();

  const [tab, setTab] = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connecting to server…");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const hash = await sha256(loginPassword);
      const token = await actor.loginUser(
        loginEmail.trim().toLowerCase(),
        hash,
      );
      if (!token) {
        setError("Invalid email or password.");
        return;
      }
      const user = await actor.validateSession(token);
      if (user) {
        login(token, user);
        toast.success(`Welcome back, ${user.name}!`);
        onNavigate("home");
      } else {
        setError("Login failed. Please try again.");
      }
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Connecting to server…");
      return;
    }
    if (isAdminSubdomain && regEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError("Only the admin email can register on this subdomain.");
      return;
    }
    setLoading(true);
    setError("");
    setDuplicateEmail(false);
    try {
      const hash = await sha256(regPassword);
      const token = await actor.registerUser(
        regEmail.trim().toLowerCase(),
        hash,
        regName.trim(),
        regPhone.trim() || null,
      );
      if (!token) {
        setError("Registration failed. Please try again.");
        return;
      }
      const user = await actor.validateSession(token);
      if (user) {
        login(token, user);
        toast.success("Account created! Welcome to BobbyTravels.");
        onNavigate("home");
      } else {
        setError("Registration failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.toLowerCase().includes("already") ||
        msg.toLowerCase().includes("exist")
      ) {
        setDuplicateEmail(true);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (forgotMode) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
          <h2 className="text-xl font-bold text-foreground mb-2 font-display">
            Forgot Password
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            We'll connect you with our support team on WhatsApp to reset your
            password.
          </p>
          <a
            href={`https://wa.me/919815480825?text=${encodeURIComponent(`Hi, I need help resetting my password for email: ${prefilledEmail}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors"
          >
            Contact Support on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setForgotMode(false)}
            className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground text-center"
          >
            ← Back to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground font-display">
            Welcome to BobbyTravels
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Login or create an account to manage your bookings
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList
              className="w-full rounded-none border-b border-border h-12 bg-muted/50"
              data-ocid="auth.tab"
            >
              <TabsTrigger
                value="login"
                data-ocid="auth.login.tab"
                className="flex-1 h-10 gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                data-ocid="auth.register.tab"
                className="flex-1 h-10 gap-1.5"
              >
                <UserPlus className="w-4 h-4" /> Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    data-ocid="auth.email.input"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="login-pass" className="text-sm">
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setPrefilledEmail(loginEmail);
                      }}
                      className="text-xs text-muted-foreground hover:text-gold transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-pass"
                      data-ocid="auth.password.input"
                      type={showPass ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive" data-ocid="auth.error_state">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  data-ocid="auth.login.submit_button"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {loading ? "Logging in…" : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="p-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="reg-name" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="reg-name"
                    data-ocid="auth.name.input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-phone" className="text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="reg-phone"
                    data-ocid="auth.phone.input"
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98154 80825"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-email" className="text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="reg-email"
                    data-ocid="auth.reg.email.input"
                    type="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      setDuplicateEmail(false);
                    }}
                    placeholder="you@example.com"
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="reg-pass" className="text-sm">
                    Password
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="reg-pass"
                      data-ocid="auth.reg.password.input"
                      type={showPass ? "text" : "password"}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      minLength={6}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                {duplicateEmail && (
                  <Alert
                    className="border-amber-500/50 bg-amber-500/10"
                    data-ocid="auth.duplicate.error_state"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <AlertDescription className="text-amber-400">
                      This email is already registered.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setTab("login");
                          setLoginEmail(regEmail);
                          setDuplicateEmail(false);
                        }}
                        className="underline font-medium"
                      >
                        Login instead
                      </button>
                    </AlertDescription>
                  </Alert>
                )}
                {error && !duplicateEmail && (
                  <Alert variant="destructive" data-ocid="auth.error_state">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  type="submit"
                  data-ocid="auth.register.submit_button"
                  disabled={loading}
                  className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
