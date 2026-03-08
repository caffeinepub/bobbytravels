import { Globe, Mail, MessageCircle, Phone, Plane } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.hostname
      : "bobbytravels.online",
  );

  return (
    <footer className="bg-navy-dark border-t border-white/10 text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
                <Plane className="w-5 h-5 text-navy-dark" />
              </div>
              <span className="font-display font-bold text-white text-lg">
                Bobby<span className="text-gold">Travels</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              Your trusted travel partner for the best flight deals. Direct
              connections, unbeatable prices, personal service.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-gold flex-shrink-0" />
              <a
                href="https://bobbytravels.online"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                bobbytravels.online
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="tel:9815480825"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                  +91 9815480825
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919815480825"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-gold flex-shrink-0" />
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@bobbytravels.online"
                  className="flex items-center gap-2.5 hover:text-gold transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                  info@bobbytravels.online
                </a>
              </li>
            </ul>
          </div>

          {/* Emails */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-widest">
              Email Departments
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@bobbytravels.online"
                  className="flex flex-col hover:text-gold transition-colors"
                >
                  <span className="text-gold text-xs font-ui uppercase tracking-wide">
                    General Enquiries
                  </span>
                  <span>info@bobbytravels.online</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:book@bobbytravels.online"
                  className="flex flex-col hover:text-gold transition-colors"
                >
                  <span className="text-gold text-xs font-ui uppercase tracking-wide">
                    Booking & Reservations
                  </span>
                  <span>book@bobbytravels.online</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@bobbytravels.online"
                  className="flex flex-col hover:text-gold transition-colors"
                >
                  <span className="text-gold text-xs font-ui uppercase tracking-wide">
                    Customer Support
                  </span>
                  <span>support@bobbytravels.online</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {year} BobbyTravels. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
