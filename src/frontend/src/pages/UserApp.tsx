import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { InstallBanner } from "../components/InstallBanner";
import { Navbar } from "../components/Navbar";
import { AuthProvider } from "../contexts/AuthContext";
import { AirlineHelplinePage } from "./AirlineHelplinePage";
import { ContactPage } from "./ContactPage";
import { FlightInquiryPage } from "./FlightInquiryPage";
import { HomePage } from "./HomePage";
import { LoginPage } from "./LoginPage";
import { MyBookingsPage } from "./MyBookingsPage";
import { PNRPage } from "./PNRPage";
import { ToursPage } from "./ToursPage";
import { VisaPage } from "./VisaPage";

export type UserPage =
  | "home"
  | "bookFlight"
  | "visa"
  | "tours"
  | "pnr"
  | "airlineHelpline"
  | "contact"
  | "login"
  | "myBookings";

export function UserApp() {
  const [currentPage, setCurrentPage] = useState<UserPage>("home");

  useEffect(() => {
    const titles: Record<UserPage, string> = {
      home: "BobbyTravels – Your Trusted Travel Partner",
      bookFlight: "Book Flight – BobbyTravels",
      visa: "Visa Services – BobbyTravels",
      tours: "Tour Packages – BobbyTravels",
      pnr: "PNR Check – BobbyTravels",
      airlineHelpline: "Airline Helpline – BobbyTravels",
      contact: "Contact Us – BobbyTravels",
      login: "Login – BobbyTravels",
      myBookings: "My Bookings – BobbyTravels",
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  const navigate = (page: UserPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "bookFlight":
        return <FlightInquiryPage />;
      case "visa":
        return <VisaPage />;
      case "tours":
        return <ToursPage />;
      case "pnr":
        return <PNRPage />;
      case "airlineHelpline":
        return <AirlineHelplinePage />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <LoginPage onNavigate={navigate} />;
      case "myBookings":
        return <MyBookingsPage onNavigate={navigate} />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar currentPage={currentPage} onNavigate={navigate} />
        <div className="flex-1">{renderPage()}</div>
        <Footer onNavigate={navigate} />
        <Toaster richColors position="top-right" />
        <InstallBanner />
      </div>
    </AuthProvider>
  );
}
