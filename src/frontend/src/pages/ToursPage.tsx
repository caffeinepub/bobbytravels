import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Loader2, MapPin, Star, Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSubmitTourEnquiry } from "../hooks/useQueries";

const packages = [
  {
    id: "golden-triangle",
    name: "Golden Triangle India",
    places: "Delhi • Agra • Jaipur",
    days: 7,
    price: "₹25,000",
    perPerson: true,
    badge: "Best Seller",
    gradient: "from-orange-400 to-amber-500",
  },
  {
    id: "thailand",
    name: "Thailand Explorer",
    places: "Bangkok • Phuket • Pattaya",
    days: 8,
    price: "₹45,000",
    perPerson: true,
    badge: "Popular",
    gradient: "from-teal-400 to-cyan-500",
  },
  {
    id: "dubai",
    name: "Dubai Delight",
    places: "Dubai • Abu Dhabi",
    days: 5,
    price: "₹55,000",
    perPerson: true,
    badge: "Hot Deal",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    id: "singapore-malaysia",
    name: "Singapore & Malaysia",
    places: "Singapore • Kuala Lumpur",
    days: 7,
    price: "₹65,000",
    perPerson: true,
    badge: "Trending",
    gradient: "from-blue-400 to-indigo-500",
  },
  {
    id: "europe",
    name: "Europe Explorer",
    places: "Paris • Rome • Amsterdam",
    days: 12,
    price: "₹1,50,000",
    perPerson: true,
    badge: "Premium",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    id: "maldives",
    name: "Maldives Honeymoon",
    places: "Male • Baa Atoll",
    days: 5,
    price: "₹90,000",
    perPerson: true,
    badge: "Romantic",
    gradient: "from-cyan-400 to-blue-500",
  },
];

export function ToursPage() {
  const submit = useSubmitTourEnquiry();
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    tourPackage: "",
    travelDate: "",
    adults: 2,
    children: 0,
    budget: "",
    specialRequests: "",
  });

  const set = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleEnquire = (pkg: (typeof packages)[0]) => {
    set("tourPackage", pkg.name);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.customerName ||
      !form.customerPhone ||
      !form.tourPackage ||
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
        tourPackage: form.tourPackage,
        travelDate: form.travelDate,
        adultsCount: BigInt(form.adults),
        childrenCount: BigInt(form.children),
        budget: form.budget || undefined,
        specialRequests: form.specialRequests || undefined,
      });
      const msg = `🌍 Tour Enquiry from BobbyTravels%0A%0AName: ${form.customerName}%0APhone: ${form.customerPhone}%0APackage: ${form.tourPackage}%0ADate: ${form.travelDate}%0AAdults: ${form.adults}, Children: ${form.children}%0ABudget: ${form.budget || "Flexible"}%0ARequests: ${form.specialRequests || "None"}`;
      window.open(`https://wa.me/919815480825?text=${msg}`, "_blank");
      setSubmitted(true);
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-sky-50 pt-24 pb-16 flex items-center justify-center px-4">
        <div data-ocid="tours.success_state" className="text-center max-w-md">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Enquiry Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Our tour team will contact you with a customized itinerary and
            pricing.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            className="bg-gold hover:bg-gold/90 text-navy-dark"
          >
            Explore More Packages
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main data-ocid="tours.page" className="min-h-screen bg-sky-50 pt-20 pb-16">
      <div className="bg-navy-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">
            Tour <span className="text-gold">Packages</span>
          </h1>
          <p className="text-white/70 text-lg">
            Curated holiday packages with flights, hotels, and guided tours
            included.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              className="border-0 shadow-md hover:shadow-xl transition-shadow rounded-2xl overflow-hidden"
            >
              <div
                className={`h-36 bg-gradient-to-br ${pkg.gradient} flex items-end p-4`}
              >
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  {pkg.badge}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-bold text-lg mb-1">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {pkg.places}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {pkg.days} days
                  </span>
                  <div className="text-right">
                    <p className="font-bold text-navy text-lg">{pkg.price}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <Button
                  data-ocid={`tours.enquire.button.${packages.indexOf(pkg) + 1}`}
                  onClick={() => handleEnquire(pkg)}
                  className="w-full bg-navy-dark hover:bg-navy text-white rounded-xl"
                >
                  Enquire Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Form */}
        <div ref={formRef}>
          <Card className="border-0 shadow-xl rounded-3xl overflow-hidden max-w-2xl mx-auto">
            <div className="bg-navy-dark px-6 py-5 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-gold" />
              <h3 className="font-bold text-white text-lg">
                Tour Enquiry Form
              </h3>
            </div>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      data-ocid="tours.name.input"
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
                      data-ocid="tours.phone.input"
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
                    data-ocid="tours.email.input"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => set("customerEmail", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>
                    Tour Package <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    data-ocid="tours.package.input"
                    placeholder="Package name or destination"
                    value={form.tourPackage}
                    onChange={(e) => set("tourPackage", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Travel Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      data-ocid="tours.date.input"
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => set("travelDate", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Budget (optional)</Label>
                    <Input
                      data-ocid="tours.budget.input"
                      placeholder="e.g. ₹50,000"
                      value={form.budget}
                      onChange={(e) => set("budget", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Adults</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          set("adults", Math.max(1, form.adults - 1))
                        }
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center font-medium">
                        {form.adults}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => set("adults", form.adults + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Children</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          set("children", Math.max(0, form.children - 1))
                        }
                      >
                        -
                      </Button>
                      <span className="flex-1 text-center font-medium">
                        {form.children}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() =>
                          set("children", (form.children as number) + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Special Requests</Label>
                  <Textarea
                    data-ocid="tours.requests.textarea"
                    placeholder="Honeymoon package, dietary needs, accessibility requirements..."
                    value={form.specialRequests}
                    onChange={(e) => set("specialRequests", e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
                <Button
                  type="submit"
                  data-ocid="tours.submit_button"
                  className="w-full bg-gold hover:bg-gold/90 text-navy-dark font-semibold py-3"
                  disabled={submit.isPending}
                >
                  {submit.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Tour Enquiry"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
