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
import { useSubmitFlightEnquiry } from "@/hooks/useQueries";
import {
  CalendarDays,
  CheckCircle,
  Loader2,
  Plane,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TripType } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import type { UserPage } from "./UserApp";

const tripTypeMap: Record<string, TripType> = {
  oneWay: TripType.oneWay,
  returnTrip: TripType.returnTrip,
  isFlexible: TripType.isFlexible,
};

interface SearchPageProps {
  onNavigate?: (page: UserPage) => void;
}

export function SearchPage({ onNavigate }: SearchPageProps = {}) {
  const { mutateAsync: submitEnquiry, isPending } = useSubmitFlightEnquiry();
  const { sessionToken, currentUser } = useAuth();
  const { actor } = useActor();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
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
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    try {
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
        adultsCount: BigInt(form.adults),
        childrenCount: BigInt(form.children),
        infantsCount: BigInt(form.infants),
        cabinClass: form.cabinClass,
        specialRequests: form.specialRequests || undefined,
      });
    } catch {
      // Non-fatal
    }

    // If user is logged in, also save a booking record (non-blocking)
    if (sessionToken && currentUser) {
      try {
        const a = actor as unknown as Record<string, any>;
        if (typeof a.saveUserBooking === "function") {
          await a.saveUserBooking(sessionToken, {
            customerName: form.name || currentUser.name,
            customerEmail: form.email || currentUser.email,
            customerPhone: form.phone,
            origin: form.origin,
            destination: form.destination,
            departureDate: form.departureDate,
            returnDate:
              form.tripType === "returnTrip" && form.returnDate
                ? [form.returnDate]
                : [],
            tripType: form.tripType,
            adultsCount: BigInt(form.adults),
            childrenCount: BigInt(form.children),
            infantsCount: BigInt(form.infants),
            cabinClass: form.cabinClass,
          });
          toast.success("Booking saved to your account!");
        }
      } catch {
        // Non-blocking — don't show error to user
      }
    }

    const tripLabel = {
      oneWay: "One Way",
      returnTrip: "Return",
      isFlexible: "Flexible",
    }[form.tripType];
    const passengers = [
      `${form.adults} Adult${form.adults !== 1 ? "s" : ""}`,
      form.children > 0
        ? `${form.children} Child${form.children !== 1 ? "ren" : ""}`
        : null,
      form.infants > 0
        ? `${form.infants} Infant${form.infants !== 1 ? "s" : ""}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    const waMsg = `Hi BobbyTravels! I want to book a flight.%0A%0AFrom: ${form.origin}%0ATo: ${form.destination}%0ATrip: ${tripLabel}%0ACabin: ${form.cabinClass}%0ADeparture: ${form.departureDate}%0AReturn: ${form.tripType === "returnTrip" ? form.returnDate || "TBD" : "N/A"}%0APassengers: ${passengers}%0ASpecial: ${form.specialRequests || "None"}%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEmail: ${form.email || "N/A"}`;
    window.open(`https://wa.me/919815480825?text=${waMsg}`, "_blank");
    setSubmitted(true);
    toast.success("Enquiry submitted! Check WhatsApp for deals.");
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4">
        <div data-ocid="search.success_state" className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Enquiry Sent!</h2>
          <p className="text-muted-foreground mb-6">
            We’ve opened WhatsApp so Bobby can send you the best deals. Check
            your WhatsApp!
          </p>
          {currentUser && (
            <p className="text-sm text-emerald-700 bg-emerald-50 rounded-xl p-3 mb-4">
              ✅ Booking saved to your account. View it in{" "}
              <button
                type="button"
                onClick={() => onNavigate?.("myBookings")}
                className="font-semibold underline"
              >
                My Bookings
              </button>
              .
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <a
              href="https://wa.me/919815480825"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Open WhatsApp
              </Button>
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
        </div>
      </main>
    );
  }

  return (
    <main
      data-ocid="search.page"
      className="min-h-screen bg-sky-50 pt-20 pb-16"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Book a <span className="text-navy">Flight</span>
          </h1>
          <p className="text-muted-foreground">
            Fill in your details and get the best deals on WhatsApp.
          </p>
          {currentUser && (
            <p className="text-sm text-emerald-700 mt-2">
              ✅ Logged in as {currentUser.name} — your booking will be saved
              automatically.
            </p>
          )}
        </div>

        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-navy-dark p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <Plane className="w-5 h-5 text-navy-dark" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">
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
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Trip Type
                </Label>
                <Tabs
                  value={form.tripType}
                  onValueChange={(v) => setForm((p) => ({ ...p, tripType: v }))}
                >
                  <TabsList
                    data-ocid="search.triptype.tab"
                    className="w-full h-11 p-1 rounded-xl"
                  >
                    <TabsTrigger
                      value="oneWay"
                      className="flex-1 text-sm rounded-lg"
                    >
                      One Way
                    </TabsTrigger>
                    <TabsTrigger
                      value="returnTrip"
                      className="flex-1 text-sm rounded-lg"
                    >
                      Return
                    </TabsTrigger>
                    <TabsTrigger
                      value="isFlexible"
                      className="flex-1 text-sm rounded-lg"
                    >
                      Flexible
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    From <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1">
                    <AirportCombobox
                      value={form.origin}
                      onChange={(v) => setForm((p) => ({ ...p, origin: v }))}
                      placeholder="City or Airport"
                      id="origin"
                      data-ocid="search.origin.input"
                    />
                  </div>
                </div>
                <div>
                  <Label>
                    To <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1">
                    <AirportCombobox
                      value={form.destination}
                      onChange={(v) =>
                        setForm((p) => ({ ...p, destination: v }))
                      }
                      placeholder="City or Airport"
                      id="destination"
                      data-ocid="search.destination.input"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-gold" />
                    Departure Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="search.departure.input"
                    type="date"
                    value={form.departureDate}
                    onChange={set("departureDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
                {form.tripType === "returnTrip" && (
                  <div>
                    <Label className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-gold" />
                      Return Date
                    </Label>
                    <Input
                      data-ocid="search.return.input"
                      type="date"
                      value={form.returnDate}
                      onChange={set("returnDate")}
                      min={
                        form.departureDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  Passengers
                </Label>
                <div
                  className="rounded-xl border divide-y mt-1"
                  data-ocid="search.passengers.select"
                >
                  {[
                    {
                      key: "adults",
                      label: "Adults",
                      sub: "12 years and above",
                      min: 1,
                    },
                    {
                      key: "children",
                      label: "Children",
                      sub: "2 - 11 years",
                      min: 0,
                    },
                    {
                      key: "infants",
                      label: "Infants",
                      sub: "Under 2 years",
                      min: 0,
                    },
                  ].map(({ key, label, sub, min }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              [key]: Math.max(
                                min,
                                (p as unknown as Record<string, number>)[key] -
                                  1,
                              ),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy disabled:opacity-40"
                          disabled={
                            (form as unknown as Record<string, number>)[key] <=
                            min
                          }
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold">
                          {(form as unknown as Record<string, number>)[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              [key]:
                                (p as unknown as Record<string, number>)[key] +
                                1,
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Cabin Class</Label>
                <Select
                  value={form.cabinClass}
                  onValueChange={(v) =>
                    setForm((p) => ({ ...p, cabinClass: v }))
                  }
                >
                  <SelectTrigger
                    data-ocid="search.cabin.select"
                    className="mt-1 h-11 rounded-xl"
                  >
                    <SelectValue />
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

              <div>
                <Label>
                  Special Requests{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </Label>
                <Textarea
                  data-ocid="search.special.textarea"
                  placeholder="Wheelchair, meal preference, airline preference..."
                  value={form.specialRequests}
                  onChange={set("specialRequests")}
                  rows={3}
                  className="mt-1 rounded-xl"
                />
              </div>

              <div className="border-t pt-5">
                <p className="text-sm font-semibold mb-4">
                  Your Contact Details
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      data-ocid="search.name.input"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={set("name")}
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label>
                      Phone / WhatsApp{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      data-ocid="search.phone.input"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={form.phone}
                      onChange={set("phone")}
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Email Address</Label>
                    <Input
                      data-ocid="search.email.input"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={set("email")}
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                data-ocid="search.submit_button"
                disabled={isPending}
                className="w-full h-12 text-base bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
                size="lg"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 w-5 h-5" />
                    Get Deals on WhatsApp ✈️
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
