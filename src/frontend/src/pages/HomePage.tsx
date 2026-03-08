import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Clock,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

type Page = "home" | "search" | "account" | "payment" | "contact";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: <Plane className="w-6 h-6" />,
    title: "Best Flight Deals",
    desc: "Direct access to exclusive deals and discounted fares not found elsewhere.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "WhatsApp Instant Response",
    desc: "Submit your enquiry and get flight options directly on WhatsApp within minutes.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trusted & Verified",
    desc: "Years of experience helping travelers find the perfect flights at the best prices.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "24/7 Support",
    desc: "Our team is available round the clock to assist with any travel requirements.",
  },
];

const popularRoutes = [
  { from: "Delhi (DEL)", to: "Mumbai (BOM)", price: "₹3,499" },
  { from: "Delhi (DEL)", to: "Dubai (DXB)", price: "₹18,999" },
  { from: "Mumbai (BOM)", to: "London (LHR)", price: "₹45,999" },
  { from: "Bangalore (BLR)", to: "Singapore (SIN)", price: "₹22,499" },
  { from: "Chennai (MAA)", to: "Bangkok (BKK)", price: "₹16,999" },
  { from: "Hyderabad (HYD)", to: "Toronto (YYZ)", price: "₹72,999" },
];

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 hero-gradient" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-flight.dim_1400x600.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-dark/80" />

        {/* Floating plane decoration */}
        <motion.div
          className="absolute top-24 right-8 md:right-24 opacity-10"
          animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Plane className="w-24 h-24 md:w-40 md:h-40 text-white" />
        </motion.div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge className="mb-6 bg-gold/20 text-gold border-gold/30 hover:bg-gold/30 text-sm px-4 py-1.5 font-ui">
              ✈️ Best Deals · Direct from Agent
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none tracking-tight mb-6"
          >
            Find Your <span className="text-gold">Perfect</span>
            <br />
            Flight Today
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          >
            Submit your travel details and receive exclusive flight deals
            directly on WhatsApp from{" "}
            <span className="text-white font-semibold">BobbyTravels</span> —
            your personal travel expert.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => onNavigate("search")}
              className="bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-base px-8 py-6 h-auto shadow-gold hover:shadow-none transition-all group rounded-xl"
            >
              Book a Flight
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="https://wa.me/919815480825"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white/80 hover:text-gold transition-colors font-ui text-sm font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-6 text-white/50 text-sm font-ui"
          >
            {[
              "Domestic Flights",
              "International Flights",
              "Group Bookings",
              "Flexible Dates",
            ].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 bg-sky-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3"
            >
              Why Choose <span className="text-navy">BobbyTravels?</span>
            </motion.h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We combine technology with personal service to deliver the best
              travel experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="bg-white rounded-2xl p-6 flight-card-shadow h-full hover:shadow-flight transition-shadow duration-300 group">
                  <div className="w-12 h-12 rounded-xl bg-navy text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3"
            >
              Popular <span className="text-navy">Routes</span>
            </motion.h2>
            <p className="text-muted-foreground">
              Starting prices — contact us for the best current deals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularRoutes.map((route, i) => (
              <motion.div
                key={`${route.from}-${route.to}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate("search")}
                  className="w-full bg-sky-pale hover:bg-secondary rounded-xl p-5 text-left transition-all duration-200 hover:shadow-flight group border border-border hover:border-navy/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 font-ui text-sm">
                        <span className="font-semibold text-foreground truncate">
                          {route.from}
                        </span>
                        <Plane className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        <span className="font-semibold text-foreground truncate">
                          {route.to}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs mt-1">
                        Starting from
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-display font-bold text-navy text-lg">
                        {route.price}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => onNavigate("search")}
              className="bg-navy hover:bg-navy-light text-white font-ui"
            >
              Search All Flights
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 right-12 rotate-12">
            <Plane className="w-32 h-32 text-white" />
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-white text-3xl md:text-4xl mb-4">
              Ready to Fly? Talk to Us Directly
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Skip the middleman. Get personalized flight deals sent straight to
              your WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("search")}
                className="bg-gold hover:bg-gold-dark text-navy-dark font-display font-semibold shadow-gold"
              >
                <Plane className="mr-2 w-4 h-4" />
                Book Now
              </Button>
              <a
                href="tel:9815480825"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors font-ui font-medium"
              >
                <Phone className="w-4 h-4" />
                +91 9815480825
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
