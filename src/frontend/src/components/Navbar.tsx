import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useQueries";
import { Menu, Plane, X } from "lucide-react";
import { useEffect, useState } from "react";

type Page = "home" | "search" | "payment" | "contact" | "leads" | "users";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const baseNavLinks: { label: string; page: Page; ocid: string }[] = [
  { label: "Home", page: "home", ocid: "nav.home.link" },
  { label: "Book Flight", page: "search", ocid: "nav.search.link" },
  { label: "Payment", page: "payment", ocid: "nav.payment.link" },
  { label: "Contact", page: "contact", ocid: "nav.contact.link" },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const { data: isAdminData } = useIsAdmin();

  const isAdmin = isAdminData === true;

  const navLinks = isAdmin
    ? [
        ...baseNavLinks,
        { label: "Leads", page: "leads" as Page, ocid: "nav.leads.link" },
        { label: "Users", page: "users" as Page, ocid: "nav.users.link" },
      ]
    : baseNavLinks;

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass shadow-nav" : "bg-navy-dark/90 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("home")}
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-lg p-1"
            aria-label="BobbyTravels Home"
          >
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center shadow-gold group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-navy-dark" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-white text-base tracking-wide">
                Bobby<span className="text-gold">Travels</span>
              </span>
              <span className="text-[10px] text-white/50 font-ui tracking-widest uppercase">
                bobbytravels.online
              </span>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.page}
                data-ocid={link.ocid}
                onClick={() => handleNav(link.page)}
                className={`px-4 py-2 rounded-lg text-sm font-ui font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  currentPage === link.page
                    ? "bg-gold text-navy-dark shadow-gold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 focus-visible:ring-gold"
                  aria-label="Open menu"
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
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
                        <Plane className="w-4 h-4 text-navy-dark" />
                      </div>
                      <span className="font-display font-bold text-white">
                        Bobby<span className="text-gold">Travels</span>
                      </span>
                    </div>
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
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-ui font-medium transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                          currentPage === link.page
                            ? "bg-gold text-navy-dark"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>
                  {isLoggedIn && (
                    <div className="px-5 pb-2 pt-0 border-t border-white/10 mt-auto">
                      <p className="text-white/60 text-xs font-ui pt-4">
                        Signed in via{" "}
                        <span className="text-white/90 font-semibold">
                          Internet Identity
                        </span>
                      </p>
                    </div>
                  )}
                  <div className="p-5 border-t border-white/10">
                    <p className="text-white/40 text-xs font-ui">
                      📞{" "}
                      <a
                        href="tel:9815480825"
                        className="hover:text-gold transition-colors"
                      >
                        9815480825
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
