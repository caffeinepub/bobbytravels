import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AccountPage } from "./pages/AccountPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { PaymentPage } from "./pages/PaymentPage";
import { SearchPage } from "./pages/SearchPage";

type Page = "home" | "search" | "account" | "payment" | "contact";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // Update document title on page change
  useEffect(() => {
    const titles: Record<Page, string> = {
      home: "BobbyTravels – Best Flight Deals",
      search: "Book a Flight – BobbyTravels",
      account: "My Account – BobbyTravels",
      payment: "Secure Payment – BobbyTravels",
      contact: "Contact Us – BobbyTravels",
    };
    document.title = titles[currentPage];

    // Update meta description
    const metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (metaDesc) {
      const descs: Record<Page, string> = {
        home: "BobbyTravels – Find the best flight deals. Get personalized flight quotes directly on WhatsApp.",
        search:
          "Search and book flights with BobbyTravels. One way, return, or flexible trips.",
        account: "Manage your BobbyTravels account and profile.",
        payment:
          "Secure UPI/Google Pay payment for your BobbyTravels flight booking.",
        contact: "Contact BobbyTravels via WhatsApp, phone, or email.",
      };
      metaDesc.content = descs[currentPage];
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />;
      case "search":
        return <SearchPage />;
      case "account":
        return <AccountPage />;
      case "payment":
        return <PaymentPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1">{renderPage()}</div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}
