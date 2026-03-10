import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Loader2,
  Plane,
  RefreshCw,
  Search,
  Ticket,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { useActor } from "../hooks/useActor";
import { useGetUserBookings } from "../hooks/useQueries";
import type { UserPage } from "./UserApp";

interface MyBookingsPageProps {
  onNavigate: (page: UserPage) => void;
}

const PAYMENT_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  enquiry: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const { currentUser, sessionToken } = useAuth();
  const { actor } = useActor();
  const [flightInfoMap, setFlightInfoMap] = useState<Record<string, string>>(
    {},
  );
  const [loadingPnr, setLoadingPnr] = useState<Record<string, boolean>>({});
  const [airlineMap, setAirlineMap] = useState<Record<string, string>>({});

  const {
    data: bookings,
    isLoading,
    refetch,
    isRefetching,
  } = useGetUserBookings(sessionToken ?? "");

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4">
        <Card
          data-ocid="mybookings.login.card"
          className="border-0 shadow-xl rounded-3xl max-w-md w-full"
        >
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-navy-dark/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-navy-dark" />
            </div>
            <h2 className="text-2xl font-bold text-navy-dark mb-3">
              Track Your Bookings
            </h2>
            <p className="text-muted-foreground mb-8">
              Create an account or log in to view your flight bookings, PNR
              status, and payment details — all in one place.
            </p>
            <Button
              data-ocid="mybookings.login.button"
              onClick={() => onNavigate("login")}
              className="bg-navy-dark text-white hover:bg-navy w-full h-12 text-base font-semibold gap-2"
            >
              Login / Register
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const handleCheckFlight = async (
    pnr: string,
    airline: string,
    bookingKey: string,
  ) => {
    if (!pnr) return;
    setLoadingPnr((prev) => ({ ...prev, [bookingKey]: true }));
    try {
      const a = actor as unknown as Record<string, any>;
      const info = await a.getAmadeusFlightInfo(pnr, airline || "");
      setFlightInfoMap((prev) => ({ ...prev, [bookingKey]: info }));
    } catch {
      toast.error("Could not fetch flight info. Please try again.");
    } finally {
      setLoadingPnr((prev) => ({ ...prev, [bookingKey]: false }));
    }
  };

  return (
    <main
      data-ocid="mybookings.page"
      className="min-h-screen bg-sky-50 pt-20 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-dark">
              My <span className="text-gold">Bookings</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Hi {currentUser.name}, track all your flight enquiries and
              bookings.
            </p>
          </div>
          <Button
            data-ocid="mybookings.refresh.button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-2 border-navy-dark/20 text-navy-dark hover:bg-navy-dark hover:text-white"
          >
            {isRefetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div data-ocid="mybookings.loading_state" className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div data-ocid="mybookings.empty_state" className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-navy-dark/10 flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-navy-dark/40" />
            </div>
            <h3 className="text-xl font-semibold text-navy-dark mb-2">
              No Bookings Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Your flight enquiries and bookings will appear here.
            </p>
            <Button
              data-ocid="mybookings.book.button"
              onClick={() => onNavigate("search")}
              className="bg-navy-dark text-white hover:bg-navy gap-2"
            >
              <Plane className="w-4 h-4" />
              Book a Flight
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, idx) => {
              const bookingKey = String(booking.bookingId);
              const pnr =
                Array.isArray(booking.pnrNumber) && booking.pnrNumber.length > 0
                  ? booking.pnrNumber[0]
                  : null;
              const returnDate =
                Array.isArray(booking.returnDate) &&
                booking.returnDate.length > 0
                  ? booking.returnDate[0]
                  : null;
              const flightInfo = flightInfoMap[bookingKey];
              const paymentStyle =
                PAYMENT_STATUS_STYLES[booking.paymentStatus] ??
                "bg-gray-100 text-gray-600 border-gray-200";
              const bookingStyle =
                BOOKING_STATUS_STYLES[booking.bookingStatus] ??
                "bg-gray-100 text-gray-600 border-gray-200";

              return (
                <Card
                  key={bookingKey}
                  data-ocid={`mybookings.item.${idx + 1}`}
                  className="border-0 shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="bg-navy-dark p-4 pb-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center">
                          <Plane className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">
                            {booking.origin}{" "}
                            <span className="text-gold">→</span>{" "}
                            {booking.destination}
                          </CardTitle>
                          <p className="text-white/50 text-xs">
                            Booking #{bookingKey} · {booking.tripType} ·{" "}
                            {booking.cabinClass}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`border text-xs font-medium ${bookingStyle}`}
                        >
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </Badge>
                        <Badge
                          className={`border text-xs font-medium ${paymentStyle}`}
                        >
                          <CreditCard className="w-3 h-3 mr-1" />
                          {booking.paymentStatus.charAt(0).toUpperCase() +
                            booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Departure
                        </span>
                        <span className="font-medium">
                          {booking.departureDate}
                        </span>
                      </div>
                      {returnDate && (
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground text-xs flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Return
                          </span>
                          <span className="font-medium">{returnDate}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Passengers
                        </span>
                        <span className="font-medium">
                          {Number(booking.adultsCount)}A
                          {Number(booking.childrenCount) > 0
                            ? ` ${Number(booking.childrenCount)}C`
                            : ""}
                          {Number(booking.infantsCount) > 0
                            ? ` ${Number(booking.infantsCount)}I`
                            : ""}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          <Ticket className="w-3 h-3" />
                          PNR
                        </span>
                        <span
                          className={`font-medium ${pnr ? "text-navy-dark" : "text-amber-600"}`}
                        >
                          {pnr ?? "Pending"}
                        </span>
                      </div>
                    </div>

                    {pnr && (
                      <div className="border-t pt-4">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex-1 min-w-[180px]">
                            <Input
                              data-ocid={`mybookings.airline.input.${idx + 1}`}
                              placeholder="Enter airline code (e.g. AI, 6E)"
                              value={airlineMap[bookingKey] ?? ""}
                              onChange={(e) =>
                                setAirlineMap((prev) => ({
                                  ...prev,
                                  [bookingKey]: e.target.value,
                                }))
                              }
                              className="h-9 text-sm"
                            />
                          </div>
                          <Button
                            data-ocid={`mybookings.flightstatus.button.${idx + 1}`}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleCheckFlight(
                                pnr,
                                airlineMap[bookingKey] ?? "",
                                bookingKey,
                              )
                            }
                            disabled={loadingPnr[bookingKey]}
                            className="gap-1.5 border-navy-dark/30 text-navy-dark hover:bg-navy-dark hover:text-white"
                          >
                            {loadingPnr[bookingKey] ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Search className="w-3.5 h-3.5" />
                            )}
                            Check Flight Status
                          </Button>
                        </div>
                        {flightInfo && (
                          <div className="mt-3 p-3 bg-sky-50 rounded-xl text-sm border border-sky-100 whitespace-pre-wrap font-mono text-xs">
                            {flightInfo}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
