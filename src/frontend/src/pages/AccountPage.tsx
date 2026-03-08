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
import { useAuth } from "@/hooks/useAuth";
import {
  useGetMyProfile,
  useInitializeAccessControl,
  useIsAdmin,
  useSaveMyProfile,
} from "@/hooks/useQueries";
import { getSecretParameter } from "@/utils/urlParams";
import {
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Loader2,
  LogIn,
  LogOut,
  Save,
  Shield,
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

export function AccountPage({ onNavigate }: AccountPageProps) {
  const { isLoggedIn, isInitializing, principal, login, logout } = useAuth();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: profile } = useGetMyProfile();
  const saveProfileMutation = useSaveMyProfile();
  const claimAdminMutation = useInitializeAccessControl();

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [saved, setSaved] = useState(false);

  // Sync form fields when profile loads
  const profileName = profile?.name ?? "";
  const profileEmail = profile?.email ?? "";
  const profilePhone = profile?.phone ?? "";

  const displayName = formName || profileName || "Traveler";

  const initials =
    displayName
      .split(" ")
      .slice(0, 2)
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "?";

  const truncatedPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : "";

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formName || profileName;
    const email = formEmail || profileEmail;
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    try {
      await saveProfileMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: (formPhone || profilePhone).trim() || undefined,
      });
      setSaved(true);
      toast.success("Profile updated!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  const handleClaimAdmin = async () => {
    const token = getSecretParameter("caffeineAdminToken");
    if (!token) {
      toast.error(
        "Admin token not found. Please open this page via the admin activation link.",
      );
      return;
    }
    try {
      await claimAdminMutation.mutateAsync(token);
      toast.success("Admin access activated!");
    } catch {
      toast.error("Failed to claim admin access. The token may be invalid.");
    }
  };

  if (isInitializing) {
    return (
      <main className="min-h-screen bg-sky-pale pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-navy" />
        </div>
      </main>
    );
  }

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
                Sign in to manage your bookings and preferences.
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
                  Secure, password-free login via Internet Identity
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                <Button
                  data-ocid="account.ii_login.button"
                  onClick={login}
                  className="w-full h-12 bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-base shadow-gold hover:shadow-none rounded-xl gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In with Internet Identity
                </Button>

                <div className="bg-secondary/60 rounded-xl p-4 text-xs text-muted-foreground font-ui leading-relaxed">
                  <p className="font-semibold text-foreground mb-1">
                    What is Internet Identity?
                  </p>
                  <p>
                    Internet Identity is a secure, biometric login system built
                    on the Internet Computer. No passwords — use your
                    fingerprint, face ID, or device PIN. Your identity is
                    private and cannot be tracked across sites.
                  </p>
                </div>
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
                    {displayName}
                  </p>
                  <p className="text-white/60 text-xs font-mono mt-0.5 truncate">
                    {truncatedPrincipal}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {isAdmin && (
                      <Badge className="bg-gold text-navy-dark text-xs font-ui font-semibold px-2 py-0.5 rounded-full border-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Admin
                      </Badge>
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
          {isAdmin && (
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

          {/* Claim Admin Access (only if NOT already admin and not loading) */}
          {!isAdminLoading && !isAdmin && (
            <Card className="border border-dashed border-gold/40 shadow-none rounded-3xl bg-transparent">
              <CardContent className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-ui font-semibold text-foreground mb-1">
                      Activate Admin Access
                    </p>
                    <p className="text-xs text-muted-foreground font-ui mb-3 leading-relaxed">
                      If you have an admin activation link, click below to
                      unlock the Leads Dashboard.
                    </p>
                    <Button
                      data-ocid="account.claim_admin.button"
                      variant="outline"
                      size="sm"
                      onClick={handleClaimAdmin}
                      disabled={claimAdminMutation.isPending}
                      className="border-gold/40 text-gold hover:bg-gold hover:text-navy-dark hover:border-gold font-ui font-semibold rounded-xl h-9 gap-2 text-xs"
                    >
                      {claimAdminMutation.isPending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Shield className="w-3.5 h-3.5" />
                      )}
                      {claimAdminMutation.isPending
                        ? "Activating..."
                        : "Activate Admin Access"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Profile */}
          <Card className="border-0 shadow-flight rounded-3xl">
            <CardHeader className="pb-3 px-6 pt-6">
              <CardTitle className="font-display text-xl text-foreground">
                Profile Details
              </CardTitle>
              <CardDescription>
                Update your name, email and phone number.
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
                    placeholder={profileName || "Your full name"}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
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
                    placeholder={profileEmail || "you@email.com"}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    autoComplete="email"
                    className="h-11 rounded-xl"
                  />
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
                    placeholder={profilePhone || "+91 XXXXX XXXXX"}
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    autoComplete="tel"
                    className="h-11 rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  data-ocid="account.profile.save_button"
                  disabled={saveProfileMutation.isPending}
                  className="w-full bg-navy hover:bg-navy-light text-white font-ui font-semibold rounded-xl h-11"
                >
                  {saveProfileMutation.isPending ? (
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  ) : saved ? (
                    <CheckCircle className="mr-2 w-4 h-4" />
                  ) : (
                    <Save className="mr-2 w-4 h-4" />
                  )}
                  {saveProfileMutation.isPending
                    ? "Saving..."
                    : saved
                      ? "Saved!"
                      : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account info */}
          <Card className="border border-dashed border-border/60 shadow-none rounded-3xl bg-transparent">
            <CardContent className="px-6 py-5">
              <Separator className="mb-4" />
              <p className="text-xs text-muted-foreground font-ui text-center leading-relaxed">
                Your identity is stored securely on the Internet Computer.{" "}
                <button
                  type="button"
                  data-ocid="account.logout.secondary_button"
                  onClick={logout}
                  className="text-destructive hover:underline font-semibold"
                >
                  Sign out
                </button>{" "}
                to disconnect from this device.
              </p>
            </CardContent>
          </Card>

          {/* Principal info */}
          {principal && (
            <Card className="border border-dashed border-border/40 shadow-none rounded-3xl bg-transparent">
              <CardContent className="px-6 py-4">
                <p className="text-xs text-muted-foreground font-ui mb-1 font-semibold">
                  Your Principal ID
                </p>
                <p className="text-xs font-mono text-foreground/70 break-all leading-relaxed">
                  {principal}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </main>
  );
}
