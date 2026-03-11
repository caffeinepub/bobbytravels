import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, FileSearch, Loader2, Plane } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitPNREnquiry } from "../hooks/useQueries";

const airlines = [
  "Air India",
  "IndiGo",
  "SpiceJet",
  "Vistara",
  "GoFirst",
  "AirAsia India",
  "Emirates",
  "Qatar Airways",
  "Singapore Airlines",
  "British Airways",
  "Lufthansa",
  "Air France",
  "KLM",
  "Etihad",
  "Thai Airways",
  "Cathay Pacific",
  "Malaysian Airlines",
  "Sri Lankan Airlines",
  "Other",
];

export function PNRPage() {
  const submit = useSubmitPNREnquiry();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    pnrNumber: "",
    airline: "",
    travelDate: "",
    notes: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName ||
      !form.customerPhone ||
      !form.pnrNumber ||
      !form.airline
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await submit.mutateAsync({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        pnrNumber: form.pnrNumber.toUpperCase(),
        airline: form.airline,
        travelDate: form.travelDate || undefined,
        notes: form.notes || undefined,
      });
      const msg = `📋 PNR Enquiry from BobbyTravels%0A%0AName: ${form.customerName}%0APhone: ${form.customerPhone}%0APNR: ${form.pnrNumber.toUpperCase()}%0AAirline: ${form.airline}%0ATravel Date: ${form.travelDate || "N/A"}%0ANotes: ${form.notes || "None"}`;
      fetch("https://hooks.zapier.com/hooks/catch/26772363/ux8vj5v/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "pnr",
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || "",
          pnrNumber: form.pnrNumber.toUpperCase(),
          airline: form.airline,
          travelDate: form.travelDate || "",
          notes: form.notes || "",
        }),
      }).catch(() => {});
      window.open(`https://wa.me/919815480825?text=${msg}`, "_blank");
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4">
        <div data-ocid="pnr.success_state" className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">PNR Request Received!</h2>
          <p className="text-muted-foreground mb-6">
            Our team will contact you shortly with your flight status and
            details.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gold hover:bg-gold/90 text-navy-dark"
          >
            Submit Another Request
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main data-ocid="pnr.page" className="min-h-screen bg-sky-50 pt-20 pb-16">
      <div className="bg-navy-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-8 h-8 text-navy-dark" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            PNR <span className="text-gold">Status Check</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Enter your PNR number and our team will provide you with the latest
            flight status and booking details.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "📍",
              title: "What is PNR?",
              desc: "Passenger Name Record - your unique booking reference code",
            },
            {
              icon: "⏱",
              title: "Quick Response",
              desc: "Our team responds within 30 minutes during business hours",
            },
            {
              icon: "📱",
              title: "WhatsApp Updates",
              desc: "Receive flight status updates directly on WhatsApp",
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

        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-navy-dark px-6 py-5 flex items-center gap-3">
            <Plane className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-lg">PNR Enquiry Form</h3>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="pnr.name.input"
                    placeholder="Your name"
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="pnr.phone.input"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={form.customerPhone}
                    onChange={(e) => set("customerPhone", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Email Address</Label>
                <Input
                  data-ocid="pnr.email.input"
                  type="email"
                  value={form.customerEmail}
                  onChange={(e) => set("customerEmail", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    PNR / Booking Reference{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="pnr.pnr.input"
                    placeholder="e.g. ABCD12"
                    value={form.pnrNumber}
                    onChange={(e) =>
                      set("pnrNumber", e.target.value.toUpperCase())
                    }
                    className="mt-1 font-mono tracking-wider"
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label>
                    Airline <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.airline}
                    onValueChange={(v) => set("airline", v)}
                  >
                    <SelectTrigger
                      data-ocid="pnr.airline.select"
                      className="mt-1"
                    >
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                    <SelectContent>
                      {airlines.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Travel Date</Label>
                <Input
                  data-ocid="pnr.date.input"
                  type="date"
                  value={form.travelDate}
                  onChange={(e) => set("travelDate", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  data-ocid="pnr.notes.textarea"
                  placeholder="Any specific information you need..."
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                data-ocid="pnr.submit_button"
                className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold py-3"
                disabled={submit.isPending}
              >
                {submit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Check PNR Status"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
