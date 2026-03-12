import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Globe, Mail, Phone, Plane, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AIRLINES, REGIONS } from "../data/airlines";

const REGION_COLORS: Record<string, string> = {
  India: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "Middle East": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Europe: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Americas: "bg-red-500/20 text-red-400 border-red-500/30",
  "Asia Pacific": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Africa: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const IATA_COLORS = [
  "bg-blue-600",
  "bg-emerald-600",
  "bg-red-600",
  "bg-purple-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-pink-600",
  "bg-indigo-600",
];

function iataColor(iata: string) {
  let h = 0;
  for (let i = 0; i < iata.length; i++)
    h = (h * 31 + iata.charCodeAt(i)) & 0xffff;
  return IATA_COLORS[h % IATA_COLORS.length];
}

export function AirlineHelplinePage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return AIRLINES.filter((a) => {
      const matchRegion = region === "All" || a.region === region;
      const matchSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.iata.toLowerCase().includes(q) ||
        a.phone.includes(q);
      return matchRegion && matchSearch;
    });
  }, [search, region]);

  return (
    <main className="min-h-screen bg-background pt-20 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-dark via-navy to-navy-light/80 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Phone className="w-6 h-6 text-gold" />
            <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">
              Helpline Directory
            </Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-display">
            Airline Helpline Numbers
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto">
            Direct contact details for {AIRLINES.length}+ international
            airlines. Tap to call or email instantly.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-ocid="helpline.search.input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search airline, country or IATA code…"
              className="pl-10"
            />
          </div>
        </div>

        {/* Region Tabs */}
        <div
          className="flex flex-wrap gap-2 mb-6"
          data-ocid="helpline.region.tab"
        >
          {REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              data-ocid="helpline.region.tab"
              onClick={() => setRegion(r)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                region === r
                  ? "bg-gold text-navy-dark shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filtered.length} airline{filtered.length !== 1 ? "s" : ""}
          {region !== "All" ? ` in ${region}` : ""}
          {search ? ` matching "${search}"` : ""}
        </p>

        {filtered.length === 0 ? (
          <div data-ocid="helpline.empty_state" className="text-center py-16">
            <Plane className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              No airlines found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((airline, i) => (
              <div
                key={`${airline.iata}-${i}`}
                data-ocid={`helpline.item.${i + 1}`}
                className="bg-card border border-border rounded-2xl p-4 hover:border-gold/30 transition-all hover:shadow-md group"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${iataColor(airline.iata)} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <span className="text-white font-bold text-sm font-mono">
                      {airline.iata}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
                      {airline.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${
                          REGION_COLORS[airline.region] ||
                          "bg-muted text-muted-foreground"
                        }`}
                      >
                        {airline.country}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact links */}
                <div className="space-y-2">
                  <a
                    href={`tel:${airline.phone.replace(/[^+\d]/g, "")}`}
                    data-ocid="helpline.phone.link"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-gold transition-colors group/link"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover/link:bg-gold/20">
                      <Phone className="w-3.5 h-3.5 text-gold" />
                    </span>
                    <span className="truncate font-medium">
                      {airline.phone}
                    </span>
                  </a>

                  <a
                    href={`mailto:${airline.email}`}
                    data-ocid="helpline.email.link"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-gold transition-colors group/link"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover/link:bg-gold/20">
                      <Mail className="w-3.5 h-3.5 text-gold" />
                    </span>
                    <span className="truncate">{airline.email}</span>
                  </a>

                  <a
                    href={airline.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="helpline.website.link"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-gold transition-colors group/link"
                  >
                    <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 group-hover/link:bg-gold/20">
                      <Globe className="w-3.5 h-3.5 text-gold" />
                    </span>
                    <span className="truncate">
                      {airline.website.replace("https://", "")}
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
