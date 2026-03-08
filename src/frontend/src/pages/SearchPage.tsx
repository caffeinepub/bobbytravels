import { AirportCombobox } from "@/components/AirportCombobox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useSubmitEnquiry } from "@/hooks/useQueries";
import { CalendarDays, Loader2, LogIn, Plane, Send, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { TripType } from "../backend.d";

const tripTypeMap: Record<string, TripType> = {
  oneWay: TripType.oneWay,
  returnTrip: TripType.returnTrip,
  isFlexible: TripType.isFlexible,
};

const tripTypeLabel: Record<string, string> = {
  oneWay: "One Way",
  returnTrip: "Return",
  isFlexible: "Flexible",
};

interface FormState {
  origin: string;
  destination: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
  specialRequests: string;
  name: string;
  phone: string;
  email: string;
}

export function SearchPage() {
  const { mutateAsync: submitEnquiry, isPending } = useSubmitEnquiry();
  const { isLoggedIn, login } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>({
    origin: "",
    destination: "",
    tripType: "oneWay",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy",
    specialRequests: "",
    name: "",
    phone: "",
    email: "",
  });

  const set =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (
      !form.origin ||
      !form.destination ||
      !form.departureDate ||
      !form.name ||
      !form.phone
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Require Internet Identity login to submit
    if (!isLoggedIn) {
      toast.error("Please sign in first to submit your enquiry.", {
        action: {
          label: "Sign In",
          onClick: login,
        },
      });
      login();
      return;
    }

    try {
      // Save to backend — cast to any to handle new/old backend shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await submitEnquiry({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email || undefined,
        origin: form.origin,
        destination: form.destination,
        departureDate: form.departureDate,
        returnDate:
          form.tripType === "returnTrip" && form.returnDate
            ? form.returnDate
            : undefined,
        tripType: tripTypeMap[form.tripType],
        // Support both new (adultsCount/childrenCount/infantsCount) and old (passengerCount) backend shapes
        ...({
          adultsCount: BigInt(form.adults),
          childrenCount: BigInt(form.children),
          infantsCount: BigInt(form.infants),
          cabinClass: form.cabinClass,
        } as object),
        passengerCount: BigInt(form.adults + form.children + form.infants),
        specialRequests: form.specialRequests || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } catch {
      // Non-fatal — still proceed to WhatsApp/email
    }

    const tripLabel = tripTypeLabel[form.tripType];
    const returnInfo =
      form.tripType === "returnTrip" ? form.returnDate || "N/A" : "N/A";

    const passengerSummary = [
      `${form.adults} Adult${form.adults !== 1 ? "s" : ""}`,
      form.children > 0
        ? `${form.children} Child${form.children !== 1 ? "ren" : ""} (2-11 yrs)`
        : null,
      form.infants > 0
        ? `${form.infants} Infant${form.infants !== 1 ? "s" : ""} (under 2 yrs)`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    // Build WhatsApp message
    const waMsg = encodeURIComponent(
      `Hi BobbyTravels! I want to book a flight.\n\nFrom: ${form.origin}\nTo: ${form.destination}\nTrip: ${tripLabel}\nCabin: ${form.cabinClass}\nDeparture: ${form.departureDate}\nReturn: ${returnInfo}\nPassengers: ${passengerSummary}\nSpecial Requests: ${form.specialRequests || "None"}\n\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}`,
    );
    const waUrl = `https://wa.me/919815480825?text=${waMsg}`;

    // Build mailto
    const mailSubject = encodeURIComponent("New Flight Enquiry");
    const mailBody = encodeURIComponent(
      `New Flight Enquiry\n\nFrom: ${form.origin}\nTo: ${form.destination}\nTrip: ${tripLabel}\nCabin: ${form.cabinClass}\nDeparture: ${form.departureDate}\nReturn: ${returnInfo}\nPassengers: ${passengerSummary}\nSpecial Requests: ${form.specialRequests || "None"}\n\nCustomer Name: ${form.name}\nCustomer Phone: ${form.phone}\nCustomer Email: ${form.email}`,
    );
    const mailtoUrl = `mailto:book@bobbytravels.online?subject=${mailSubject}&body=${mailBody}`;

    // Open WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Open mailto after brief delay
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);

    setSubmitted(true);
    toast.success("Enquiry sent! Check WhatsApp for your deals.");
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-sky-pale pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-flight"
          >
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-navy-dark" />
            </div>
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">
              Enquiry Sent! ✈️
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your flight enquiry has been submitted. We've opened WhatsApp so
              Bobby can send you the best deals directly. Check your WhatsApp
              for a response shortly!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/919815480825"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy text-white font-ui font-semibold hover:bg-navy-light transition-colors"
              >
                Open WhatsApp
              </a>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    origin: "",
                    destination: "",
                    tripType: "oneWay",
                    departureDate: "",
                    returnDate: "",
                    adults: 1,
                    children: 0,
                    infants: 0,
                    cabinClass: "Economy",
                    specialRequests: "",
                    name: "",
                    phone: "",
                    email: "",
                  });
                }}
              >
                New Search
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-pale pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-4xl text-foreground mb-2">
              Book a <span className="text-navy">Flight</span>
            </h1>
            <p className="text-muted-foreground">
              Fill in your details and we'll send the best deals straight to
              your WhatsApp.
            </p>
          </div>

          <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
            <CardHeader className="hero-gradient p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                  <Plane className="w-5 h-5 text-navy-dark" />
                </div>
                <div>
                  <CardTitle className="text-white font-display text-xl">
                    Flight Enquiry
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Get exclusive deals via WhatsApp
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Type */}
                <div>
                  <Label className="text-sm font-ui font-medium text-foreground mb-2 block">
                    Trip Type
                  </Label>
                  <Tabs
                    value={form.tripType}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, tripType: v }))
                    }
                  >
                    <TabsList
                      data-ocid="search.triptype.tab"
                      className="w-full bg-secondary h-11 p-1 rounded-xl"
                    >
                      <TabsTrigger
                        value="oneWay"
                        className="flex-1 text-sm font-ui rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white"
                      >
                        One Way
                      </TabsTrigger>
                      <TabsTrigger
                        value="returnTrip"
                        className="flex-1 text-sm font-ui rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white"
                      >
                        Return
                      </TabsTrigger>
                      <TabsTrigger
                        value="isFlexible"
                        className="flex-1 text-sm font-ui rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white"
                      >
                        Flexible
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Origin / Destination */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="origin"
                      className="text-sm font-ui font-medium"
                    >
                      From <span className="text-destructive">*</span>
                    </Label>
                    <AirportCombobox
                      value={form.origin}
                      onChange={(v) =>
                        setForm((prev) => ({ ...prev, origin: v }))
                      }
                      placeholder="City or Airport"
                      id="origin"
                      data-ocid="search.origin.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="destination"
                      className="text-sm font-ui font-medium"
                    >
                      To <span className="text-destructive">*</span>
                    </Label>
                    <AirportCombobox
                      value={form.destination}
                      onChange={(v) =>
                        setForm((prev) => ({ ...prev, destination: v }))
                      }
                      placeholder="City or Airport"
                      id="destination"
                      data-ocid="search.destination.input"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="departureDate"
                      className="text-sm font-ui font-medium flex items-center gap-1.5"
                    >
                      <CalendarDays className="w-3.5 h-3.5 text-gold" />
                      Departure Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="departureDate"
                      data-ocid="search.departure.input"
                      type="date"
                      value={form.departureDate}
                      onChange={set("departureDate")}
                      required
                      min={new Date().toISOString().split("T")[0]}
                      className="h-11 rounded-xl"
                    />
                  </div>
                  {form.tripType === "returnTrip" && (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="returnDate"
                        className="text-sm font-ui font-medium flex items-center gap-1.5"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-gold" />
                        Return Date
                      </Label>
                      <Input
                        id="returnDate"
                        data-ocid="search.return.input"
                        type="date"
                        value={form.returnDate}
                        onChange={set("returnDate")}
                        min={
                          form.departureDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="h-11 rounded-xl"
                      />
                    </div>
                  )}
                </div>

                {/* Passengers */}
                <div className="space-y-3">
                  <Label className="text-sm font-ui font-medium flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-gold" />
                    Passengers
                  </Label>
                  <div
                    className="rounded-xl border border-border divide-y divide-border"
                    data-ocid="search.passengers.select"
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-ui font-medium text-foreground">
                          Adults
                        </p>
                        <p className="text-xs text-muted-foreground">
                          12 years and above
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          data-ocid="search.adults.button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              adults: Math.max(1, prev.adults - 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                          disabled={form.adults <= 1}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display font-bold text-lg text-foreground">
                          {form.adults}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              adults: Math.min(9, prev.adults + 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Children */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-ui font-medium text-foreground">
                          Children
                        </p>
                        <p className="text-xs text-muted-foreground">
                          2 – 11 years
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          data-ocid="search.children.button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              children: Math.max(0, prev.children - 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                          disabled={form.children <= 0}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display font-bold text-lg text-foreground">
                          {form.children}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              children: Math.min(8, prev.children + 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Infants */}
                    <div className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-ui font-medium text-foreground">
                          Infants
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Under 2 years
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          data-ocid="search.infants.button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              infants: Math.max(0, prev.infants - 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                          disabled={form.infants <= 0}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-display font-bold text-lg text-foreground">
                          {form.infants}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              infants: Math.min(form.adults, prev.infants + 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 border-border flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-ui">
                    Total: {form.adults + form.children + form.infants}{" "}
                    passenger
                    {form.adults + form.children + form.infants !== 1
                      ? "s"
                      : ""}
                  </p>
                </div>

                {/* Cabin Class */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cabinClass"
                    className="text-sm font-ui font-medium flex items-center gap-1.5"
                  >
                    <Plane className="w-3.5 h-3.5 text-gold" />
                    Cabin Class
                  </Label>
                  <Select
                    value={form.cabinClass}
                    onValueChange={(v) =>
                      setForm((prev) => ({ ...prev, cabinClass: v }))
                    }
                  >
                    <SelectTrigger
                      id="cabinClass"
                      data-ocid="search.cabin.select"
                      className="h-11 rounded-xl"
                    >
                      <SelectValue placeholder="Select cabin class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Economy">Economy</SelectItem>
                      <SelectItem value="Premium Economy">
                        Premium Economy
                      </SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="First Class">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Requests */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="specialRequests"
                    className="text-sm font-ui font-medium"
                  >
                    Special Requests{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Textarea
                    id="specialRequests"
                    data-ocid="search.special.textarea"
                    placeholder="Any specific requirements? e.g. wheelchair, meal preference, airline preference..."
                    value={form.specialRequests}
                    onChange={set("specialRequests")}
                    rows={3}
                    className="rounded-xl resize-none"
                  />
                </div>

                <div className="border-t pt-5">
                  <p className="text-sm font-ui font-semibold text-foreground mb-4">
                    Your Contact Details
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="name"
                        className="text-sm font-ui font-medium"
                      >
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        data-ocid="search.name.input"
                        placeholder="Your full name"
                        value={form.name}
                        onChange={set("name")}
                        required
                        autoComplete="name"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-ui font-medium"
                      >
                        Phone / WhatsApp{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        data-ocid="search.phone.input"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={set("phone")}
                        required
                        autoComplete="tel"
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-ui font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        data-ocid="search.email.input"
                        type="email"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={set("email")}
                        autoComplete="email"
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  data-ocid="search.submit_button"
                  disabled={isPending}
                  className="w-full h-13 text-base bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold shadow-gold hover:shadow-none rounded-xl transition-all"
                  size="lg"
                >
                  {isPending ? (
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                  ) : isLoggedIn ? (
                    <Send className="mr-2 w-5 h-5" />
                  ) : (
                    <LogIn className="mr-2 w-5 h-5" />
                  )}
                  {isPending
                    ? "Sending..."
                    : isLoggedIn
                      ? "Get Deals on WhatsApp ✈️"
                      : "Sign In & Submit Enquiry"}
                </Button>

                {!isLoggedIn && (
                  <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
                    <LogIn className="w-3 h-3" />
                    Sign in required to submit. We use Internet Identity for
                    secure, password-free login.
                  </p>
                )}
                {isLoggedIn && (
                  <p className="text-center text-xs text-muted-foreground">
                    By submitting, you'll be redirected to WhatsApp to receive
                    personalized flight deals from BobbyTravels.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
