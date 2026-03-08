import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AIRPORTS } from "@/data/airports";
import { cn } from "@/lib/utils";
import { ChevronDown, PlaneTakeoff } from "lucide-react";
import { useMemo, useRef, useState } from "react";

interface AirportComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  "data-ocid"?: string;
}

const MAX_UNFILTERED = 50;

export function AirportCombobox({
  value,
  onChange,
  placeholder = "City or Airport",
  id,
  "data-ocid": dataOcid,
}: AirportComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AIRPORTS.slice(0, MAX_UNFILTERED);
    return AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q),
    );
  }, [query]);

  const handleSelect = (airport: (typeof AIRPORTS)[number]) => {
    onChange(`${airport.city} (${airport.code}) - ${airport.country}`);
    setOpen(false);
    setQuery("");
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          id={id}
          data-ocid={dataOcid}
          type="button"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="airport-combobox-listbox"
          className={cn(
            "flex h-11 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "hover:border-navy/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "transition-colors",
            !value && "text-muted-foreground",
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <PlaneTakeoff className="h-4 w-4 shrink-0 text-gold" />
            <span className="truncate">{value || placeholder}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 w-[var(--radix-popover-trigger-width)] max-w-[480px]"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search city, airport or code…"
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="max-h-[320px]">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No airports found.
            </CommandEmpty>
            {filtered.map((airport) => (
              <CommandItem
                key={`${airport.code}-${airport.city}`}
                value={airport.code}
                onSelect={() => handleSelect(airport)}
                className="cursor-pointer px-3 py-2"
              >
                <span className="flex items-center gap-3 w-full min-w-0">
                  {/* IATA badge */}
                  <span className="shrink-0 inline-flex items-center justify-center rounded-md bg-navy/10 text-navy font-mono font-bold text-xs w-10 h-7 border border-navy/20">
                    {airport.code}
                  </span>
                  {/* Info */}
                  <span className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground text-sm truncate">
                      {airport.city}
                    </span>
                    <span className="text-muted-foreground text-xs truncate">
                      {airport.name} · {airport.country}
                    </span>
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
