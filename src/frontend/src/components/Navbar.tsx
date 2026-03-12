import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, LogIn, LogOut, Menu, Phone, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { UserPage } from "../pages/UserApp";

interface NavbarProps {
  currentPage: UserPage;
  onNavigate: (page: UserPage) => void;
  hideAuth?: boolean;
}

const NAV_LINKS: { label: string; page: UserPage; ocid: string }[] = [
  { label: "Home", page: "home", ocid: "nav.home.link" },
  { label: "Book Flight", page: "bookFlight", ocid: "nav.bookflight.link" },
  { label: "Visa", page: "visa", ocid: "nav.visa.link" },
  { label: "Tours", page: "tours", ocid: "nav.tours.link" },
  { label: "PNR Check", page: "pnr", ocid: "nav.pnr.link" },
  { label: "Helpline", page: "airlineHelpline", ocid: "nav.helpline.link" },
  { label: "Contact", page: "contact", ocid: "nav.contact.link" },
];

export function Navbar({
  currentPage,
  onNavigate,
  hideAuth = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (page: UserPage) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNav("home");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-dark/95 backdrop-blur-md shadow-nav"
          : "bg-navy-dark/90 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            data-ocid="nav.home.link"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg p-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center shadow group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-navy-dark" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-base tracking-wide font-display">
                Bobby<span className="text-gold">Travels</span>
              </span>
              <span className="text-[10px] text-white/50 tracking-widest uppercase">
                bobbytravels.online
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.page}
                data-ocid={link.ocid}
                onClick={() => handleNav(link.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPage === link.page
                    ? "bg-gold text-navy-dark"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
            {!hideAuth &&
              (currentUser ? (
                <div className="flex items-center gap-1 ml-1">
                  <button
                    type="button"
                    data-ocid="nav.mybookings.link"
                    onClick={() => handleNav("myBookings")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentPage === "myBookings"
                        ? "bg-gold text-navy-dark"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    My Bookings
                  </button>
                  <button
                    type="button"
                    data-ocid="nav.logout.button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  data-ocid="nav.login.button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleNav("login")}
                  className="ml-2 border-gold/50 text-gold hover:bg-gold hover:text-navy-dark h-8 gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Button>
              ))}
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-navy-dark border-white/10 p-0 w-72"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <span className="font-bold text-white font-display">
                      Bobby<span className="text-gold">Travels</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                      className="text-white/60 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
                    {NAV_LINKS.map((link) => (
                      <button
                        type="button"
                        key={link.page}
                        data-ocid={link.ocid}
                        onClick={() => handleNav(link.page)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                          currentPage === link.page
                            ? "bg-gold text-navy-dark"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                    {!hideAuth && currentUser && (
                      <button
                        type="button"
                        data-ocid="nav.mybookings.link"
                        onClick={() => handleNav("myBookings")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                          currentPage === "myBookings"
                            ? "bg-gold text-navy-dark"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        My Bookings
                      </button>
                    )}
                  </div>
                  <div className="p-5 border-t border-white/10 space-y-3">
                    {!hideAuth &&
                      (currentUser ? (
                        <Button
                          data-ocid="nav.logout.button"
                          variant="outline"
                          className="w-full border-white/20 text-white/70 hover:bg-white/10 gap-2"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </Button>
                      ) : (
                        <Button
                          data-ocid="nav.login.button"
                          className="w-full bg-gold text-navy-dark hover:bg-gold/90 gap-2"
                          onClick={() => handleNav("login")}
                        >
                          <LogIn className="w-4 h-4" /> Login / Register
                        </Button>
                      ))}
                    <a
                      href="tel:+919815480825"
                      className="flex items-center gap-2 text-white/40 text-xs hover:text-gold transition-colors"
                    >
                      <Phone className="w-3 h-3" />
                      +91 9815480825
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
