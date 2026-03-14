import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ExternalLink,
  FileSearch,
  Info,
  MessageCircle,
  Plane,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitPNREnquiry } from "../hooks/useQueries";

const airlineData = [
  // India
  {
    name: "Air India",
    region: "India",
    manageUrl: "https://www.airindia.com/in/en/manage.html",
    pnrParam: "pnrNumber",
    lastNameParam: "lastName",
  },
  {
    name: "IndiGo",
    region: "India",
    manageUrl: "https://www.goindigo.in/manage-booking.html",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "SpiceJet",
    region: "India",
    manageUrl: "https://www.spicejet.com/",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "AirAsia India",
    region: "India",
    manageUrl: "https://www.airasia.com/manage-booking/en/gb.html",
    pnrParam: "bookingCode",
    lastNameParam: "familyName",
  },
  {
    name: "Akasa Air",
    region: "India",
    manageUrl: "https://www.akasaair.com/manage-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "Star Air",
    region: "India",
    manageUrl: "https://www.starair.in/manage-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  // Middle East
  {
    name: "Emirates",
    region: "Middle East",
    manageUrl: "https://www.emirates.com/english/manage-booking/",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Qatar Airways",
    region: "Middle East",
    manageUrl: "https://www.qatarairways.com/en/manage-booking.html",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Etihad Airways",
    region: "Middle East",
    manageUrl: "https://www.etihad.com/en/manage/",
    pnrParam: "bookingReference",
    lastNameParam: "lastName",
  },
  {
    name: "Air Arabia",
    region: "Middle East",
    manageUrl: "https://www.airarabia.com/en/manage-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "flydubai",
    region: "Middle East",
    manageUrl: "https://www.flydubai.com/en/manage/retrieve-booking",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Oman Air",
    region: "Middle East",
    manageUrl: "https://www.omanair.com/en/manage-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "Kuwait Airways",
    region: "Middle East",
    manageUrl: "https://www.kuwaitairways.com/en/manage-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "Gulf Air",
    region: "Middle East",
    manageUrl: "https://www.gulfair.com/manage-booking",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  // Europe
  {
    name: "British Airways",
    region: "Europe",
    manageUrl:
      "https://www.britishairways.com/travel/managebooking/public/en_gb",
    pnrParam: "ref",
    lastNameParam: "surname",
  },
  {
    name: "Lufthansa",
    region: "Europe",
    manageUrl: "https://www.lufthansa.com/de/en/manage-booking",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Air France",
    region: "Europe",
    manageUrl: "https://wwws.airfrance.us/en/information/manage-my-booking",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "KLM",
    region: "Europe",
    manageUrl: "https://www.klm.com/en/manage-booking",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Turkish Airlines",
    region: "Europe",
    manageUrl: "https://www.turkishairlines.com/en-int/flights/manage-booking/",
    pnrParam: "pnrNumber",
    lastNameParam: "surname",
  },
  {
    name: "Swiss Air",
    region: "Europe",
    manageUrl: "https://www.swiss.com/en/en/manage",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Austrian Airlines",
    region: "Europe",
    manageUrl: "https://www.austrian.com/en/en/manage",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Iberia",
    region: "Europe",
    manageUrl: "https://www.iberia.com/us/manage-booking/",
    pnrParam: "localizator",
    lastNameParam: "lastName",
  },
  {
    name: "Ryanair",
    region: "Europe",
    manageUrl: "https://www.ryanair.com/us/en/manage-booking/",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  // Asia Pacific
  {
    name: "Singapore Airlines",
    region: "Asia Pacific",
    manageUrl: "https://www.singaporeair.com/en_UK/sg/manage-booking/",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Cathay Pacific",
    region: "Asia Pacific",
    manageUrl: "https://www.cathaypacific.com/cx/en_HK/manage-booking.html",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Malaysia Airlines",
    region: "Asia Pacific",
    manageUrl: "https://www.malaysiaairlines.com/my/en/manage-booking.html",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Thai Airways",
    region: "Asia Pacific",
    manageUrl:
      "https://www.thaiairways.com/en_US/booking/manage_my_booking.page",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Garuda Indonesia",
    region: "Asia Pacific",
    manageUrl: "https://www.garuda-indonesia.com/id/en/manage-booking",
    pnrParam: "bookingCode",
    lastNameParam: "lastName",
  },
  {
    name: "Vietnam Airlines",
    region: "Asia Pacific",
    manageUrl:
      "https://www.vietnamairlines.com/vn/en/travel-information/manage-booking",
    pnrParam: "bookingCode",
    lastNameParam: "lastName",
  },
  {
    name: "Air China",
    region: "Asia Pacific",
    manageUrl: "https://www.airchina.us/US/GB/buy/manage-booking/",
    pnrParam: "pnr",
    lastNameParam: "lastName",
  },
  {
    name: "China Eastern",
    region: "Asia Pacific",
    manageUrl: "https://us.ceair.com/en/manage-booking/",
    pnrParam: "orderCode",
    lastNameParam: "familyName",
  },
  {
    name: "Japan Airlines",
    region: "Asia Pacific",
    manageUrl: "https://www.jal.co.jp/en/booking/manage/",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "ANA",
    region: "Asia Pacific",
    manageUrl: "https://www.ana.co.jp/en/us/manage/",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "Korean Air",
    region: "Asia Pacific",
    manageUrl:
      "https://www.koreanair.com/global/en/before/check-in/manage-booking",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  // Americas
  {
    name: "American Airlines",
    region: "Americas",
    manageUrl: "https://www.aa.com/reservations/retrieve/begin.do",
    pnrParam: "confirmationCode",
    lastNameParam: "lastName",
  },
  {
    name: "United Airlines",
    region: "Americas",
    manageUrl:
      "https://www.united.com/ual/en/us/flight-search/manage-reservations/",
    pnrParam: "recordLocator",
    lastNameParam: "lastName",
  },
  {
    name: "Delta Air Lines",
    region: "Americas",
    manageUrl: "https://www.delta.com/us/en/need-help/overview",
    pnrParam: "confirmationNumber",
    lastNameParam: "lastName",
  },
  {
    name: "Air Canada",
    region: "Americas",
    manageUrl:
      "https://www.aircanada.com/ca/en/aco/home/plan/reservations/my-reservations.html",
    pnrParam: "bookingRef",
    lastNameParam: "lastName",
  },
  {
    name: "LATAM Airlines",
    region: "Americas",
    manageUrl: "https://www.latamairlines.com/us/en/manage-your-booking",
    pnrParam: "bookingCode",
    lastNameParam: "lastName",
  },
];

const regions = ["India", "Middle East", "Europe", "Asia Pacific", "Americas"];

function buildManageUrl(
  airline: (typeof airlineData)[0],
  pnr: string,
  lastName: string,
) {
  const url = new URL(airline.manageUrl);
  if (pnr) url.searchParams.set(airline.pnrParam, pnr);
  if (lastName) url.searchParams.set(airline.lastNameParam, lastName);
  return url.toString();
}

export function PNRPage() {
  const submit = useSubmitPNREnquiry();
  const [form, setForm] = useState({
    pnrNumber: "",
    airline: "",
    lastName: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const selectedAirline = airlineData.find((a) => a.name === form.airline);

  const handleCheckWebsite = () => {
    if (!form.airline || !form.pnrNumber || !form.lastName) {
      toast.error("Please fill in all fields to continue.");
      return;
    }
    if (!selectedAirline) return;
    const url = buildManageUrl(selectedAirline, form.pnrNumber, form.lastName);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleWhatsApp = async () => {
    if (!form.airline || !form.pnrNumber) {
      toast.error("Please select an airline and enter your PNR.");
      return;
    }
    try {
      await submit.mutateAsync({
        customerName: form.lastName || "Customer",
        customerPhone: "",
        pnrNumber: form.pnrNumber.toUpperCase(),
        airline: form.airline,
      });
    } catch {
      // silent — WhatsApp still opens
    }
    fetch("https://hooks.zapier.com/hooks/catch/26772363/ux8vj5v/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "pnr",
        lastName: form.lastName,
        pnrNumber: form.pnrNumber.toUpperCase(),
        airline: form.airline,
      }),
    }).catch(() => {});
    const msg = `✈️ PNR Status Help - BobbyTravels%0A%0AAirline: ${form.airline}%0APNR/E-Ticket: ${form.pnrNumber.toUpperCase()}%0ALast Name: ${form.lastName || "N/A"}%0A%0APlease help me check my booking status.`;
    window.open(`https://wa.me/919815480825?text=${msg}`, "_blank");
  };

  return (
    <main data-ocid="pnr.page" className="min-h-screen bg-sky-50 pt-20 pb-16">
      {/* Hero */}
      <div className="bg-navy-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-8 h-8 text-navy-dark" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Check Your <span className="text-gold">Booking Status</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Select your airline, enter your PNR and last name — we'll take you
            directly to the airline's official manage booking page.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "🔗",
              title: "Direct Redirect",
              desc: "Opens the airline's official site with your details pre-filled",
            },
            {
              icon: "🛡️",
              title: "Secure & Official",
              desc: "You interact directly with the airline — no middleman",
            },
            {
              icon: "💬",
              title: "Need Help?",
              desc: "Our team is on WhatsApp if you need assistance",
            },
          ].map((item) => (
            <Card key={item.title} className="border-0 shadow-sm rounded-2xl">
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main form card */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-navy-dark px-6 py-5 flex items-center gap-3">
            <Plane className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-lg">Manage My Booking</h3>
          </div>
          <CardContent className="p-6 space-y-5">
            {/* Airline */}
            <div>
              <Label className="font-medium">
                Airline <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.airline}
                onValueChange={(v) => set("airline", v)}
              >
                <SelectTrigger
                  data-ocid="pnr.airline.select"
                  className="mt-1 w-full"
                >
                  <SelectValue placeholder="Select your airline" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {regions.map((region) => (
                    <SelectGroup key={region}>
                      <SelectLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 py-1">
                        {region}
                      </SelectLabel>
                      {airlineData
                        .filter((a) => a.region === region)
                        .map((a) => (
                          <SelectItem key={a.name} value={a.name}>
                            {a.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PNR */}
            <div>
              <Label className="font-medium">
                PNR / E-Ticket Number{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="pnr.pnr.input"
                placeholder="e.g. ABCD12 or 1234567890"
                value={form.pnrNumber}
                onChange={(e) => set("pnrNumber", e.target.value.toUpperCase())}
                className="mt-1 font-mono tracking-widest"
                maxLength={14}
              />
            </div>

            {/* Last Name */}
            <div>
              <Label className="font-medium">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                data-ocid="pnr.lastname.input"
                placeholder="As printed on your ticket"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                You'll be redirected to the airline's official website. Details
                are pre-filled where supported by the airline.
              </span>
            </div>

            {/* Primary CTA */}
            <Button
              type="button"
              data-ocid="pnr.check_website.button"
              onClick={handleCheckWebsite}
              className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Check on Airline Website
            </Button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* WhatsApp help */}
            <Button
              type="button"
              data-ocid="pnr.whatsapp.button"
              variant="outline"
              onClick={handleWhatsApp}
              disabled={submit.isPending}
              className="w-full border-green-500 text-green-700 hover:bg-green-50 font-medium py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Need Help? Contact Us on WhatsApp
            </Button>
          </CardContent>
        </Card>

        {/* Selected airline preview */}
        {selectedAirline && form.pnrNumber && (
          <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-border text-sm">
            <p className="text-muted-foreground mb-1">You'll be taken to:</p>
            <p className="font-medium text-navy-dark break-all">
              {buildManageUrl(selectedAirline, form.pnrNumber, form.lastName)}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
