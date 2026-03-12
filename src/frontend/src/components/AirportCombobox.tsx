import { AIRPORTS } from "@/data/airports";
import { cn } from "@/lib/utils";
import { PlaneTakeoff, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Display text: while focused & typing show query, otherwise show selected value
  const displayValue = open ? query : value;

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
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleFocus = () => {
    setQuery("");
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setOpen(false);
      setQuery("");
      setActiveIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <PlaneTakeoff className="absolute left-3 h-4 w-4 text-gold pointer-events-none" />
        <input
          ref={inputRef}
          id={id}
          data-ocid={dataOcid}
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={displayValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex h-11 w-full rounded-xl border border-input bg-background pl-9 pr-8 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "hover:border-primary/50 transition-colors",
          )}
        />
        {value && !open && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={handleClear}
            className="absolute right-3 text-muted-foreground hover:text-foreground"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full max-h-[320px] overflow-y-auto rounded-xl border border-border bg-popover shadow-lg"
        >
          {filtered.map((airport, idx) => (
            <div
              key={`${airport.code}-${airport.city}`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(airport);
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 cursor-pointer text-sm",
                idx === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50",
              )}
            >
              <span className="shrink-0 inline-flex items-center justify-center rounded-md bg-navy/10 text-navy font-mono font-bold text-xs w-10 h-7 border border-navy/20">
                {airport.code}
              </span>
              <span className="flex flex-col min-w-0">
                <span className="font-medium text-foreground truncate">
                  {airport.city}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {airport.name} · {airport.country}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {open && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg px-4 py-6 text-center text-sm text-muted-foreground">
          No airports found.
        </div>
      )}
    </div>
  );
}
