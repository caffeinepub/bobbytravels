import { AirportCombobox } from "@/components/AirportCombobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  ExternalLink,
  Minus,
  Plane,
  Plus,
  Send,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TripType } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ZAPIER_WEBHOOK = "https://hooks.zapier.com/hooks/catch/26772363/ux8vj5v/";
const WA_NUMBER = "919815480825";

const SPECIAL_REQUESTS = [
  "Wheelchair Assistance",
  "Vegetarian Meal",
  "Non-Veg Meal",
  "Extra Baggage",
  "Window Seat",
  "Aisle Seat",
  "Extra Legroom",
  "Child Meal",
  "Diabetic Meal",
  "Infant Bassinet",
];

const CABIN_CLASSES = [
  "Economy",
  "Premium Economy",
  "Business Class",
  "First Class",
];

function Counter({
  label,
  sub,
  value,
  onChange,
  min = 0,
  max = 9,
  ocidBase,
}: {
  label: string;
  sub: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  ocidBase: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid={`${ocidBase}.button`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-5 text-center font-semibold text-sm">{value}</span>
        <button
          type="button"
          data-ocid={`${ocidBase}.button`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function FlightInquiryPage() {
  const { actor } = useActor();

  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [tripType, setTripType] = useState<"oneWay" | "return">("return");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [specialRequests, setSpecialRequests] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleRequest = (req: string) => {
    setSpecialRequests((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    );
  };

  const totalPassengers = adults + children + infants;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAirport || !toAirport || !departureDate || !name || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const srText =
        specialRequests.length > 0 ? specialRequests.join(", ") : undefined;
      const payload = {
        origin: fromAirport,
        destination: toAirport,
        tripType: tripType === "return" ? TripType.returnTrip : TripType.oneWay,
        departureDate,
        returnDate:
          tripType === "return" && returnDate ? returnDate : undefined,
        adultsCount: BigInt(adults),
        childrenCount: BigInt(children),
        infantsCount: BigInt(infants),
        cabinClass,
        specialRequests: srText,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || undefined,
      };

      if (actor) {
        try {
          await actor.submitFlightEnquiry(payload);
        } catch {
          // non-blocking
        }
      }

      try {
        await fetch(ZAPIER_WEBHOOK, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "flight_enquiry",
            from: fromAirport,
            to: toAirport,
            trip_type: tripType,
            departure: departureDate,
            return_date: returnDate || "",
            adults,
            children,
            infants,
            cabin: cabinClass,
            special_requests: specialRequests.join(", "),
            name,
            phone,
            email,
          }),
        });
      } catch {
        // non-blocking
      }

      const passengerStr = [
        `${adults} Adult${adults > 1 ? "s" : ""}`,
        children > 0 ? `${children} Child${children > 1 ? "ren" : ""}` : null,
        infants > 0 ? `${infants} Infant${infants > 1 ? "s" : ""}` : null,
      ]
        .filter(Boolean)
        .join(", ");

      const msgParts = [
        "\u2708\uFE0F *FLIGHT ENQUIRY \u2013 BobbyTravels*",
        "",
        `*From:* ${fromAirport}`,
        `*To:* ${toAirport}`,
        `*Trip Type:* ${tripType === "return" ? "Return" : "One Way"}`,
        `*Departure:* ${departureDate}`,
        tripType === "return" && returnDate ? `*Return:* ${returnDate}` : null,
        `*Passengers:* ${passengerStr}`,
        `*Cabin Class:* ${cabinClass}`,
        specialRequests.length > 0
          ? `*Special Requests:* ${specialRequests.join(", ")}`
          : null,
        "",
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        email ? `*Email:* ${email}` : null,
      ]
        .filter((x) => x !== null)
        .join("\n");

      window.open(
        `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msgParts)}`,
        "_blank",
      );
      toast.success("Enquiry sent! We'll get back to you shortly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-20 pb-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-dark via-navy to-navy-light/80 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Plane className="w-6 h-6 text-gold" />
            <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
              Quick Enquiry
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Book Your Flight
          </h1>
          <p className="text-white/70 text-sm sm:text-base">
            Fill the form and get an instant quote via WhatsApp
          </p>
        </div>
      </div>

      {/* Trip.com Affiliate Search Box */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Search &amp; Book Directly
          </p>
        </div>
        <div
          data-ocid="trip.search.panel"
          className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="p-2 min-w-[920px]">
            <iframe
              src="https://www.trip.com/partners/ad/S13946361?Allianceid=7954115&SID=299528265&trip_sub1="
              style={{
                width: "900px",
                height: "200px",
                border: "none",
                display: "block",
              }}
              scrolling="no"
              id="S13946361"
              title="Search and book flights on Trip.com"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-right">
          Powered by{" "}
          <a
            href="https://www.trip.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Trip.com
          </a>
        </p>
      </div>

      {/* Enquiry Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-4">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Trip Type */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Plane className="w-4 h-4 text-gold" />
              <h2 className="font-semibold text-foreground">Trip Details</h2>
            </div>
            <div className="flex gap-2 mb-5">
              {(["oneWay", "return"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid={`flight.${t}.toggle`}
                  onClick={() => setTripType(t)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                    tripType === t
                      ? "bg-gold text-navy-dark shadow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {t === "oneWay" ? "One Way" : "Return"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  From *
                </Label>
                <AirportCombobox
                  value={fromAirport}
                  onChange={setFromAirport}
                  placeholder="Departure city"
                  data-ocid="flight.from.select"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-1.5 block">
                  To *
                </Label>
                <AirportCombobox
                  value={toAirport}
                  onChange={setToAirport}
                  placeholder="Destination city"
                  data-ocid="flight.to.select"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="dep-date"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Departure Date *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="dep-date"
                    type="date"
                    data-ocid="flight.departure.input"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {tripType === "return" && (
                <div>
                  <Label
                    htmlFor="ret-date"
                    className="text-xs text-muted-foreground mb-1.5 block"
                  >
                    Return Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="ret-date"
                      type="date"
                      data-ocid="flight.return.input"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={
                        departureDate || new Date().toISOString().split("T")[0]
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Passengers */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-gold" />
              <h2 className="font-semibold text-foreground">
                Passengers
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({totalPassengers} total)
                </span>
              </h2>
            </div>
            <Counter
              label="Adults"
              sub="12 years and above"
              value={adults}
              onChange={setAdults}
              min={1}
              ocidBase="flight.adults"
            />
            <Counter
              label="Children"
              sub="2 \u2013 11 years"
              value={children}
              onChange={setChildren}
              ocidBase="flight.children"
            />
            <Counter
              label="Infants"
              sub="Under 2 years"
              value={infants}
              onChange={setInfants}
              max={adults}
              ocidBase="flight.infants"
            />
          </div>

          {/* Cabin Class */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-gold" />
              <h2 className="font-semibold text-foreground">Cabin Class</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CABIN_CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  data-ocid="flight.cabin.toggle"
                  onClick={() => setCabinClass(cls)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium transition-all text-center ${
                    cabinClass === cls
                      ? "bg-gold text-navy-dark shadow"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-foreground mb-4">
              Special Requests
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPECIAL_REQUESTS.map((req) => {
                const checkId = `sr-${req.replace(/\s+/g, "-").toLowerCase()}`;
                return (
                  <div key={req} className="flex items-center gap-2.5">
                    <Checkbox
                      id={checkId}
                      data-ocid="flight.special.checkbox"
                      checked={specialRequests.includes(req)}
                      onCheckedChange={() => toggleRequest(req)}
                      className="data-[state=checked]:bg-gold data-[state=checked]:border-gold"
                    />
                    <Label
                      htmlFor={checkId}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {req}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-foreground mb-4">
              Contact Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <Label
                  htmlFor="contact-name"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Full Name *
                </Label>
                <Input
                  id="contact-name"
                  data-ocid="flight.name.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-phone"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Phone Number *
                </Label>
                <Input
                  id="contact-phone"
                  data-ocid="flight.phone.input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98154 80825"
                  required
                />
              </div>
              <div>
                <Label
                  htmlFor="contact-email"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Email Address
                </Label>
                <Input
                  id="contact-email"
                  data-ocid="flight.email.input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="p-5 bg-muted/30">
            <Button
              type="submit"
              data-ocid="flight.submit.button"
              disabled={submitting}
              className="w-full h-12 bg-gold hover:bg-gold/90 text-navy-dark font-semibold text-base gap-2 rounded-xl"
            >
              <Send className="w-5 h-5" />
              {submitting ? "Sending\u2026" : "Send Enquiry via WhatsApp"}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Your enquiry will open WhatsApp with all details pre-filled.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
