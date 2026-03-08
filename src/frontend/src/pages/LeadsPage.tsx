import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetAllEnquiries, useIsCallerAdmin } from "@/hooks/useQueries";
import {
  ArrowRight,
  Calendar,
  Check,
  ClipboardCopy,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { FlightEnquiry } from "../backend.d";
import { TripType } from "../backend.d";

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

function LeadCard({
  enquiry,
  index,
}: {
  enquiry: FlightEnquiry;
  index: number;
}) {
  const ocidIndex = index + 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      data-ocid={`leads.item.${ocidIndex}`}
    >
      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white">
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
            <Badge
              variant="outline"
              className={`text-xs font-ui font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${tripTypeBadgeClass(enquiry.tripType)}`}
            >
              {tripTypeLabel(enquiry.tripType)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4 space-y-3">
          {/* Route */}
          <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2.5">
            <span className="font-display font-bold text-sm text-navy truncate max-w-[35%]">
              {enquiry.origin}
            </span>
            <ArrowRight className="w-4 h-4 text-gold flex-shrink-0" />
            <span className="font-display font-bold text-sm text-navy truncate max-w-[35%]">
              {enquiry.destination}
            </span>
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
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gold flex-shrink-0" />
              <span>
                <span className="text-foreground font-medium">
                  {Number(enquiry.passengerCount)}
                </span>{" "}
                passenger
                {Number(enquiry.passengerCount) !== 1 ? "s" : ""}
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
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: enquiries, isLoading: isEnquiriesLoading } =
    useGetAllEnquiries();

  const isLoading = isAdminLoading || isEnquiriesLoading;

  // Sort newest first
  const sorted = enquiries
    ? [...enquiries].sort((a, b) => Number(b.timestamp - a.timestamp))
    : [];

  if (isAdminLoading) {
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
            The leads dashboard is only available to administrators. Please log
            in with an admin account.
          </p>
        </div>
      </main>
    );
  }

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
            {!isLoading && (
              <Badge
                variant="outline"
                className="text-sm font-display font-semibold px-4 py-1.5 rounded-full border-navy/20 text-navy"
              >
                {sorted.length} enquir{sorted.length !== 1 ? "ies" : "y"}
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <LeadsSkeleton />
        ) : sorted.length === 0 ? (
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
      </div>
    </main>
  );
}
