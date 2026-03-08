import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, Share, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export function InstallBanner() {
  const { isInstallable, isInstalled, isIOS, isStandalone, handleInstall } =
    useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Don't show if: already dismissed, already installed/standalone, or not installable
  const shouldShow =
    isInstallable && !isInstalled && !isStandalone && !dismissed;

  return (
    <>
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            data-ocid="install.banner"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
              background: "oklch(0.16 0.055 265)",
              borderTop: "1px solid oklch(0.78 0.155 80 / 0.25)",
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              {/* App icon */}
              <img
                src="/assets/generated/bobbytravels-icon.dim_512x512.png"
                alt="BobbyTravels"
                className="w-10 h-10 rounded-xl flex-shrink-0"
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-ui font-semibold text-sm leading-tight truncate">
                  Install BobbyTravels App
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  {isIOS
                    ? "Add to your home screen"
                    : "Quick access to flight deals"}
                </p>
              </div>

              {/* Install button */}
              <Button
                data-ocid="install.primary_button"
                size="sm"
                onClick={() => {
                  if (isIOS) {
                    setShowIOSGuide(true);
                  } else {
                    handleInstall();
                  }
                }}
                className="flex-shrink-0 h-8 px-3 text-xs font-ui font-semibold"
                style={{
                  background: "oklch(0.78 0.155 80)",
                  color: "oklch(0.16 0.055 265)",
                }}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Install
              </Button>

              {/* Dismiss */}
              <button
                data-ocid="install.close_button"
                type="button"
                onClick={() => setDismissed(true)}
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss install prompt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* iOS Guide tooltip */}
            <AnimatePresence>
              {showIOSGuide && isIOS && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="px-4 pb-4"
                >
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "oklch(0.22 0.065 260)",
                      border: "1px solid oklch(0.78 0.155 80 / 0.2)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-white font-ui font-semibold text-sm">
                        How to install on iPhone/iPad
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowIOSGuide(false)}
                        className="text-white/40 hover:text-white transition-colors ml-2"
                        aria-label="Close iOS guide"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <ol className="space-y-2">
                      {[
                        {
                          icon: <Share className="w-4 h-4" />,
                          text: "Tap the Share button at the bottom of Safari",
                        },
                        {
                          icon: <span className="text-xs font-bold">↓</span>,
                          text: 'Scroll down and tap "Add to Home Screen"',
                        },
                        {
                          icon: <span className="text-xs font-bold">✓</span>,
                          text: 'Tap "Add" in the top right corner',
                        },
                      ].map((step) => (
                        <li key={step.text} className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                            style={{ background: "oklch(0.78 0.155 80 / 0.2)" }}
                          >
                            {step.icon}
                          </span>
                          <span className="text-white/80 text-xs">
                            {step.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
