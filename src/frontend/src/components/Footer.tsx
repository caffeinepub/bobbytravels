import { Mail, MapPin, Phone, Plane } from "lucide-react";
import type { UserPage } from "../pages/UserApp";

interface FooterProps {
  onNavigate?: (page: UserPage) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? window.location.hostname
      : "bobbytravels.online";

  const nav = (page: UserPage) => {
    onNavigate?.(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-dark border-t border-white/10 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <Plane className="w-4 h-4 text-navy-dark" />
              </div>
              <span className="font-bold text-white font-display">
                Bobby<span className="text-gold">Travels</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Your trusted travel partner for flights, visa, and tour packages
              worldwide.
            </p>
            <div className="space-y-2">
              <a
                href="tel:+919815480825"
                className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> +91 9815480825
              </a>
              <a
                href="mailto:info@bobbytravels.online"
                className="flex items-center gap-2 text-white/50 text-sm hover:text-gold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> info@bobbytravels.online
              </a>
              <span className="flex items-center gap-2 text-white/50 text-sm">
                <MapPin className="w-3.5 h-3.5" /> India
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-2">
              {(
                [
                  ["Book Flight", "bookFlight"],
                  ["Visa Services", "visa"],
                  ["Tour Packages", "tours"],
                  ["PNR Check", "pnr"],
                  ["Airline Helpline", "airlineHelpline"],
                ] as [string, UserPage][]
              ).map(([label, page]) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => nav(page)}
                    className="text-white/50 text-sm hover:text-gold transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => nav("contact")}
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/919815480825"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li>
                <a
                  href="mailto:book@bobbytravels.online"
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  book@bobbytravels.online
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@bobbytravels.online"
                  className="text-white/50 text-sm hover:text-gold transition-colors"
                >
                  support@bobbytravels.online
                </a>
              </li>
            </ul>
          </div>

          {/* Pay */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Payment
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <p className="text-white/60 text-xs mb-1">Google Pay / UPI</p>
              <p className="text-gold font-mono text-sm font-medium">
                9878030007-1@okbizaxis
              </p>
            </div>
            <p className="text-white/40 text-xs mt-3">
              Secure payments accepted via UPI, NEFT, IMPS.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {year} BobbyTravels. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
