import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useInitializeAccessControl,
  useIsCallerAdmin,
  useSaveCallerUserProfile,
} from "@/hooks/useQueries";
import {
  CheckCircle,
  KeyRound,
  Loader2,
  LogIn,
  LogOut,
  Save,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function AccountPage() {
  const {
    login,
    clear,
    isLoggingIn,
    isLoginSuccess,
    isInitializing,
    identity,
  } = useInternetIdentity();

  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { mutateAsync: saveProfile, isPending: savePending } =
    useSaveCallerUserProfile();
  const { data: isAdmin } = useIsCallerAdmin();
  const { mutateAsync: claimAdmin, isPending: claimPending } =
    useInitializeAccessControl();

  const isLoggedIn = !!identity;

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [showAdminSection, setShowAdminSection] = useState(false);

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormName(profile.name || "");
      setFormEmail(profile.email || "");
      setFormPhone(profile.phone || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      toast.error("Name and email are required.");
      return;
    }
    try {
      await saveProfile({
        name: formName,
        email: formEmail,
        phone: formPhone || undefined,
      });
      setSaved(true);
      toast.success("Profile saved successfully!");
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleClaimAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken.trim()) {
      toast.error("Please enter the admin secret token.");
      return;
    }
    try {
      await claimAdmin(adminToken.trim());
      toast.success(
        "Admin access granted! You can now view the Leads dashboard.",
      );
      setAdminToken("");
      setShowAdminSection(false);
    } catch {
      toast.error(
        "Invalid token or admin already assigned. Please check the token and try again.",
      );
    }
  };

  const initials = formName
    ? formName
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";

  const principal = identity?.getPrincipal().toString();
  const shortPrincipal = principal
    ? `${principal.slice(0, 6)}...${principal.slice(-4)}`
    : "";

  return (
    <main className="min-h-screen bg-sky-pale pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
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
              Manage your profile and booking preferences
            </p>
          </div>

          {isInitializing ? (
            <Card className="border-0 shadow-flight rounded-3xl">
              <CardContent className="p-8 space-y-4">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-4 w-48 mx-auto" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-11 w-full rounded-xl" />
              </CardContent>
            </Card>
          ) : !isLoggedIn ? (
            /* Login Panel */
            <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
              <CardHeader className="hero-gradient p-8 text-center">
                <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-navy-dark" />
                </div>
                <CardTitle className="text-white font-display text-2xl">
                  Sign In to Your Account
                </CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  Access your booking history, saved preferences, and manage
                  your travel profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="bg-sky-pale rounded-2xl p-5 text-sm text-muted-foreground leading-relaxed">
                    <p className="font-semibold text-foreground mb-1">
                      Why create an account?
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Save your travel preferences</li>
                      <li>Track your booking enquiries</li>
                      <li>Faster checkout for future bookings</li>
                      <li>Exclusive member deals</li>
                    </ul>
                  </div>

                  <Button
                    data-ocid="account.login.button"
                    size="lg"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="w-full h-13 bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-base shadow-gold hover:shadow-none rounded-xl"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    ) : (
                      <LogIn className="mr-2 w-5 h-5" />
                    )}
                    {isLoggingIn ? "Signing in..." : "Sign In / Register"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    Secure login powered by Internet Identity. No password
                    required.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Profile Panel */
            <div className="space-y-5">
              {/* Profile header */}
              <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
                <div className="hero-gradient p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-gold/50">
                      <AvatarFallback className="bg-gold text-navy-dark font-display font-bold text-xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-display font-bold text-white text-xl">
                        {formName || "Traveler"}
                      </p>
                      <p className="text-white/50 text-xs font-ui font-mono">
                        {shortPrincipal}
                      </p>
                      {isLoginSuccess && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-300 text-xs font-ui">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-auto">
                      <Button
                        data-ocid="account.logout.button"
                        variant="ghost"
                        size="sm"
                        onClick={clear}
                        className="text-white/60 hover:text-white hover:bg-white/10 gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Admin status badge */}
              {isAdmin && (
                <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-ui font-semibold text-emerald-700">
                    Admin Access Active -- You can view the Leads Dashboard
                  </span>
                </div>
              )}

              {/* Profile form */}
              <Card className="border-0 shadow-flight rounded-3xl">
                <CardHeader className="pb-3 px-6 pt-6">
                  <CardTitle className="font-display text-xl text-foreground">
                    Profile Details
                  </CardTitle>
                  <CardDescription>
                    This information will be pre-filled in your booking forms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {profileLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-11 w-full rounded-xl" />
                      <Skeleton className="h-11 w-full rounded-xl" />
                      <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                  ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="profileName"
                          className="text-sm font-ui font-medium"
                        >
                          Full Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="profileName"
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
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="profileEmail"
                          type="email"
                          placeholder="you@email.com"
                          value={formEmail}
                          onChange={(e) => setFormEmail(e.target.value)}
                          required
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
                        disabled={savePending}
                        className="w-full bg-navy hover:bg-navy-light text-white font-ui font-semibold rounded-xl h-11"
                      >
                        {savePending ? (
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                        ) : saved ? (
                          <CheckCircle className="mr-2 w-4 h-4" />
                        ) : (
                          <Save className="mr-2 w-4 h-4" />
                        )}
                        {savePending
                          ? "Saving..."
                          : saved
                            ? "Saved!"
                            : "Save Profile"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
              {/* Claim Admin Access */}
              {!isAdmin && (
                <Card className="border border-dashed border-border/60 shadow-none rounded-3xl bg-transparent">
                  <CardContent className="px-6 py-5">
                    {!showAdminSection ? (
                      <button
                        type="button"
                        data-ocid="account.admin.open_modal_button"
                        onClick={() => setShowAdminSection(true)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-ui"
                      >
                        <KeyRound className="w-4 h-4" />
                        Have an admin token? Claim admin access
                      </button>
                    ) : (
                      <form onSubmit={handleClaimAdmin} className="space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <KeyRound className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-ui font-semibold text-foreground">
                            Claim Admin Access
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-ui">
                          Enter the admin secret token to gain admin privileges.
                        </p>
                        <Input
                          data-ocid="account.admin.input"
                          type="password"
                          placeholder="Enter admin secret token"
                          value={adminToken}
                          onChange={(e) => setAdminToken(e.target.value)}
                          className="h-11 rounded-xl"
                        />
                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            data-ocid="account.admin.submit_button"
                            disabled={claimPending}
                            className="flex-1 bg-navy hover:bg-navy-light text-white font-ui font-semibold rounded-xl h-10"
                          >
                            {claimPending ? (
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            ) : (
                              <Shield className="mr-2 w-4 h-4" />
                            )}
                            {claimPending ? "Claiming..." : "Claim Admin"}
                          </Button>
                          <Button
                            type="button"
                            data-ocid="account.admin.cancel_button"
                            variant="ghost"
                            onClick={() => {
                              setShowAdminSection(false);
                              setAdminToken("");
                            }}
                            className="rounded-xl h-10 px-4"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
