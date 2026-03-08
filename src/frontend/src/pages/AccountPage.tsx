import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Phone,
  Save,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

type Page =
  | "home"
  | "search"
  | "account"
  | "payment"
  | "contact"
  | "leads"
  | "users";

interface AccountPageProps {
  onNavigate?: (page: Page) => void;
}

function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  required,
  autoComplete,
  "data-ocid": ocid,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  "data-ocid"?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        data-ocid={ocid}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="h-11 rounded-xl pr-10"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    setLoading(false);
    if ("ok" in result) {
      toast.success("Welcome back!");
      onSuccess?.();
    } else {
      toast.error(result.err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="loginEmail" className="text-sm font-ui font-medium">
          Email Address
        </Label>
        <Input
          id="loginEmail"
          data-ocid="account.login.email.input"
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="loginPassword" className="text-sm font-ui font-medium">
          Password
        </Label>
        <PasswordInput
          id="loginPassword"
          data-ocid="account.login.password.input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Your password"
          required
          autoComplete="current-password"
        />
      </div>
      <Button
        type="submit"
        data-ocid="account.login.submit_button"
        disabled={loading}
        className="w-full h-11 bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-base shadow-gold hover:shadow-none rounded-xl"
      >
        {loading ? (
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        ) : (
          <LogIn className="mr-2 w-4 h-4" />
        )}
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const set =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    const result = await register(
      form.email.trim(),
      form.password,
      form.name.trim(),
      form.phone.trim() || undefined,
    );
    setLoading(false);
    if ("ok" in result) {
      toast.success("Account created! Welcome to BobbyTravels.");
      onSuccess?.();
    } else {
      toast.error(result.err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="regName" className="text-sm font-ui font-medium">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="regName"
          data-ocid="account.register.name.input"
          placeholder="Raj Kumar"
          value={form.name}
          onChange={set("name")}
          required
          autoComplete="name"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="regEmail" className="text-sm font-ui font-medium">
          Email Address <span className="text-destructive">*</span>
        </Label>
        <Input
          id="regEmail"
          data-ocid="account.register.email.input"
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={set("email")}
          required
          autoComplete="email"
          className="h-11 rounded-xl"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="regPassword" className="text-sm font-ui font-medium">
            Password <span className="text-destructive">*</span>
          </Label>
          <PasswordInput
            id="regPassword"
            data-ocid="account.register.password.input"
            value={form.password}
            onChange={set("password")}
            placeholder="Min. 6 characters"
            required
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="regConfirm" className="text-sm font-ui font-medium">
            Confirm Password <span className="text-destructive">*</span>
          </Label>
          <PasswordInput
            id="regConfirm"
            data-ocid="account.register.confirm.input"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            placeholder="Repeat password"
            required
            autoComplete="new-password"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="regPhone" className="text-sm font-ui font-medium">
          Phone / WhatsApp{" "}
          <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="regPhone"
          data-ocid="account.register.phone.input"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          value={form.phone}
          onChange={set("phone")}
          autoComplete="tel"
          className="h-11 rounded-xl"
        />
      </div>
      <Button
        type="submit"
        data-ocid="account.register.submit_button"
        disabled={loading}
        className="w-full h-11 bg-navy hover:bg-navy-light text-white font-display font-bold text-base rounded-xl"
      >
        {loading ? (
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="mr-2 w-4 h-4" />
        )}
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { session, isLoggedIn, logout, updateProfile } = useAuth();

  const [formName, setFormName] = useState(session?.name || "");
  const [formPhone, setFormPhone] = useState(session?.phone || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Keep form in sync with session
  const handleSessionLoad = () => {
    setFormName(session?.name || "");
    setFormPhone(session?.phone || "");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Name is required.");
      return;
    }
    setSaving(true);
    updateProfile(formName.trim(), formPhone.trim() || undefined);
    setSaving(false);
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 3000);
  };

  const initials = (session?.name || "?")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-sky-pale pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-4xl text-foreground mb-2">
                My <span className="text-navy">Account</span>
              </h1>
              <p className="text-muted-foreground">
                Sign in or create an account to manage your bookings.
              </p>
            </div>

            <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
              <CardHeader className="hero-gradient p-6 text-center">
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-3">
                  <LogIn className="w-7 h-7 text-navy-dark" />
                </div>
                <CardTitle className="text-white font-display text-xl">
                  Welcome to BobbyTravels
                </CardTitle>
                <CardDescription className="text-white/60 mt-1 text-sm">
                  Book smarter, travel better.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <Tabs defaultValue="login" data-ocid="account.auth.tab">
                  <TabsList className="w-full bg-secondary h-11 p-1 rounded-xl mb-6">
                    <TabsTrigger
                      value="login"
                      data-ocid="account.login.tab"
                      className="flex-1 text-sm font-ui rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white"
                    >
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger
                      value="register"
                      data-ocid="account.register.tab"
                      className="flex-1 text-sm font-ui rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white"
                    >
                      Create Account
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <LoginForm onSuccess={handleSessionLoad} />
                  </TabsContent>

                  <TabsContent value="register">
                    <RegisterForm onSuccess={handleSessionLoad} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-pale pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-5"
        >
          {/* Profile header */}
          <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
            <div className="hero-gradient p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-gold/50">
                  <AvatarFallback className="bg-gold text-navy-dark font-display font-bold text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white text-xl truncate">
                    {session?.name || "Traveler"}
                  </p>
                  <p className="text-white/60 text-sm font-ui truncate">
                    {session?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {session?.isAdmin && (
                      <Badge className="bg-gold text-navy-dark text-xs font-ui font-semibold px-2 py-0.5 rounded-full border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                    {session?.phone && (
                      <span className="text-white/50 text-xs font-ui flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {session.phone}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  data-ocid="account.logout.button"
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white/60 hover:text-white hover:bg-white/10 gap-2 flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Admin Dashboard Card */}
          {session?.isAdmin && (
            <Card
              data-ocid="account.admin.card"
              className="border-0 shadow-flight rounded-3xl overflow-hidden"
            >
              <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-white text-base leading-tight">
                    Admin Access Active
                  </p>
                  <p className="text-emerald-100 text-xs font-ui">
                    You have full access to the admin dashboard
                  </p>
                </div>
              </div>
              <CardContent className="px-6 py-5">
                <p className="text-sm text-muted-foreground font-ui mb-4">
                  Manage all customer enquiries, lead statuses, and registered
                  users.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    data-ocid="account.leads.button"
                    onClick={() => onNavigate?.("leads")}
                    className="flex-1 bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-sm rounded-xl h-11 shadow-gold hover:shadow-none gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Leads Dashboard
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </Button>
                  <Button
                    data-ocid="account.users.button"
                    onClick={() => onNavigate?.("users")}
                    variant="outline"
                    className="flex-1 border-navy/30 text-navy hover:bg-navy hover:text-white font-display font-bold text-sm rounded-xl h-11 gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Users
                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Profile */}
          <Card className="border-0 shadow-flight rounded-3xl">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="font-display text-xl text-foreground">
                Edit Profile
              </CardTitle>
              <CardDescription>
                Update your name and phone number.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="profileName"
                    className="text-sm font-ui font-medium"
                  >
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="profileName"
                    data-ocid="account.profile.name.input"
                    placeholder="Your full name"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-11 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="profileEmail"
                    className="text-sm font-ui font-medium"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="profileEmail"
                    type="email"
                    value={session?.email || ""}
                    readOnly
                    disabled
                    className="h-11 rounded-xl bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground font-ui">
                    Email cannot be changed after registration.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="profilePhone"
                    className="text-sm font-ui font-medium"
                  >
                    Phone / WhatsApp{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="profilePhone"
                    data-ocid="account.profile.phone.input"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    autoComplete="tel"
                    className="h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="account.profile.save_button"
                  disabled={saving}
                  className="w-full bg-navy hover:bg-navy-light text-white font-ui font-semibold rounded-xl h-11"
                >
                  {saving ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="mr-2 w-4 h-4" />
                  ) : (
                    <Save className="mr-2 w-4 h-4" />
                  )}
                  {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account info */}
          <Card className="border border-dashed border-border/60 shadow-none rounded-3xl bg-transparent">
            <CardContent className="px-6 py-5">
              <Separator className="mb-4" />
              <p className="text-xs text-muted-foreground font-ui text-center leading-relaxed">
                Your data is stored securely.{" "}
                <button
                  type="button"
                  data-ocid="account.logout.secondary_button"
                  onClick={logout}
                  className="text-destructive hover:underline font-semibold"
                >
                  Sign out
                </button>{" "}
                to leave this device.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
