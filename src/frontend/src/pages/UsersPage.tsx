import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useQueries";
import { Lock, Shield, Users } from "lucide-react";
import { motion } from "motion/react";

export function UsersPage() {
  const { data: isAdmin } = useIsAdmin();
  const { principal, isLoggedIn } = useAuth();

  if (!isAdmin) {
    return (
      <main
        data-ocid="users.page"
        className="min-h-screen bg-sky-pale pt-24 pb-16"
      >
        <div className="max-w-md mx-auto px-4 text-center mt-20">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground font-ui text-sm leading-relaxed">
            The user management dashboard is only available to administrators.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      data-ocid="users.page"
      className="min-h-screen bg-sky-pale pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                User <span className="text-navy">Management</span>
              </h1>
              <p className="text-muted-foreground font-ui text-sm mt-1">
                Identity-based access management via Internet Computer
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-sm font-display font-semibold px-4 py-1.5 rounded-full border-navy/20 text-navy"
            >
              <Users className="w-4 h-4 mr-1.5" />
              IC-based auth
            </Badge>
          </div>
        </motion.div>

        {/* Info Card */}
        <Card className="border-0 shadow-flight rounded-3xl overflow-hidden mb-6">
          <div className="bg-emerald-600 px-6 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-base leading-tight">
                Internet Identity Authentication
              </p>
              <p className="text-emerald-100 text-xs font-ui">
                Users are authenticated via cryptographic principals — no
                passwords stored
              </p>
            </div>
          </div>
          <CardContent className="px-6 py-5 space-y-4">
            <p className="text-sm text-muted-foreground font-ui leading-relaxed">
              BobbyTravels uses{" "}
              <strong className="text-foreground">Internet Identity</strong> for
              user authentication. Each user has a unique cryptographic
              principal ID instead of a username and password. This means:
            </p>
            <ul className="space-y-2 text-sm font-ui text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                No passwords to store, manage, or breach
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Users authenticate with biometrics (Face ID, fingerprint, PIN)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Each user identity is cryptographically secured on-chain
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                Role management (admin/user/guest) is stored on the Internet
                Computer
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Current admin info */}
        {isLoggedIn && principal && (
          <Card className="border border-dashed border-gold/40 shadow-none rounded-3xl bg-transparent">
            <CardHeader className="pb-2 pt-5 px-6">
              <p className="text-sm font-ui font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                Your Admin Principal
              </p>
            </CardHeader>
            <CardContent className="px-6 pb-5">
              <p className="text-xs font-mono text-foreground/70 break-all leading-relaxed bg-secondary/50 rounded-xl px-3 py-2">
                {principal}
              </p>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground font-ui leading-relaxed">
                Customer enquiries submitted via the booking form are visible in
                the <strong className="text-foreground">Leads Dashboard</strong>
                . User profiles saved via Internet Identity are stored privately
                on the Internet Computer canister.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          data-ocid="users.empty_state"
          className="mt-6 flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
            <Users className="w-7 h-7 text-navy-dark" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">
            No User Registry
          </h3>
          <p className="text-muted-foreground font-ui text-sm max-w-sm leading-relaxed">
            User identities are managed by Internet Identity — a
            privacy-preserving, decentralised authentication system. No
            centralised user list is maintained.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
