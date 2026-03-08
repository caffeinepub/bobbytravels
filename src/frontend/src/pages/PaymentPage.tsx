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
  CheckCircle,
  Copy,
  CreditCard,
  Info,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const UPI_ID = "9878030007-1@okbizaxis";
const PAYEE_NAME = "BobbyTravels";

export function PaymentPage() {
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [upiLaunched, setUpiLaunched] = useState(false);

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      toast.success("UPI ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleGooglePay = () => {
    if (
      !amount ||
      Number.isNaN(Number.parseFloat(amount)) ||
      Number.parseFloat(amount) <= 0
    ) {
      toast.error("Please enter a valid amount.");
      return;
    }
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent("BobbyTravels Flight Booking")}`;
    window.location.href = upiUrl;
    setUpiLaunched(true);
    toast.success("Opening payment app...");
  };

  const presetAmounts = ["5000", "10000", "15000", "25000", "50000"];

  return (
    <main className="min-h-screen bg-sky-pale pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-4xl text-foreground mb-2">
              Secure <span className="text-navy">Payment</span>
            </h1>
            <p className="text-muted-foreground">
              Pay via UPI / Google Pay — fast, secure, and instant
            </p>
          </div>

          <div className="space-y-5">
            {/* Payment Card */}
            <Card className="border-0 shadow-flight rounded-3xl overflow-hidden">
              <CardHeader className="hero-gradient p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-navy-dark" />
                  </div>
                  <div>
                    <CardTitle className="text-white font-display text-xl">
                      UPI Payment
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Pay directly to BobbyTravels
                    </CardDescription>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-green-400/20 text-green-300 border-green-400/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* UPI ID display */}
                <div className="bg-sky-pale rounded-2xl p-5 border border-border">
                  <p className="text-xs font-ui font-medium uppercase tracking-widest text-muted-foreground mb-2">
                    UPI / Google Pay ID
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 font-mono text-base font-bold text-foreground tracking-wide">
                      {UPI_ID}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyUpiId}
                      className="gap-2 rounded-lg shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Payee:{" "}
                    <span className="font-semibold text-foreground">
                      {PAYEE_NAME}
                    </span>
                  </p>
                </div>

                {/* Amount input */}
                <div className="space-y-3">
                  <Label
                    htmlFor="amount"
                    className="text-sm font-ui font-medium"
                  >
                    Payment Amount (₹){" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-base">
                      ₹
                    </span>
                    <Input
                      id="amount"
                      data-ocid="payment.amount.input"
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8 h-12 text-lg font-display font-bold rounded-xl"
                    />
                  </div>
                  {/* Quick amounts */}
                  <div className="flex flex-wrap gap-2">
                    {presetAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-ui font-medium border transition-all ${
                          amount === amt
                            ? "bg-navy text-white border-navy"
                            : "bg-white text-muted-foreground border-border hover:border-navy hover:text-navy"
                        }`}
                      >
                        ₹{Number(amt).toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Google Pay button */}
                <Button
                  data-ocid="payment.googlepay.button"
                  size="lg"
                  onClick={handleGooglePay}
                  className="w-full h-14 bg-gold hover:bg-gold-dark text-navy-dark font-display font-bold text-base shadow-gold hover:shadow-none rounded-xl transition-all gap-3"
                >
                  <Smartphone className="w-5 h-5" />
                  Pay with Google Pay / UPI
                </Button>

                {upiLaunched && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800 flex gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Payment app opening...</p>
                      <p className="text-green-700 text-xs mt-0.5">
                        If your UPI app didn't open, copy the UPI ID above and
                        pay manually.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Section */}
            <Card className="border-0 shadow-flight rounded-3xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    <div className="w-44 h-44 rounded-2xl overflow-hidden bg-white border-2 border-border flex items-center justify-center">
                      <img
                        src="/assets/generated/upi-qr-placeholder.dim_300x300.png"
                        alt="Scan QR Code to Pay"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                      Scan with Any UPI App
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Open Google Pay, PhonePe, Paytm, or any UPI-enabled app.
                      Tap "Scan QR" and scan the code, or use the UPI ID above.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                        <Badge
                          key={app}
                          variant="secondary"
                          className="font-ui text-xs"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-0 shadow-flight rounded-3xl">
              <CardContent className="p-6">
                <div className="flex gap-3 mb-4">
                  <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
                  <h3 className="font-display font-semibold text-foreground">
                    Payment Instructions
                  </h3>
                </div>
                <ol className="space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "Enter the exact amount quoted by BobbyTravels for your booking.",
                    `Copy UPI ID: ${UPI_ID} or scan the QR code above.`,
                    "Open Google Pay, PhonePe, or any UPI app on your phone.",
                    "Complete the payment and take a screenshot of the confirmation.",
                    "Send the payment confirmation screenshot on WhatsApp to +91 9815480825.",
                    "Your booking will be confirmed within 30 minutes of payment verification.",
                  ].map((step, idx) => (
                    <li key={step} className="flex gap-3">
                      <span className="w-5 h-5 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
