import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Loader2,
  Plane,
  RefreshCw,
  Ticket,
  Users,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGetUserBookings } from "../hooks/useQueries";
import type { UserPage } from "./UserApp";

interface MyBookingsPageProps {
  onNavigate: (page: UserPage) => void;
}

const PAYMENT_STYLES: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const BOOKING_STYLES: Record<string, string> = {
  enquiry: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  confirmed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const { currentUser, sessionToken } = useAuth();
  const {
    data: bookings,
    isLoading,
    refetch,
    isRefetching,
  } = useGetUserBookings(sessionToken ?? "");

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
        <Card
          data-ocid="mybookings.login.card"
          className="border border-border shadow-xl rounded-2xl max-w-md w-full"
        >
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3 font-display">
              Track Your Bookings
            </h2>
            <p className="text-muted-foreground mb-8 text-sm">
              Login or register to view your flight bookings, PNR status, and
              payment details.
            </p>
            <Button
              data-ocid="mybookings.login.button"
              onClick={() => onNavigate("login")}
              className="bg-gold hover:bg-gold/90 text-navy-dark w-full h-12 font-semibold gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Login / Register
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main
      data-ocid="mybookings.page"
      className="min-h-screen bg-background pt-20 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display">
              My <span className="text-gold">Bookings</span>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Hi {currentUser.name}, track all your flight enquiries.
            </p>
          </div>
          <Button
            data-ocid="mybookings.refresh.button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-2"
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
              <Card key={i} className="border border-border rounded-2xl">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !bookings || bookings.length === 0 ? (
          <div data-ocid="mybookings.empty_state" className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
              <Plane className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Bookings Yet
            </h3>
            <p className="text-muted-foreground mb-6 text-sm">
              Your flight enquiries and bookings will appear here.
            </p>
            <Button
              data-ocid="mybookings.book.button"
              onClick={() => onNavigate("bookFlight")}
              className="bg-gold hover:bg-gold/90 text-navy-dark gap-2"
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
              const paymentStyle =
                PAYMENT_STYLES[booking.paymentStatus] ??
                "bg-muted text-muted-foreground";
              const bookingStyle =
                BOOKING_STYLES[booking.bookingStatus] ??
                "bg-muted text-muted-foreground";

              return (
                <Card
                  key={bookingKey}
                  data-ocid={`mybookings.item.${idx + 1}`}
                  className="border border-border rounded-2xl overflow-hidden"
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
                            #{bookingKey} · {booking.tripType} ·{" "}
                            {booking.cabinClass}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`border text-xs ${bookingStyle}`}>
                          {booking.bookingStatus.charAt(0).toUpperCase() +
                            booking.bookingStatus.slice(1)}
                        </Badge>
                        <Badge className={`border text-xs ${paymentStyle}`}>
                          <CreditCard className="w-3 h-3 mr-1" />
                          {booking.paymentStatus.charAt(0).toUpperCase() +
                            booking.paymentStatus.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" /> Departure
                        </p>
                        <p className="font-medium">{booking.departureDate}</p>
                      </div>
                      {returnDate && (
                        <div>
                          <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" /> Return
                          </p>
                          <p className="font-medium">{returnDate}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Users className="w-3 h-3" /> Passengers
                        </p>
                        <p className="font-medium">
                          {Number(booking.adultsCount)}A
                          {Number(booking.childrenCount) > 0
                            ? ` ${Number(booking.childrenCount)}C`
                            : ""}
                          {Number(booking.infantsCount) > 0
                            ? ` ${Number(booking.infantsCount)}I`
                            : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs flex items-center gap-1 mb-1">
                          <Ticket className="w-3 h-3" /> PNR
                        </p>
                        <p
                          className={`font-medium font-mono ${pnr ? "text-gold" : "text-amber-500"}`}
                        >
                          {pnr ?? "Pending"}
                        </p>
                      </div>
                    </div>
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
