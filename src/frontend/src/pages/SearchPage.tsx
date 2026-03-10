import { AirportCombobox } from "@/components/AirportCombobox";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitFlightEnquiry } from "@/hooks/useQueries";
import type { FlightOffer } from "@/utils/amadeus";
import {
  extractIataCode,
  formatDate,
  formatPrice,
  formatTime,
  searchFlights,
} from "@/utils/amadeus";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  Clock,
  Loader2,
  Plane,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { TripType } from "../backend.d";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import type { UserPage } from "./UserApp";

type Step = "search" | "results" | "inquiry" | "success";

const tripTypeMap: Record<string, TripType> = {
  oneWay: TripType.oneWay,
  returnTrip: TripType.returnTrip,
  isFlexible: TripType.isFlexible,
};

interface SearchPageProps {
  onNavigate?: (page: UserPage) => void;
}

interface SearchForm {
  origin: string;
  destination: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  specialRequests: string;
}

export function SearchPage({ onNavigate }: SearchPageProps = {}) {
  const { mutateAsync: submitEnquiry, isPending: isSubmitting } =
    useSubmitFlightEnquiry();
  const { sessionToken, currentUser } = useAuth();
  const { actor } = useActor();

  const [step, setStep] = useState<Step>("search");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [flightResults, setFlightResults] = useState<FlightOffer[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(
    null,
  );

  const [search, setSearch] = useState<SearchForm>({
    origin: "",
    destination: "",
    tripType: "oneWay",
    departureDate: "",
    returnDate: "",
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: "Economy",
  });

  const [contact, setContact] = useState<ContactForm>({
    name: currentUser?.name ?? "",
    phone: currentUser?.phone ?? "",
    email: currentUser?.email ?? "",
    specialRequests: "",
  });

  const setSearchField =
    (field: keyof SearchForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setSearch((p) => ({ ...p, [field]: e.target.value }));

  // ── Step 1: Search ────────────────────────────────────────────────────────────
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.origin || !search.destination || !search.departureDate) {
      toast.error("Please fill in origin, destination, and departure date.");
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    setStep("results");
    try {
      const results = await searchFlights({
        originCode: extractIataCode(search.origin),
        destinationCode: extractIataCode(search.destination),
        departureDate: search.departureDate,
        returnDate:
          search.tripType === "returnTrip" && search.returnDate
            ? search.returnDate
            : undefined,
        adults: search.adults,
        children: search.children,
        infants: search.infants,
        cabinClass: search.cabinClass,
      });
      setFlightResults(results);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to search flights.";
      setSearchError(msg);
      setFlightResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // ── Step 2 → 3: Select flight ─────────────────────────────────────────────────
  const handleSelectFlight = (flight: FlightOffer) => {
    setSelectedFlight(flight);
    setStep("inquiry");
  };

  // ── Step 3: Submit inquiry ────────────────────────────────────────────────────
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name || !contact.phone) {
      toast.error("Please provide your name and phone number.");
      return;
    }

    const flight = selectedFlight;
    if (!flight) return;

    const tripLabel =
      search.tripType === "returnTrip"
        ? "Return"
        : search.tripType === "isFlexible"
          ? "Flexible"
          : "One Way";
    const passengersStr = [
      `${search.adults} Adult${search.adults !== 1 ? "s" : ""}`,
      search.children > 0
        ? `${search.children} Child${search.children !== 1 ? "ren" : ""}`
        : null,
      search.infants > 0
        ? `${search.infants} Infant${search.infants !== 1 ? "s" : ""}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    const depTime = formatTime(flight.departureTime);
    const arrTime = formatTime(flight.arrivalTime);
    const depDate = formatDate(flight.departureTime);

    try {
      await submitEnquiry({
        customerName: contact.name,
        customerPhone: contact.phone,
        customerEmail: contact.email || undefined,
        origin: search.origin,
        destination: search.destination,
        departureDate: search.departureDate,
        returnDate:
          search.tripType === "returnTrip" && search.returnDate
            ? search.returnDate
            : undefined,
        tripType: tripTypeMap[search.tripType],
        adultsCount: BigInt(search.adults),
        childrenCount: BigInt(search.children),
        infantsCount: BigInt(search.infants),
        cabinClass: search.cabinClass,
        specialRequests: contact.specialRequests || undefined,
      });
    } catch {
      // Non-blocking
    }

    // Save booking if logged in
    if (sessionToken && currentUser) {
      try {
        const a = actor as unknown as Record<string, any>;
        if (typeof a.saveUserBooking === "function") {
          await a.saveUserBooking(sessionToken, {
            customerName: contact.name || currentUser.name,
            customerEmail: contact.email || currentUser.email,
            customerPhone: contact.phone,
            origin: search.origin,
            destination: search.destination,
            departureDate: search.departureDate,
            returnDate:
              search.tripType === "returnTrip" && search.returnDate
                ? [search.returnDate]
                : [],
            tripType: search.tripType,
            adultsCount: BigInt(search.adults),
            childrenCount: BigInt(search.children),
            infantsCount: BigInt(search.infants),
            cabinClass: search.cabinClass,
          });
        }
      } catch {
        // Non-blocking
      }
    }

    // Open WhatsApp
    const waMsg = [
      "✈️ *Flight Enquiry — BobbyTravels*",
      "",
      `*Flight:* ${flight.airlineName} ${flight.flightNumber}`,
      `*Route:* ${search.origin} → ${search.destination}`,
      `*Type:* ${tripLabel}`,
      `*Departure:* ${depDate}, ${depTime} → ${arrTime} (${flight.itineraryDuration})`,
      `*Stops:* ${flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}`,
      `*Price:* ${formatPrice(flight.price)} per adult`,
      `*Cabin:* ${flight.cabinClass}`,
      `*Passengers:* ${passengersStr}`,
      "",
      "*Customer Details*",
      `Name: ${contact.name}`,
      `Phone: ${contact.phone}`,
      `Email: ${contact.email || "N/A"}`,
      contact.specialRequests ? `Special: ${contact.specialRequests}` : null,
    ]
      .filter((l) => l !== null)
      .join("%0A");

    window.open(`https://wa.me/919815480825?text=${waMsg}`, "_blank");
    setStep("success");
    toast.success("Enquiry sent! Check WhatsApp.");
  };

  const resetAll = () => {
    setStep("search");
    setSearch({
      origin: "",
      destination: "",
      tripType: "oneWay",
      departureDate: "",
      returnDate: "",
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: "Economy",
    });
    setContact({ name: "", phone: "", email: "", specialRequests: "" });
    setSelectedFlight(null);
    setFlightResults([]);
    setSearchError(null);
  };

  // ── Render: Success ───────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <main className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4">
        <div data-ocid="search.success_state" className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Enquiry Sent!</h2>
          <p className="text-muted-foreground mb-6">
            We've opened WhatsApp so our team can send you the best deals. Check
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
            <Button variant="outline" onClick={resetAll}>
              New Search
            </Button>
          </div>
        </div>
      </main>
    );
  }

  // ── Render: Inquiry form ──────────────────────────────────────────────────────
  if (step === "inquiry" && selectedFlight) {
    const flight = selectedFlight;
    return (
      <main
        data-ocid="search.page"
        className="min-h-screen bg-sky-pale pt-20 pb-16"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <button
            type="button"
            data-ocid="search.secondary_button"
            onClick={() => setStep("results")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to results
          </button>

          {/* Selected flight summary */}
          <div className="bg-navy-dark text-white rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-4 h-4 text-gold" />
              <span className="text-xs text-white/60 uppercase tracking-wider">
                Selected Flight
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-lg">{flight.airlineName}</p>
                <p className="text-white/60 text-sm">
                  {flight.flightNumber} · {flight.cabinClass}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight">
                  {formatTime(flight.departureTime)}
                </p>
                <p className="text-xs text-white/50">
                  {extractIataCode(search.origin)}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-white/40">
                  <div className="h-px w-10 bg-white/20" />
                  <Plane className="w-3 h-3" />
                  <div className="h-px w-10 bg-white/20" />
                </div>
                <span className="text-xs text-white/50">
                  {flight.itineraryDuration}
                </span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold tracking-tight">
                  {formatTime(flight.arrivalTime)}
                </p>
                <p className="text-xs text-white/50">
                  {extractIataCode(search.destination)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gold">
                  {formatPrice(flight.price)}
                </p>
                <p className="text-xs text-white/50">per adult</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <Card className="border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Complete Your Enquiry</CardTitle>
              <CardDescription>
                Our team will contact you on WhatsApp with booking details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitInquiry} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      data-ocid="search.name.input"
                      placeholder="Your full name"
                      value={contact.name}
                      onChange={(e) =>
                        setContact((p) => ({ ...p, name: e.target.value }))
                      }
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
                      value={contact.phone}
                      onChange={(e) =>
                        setContact((p) => ({ ...p, phone: e.target.value }))
                      }
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email Address (optional)</Label>
                  <Input
                    data-ocid="search.email.input"
                    type="email"
                    placeholder="you@email.com"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((p) => ({ ...p, email: e.target.value }))
                    }
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Special Requests (optional)</Label>
                  <Textarea
                    data-ocid="search.special.textarea"
                    placeholder="Wheelchair, meal preference, seat choice..."
                    value={contact.specialRequests}
                    onChange={(e) =>
                      setContact((p) => ({
                        ...p,
                        specialRequests: e.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-1 rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="search.submit_button"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Send Enquiry on WhatsApp ✈️
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

  // ── Render: Results ───────────────────────────────────────────────────────────
  if (step === "results") {
    return (
      <main
        data-ocid="search.page"
        className="min-h-screen bg-sky-pale pt-20 pb-16"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {extractIataCode(search.origin)}{" "}
                <ArrowRight className="inline w-4 h-4 mx-1" />{" "}
                {extractIataCode(search.destination)}
              </h2>
              <p className="text-sm text-muted-foreground">
                {search.departureDate} ·{" "}
                {search.adults + search.children + search.infants} Passenger
                {search.adults + search.children + search.infants !== 1
                  ? "s"
                  : ""}{" "}
                · {search.cabinClass}
              </p>
            </div>
            <Button
              variant="outline"
              data-ocid="search.secondary_button"
              onClick={() => setStep("search")}
              className="rounded-xl"
            >
              <Search className="w-4 h-4 mr-2" />
              Modify
            </Button>
          </div>

          {/* Loading */}
          {isSearching && (
            <div data-ocid="search.loading_state" className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="space-y-2 text-center">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                      <div className="space-y-2 text-center">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-7 w-24" />
                        <Skeleton className="h-10 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isSearching && searchError && (
            <div
              data-ocid="search.error_state"
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
            >
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <p className="font-semibold text-red-700 mb-1">
                Search Unavailable
              </p>
              <p className="text-sm text-red-600 mb-4">{searchError}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setStep("search")}
                  className="rounded-xl"
                >
                  Try Again
                </Button>
                <Button
                  data-ocid="search.primary_button"
                  onClick={() => {
                    setSelectedFlight(null);
                    setStep("inquiry");
                  }}
                  className="bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
                >
                  Send Manual Enquiry
                </Button>
              </div>
            </div>
          )}

          {/* No results */}
          {!isSearching && !searchError && flightResults.length === 0 && (
            <div
              data-ocid="search.empty_state"
              className="bg-white border rounded-2xl p-10 text-center"
            >
              <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="font-semibold text-lg mb-2">No flights found</p>
              <p className="text-muted-foreground text-sm mb-6">
                We couldn't find any flights for this route and date. Try
                different dates or let us enquire for you.
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setStep("search")}
                  className="rounded-xl"
                >
                  Modify Search
                </Button>
                <Button
                  data-ocid="search.primary_button"
                  onClick={() => {
                    setSelectedFlight(null);
                    setStep("inquiry");
                  }}
                  className="bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
                >
                  Send Manual Enquiry
                </Button>
              </div>
            </div>
          )}

          {/* Flight result cards */}
          {!isSearching && flightResults.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {flightResults.length} flight
                {flightResults.length !== 1 ? "s" : ""} found
              </p>
              {flightResults.map((flight, idx) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  index={idx + 1}
                  onSelect={handleSelectFlight}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ── Render: Search form (Step 1) ──────────────────────────────────────────────
  return (
    <main
      data-ocid="search.page"
      className="min-h-screen bg-sky-pale pt-20 pb-16"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Search <span className="text-navy">Flights</span>
          </h1>
          <p className="text-muted-foreground">
            Live prices from global airlines. Book via WhatsApp.
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
                <Search className="w-5 h-5 text-navy-dark" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">
                  Find Flights
                </CardTitle>
                <CardDescription className="text-white/60">
                  Powered by Amadeus · Live inventory
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Trip type */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Trip Type
                </Label>
                <Tabs
                  value={search.tripType}
                  onValueChange={(v) =>
                    setSearch((p) => ({ ...p, tripType: v }))
                  }
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

              {/* Origin / Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    From <span className="text-destructive">*</span>
                  </Label>
                  <div className="mt-1">
                    <AirportCombobox
                      value={search.origin}
                      onChange={(v) => setSearch((p) => ({ ...p, origin: v }))}
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
                      value={search.destination}
                      onChange={(v) =>
                        setSearch((p) => ({ ...p, destination: v }))
                      }
                      placeholder="City or Airport"
                      id="destination"
                      data-ocid="search.destination.input"
                    />
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-gold" />
                    Departure Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="search.departure.input"
                    type="date"
                    value={search.departureDate}
                    onChange={setSearchField("departureDate")}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 h-11 rounded-xl"
                  />
                </div>
                {search.tripType === "returnTrip" && (
                  <div>
                    <Label className="flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5 text-gold" />
                      Return Date
                    </Label>
                    <Input
                      data-ocid="search.return.input"
                      type="date"
                      value={search.returnDate}
                      onChange={setSearchField("returnDate")}
                      min={
                        search.departureDate ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="mt-1 h-11 rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div>
                <Label className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-gold" />
                  Passengers
                </Label>
                <div
                  className="rounded-xl border divide-y mt-1"
                  data-ocid="search.passengers.select"
                >
                  {(
                    [
                      {
                        key: "adults" as const,
                        label: "Adults",
                        sub: "12+ years",
                        min: 1,
                      },
                      {
                        key: "children" as const,
                        label: "Children",
                        sub: "2-11 years",
                        min: 0,
                      },
                      {
                        key: "infants" as const,
                        label: "Infants",
                        sub: "Under 2",
                        min: 0,
                      },
                    ] as const
                  ).map(({ key, label, sub, min }) => (
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
                            setSearch((p) => ({
                              ...p,
                              [key]: Math.max(min, p[key] - 1),
                            }))
                          }
                          className="w-9 h-9 rounded-lg border-2 flex items-center justify-center text-lg font-bold hover:border-navy hover:text-navy disabled:opacity-40"
                          disabled={search[key] <= min}
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-bold">
                          {search[key]}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setSearch((p) => ({
                              ...p,
                              [key]: p[key] + 1,
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

              {/* Cabin class */}
              <div>
                <Label>Cabin Class</Label>
                <Select
                  value={search.cabinClass}
                  onValueChange={(v) =>
                    setSearch((p) => ({ ...p, cabinClass: v }))
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

              <Button
                type="submit"
                data-ocid="search.submit_button"
                disabled={isSearching}
                className="w-full h-12 text-base bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 w-5 h-5" />
                    Search Flights
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

// ── Flight card component ─────────────────────────────────────────────────────

interface FlightCardProps {
  flight: FlightOffer;
  index: number;
  onSelect: (flight: FlightOffer) => void;
}

function FlightCard({ flight, index, onSelect }: FlightCardProps) {
  const ocid = `search.flight.item.${index}` as const;
  const depTime = formatTime(flight.departureTime);
  const arrTime = formatTime(flight.arrivalTime);
  const depDate = formatDate(flight.departureTime);
  const arrDate = formatDate(flight.arrivalTime);
  const isOvernight = depDate !== arrDate;

  return (
    <div
      data-ocid={ocid}
      className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-flight transition-shadow duration-200 overflow-hidden"
    >
      {/* Mobile layout */}
      <div className="p-4 sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-sm">{flight.airlineName}</p>
            <p className="text-xs text-muted-foreground">
              {flight.flightNumber}
            </p>
          </div>
          <Badge
            variant="outline"
            className="text-xs bg-sky-light border-sky-light text-navy"
          >
            {flight.cabinClass}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="text-center">
            <p className="text-xl font-bold tracking-tight">{depTime}</p>
            <p className="text-xs text-muted-foreground">
              {flight.segments[0].departure.iataCode}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5">
            <div className="flex items-center w-full gap-1">
              <div className="h-px flex-1 bg-border" />
              <Plane className="w-3 h-3 text-muted-foreground" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {flight.itineraryDuration}
            </div>
            <span
              className={`text-xs font-semibold ${
                flight.stops === 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </span>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold tracking-tight">
              {arrTime}
              {isOvernight && (
                <sup className="text-xs text-amber-500 ml-0.5">+1</sup>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {flight.segments[flight.segments.length - 1].arrival.iataCode}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="text-lg font-bold text-navy">
              {formatPrice(flight.price)}
            </p>
            <p className="text-xs text-muted-foreground">per adult</p>
          </div>
          <Button
            data-ocid={`search.flight.primary_button.${index}`}
            onClick={() => onSelect(flight)}
            className="bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl text-sm"
          >
            Select &amp; Enquire
          </Button>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:flex items-center gap-4 p-5">
        {/* Airline */}
        <div className="w-36 flex-shrink-0">
          <p className="font-bold text-sm leading-tight">
            {flight.airlineName}
          </p>
          <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
          <Badge
            variant="outline"
            className="text-xs mt-1 bg-sky-light border-sky-light text-navy"
          >
            {flight.cabinClass}
          </Badge>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex items-center gap-3">
          <div className="text-center min-w-[64px]">
            <p className="text-2xl font-bold tracking-tight leading-none">
              {depTime}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {flight.segments[0].departure.iataCode}
            </p>
            <p className="text-xs text-muted-foreground">{depDate}</p>
          </div>

          <div className="flex-1 flex flex-col items-center gap-0.5">
            <div className="flex items-center w-full gap-1">
              <div className="h-px flex-1 bg-border" />
              <Plane className="w-4 h-4 text-muted-foreground" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {flight.itineraryDuration}
            </div>
            <span
              className={`text-xs font-semibold ${
                flight.stops === 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {flight.stops === 0
                ? "Non-stop"
                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
            </span>
          </div>

          <div className="text-center min-w-[64px]">
            <p className="text-2xl font-bold tracking-tight leading-none">
              {arrTime}
              {isOvernight && (
                <sup className="text-xs text-amber-500 ml-0.5">+1</sup>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {flight.segments[flight.segments.length - 1].arrival.iataCode}
            </p>
            <p className="text-xs text-muted-foreground">{arrDate}</p>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="text-right flex-shrink-0 w-40">
          <p className="text-2xl font-bold text-navy">
            {formatPrice(flight.price)}
          </p>
          <p className="text-xs text-muted-foreground mb-3">per adult</p>
          <Button
            data-ocid={`search.flight.primary_button.${index}`}
            onClick={() => onSelect(flight)}
            className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-bold rounded-xl"
          >
            Select &amp; Enquire
          </Button>
        </div>
      </div>
    </div>
  );
}
