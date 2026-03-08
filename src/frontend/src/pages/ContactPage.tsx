import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";

const emailContacts = [
  {
    purpose: "General Enquiries",
    email: "info@bobbytravels.online",
    desc: "Questions about destinations, routes, or general travel advice.",
    icon: "ℹ️",
  },
  {
    purpose: "Booking & Reservations",
    email: "book@bobbytravels.online",
    desc: "Ready to book? Send us your travel details for a quote.",
    icon: "✈️",
  },
  {
    purpose: "Customer Support",
    email: "support@bobbytravels.online",
    desc: "Issues with existing bookings or need urgent assistance.",
    icon: "🆘",
  },
];

export function ContactPage() {
  return (
    <main className="min-h-screen bg-sky-pale pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground mb-3">
              Get in <span className="text-navy">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              We're here to help you find the perfect flight. Reach us via
              WhatsApp, email, or phone — whatever works best for you.
            </p>
          </div>

          {/* Primary contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* WhatsApp */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-flight rounded-3xl overflow-hidden h-full">
                <div className="hero-gradient p-6 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center mb-4">
                    <MessageCircle className="w-6 h-6 text-green-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-white text-lg">
                        WhatsApp
                      </h3>
                      <Badge className="bg-green-400/20 text-green-300 border-green-400/30 text-xs">
                        Fastest Response
                      </Badge>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      Message us directly for instant flight quotes and deals.
                      We typically respond within minutes during business hours.
                    </p>
                    <p className="text-gold font-mono font-bold text-lg mb-4">
                      +91 9815480825
                    </p>
                  </div>
                  <a
                    href="https://wa.me/919815480825?text=Hi BobbyTravels! I need help with flight booking."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      data-ocid="contact.whatsapp.button"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-ui font-semibold rounded-xl gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </Button>
                  </a>
                </div>
              </Card>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-0 shadow-flight rounded-3xl overflow-hidden h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-navy flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-foreground text-lg mb-1">
                      Phone
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Call us directly for urgent bookings or complex travel
                      arrangements.
                    </p>
                    <p className="font-mono font-bold text-xl text-navy mb-2">
                      9815480825
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="w-3.5 h-3.5" />
                      Available Mon–Sat, 9 AM – 8 PM
                    </div>
                  </div>
                  <a href="tel:9815480825">
                    <Button
                      variant="outline"
                      className="w-full border-navy text-navy hover:bg-navy hover:text-white font-ui font-semibold rounded-xl gap-2 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Email contacts */}
          <h2 className="font-display font-bold text-2xl text-foreground mb-5">
            Email Departments
          </h2>
          <div className="space-y-3 mb-5">
            {emailContacts.map((contact, i) => (
              <motion.div
                key={contact.email}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <Card className="border-0 shadow-flight rounded-2xl hover:shadow-none transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-2xl leading-none pt-0.5">
                        {contact.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                          <h3 className="font-ui font-semibold text-foreground text-sm">
                            {contact.purpose}
                          </h3>
                          <a
                            href={`mailto:${contact.email}`}
                            className="font-mono text-sm text-navy hover:text-gold transition-colors truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {contact.desc}
                        </p>
                      </div>
                      <a href={`mailto:${contact.email}`} className="shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-navy hover:bg-sky-pale rounded-lg font-ui"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Email
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Business info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Card className="border-0 shadow-flight rounded-3xl">
              <CardContent className="p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-5">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-pale flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-ui uppercase tracking-widest text-muted-foreground mb-0.5">
                        Website
                      </p>
                      <a
                        href="https://bobbytravels.online"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-ui font-semibold text-navy hover:text-gold transition-colors"
                      >
                        bobbytravels.online
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-pale flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-ui uppercase tracking-widest text-muted-foreground mb-0.5">
                        Business Hours
                      </p>
                      <p className="font-ui font-semibold text-foreground text-sm">
                        Mon – Sat: 9 AM – 8 PM
                      </p>
                      <p className="font-ui text-muted-foreground text-xs">
                        WhatsApp available 24/7
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-pale flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-ui uppercase tracking-widest text-muted-foreground mb-0.5">
                        Service
                      </p>
                      <p className="font-ui font-semibold text-foreground text-sm">
                        Nationwide & International
                      </p>
                      <p className="font-ui text-muted-foreground text-xs">
                        All major Indian cities served
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-pale flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-navy" />
                    </div>
                    <div>
                      <p className="text-xs font-ui uppercase tracking-widest text-muted-foreground mb-0.5">
                        Response Time
                      </p>
                      <p className="font-ui font-semibold text-foreground text-sm">
                        Usually within 30 mins
                      </p>
                      <p className="font-ui text-muted-foreground text-xs">
                        Via WhatsApp during business hours
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
