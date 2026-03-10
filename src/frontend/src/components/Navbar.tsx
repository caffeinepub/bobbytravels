import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LogOut, Menu, Plane, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();

  const baseLinks: { label: string; page: Page; ocid: string }[] = [
    { label: "Home", page: "home", ocid: "nav.home.link" },
    { label: "Book Flight", page: "search", ocid: "nav.search.link" },
    { label: "Visa", page: "visa", ocid: "nav.visa.link" },
    { label: "Tours", page: "tours", ocid: "nav.tours.link" },
    { label: "PNR Check", page: "pnr", ocid: "nav.pnr.link" },
    { label: "Contact", page: "contact", ocid: "nav.contact.link" },
  ];

  const navLinks = isAdmin
    ? [
        ...baseLinks,
        {
          label: "Dashboard",
          page: "dashboard" as Page,
          ocid: "nav.dashboard.link",
        },
      ]
    : baseLinks;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    handleNav("home");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-dark/95 backdrop-blur-md shadow-lg"
          : "bg-navy-dark/90 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
              <span className="font-bold text-white text-base tracking-wide">
                Bobby<span className="text-gold">Travels</span>
              </span>
              <span className="text-[10px] text-white/50 tracking-widest uppercase">
                bobbytravels.online
              </span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
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
            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-white/70 text-sm flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {currentUser.name.split(" ")[0]}
                </span>
                <Button
                  data-ocid="nav.logout.button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                data-ocid="nav.login.button"
                variant="outline"
                size="sm"
                onClick={() => handleNav("login")}
                className="ml-2 border-gold/50 text-gold hover:bg-gold hover:text-navy-dark h-8"
              >
                Login
              </Button>
            )}
          </div>

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
                    <span className="font-bold text-white">
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
                  <div className="flex flex-col p-4 gap-1">
                    {navLinks.map((link) => (
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
                    {currentUser ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-white/10 text-left mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout ({currentUser.name.split(" ")[0]})
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleNav("login")}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gold hover:bg-white/10 text-left mt-2"
                      >
                        Login / Register
                      </button>
                    )}
                  </div>
                  <div className="p-5 border-t border-white/10">
                    <p className="text-white/40 text-xs">
                      <a href="tel:9815480825" className="hover:text-gold">
                        +91 9815480825
                      </a>
                    </p>
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
