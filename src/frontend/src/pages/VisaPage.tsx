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
import { CheckCircle, Globe, Loader2, Stamp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitVisaEnquiry } from "../hooks/useQueries";

const destinations = [
  { name: "USA", flag: "🇺🇸", processing: "15-20 days" },
  { name: "UK", flag: "🇬🇧", processing: "10-15 days" },
  { name: "Schengen (Europe)", flag: "🇪🇺", processing: "10-15 days" },
  { name: "UAE / Dubai", flag: "🇦🇪", processing: "3-5 days" },
  { name: "Singapore", flag: "🇸🇬", processing: "5-7 days" },
  { name: "Australia", flag: "🇦🇺", processing: "20-30 days" },
  { name: "Canada", flag: "🇨🇦", processing: "20-30 days" },
  { name: "Thailand", flag: "🇹🇭", processing: "3-5 days" },
  { name: "Malaysia", flag: "🇲🇾", processing: "5-7 days" },
];

export function VisaPage() {
  const submit = useSubmitVisaEnquiry();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    country: "",
    visaType: "",
    travelDate: "",
    passportNumber: "",
    specialNotes: "",
  });

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName ||
      !form.customerPhone ||
      !form.country ||
      !form.visaType ||
      !form.travelDate
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await submit.mutateAsync({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        country: form.country,
        visaType: form.visaType,
        travelDate: form.travelDate,
        passportNumber: form.passportNumber || undefined,
        specialNotes: form.specialNotes || undefined,
      });
      // WhatsApp notification
      const msg = `🇮🇳 Visa Enquiry from BobbyTravels%0A%0AName: ${form.customerName}%0APhone: ${form.customerPhone}%0AEmail: ${form.customerEmail || "N/A"}%0ACountry: ${form.country}%0AVisa Type: ${form.visaType}%0ATravel Date: ${form.travelDate}%0APassport: ${form.passportNumber || "N/A"}%0ANotes: ${form.specialNotes || "None"}`;
      fetch("https://hooks.zapier.com/hooks/catch/26772363/ux8vj5v/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "visa",
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          customerEmail: form.customerEmail || "",
          country: form.country,
          visaType: form.visaType,
          travelDate: form.travelDate,
          passportNumber: form.passportNumber || "",
          specialNotes: form.specialNotes || "",
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
        <div data-ocid="visa.success_state" className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Enquiry Submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Our visa team will contact you shortly. A WhatsApp message has been
            sent to our team with your details.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gold hover:bg-gold/90 text-navy-dark"
          >
            Submit Another Enquiry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main data-ocid="visa.page" className="min-h-screen bg-sky-50 pt-20 pb-16">
      {/* Hero */}
      <div className="bg-navy-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stamp className="w-8 h-8 text-navy-dark" />
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Visa <span className="text-gold">Services</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Hassle-free visa assistance for 50+ countries. Our experts handle
            everything from documentation to appointment booking.
          </p>
        </div>
      </div>

      {/* Destinations grid */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Popular Visa Destinations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {destinations.map((d) => (
            <Card
              key={d.name}
              className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer rounded-2xl"
              onClick={() => set("country", d.name)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{d.flag}</div>
                <p className="font-semibold text-sm">{d.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {d.processing}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enquiry Form */}
        <Card className="border-0 shadow-xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
          <div className="bg-navy-dark px-6 py-5 flex items-center gap-3">
            <Globe className="w-6 h-6 text-gold" />
            <h3 className="font-bold text-white text-lg">Visa Enquiry Form</h3>
          </div>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="visa.name.input"
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
                    data-ocid="visa.phone.input"
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
                  data-ocid="visa.email.input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.customerEmail}
                  onChange={(e) => set("customerEmail", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Destination Country{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="visa.country.input"
                    placeholder="e.g. USA, UK, Dubai"
                    value={form.country}
                    onChange={(e) => set("country", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>
                    Visa Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.visaType}
                    onValueChange={(v) => set("visaType", v)}
                  >
                    <SelectTrigger
                      data-ocid="visa.type.select"
                      className="mt-1"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tourist">Tourist</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Transit">Transit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Planned Travel Date{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="visa.date.input"
                    type="date"
                    value={form.travelDate}
                    onChange={(e) => set("travelDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Passport Number (optional)</Label>
                  <Input
                    data-ocid="visa.passport.input"
                    placeholder="A1234567"
                    value={form.passportNumber}
                    onChange={(e) => set("passportNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Special Notes</Label>
                <Textarea
                  data-ocid="visa.notes.textarea"
                  placeholder="Any special requirements or questions..."
                  value={form.specialNotes}
                  onChange={(e) => set("specialNotes", e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                data-ocid="visa.submit_button"
                className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold py-3"
                disabled={submit.isPending}
              >
                {submit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Visa Enquiry"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
