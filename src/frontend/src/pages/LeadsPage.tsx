import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useGetAllEnquiries,
  useIsAdmin,
  useUpdateEnquiryStatus,
} from "@/hooks/useQueries";
import {
  ArrowRight,
  Calendar,
  Check,
  ClipboardCopy,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Plane,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { FlightEnquiry as _FlightEnquiry } from "../backend.d";
import { TripType } from "../backend.d";

// Extended type to handle both old and new backend shapes
interface FlightEnquiry extends _FlightEnquiry {
  adultsCount?: bigint;
  childrenCount?: bigint;
  infantsCount?: bigint;
  cabinClass?: string;
  status?: unknown;
}

function formatTimestamp(nanos: bigint): string {
  const ms = Number(nanos / 1_000_000n);
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tripTypeLabel(t: TripType): string {
  switch (t) {
    case TripType.oneWay:
      return "One Way";
    case TripType.returnTrip:
      return "Return";
    case TripType.isFlexible:
      return "Flexible";
    default:
      return String(t);
  }
}

function tripTypeBadgeClass(t: TripType): string {
  switch (t) {
    case TripType.oneWay:
      return "bg-sky-100 text-sky-800 border-sky-200";
    case TripType.returnTrip:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case TripType.isFlexible:
      return "bg-amber-100 text-amber-800 border-amber-200";
    default:
      return "";
  }
}

type StatusKey = "new_" | "contacted" | "booked" | "closed";

interface StatusMeta {
  label: string;
  className: string;
  dotClass: string;
}

const STATUS_META: Record<StatusKey, StatusMeta> = {
  new_: {
    label: "New",
    className: "bg-blue-100 text-blue-800 border-blue-200",
    dotClass: "bg-blue-500",
  },
  contacted: {
    label: "Contacted",
    className: "bg-amber-100 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
  },
  booked: {
    label: "Booked",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dotClass: "bg-gray-400",
  },
};

function getStatus(enquiry: FlightEnquiry): StatusKey {
  if (!enquiry.status) return "new_";
  const s = enquiry.status as
    | { new_?: null }
    | { contacted?: null }
    | { booked?: null }
    | { closed?: null }
    | string;
  if (typeof s === "string") return (s as StatusKey) || "new_";
  if (typeof s === "object" && s !== null) {
    if ("new_" in s) return "new_";
    if ("contacted" in s) return "contacted";
    if ("booked" in s) return "booked";
    if ("closed" in s) return "closed";
  }
  return "new_";
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy phone number"
            className="ml-1.5 inline-flex items-center justify-center w-6 h-6 rounded-md hover:bg-navy/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ClipboardCopy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent data-ocid="leads.tooltip">
          {copied ? "Copied!" : "Copy phone"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function StatusBadge({ status }: { status: StatusKey }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-ui font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1.5 ${meta.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`} />
      {meta.label}
    </Badge>
  );
}

function LeadCard({
  enquiry,
  index,
}: {
  enquiry: FlightEnquiry;
  index: number;
}) {
  const ocidIndex = index + 1;
  const { mutateAsync: updateStatus, isPending } = useUpdateEnquiryStatus();
  const currentStatus = getStatus(enquiry);

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus({ id: enquiry.id, status: newStatus });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Passenger breakdown
  const adults = Number(
    enquiry.adultsCount ??
      (enquiry as unknown as { passengerCount?: bigint }).passengerCount ??
      1n,
  );
  const children = Number(enquiry.childrenCount ?? 0n);
  const infants = Number(enquiry.infantsCount ?? 0n);
  const passengerSummary = [
    `${adults} Adult${adults !== 1 ? "s" : ""}`,
    children > 0 ? `${children} Child${children !== 1 ? "ren" : ""}` : null,
    infants > 0 ? `${infants} Infant${infants !== 1 ? "s" : ""}` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      data-ocid={`leads.item.${ocidIndex}`}
    >
      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white h-full flex flex-col">
        {/* Header row */}
        <CardHeader className="pb-2 pt-4 px-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-display font-bold text-foreground truncate">
                {enquiry.customerName}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5 font-ui">
                {formatTimestamp(enquiry.timestamp)}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
              <StatusBadge status={currentStatus} />
              <Badge
                variant="outline"
                className={`text-xs font-ui font-semibold px-2.5 py-0.5 rounded-full ${tripTypeBadgeClass(enquiry.tripType)}`}
              >
                {tripTypeLabel(enquiry.tripType)}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4 space-y-3 flex-1 flex flex-col">
          {/* Route */}
          <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2.5">
            <span className="font-display font-bold text-sm text-navy truncate max-w-[35%]">
              {enquiry.origin}
            </span>
            <ArrowRight className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="font-display font-bold text-sm text-navy truncate max-w-[35%]">
              {enquiry.destination}
            </span>
            {enquiry.cabinClass && (
              <span className="ml-auto text-xs text-muted-foreground font-ui flex-shrink-0 flex items-center gap-1">
                <Plane className="w-3 h-3" />
                {enquiry.cabinClass}
              </span>
            )}
          </div>

          {/* Dates + Passengers */}
          <div className="grid grid-cols-2 gap-2 text-xs font-ui text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>
                Dep:{" "}
                <span className="text-foreground font-medium">
                  {enquiry.departureDate}
                </span>
              </span>
            </div>
            {enquiry.returnDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                <span>
                  Ret:{" "}
                  <span className="text-foreground font-medium">
                    {enquiry.returnDate}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 col-span-2">
              <Users className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span className="text-foreground font-medium">
                {passengerSummary}
              </span>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            <a
              href={`tel:${enquiry.customerPhone}`}
              className="inline-flex items-center gap-1.5 text-xs font-ui font-medium text-navy hover:text-navy-light transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {enquiry.customerPhone}
            </a>
            <CopyButton value={enquiry.customerPhone} />

            <a
              href={`https://wa.me/${enquiry.customerPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-ui font-medium text-emerald-700 hover:text-emerald-600 transition-colors ml-auto"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>

            {enquiry.customerEmail && (
              <a
                href={`mailto:${enquiry.customerEmail}`}
                className="inline-flex items-center gap-1.5 text-xs font-ui font-medium text-blue-700 hover:text-blue-600 transition-colors w-full truncate"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{enquiry.customerEmail}</span>
              </a>
            )}
          </div>

          {/* Special requests */}
          {enquiry.specialRequests && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-xs font-ui text-amber-800">
              <span className="font-semibold">Special request: </span>
              {enquiry.specialRequests}
            </div>
          )}

          {/* Status update */}
          <div className="mt-auto pt-3 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-ui text-muted-foreground">
                Update status:
              </span>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={isPending}
              >
                <SelectTrigger
                  data-ocid={`leads.status.select.${ocidIndex}`}
                  className="h-7 text-xs rounded-lg flex-1 border-border/60"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_META) as StatusKey[]).map((key) => (
                    <SelectItem key={key} value={key} className="text-xs">
                      {STATUS_META[key].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function LeadsSkeleton() {
  return (
    <div
      data-ocid="leads.loading_state"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {["s1", "s2", "s3", "s4", "s5", "s6"].map((id) => (
        <Card key={id} className="rounded-2xl border border-border/60 bg-white">
          <CardHeader className="pb-2 pt-4 px-5">
            <Skeleton className="h-5 w-40 mb-1.5" />
            <Skeleton className="h-3.5 w-24" />
          </CardHeader>
          <CardContent className="px-5 pb-4 space-y-3">
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function LeadsPage() {
  const { data: isAdmin } = useIsAdmin();
  const { data: enquiries, isLoading } = useGetAllEnquiries();

  // Sort newest first — cast to extended FlightEnquiry to access new fields
  const sorted = (enquiries as FlightEnquiry[] | undefined)
    ? [...(enquiries as FlightEnquiry[])].sort((a, b) =>
        Number(b.timestamp - a.timestamp),
      )
    : ([] as FlightEnquiry[]);

  if (isLoading) {
    return (
      <main
        data-ocid="leads.page"
        className="min-h-screen bg-sky-pale pt-24 pb-16"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-80 mb-8" />
          <LeadsSkeleton />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main
        data-ocid="leads.page"
        className="min-h-screen bg-sky-pale pt-24 pb-16"
      >
        <div className="max-w-md mx-auto px-4 text-center mt-20">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-muted-foreground font-ui text-sm leading-relaxed">
            The leads dashboard is only available to administrators. Please sign
            in with your admin account.
          </p>
        </div>
      </main>
    );
  }

  // Filter by status
  const statusCounts = sorted.reduce(
    (acc, e) => {
      const s = getStatus(e);
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <main
      data-ocid="leads.page"
      className="min-h-screen bg-sky-pale pt-24 pb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Leads <span className="text-navy">Dashboard</span>
              </h1>
              <p className="text-muted-foreground font-ui text-sm mt-1">
                All flight enquiries submitted through the website
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(STATUS_META).map(([key, meta]) => {
                const count = statusCounts[key] || 0;
                if (count === 0) return null;
                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className={`text-xs font-ui font-semibold px-3 py-1 rounded-full ${meta.className}`}
                  >
                    {meta.label}: {count}
                  </Badge>
                );
              })}
              <Badge
                variant="outline"
                className="text-sm font-display font-semibold px-4 py-1.5 rounded-full border-navy/20 text-navy"
              >
                {sorted.length} total
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {sorted.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="leads.empty_state"
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-gold">
              <MessageCircle className="w-8 h-8 text-navy-dark" />
            </div>
            <h3 className="font-display font-bold text-xl text-foreground mb-2">
              No enquiries yet
            </h3>
            <p className="text-muted-foreground font-ui text-sm max-w-xs leading-relaxed">
              When customers submit flight enquiries through the booking form,
              they'll appear here.
            </p>
          </motion.div>
        ) : (
          <div
            data-ocid="leads.list"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {sorted.map((enquiry, index) => (
              <LeadCard
                key={String(enquiry.id)}
                enquiry={enquiry}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Export/Refresh button */}
        {sorted.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              data-ocid="leads.secondary_button"
              variant="outline"
              className="gap-2 text-sm font-ui border-navy/30 text-navy hover:bg-navy hover:text-white rounded-xl"
              onClick={() => {
                const csv = [
                  [
                    "Name",
                    "Phone",
                    "Email",
                    "From",
                    "To",
                    "Departure",
                    "Return",
                    "Passengers",
                    "Cabin",
                    "Status",
                    "Date",
                  ].join(","),
                  ...sorted.map((e) => {
                    const fe = e as FlightEnquiry;
                    return [
                      `"${fe.customerName}"`,
                      fe.customerPhone,
                      fe.customerEmail || "",
                      `"${fe.origin}"`,
                      `"${fe.destination}"`,
                      fe.departureDate,
                      fe.returnDate || "",
                      String(
                        Number(fe.adultsCount ?? 1n) +
                          Number(fe.childrenCount ?? 0n) +
                          Number(fe.infantsCount ?? 0n),
                      ),
                      fe.cabinClass || "",
                      getStatus(fe),
                      formatTimestamp(fe.timestamp),
                    ].join(",");
                  }),
                ].join("\n");
                const blob = new Blob([csv], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "bobbytravels-leads.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
