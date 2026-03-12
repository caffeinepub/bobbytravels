import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  FileCheck,
  Globe,
  MapPin,
  Phone as PhoneIcon,
  Plane,
  Shield,
  Star,
} from "lucide-react";
import type { UserPage } from "./UserApp";

const SERVICES = [
  {
    icon: Plane,
    title: "Flight Booking",
    desc: "Domestic & international flights with best fares",
    page: "bookFlight" as UserPage,
    color: "text-blue-400",
  },
  {
    icon: FileCheck,
    title: "Visa Services",
    desc: "Visa assistance for 50+ countries worldwide",
    page: "visa" as UserPage,
    color: "text-emerald-400",
  },
  {
    icon: Globe,
    title: "Tour Packages",
    desc: "Curated holiday packages at unbeatable prices",
    page: "tours" as UserPage,
    color: "text-purple-400",
  },
  {
    icon: Shield,
    title: "PNR Check",
    desc: "Check your booking status & travel updates",
    page: "pnr" as UserPage,
    color: "text-orange-400",
  },
  {
    icon: PhoneIcon,
    title: "Airline Helpline",
    desc: "Direct contact for 60+ international airlines",
    page: "airlineHelpline" as UserPage,
    color: "text-gold",
  },
];

const DESTINATIONS = [
  { city: "Dubai", country: "UAE", emoji: "🇦🇪", tag: "Most Popular" },
  { city: "Singapore", country: "Singapore", emoji: "🇸🇬", tag: "Trending" },
  { city: "London", country: "UK", emoji: "🇬🇧", tag: "Visa Required" },
  { city: "Bangkok", country: "Thailand", emoji: "🇹🇭", tag: "Budget Friendly" },
  { city: "Toronto", country: "Canada", emoji: "🇨🇦", tag: "Study Abroad" },
  { city: "Sydney", country: "Australia", emoji: "🇦🇺", tag: "Holiday" },
];

const WHY_US = [
  {
    icon: Star,
    title: "Best Fare Guarantee",
    desc: "We match or beat any competitor price for the same itinerary.",
  },
  {
    icon: PhoneIcon,
    title: "24/7 WhatsApp Support",
    desc: "Instant response on WhatsApp for all your travel needs.",
  },
  {
    icon: Shield,
    title: "100% Secure Booking",
    desc: "All payments processed securely via UPI & bank transfers.",
  },
  {
    icon: Globe,
    title: "Worldwide Coverage",
    desc: "Flights to 500+ destinations across 150+ countries.",
  },
];

export function HomePage({
  onNavigate,
}: { onNavigate: (page: UserPage) => void }) {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-dark via-navy to-navy-light/60 min-h-[90vh] flex items-center justify-center px-4 pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-gold text-sm font-medium mb-6">
            <Plane className="w-4 h-4" />
            India's Trusted Travel Partner
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display">
            Fly Smart, <span className="text-gold">Travel Better</span>
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Best fares on international & domestic flights. Visa, tours, and
            24/7 WhatsApp support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="home.bookflight.primary_button"
              onClick={() => onNavigate("bookFlight")}
              className="h-12 px-8 bg-gold hover:bg-gold/90 text-navy-dark font-semibold gap-2 text-base rounded-xl"
            >
              <Plane className="w-5 h-5" /> Book Flight Now
            </Button>
            <Button
              data-ocid="home.whatsapp.secondary_button"
              variant="outline"
              onClick={() =>
                window.open("https://wa.me/919815480825", "_blank")
              }
              className="h-12 px-8 border-white/30 text-white hover:bg-white/10 gap-2 text-base rounded-xl"
            >
              Get a Quote
            </Button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-display">
            Our Services
          </h2>
          <p className="text-muted-foreground">
            Everything you need for a perfect trip
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {SERVICES.map((s) => (
            <button
              key={s.page}
              type="button"
              data-ocid={`home.${s.page}.card`}
              onClick={() => onNavigate(s.page)}
              className="bg-card border border-border rounded-2xl p-4 text-left hover:border-gold/30 hover:shadow-md transition-all group"
            >
              <s.icon
                className={`w-8 h-8 mb-3 ${s.color} group-hover:scale-110 transition-transform`}
              />
              <h3 className="font-semibold text-foreground text-sm mb-1">
                {s.title}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {s.desc}
              </p>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-2 group-hover:text-gold group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-display">
              Popular Destinations
            </h2>
            <p className="text-muted-foreground">Trending routes from India</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DESTINATIONS.map((d) => (
              <button
                key={d.city}
                type="button"
                data-ocid="home.destination.card"
                onClick={() => onNavigate("bookFlight")}
                className="bg-card border border-border rounded-2xl p-4 text-center hover:border-gold/30 transition-all group"
              >
                <div className="text-3xl mb-2">{d.emoji}</div>
                <h3 className="font-semibold text-foreground text-sm">
                  {d.city}
                </h3>
                <p className="text-muted-foreground text-xs">{d.country}</p>
                <span className="inline-block mt-2 text-[10px] bg-gold/10 text-gold border border-gold/20 rounded-full px-2 py-0.5">
                  {d.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 font-display">
            Why Choose BobbyTravels?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_US.map((w) => (
            <div
              key={w.title}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <w.icon className="w-8 h-8 text-gold mb-3" />
              <h3 className="font-semibold text-foreground mb-2">{w.title}</h3>
              <p className="text-muted-foreground text-sm">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 px-4 bg-gradient-to-r from-navy-dark to-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-display">
            Ready to plan your next trip?
          </h2>
          <p className="text-white/70 mb-6">
            Book now and get instant confirmation via WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              data-ocid="home.cta.primary_button"
              onClick={() => onNavigate("bookFlight")}
              className="h-11 px-8 bg-gold hover:bg-gold/90 text-navy-dark font-semibold gap-2 rounded-xl"
            >
              <Plane className="w-4 h-4" /> Book Now
            </Button>
            <Button
              data-ocid="home.helpline.secondary_button"
              variant="outline"
              onClick={() => onNavigate("airlineHelpline")}
              className="h-11 px-8 border-white/30 text-white hover:bg-white/10 gap-2 rounded-xl"
            >
              <PhoneIcon className="w-4 h-4" /> Airline Helplines
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Get the App */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Plane className="w-7 h-7 text-gold" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2 font-display">
            Install the BobbyTravels App
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Add to your home screen for quick access — no app store needed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🤖</span>
                <h3 className="font-semibold text-foreground text-sm">
                  Android
                </h3>
              </div>
              <ol className="text-muted-foreground text-xs space-y-1 list-decimal list-inside">
                <li>Open Chrome browser</li>
                <li>Tap the ⋮ menu (top right)</li>
                <li>Tap "Add to Home screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🍎</span>
                <h3 className="font-semibold text-foreground text-sm">
                  iPhone / iPad
                </h3>
              </div>
              <ol className="text-muted-foreground text-xs space-y-1 list-decimal list-inside">
                <li>Open Safari browser</li>
                <li>Tap the Share icon (□↑)</li>
                <li>Scroll and tap "Add to Home Screen"</li>
                <li>Tap "Add" to confirm</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Location / Contact strip */}
      <section className="py-6 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a
            href="tel:+919815480825"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            <PhoneIcon className="w-4 h-4" /> +91 9815480825
          </a>
          <a
            href="mailto:book@bobbytravels.online"
            className="flex items-center gap-1.5 hover:text-gold transition-colors"
          >
            ✉️ book@bobbytravels.online
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> India
          </span>
        </div>
      </section>
    </main>
  );
}
