import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { InstallBanner } from "./components/InstallBanner";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PNRPage } from "./pages/PNRPage";
import { PaymentPage } from "./pages/PaymentPage";
import { SearchPage } from "./pages/SearchPage";
import { ToursPage } from "./pages/ToursPage";
import { VisaPage } from "./pages/VisaPage";

export type Page =
  | "home"
  | "search"
  | "visa"
  | "tours"
  | "pnr"
  | "contact"
  | "payment"
  | "login"
  | "dashboard";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  useEffect(() => {
    const titles: Record<Page, string> = {
      home: "BobbyTravels – Your Trusted Travel Partner",
      search: "Book a Flight – BobbyTravels",
      visa: "Visa Services – BobbyTravels",
      tours: "Tour Packages – BobbyTravels",
      pnr: "PNR Check – BobbyTravels",
      contact: "Contact Us – BobbyTravels",
      payment: "Secure Payment – BobbyTravels",
      login: "Login / Register – BobbyTravels",
      dashboard: "Admin Dashboard – BobbyTravels",
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "search":
        return <SearchPage />;
      case "visa":
        return <VisaPage />;
      case "tours":
        return <ToursPage />;
      case "pnr":
        return <PNRPage />;
      case "contact":
        return <ContactPage />;
      case "payment":
        return <PaymentPage />;
      case "login":
        return <LoginPage onNavigate={setCurrentPage} />;
      case "dashboard":
        return <AdminDashboard />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1">{renderPage()}</div>
        <Footer />
        <Toaster richColors position="top-right" />
        <InstallBanner />
      </div>
    </AuthProvider>
  );
}
