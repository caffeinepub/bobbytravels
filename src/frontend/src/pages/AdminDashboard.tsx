import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  BarChart3,
  BookOpen,
  Check,
  Copy,
  CreditCard,
  FileSearch,
  Globe,
  Lock,
  MapPin,
  MessageCircle,
  Plane,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import {
  useGetAdminStats,
  useGetAllBookings,
  useGetAllFlightEnquiries,
  useGetAllPNREnquiries,
  useGetAllTourEnquiries,
  useGetAllUsers,
  useGetAllVisaEnquiries,
  useUpdateBookingPNR,
  useUpdateBookingPaymentStatus,
  useUpdateBookingStatus,
  useUpdateFlightEnquiryStatus,
  useUpdateTourEnquiryStatus,
  useUpdateVisaEnquiryStatus,
} from "../hooks/useQueries";

const STATUS_OPTIONS = ["pending", "contacted", "booked", "closed"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  booked: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-600",
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded hover:bg-black/10"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-600" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground" />
      )}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number | bigint | undefined;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="border-0 shadow-sm rounded-2xl">
      <CardContent className="p-5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
        >
          {icon}
        </div>
        <p className="text-2xl font-bold">
          {value !== undefined ? String(value) : "-"}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const { isAdmin, sessionToken } = useAuth();
  const { data: stats, isLoading: statsLoading } =
    useGetAdminStats(sessionToken);
  const { data: flights } = useGetAllFlightEnquiries(sessionToken);
  const { data: visas } = useGetAllVisaEnquiries(sessionToken);
  const { data: tours } = useGetAllTourEnquiries(sessionToken);
  const { data: pnrs } = useGetAllPNREnquiries(sessionToken);
  const { data: users } = useGetAllUsers(sessionToken);
  const updateFlight = useUpdateFlightEnquiryStatus(sessionToken);
  const updateVisa = useUpdateVisaEnquiryStatus(sessionToken);
  const updateTour = useUpdateTourEnquiryStatus(sessionToken);
  const { data: bookings } = useGetAllBookings(sessionToken);
  const updatePNR = useUpdateBookingPNR(sessionToken);
  const updatePayment = useUpdateBookingPaymentStatus(sessionToken);
  const updateBookingStatus = useUpdateBookingStatus(sessionToken);
  const [pnrInputs, setPnrInputs] = useState<Record<string, string>>({});
  const [promoMsg, setPromoMsg] = useState("");

  if (!isAdmin) {
    return (
      <main
        data-ocid="dashboard.page"
        className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4"
      >
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground text-sm">
            Please login with your admin account (adityabholath@gmail.com) to
            access the dashboard.
          </p>
        </div>
      </main>
    );
  }

  const flightList =
    (flights as unknown as [bigint, Record<string, unknown>][] | undefined) ??
    [];
  const visaList =
    (visas as unknown as [bigint, Record<string, unknown>][] | undefined) ?? [];
  const tourList =
    (tours as unknown as [bigint, Record<string, unknown>][] | undefined) ?? [];
  const pnrList =
    (pnrs as unknown as [bigint, Record<string, unknown>][] | undefined) ?? [];
  const bookingList =
    (bookings as unknown as Record<string, any>[] | undefined) ?? [];
  const userList =
    (users as unknown as [bigint, Record<string, unknown>][] | undefined) ?? [];

  // Collect all phone numbers for promotions
  const allPhones = [
    ...flightList.map(([, e]) => e.customerPhone as string),
    ...visaList.map(([, e]) => e.customerPhone as string),
    ...tourList.map(([, e]) => e.customerPhone as string),
    ...pnrList.map(([, e]) => e.customerPhone as string),
  ].filter(Boolean);
  const uniquePhones = [...new Set(allPhones)];

  return (
    <main
      data-ocid="dashboard.page"
      className="min-h-screen bg-sky-50 pt-20 pb-16"
    >
      <div className="bg-navy-dark text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">
            Admin <span className="text-gold">Dashboard</span>
          </h1>
          <p className="text-white/60 mt-1 text-sm">
            BobbyTravels management panel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        {statsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              label="Flight Enquiries"
              value={stats?.totalFlightEnquiries}
              icon={<Plane className="w-5 h-5 text-white" />}
              color="bg-blue-500"
            />
            <StatCard
              label="Visa Enquiries"
              value={stats?.totalVisaEnquiries}
              icon={<Globe className="w-5 h-5 text-white" />}
              color="bg-purple-500"
            />
            <StatCard
              label="Tour Enquiries"
              value={stats?.totalTourEnquiries}
              icon={<MapPin className="w-5 h-5 text-white" />}
              color="bg-emerald-500"
            />
            <StatCard
              label="PNR Requests"
              value={stats?.totalPNREnquiries}
              icon={<FileSearch className="w-5 h-5 text-white" />}
              color="bg-amber-500"
            />
            <StatCard
              label="Registered Users"
              value={stats?.totalUsers}
              icon={<Users className="w-5 h-5 text-white" />}
              color="bg-rose-500"
            />
          </div>
        )}

        <Tabs defaultValue="flights">
          <TabsList
            data-ocid="dashboard.tab"
            className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-xl mb-6"
          >
            <TabsTrigger value="flights" data-ocid="dashboard.flights.tab">
              Flights ({flightList.length})
            </TabsTrigger>
            <TabsTrigger value="visa" data-ocid="dashboard.visa.tab">
              Visa ({visaList.length})
            </TabsTrigger>
            <TabsTrigger value="tours" data-ocid="dashboard.tours.tab">
              Tours ({tourList.length})
            </TabsTrigger>
            <TabsTrigger value="pnr" data-ocid="dashboard.pnr.tab">
              PNR ({pnrList.length})
            </TabsTrigger>
            <TabsTrigger value="users" data-ocid="dashboard.users.tab">
              Users ({userList.length})
            </TabsTrigger>
            <TabsTrigger value="bookings" data-ocid="dashboard.bookings.tab">
              Bookings ({bookingList.length})
            </TabsTrigger>
            <TabsTrigger
              value="promotions"
              data-ocid="dashboard.promotions.tab"
            >
              Promotions
            </TabsTrigger>
          </TabsList>

          {/* Flight Enquiries */}
          <TabsContent value="flights">
            {flightList.length === 0 ? (
              <div
                data-ocid="dashboard.flights.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Plane className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No flight enquiries yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {flightList.map(([id, e], idx) => (
                  <Card
                    key={String(id)}
                    data-ocid={`dashboard.flights.item.${idx + 1}`}
                    className="border-0 shadow-sm rounded-2xl"
                  >
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {String(e.customerName)}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {String(e.origin)} → {String(e.destination)}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[String(e.status)] || STATUS_COLORS.pending}`}
                        >
                          {String(e.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Dep: {String(e.departureDate)}{" "}
                        {e.returnDate ? `| Ret: ${String(e.returnDate)}` : ""}
                      </p>
                      <p className="text-xs">
                        Adults: {String(e.adultsCount)} | Children:{" "}
                        {String(e.childrenCount)} | Infants:{" "}
                        {String(e.infantsCount)}
                      </p>
                      {Boolean(e.cabinClass) && (
                        <p className="text-xs text-muted-foreground">
                          {String(e.cabinClass)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${String(e.customerPhone)}`}
                          className="text-xs text-navy font-medium"
                        >
                          {String(e.customerPhone)}
                        </a>
                        <CopyBtn value={String(e.customerPhone)} />
                        <a
                          href={`https://wa.me/${String(e.customerPhone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-xs text-emerald-700 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                      </div>
                      <Select
                        value={String(e.status)}
                        onValueChange={(v) =>
                          updateFlight
                            .mutateAsync({ id: id as bigint, status: v })
                            .then(() => toast.success("Updated"))
                            .catch(() => toast.error("Failed"))
                        }
                      >
                        <SelectTrigger
                          data-ocid={`dashboard.flights.status.select.${idx + 1}`}
                          className="h-7 text-xs"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-xs capitalize"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Visa Enquiries */}
          <TabsContent value="visa">
            {visaList.length === 0 ? (
              <div
                data-ocid="dashboard.visa.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No visa enquiries yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {visaList.map(([id, e], idx) => (
                  <Card
                    key={String(id)}
                    data-ocid={`dashboard.visa.item.${idx + 1}`}
                    className="border-0 shadow-sm rounded-2xl"
                  >
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {String(e.customerName)}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {String(e.country)} • {String(e.visaType)}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[String(e.status)] || STATUS_COLORS.pending}`}
                        >
                          {String(e.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Travel: {String(e.travelDate)}
                      </p>
                      {Boolean(e.passportNumber) && (
                        <p className="text-xs">
                          Passport: {String(e.passportNumber)}
                        </p>
                      )}
                      {Boolean(e.specialNotes) && (
                        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                          {String(e.specialNotes)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${String(e.customerPhone)}`}
                          className="text-xs text-navy font-medium"
                        >
                          {String(e.customerPhone)}
                        </a>
                        <CopyBtn value={String(e.customerPhone)} />
                        <a
                          href={`https://wa.me/${String(e.customerPhone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-xs text-emerald-700 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                      </div>
                      <Select
                        value={String(e.status)}
                        onValueChange={(v) =>
                          updateVisa
                            .mutateAsync({ id: id as bigint, status: v })
                            .then(() => toast.success("Updated"))
                            .catch(() => toast.error("Failed"))
                        }
                      >
                        <SelectTrigger
                          data-ocid={`dashboard.visa.status.select.${idx + 1}`}
                          className="h-7 text-xs"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-xs capitalize"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tour Enquiries */}
          <TabsContent value="tours">
            {tourList.length === 0 ? (
              <div
                data-ocid="dashboard.tours.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No tour enquiries yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tourList.map(([id, e], idx) => (
                  <Card
                    key={String(id)}
                    data-ocid={`dashboard.tours.item.${idx + 1}`}
                    className="border-0 shadow-sm rounded-2xl"
                  >
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {String(e.customerName)}
                          </CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {String(e.tourPackage)}
                          </p>
                        </div>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[String(e.status)] || STATUS_COLORS.pending}`}
                        >
                          {String(e.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Travel: {String(e.travelDate)}
                      </p>
                      <p className="text-xs">
                        Adults: {String(e.adultsCount)} | Children:{" "}
                        {String(e.childrenCount)}
                      </p>
                      {Boolean(e.budget) && (
                        <p className="text-xs">Budget: {String(e.budget)}</p>
                      )}
                      {Boolean(e.specialRequests) && (
                        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                          {String(e.specialRequests)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${String(e.customerPhone)}`}
                          className="text-xs text-navy font-medium"
                        >
                          {String(e.customerPhone)}
                        </a>
                        <CopyBtn value={String(e.customerPhone)} />
                        <a
                          href={`https://wa.me/${String(e.customerPhone).replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-xs text-emerald-700 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </a>
                      </div>
                      <Select
                        value={String(e.status)}
                        onValueChange={(v) =>
                          updateTour
                            .mutateAsync({ id: id as bigint, status: v })
                            .then(() => toast.success("Updated"))
                            .catch(() => toast.error("Failed"))
                        }
                      >
                        <SelectTrigger
                          data-ocid={`dashboard.tours.status.select.${idx + 1}`}
                          className="h-7 text-xs"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="text-xs capitalize"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PNR Requests */}
          <TabsContent value="pnr">
            {pnrList.length === 0 ? (
              <div
                data-ocid="dashboard.pnr.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <FileSearch className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No PNR requests yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {pnrList.map(([id, e], idx) => (
                  <Card
                    key={String(id)}
                    data-ocid={`dashboard.pnr.item.${idx + 1}`}
                    className="border-0 shadow-sm rounded-2xl"
                  >
                    <CardHeader className="pb-2 pt-4 px-5">
                      <CardTitle className="text-base">
                        {String(e.customerName)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2">
                      <p className="font-mono font-bold text-lg text-navy">
                        {String(e.pnrNumber)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {String(e.airline)}
                        {e.travelDate ? ` | ${String(e.travelDate)}` : ""}
                      </p>
                      {Boolean(e.notes) && (
                        <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
                          {String(e.notes)}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`tel:${String(e.customerPhone)}`}
                          className="text-xs text-navy font-medium"
                        >
                          {String(e.customerPhone)}
                        </a>
                        <CopyBtn value={String(e.customerPhone)} />
                        <a
                          href={`https://wa.me/${String(e.customerPhone).replace(/\D/g, "")}?text=Hi%20${String(e.customerName)}%2C%20regarding%20your%20PNR%20${String(e.pnrNumber)}...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-xs text-emerald-700 flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Reply
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            {userList.length === 0 ? (
              <div
                data-ocid="dashboard.users.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No registered users yet</p>
              </div>
            ) : (
              <div
                className="overflow-x-auto"
                data-ocid="dashboard.users.table"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Phone
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map(([id, u], idx) => (
                      <tr
                        key={String(id)}
                        data-ocid={`dashboard.users.row.${idx + 1}`}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="py-3 px-4 font-medium">
                          {String(u.name)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {String(u.email)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {u.phone ? String(u.phone) : "-"}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={
                              u.isAdmin
                                ? "bg-gold/20 text-amber-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {u.isAdmin ? "Admin" : "User"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            {bookingList.length === 0 ? (
              <div
                data-ocid="dashboard.bookings.empty_state"
                className="text-center py-16 text-muted-foreground"
              >
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No bookings yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-4 font-semibold">#</th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Route
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">PNR</th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Payment
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bookingList.map((b: any, idx: number) => {
                      const bKey = String(b.bookingId);
                      const pnr =
                        Array.isArray(b.pnrNumber) && b.pnrNumber.length > 0
                          ? b.pnrNumber[0]
                          : null;
                      return (
                        <tr
                          key={bKey}
                          data-ocid={`dashboard.bookings.row.${idx + 1}`}
                          className="hover:bg-muted/20"
                        >
                          <td className="py-3 px-4 text-muted-foreground">
                            {bKey}
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {b.customerName}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {b.customerEmail}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{b.origin}</span>
                            <span className="text-gold mx-1">→</span>
                            <span className="font-medium">{b.destination}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {b.departureDate}
                          </td>
                          <td className="py-3 px-4">
                            {pnr ? (
                              <span className="font-mono text-navy-dark">
                                {pnr}
                              </span>
                            ) : (
                              <span className="text-amber-600 text-xs">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={b.paymentStatus}
                              onValueChange={async (v) => {
                                try {
                                  await updatePayment.mutateAsync({
                                    bookingId: b.bookingId,
                                    paymentStatus: v,
                                  });
                                  toast.success("Payment status updated");
                                } catch {
                                  toast.error("Update failed");
                                }
                              }}
                            >
                              <SelectTrigger
                                data-ocid={`dashboard.bookings.payment.select.${idx + 1}`}
                                className="h-8 w-28 text-xs"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="failed">Failed</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <Select
                              value={b.bookingStatus}
                              onValueChange={async (v) => {
                                try {
                                  await updateBookingStatus.mutateAsync({
                                    bookingId: b.bookingId,
                                    bookingStatus: v,
                                  });
                                  toast.success("Booking status updated");
                                } catch {
                                  toast.error("Update failed");
                                }
                              }}
                            >
                              <SelectTrigger
                                data-ocid={`dashboard.bookings.status.select.${idx + 1}`}
                                className="h-8 w-32 text-xs"
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="enquiry">Enquiry</SelectItem>
                                <SelectItem value="confirmed">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Input
                                data-ocid={`dashboard.bookings.pnr.input.${idx + 1}`}
                                placeholder="Set PNR"
                                value={pnrInputs[bKey] ?? pnr ?? ""}
                                onChange={(e) =>
                                  setPnrInputs((prev) => ({
                                    ...prev,
                                    [bKey]: e.target.value,
                                  }))
                                }
                                className="h-8 w-28 text-xs"
                              />
                              <Button
                                data-ocid={`dashboard.bookings.pnr.save_button.${idx + 1}`}
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs px-2"
                                onClick={async () => {
                                  const pnrVal = pnrInputs[bKey];
                                  if (!pnrVal) return;
                                  try {
                                    await updatePNR.mutateAsync({
                                      bookingId: b.bookingId,
                                      pnrNumber: pnrVal,
                                    });
                                    toast.success("PNR saved");
                                  } catch {
                                    toast.error("Save failed");
                                  }
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Promotions */}
          <TabsContent value="promotions">
            <Card className="border-0 shadow-sm rounded-2xl max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gold" />
                  WhatsApp Promotions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Compose a promotional message and send it via WhatsApp to your
                  customers. You have{" "}
                  <strong>{uniquePhones.length} customer phone numbers</strong>{" "}
                  collected.
                </p>
                {uniquePhones.length > 0 && (
                  <div className="bg-muted rounded-xl p-3 max-h-40 overflow-y-auto">
                    <p className="text-xs font-semibold mb-2 text-muted-foreground">
                      Customer Phone Numbers:
                    </p>
                    {uniquePhones.map((phone, _i) => (
                      <div
                        key={phone}
                        className="flex items-center gap-2 py-0.5"
                      >
                        <span className="text-xs font-mono">{phone}</span>
                        <CopyBtn value={phone} />
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <label htmlFor="promo-msg" className="text-sm font-medium">
                    Promotional Message
                  </label>
                  <Textarea
                    data-ocid="dashboard.promo.textarea"
                    id="promo-msg"
                    placeholder="e.g. Hi! BobbyTravels is offering special discounts on Dubai packages this month. Book now at bobbytravels.online or call 9815480825!"
                    value={promoMsg}
                    onChange={(e) => setPromoMsg(e.target.value)}
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <Button
                  data-ocid="dashboard.promo.submit_button"
                  onClick={() => {
                    if (!promoMsg.trim()) {
                      toast.error("Please write a message first.");
                      return;
                    }
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(promoMsg)}`,
                      "_blank",
                    );
                    toast.success(
                      "WhatsApp opened. Select your contacts to send the message.",
                    );
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Open in WhatsApp
                </Button>
                <p className="text-xs text-muted-foreground">
                  Tip: For bulk messaging, use{" "}
                  <strong>WhatsApp Business</strong> broadcast lists. Add your
                  customers to a broadcast list so you can message all of them
                  at once.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
