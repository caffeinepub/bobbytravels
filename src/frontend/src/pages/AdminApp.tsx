import { Toaster } from "@/components/ui/sonner";
import { LogOut, Shield } from "lucide-react";
import { useEffect } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLoginPage } from "./AdminLoginPage";

function AdminAppInner() {
  const { currentUser, isAdmin, isLoading, logout } = useAuth();

  useEffect(() => {
    document.title = "Admin Panel – BobbyTravels";
  }, []);

  if (isLoading) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="min-h-screen bg-[#0a0f1e] flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <p className="text-white/60 text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AdminLoginPage />;
  }

  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.error_state"
        className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-4"
      >
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-white/60 text-sm mb-6">
            You don&apos;t have admin privileges. Please contact support if you
            believe this is an error.
          </p>
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={logout}
            className="px-5 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1e]">
      {/* Admin Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center shadow">
                <Shield className="w-5 h-5 text-navy-dark" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-white text-base tracking-wide">
                  Bobby<span className="text-gold">Travels</span>
                </span>
                <span className="text-[10px] text-white/50 tracking-widest uppercase">
                  Admin Panel
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm hidden sm:block">
                {currentUser.email}
              </span>
              <button
                type="button"
                data-ocid="admin.logout.button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <div className="flex-1 pt-16">
        <AdminDashboard />
      </div>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export function AdminApp() {
  return (
    <AuthProvider>
      <AdminAppInner />
    </AuthProvider>
  );
}
