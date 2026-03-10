import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { InstallBanner } from "../components/InstallBanner";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import { ContactPage } from "./ContactPage";
import { HomePage } from "./HomePage";
import { PNRPage } from "./PNRPage";
import { PaymentPage } from "./PaymentPage";
import { SearchPage } from "./SearchPage";
import { ToursPage } from "./ToursPage";
import { VisaPage } from "./VisaPage";

export type UserPage =
  | "home"
  | "search"
  | "visa"
  | "tours"
  | "pnr"
  | "contact"
  | "payment";

export function UserApp() {
  const [currentPage, setCurrentPage] = useState<UserPage>("home");

  useEffect(() => {
    const titles: Record<UserPage, string> = {
      home: "BobbyTravels – Your Trusted Travel Partner",
      search: "Book a Flight – BobbyTravels",
      visa: "Visa Services – BobbyTravels",
      tours: "Tour Packages – BobbyTravels",
      pnr: "PNR Check – BobbyTravels",
      contact: "Contact Us – BobbyTravels",
      payment: "Secure Payment – BobbyTravels",
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
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          hideAuth
        />
        <div className="flex-1">{renderPage()}</div>
        <Footer />
        <Toaster richColors position="top-right" />
        <InstallBanner />
      </div>
    </AuthProvider>
  );
}
