import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Globe,
  Plane,
  Search,
  Smartphone,
  Stamp,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../App";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const services = [
  {
    icon: Plane,
    title: "Air Tickets",
    desc: "Domestic & international flights at the best prices. WhatsApp deals directly from us.",
    page: "search" as Page,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Stamp,
    title: "Visa Services",
    desc: "Tourist, business, student & work visas for 50+ countries. Quick processing.",
    page: "visa" as Page,
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Globe,
    title: "Tour Packages",
    desc: "All-inclusive holiday packages: flights, hotels, tours. Customized itineraries.",
    page: "tours" as Page,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Search,
    title: "PNR Status",
    desc: "Check your flight status and booking details. Get updates via WhatsApp.",
    page: "pnr" as Page,
    color: "bg-amber-50 text-amber-600",
  },
];

const destinations = [
  { name: "Dubai", country: "UAE", gradient: "from-amber-400 to-orange-500" },
  {
    name: "Singapore",
    country: "Singapore",
    gradient: "from-red-400 to-rose-500",
  },
  {
    name: "Thailand",
    country: "Bangkok & Phuket",
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    name: "Europe",
    country: "Paris • Rome • Amsterdam",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    name: "USA",
    country: "New York & LA",
    gradient: "from-slate-400 to-blue-600",
  },
  {
    name: "Maldives",
    country: "Island Paradise",
    gradient: "from-cyan-400 to-blue-500",
  },
];

const features = [
  {
    icon: "💰",
    title: "Best Prices",
    desc: "We compare hundreds of airlines to get you the lowest fares",
  },
  {
    icon: "📱",
    title: "WhatsApp Support",
    desc: "Get instant quotes and deals directly on your WhatsApp",
  },
  {
    icon: "✈️",
    title: "All Airlines",
    desc: "All domestic and international airlines covered",
  },
  {
    icon: "🤝",
    title: "Trusted Agency",
    desc: "10+ years of experience, 50,000+ happy travelers",
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main data-ocid="home.page" className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-navy-dark text-white min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-navy to-blue-900 opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-gold fill-gold" />
              <span className="text-gold text-sm font-medium">
                India's Trusted Travel Partner
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your <span className="text-gold">Dream Trip</span>
              <br />
              Starts Here
            </h1>
            <p className="text-white/70 text-xl mb-10 max-w-2xl mx-auto">
              Flights, Visas, Tour Packages &amp; more — all with personalized
              WhatsApp support from BobbyTravels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                data-ocid="home.book_flight.primary_button"
                size="lg"
                onClick={() => onNavigate("search")}
                className="bg-gold hover:bg-gold/90 text-navy-dark font-bold h-14 px-8 text-base rounded-xl gap-2"
              >
                <Plane className="w-5 h-5" />
                Book a Flight
              </Button>
              <Button
                data-ocid="home.visa.secondary_button"
                size="lg"
                variant="outline"
                onClick={() => onNavigate("visa")}
                className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-base rounded-xl gap-2"
              >
                <Stamp className="w-5 h-5" />
                Visa Services
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "10+", label: "Years Experience" },
              { value: "50,000+", label: "Happy Travelers" },
              { value: "24/7", label: "WhatsApp Support" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-gold font-bold text-xl">{stat.value}</p>
                <p className="text-white/60 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Our <span className="text-navy">Services</span>
            </h2>
            <p className="text-muted-foreground">
              Everything you need for your perfect travel experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  data-ocid={`home.service.card.${i + 1}`}
                  className="border-0 shadow-sm hover:shadow-lg transition-all rounded-2xl cursor-pointer group"
                  onClick={() => onNavigate(svc.page)}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${svc.color} group-hover:scale-110 transition-transform`}
                    >
                      <svc.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {svc.desc}
                    </p>
                    <span className="text-navy text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4 bg-sky-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Popular <span className="text-navy">Destinations</span>
            </h2>
            <p className="text-muted-foreground">
              Top destinations our customers love
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <button
                  type="button"
                  data-ocid={`home.destination.card.${i + 1}`}
                  className={`bg-gradient-to-br ${dest.gradient} rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform shadow-md w-full text-left`}
                  onClick={() => onNavigate("search")}
                >
                  <h3 className="font-bold text-xl">{dest.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{dest.country}</p>
                  <div className="mt-4 flex items-center gap-1 text-white/80 text-sm">
                    <Plane className="w-3.5 h-3.5" />
                    Book now
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Why Choose <span className="text-navy">BobbyTravels</span>?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4 p-5 bg-sky-50 rounded-2xl">
                  <div className="text-2xl">{f.icon}</div>
                  <div>
                    <h3 className="font-bold mb-1">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get the App */}
      <section className="py-20 px-4 bg-navy-dark text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-navy-dark" />
            </div>
            <h2 className="text-3xl font-bold mb-3">
              Get the <span className="text-gold">App</span>
            </h2>
            <p className="text-white/70">
              Install BobbyTravels on your phone — no App Store needed!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="bg-white/10 border-white/20 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-3">🤖 Android</h3>
                <ol className="space-y-2 text-white/70 text-sm">
                  <li>1. Open this site in Chrome</li>
                  <li>2. Tap the menu (⋮) in Chrome</li>
                  <li>3. Tap "Add to Home screen"</li>
                  <li>4. Confirm — done!</li>
                </ol>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-3">🍎 iPhone</h3>
                <ol className="space-y-2 text-white/70 text-sm">
                  <li>1. Open this site in Safari</li>
                  <li>2. Tap the Share button (□↑)</li>
                  <li>3. Scroll and tap "Add to Home Screen"</li>
                  <li>4. Tap Add — done!</li>
                </ol>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <p className="text-white/50 text-sm">
              Works offline • Installs like a native app • No App Store required
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gold">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy-dark mb-4">
            Ready to Travel?
          </h2>
          <p className="text-navy/70 mb-8">
            Get exclusive deals sent directly to your WhatsApp. No middlemen,
            just great prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              data-ocid="home.cta.primary_button"
              size="lg"
              onClick={() => onNavigate("search")}
              className="bg-navy-dark hover:bg-navy text-white h-12 px-8 rounded-xl gap-2"
            >
              <Plane className="w-5 h-5" />
              Book Flight Now
            </Button>
            <a
              href="https://wa.me/919815480825?text=Hi! I want to know about your travel deals."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-navy-dark text-navy-dark hover:bg-navy-dark hover:text-white h-12 px-8 rounded-xl"
              >
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
