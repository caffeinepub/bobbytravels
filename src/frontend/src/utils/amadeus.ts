// Amadeus Test API integration
const AMADEUS_API_BASE = "https://test.api.amadeus.com";
const CLIENT_ID = "IM89moTdjNpalJEL5SkCNis2C9vA3Pix";
const CLIENT_SECRET = "nTy5ERnHp8kAUedf";

export interface FlightSegment {
  departure: { iataCode: string; at: string };
  arrival: { iataCode: string; at: string };
  carrierCode: string;
  number: string;
  numberOfStops: number;
  duration: string;
}

export interface FlightOffer {
  id: string;
  itineraryDuration: string;
  segments: FlightSegment[];
  returnSegments?: FlightSegment[];
  airlineName: string;
  carrierCode: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  returnDepartureTime?: string;
  returnArrivalTime?: string;
  stops: number;
  price: number;
  currency: string;
  cabinClass: string;
}

export interface SearchParams {
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: string;
}

async function getAccessToken(): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const res = await fetch(`${AMADEUS_API_BASE}/v1/security/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Amadeus auth failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token as string;
}

function cabinClassToAmadeus(cabin: string): string {
  const map: Record<string, string> = {
    Economy: "ECONOMY",
    "Premium Economy": "PREMIUM_ECONOMY",
    Business: "BUSINESS",
    "First Class": "FIRST",
  };
  return map[cabin] ?? "ECONOMY";
}

function parseDuration(iso: string): string {
  // PT2H30M -> "2h 30m"
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] ? `${match[1]}h` : "";
  const m = match[2] ? `${match[2]}m` : "";
  return [h, m].filter(Boolean).join(" ") || iso;
}

const AIRLINE_NAMES: Record<string, string> = {
  AI: "Air India",
  "6E": "IndiGo",
  SG: "SpiceJet",
  UK: "Vistara",
  QP: "Akasa Air",
  IX: "Air India Express",
  EK: "Emirates",
  EY: "Etihad Airways",
  QR: "Qatar Airways",
  SQ: "Singapore Airlines",
  TK: "Turkish Airlines",
  LH: "Lufthansa",
  BA: "British Airways",
  AF: "Air France",
  KL: "KLM",
  AA: "American Airlines",
  UA: "United Airlines",
  DL: "Delta Air Lines",
  FZ: "Flydubai",
  G8: "GoFirst",
  "2T": "TruJet",
};

export async function searchFlights(
  params: SearchParams,
): Promise<FlightOffer[]> {
  const token = await getAccessToken();

  const queryParams = new URLSearchParams({
    originLocationCode: params.originCode,
    destinationLocationCode: params.destinationCode,
    departureDate: params.departureDate,
    adults: String(params.adults),
    travelClass: cabinClassToAmadeus(params.cabinClass),
    nonStop: "false",
    max: "10",
    currencyCode: "INR",
  });

  if (params.returnDate) {
    queryParams.set("returnDate", params.returnDate);
  }
  if (params.children > 0) {
    queryParams.set("children", String(params.children));
  }
  if (params.infants > 0) {
    queryParams.set("infants", String(params.infants));
  }

  const res = await fetch(
    `${AMADEUS_API_BASE}/v2/shopping/flight-offers?${queryParams.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any)?.errors?.[0]?.detail ||
      `Flight search failed (${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const offers: any[] = data.data ?? [];

  return offers.map((offer) => {
    const itinerary = offer.itineraries[0];
    const returnItinerary = offer.itineraries[1];
    const segments: FlightSegment[] = itinerary.segments;
    const returnSegments: FlightSegment[] | undefined =
      returnItinerary?.segments;

    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    const carrierCode = firstSeg.carrierCode;

    const totalStops =
      segments.reduce(
        (acc: number, seg: FlightSegment) => acc + (seg.numberOfStops ?? 0),
        0,
      ) + Math.max(0, segments.length - 1);

    const price = Number.parseFloat(
      offer.price?.grandTotal ?? offer.price?.total ?? "0",
    );

    return {
      id: offer.id,
      itineraryDuration: parseDuration(itinerary.duration),
      segments,
      returnSegments,
      airlineName: AIRLINE_NAMES[carrierCode] ?? carrierCode,
      carrierCode,
      flightNumber: `${carrierCode}${firstSeg.number}`,
      departureTime: firstSeg.departure.at,
      arrivalTime: lastSeg.arrival.at,
      returnDepartureTime: returnSegments?.[0]?.departure?.at,
      returnArrivalTime:
        returnSegments?.[returnSegments.length - 1]?.arrival?.at,
      stops: totalStops,
      price,
      currency: offer.price?.currency ?? "INR",
      cabinClass: params.cabinClass,
    } satisfies FlightOffer;
  });
}

export function extractIataCode(airportValue: string): string {
  // Format: "Mumbai (BOM) - India" or "Mumbai (BOM)"
  const match = airportValue.match(/\(([A-Z]{3})\)/);
  return match ? match[1] : airportValue.trim().toUpperCase().slice(0, 3);
}

export function formatTime(isoDatetime: string): string {
  try {
    const date = new Date(isoDatetime);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoDatetime;
  }
}

export function formatDate(isoDatetime: string): string {
  try {
    const date = new Date(isoDatetime);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return isoDatetime;
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
