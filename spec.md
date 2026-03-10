# BobbyTravels

## Current State
SearchPage is a single enquiry form. Users fill in origin/destination/dates/passengers/cabin and submit directly to WhatsApp and save as a lead. No live Amadeus flight search or results page exists.

## Requested Changes (Diff)

### Add
- Amadeus test API integration (token fetch + flight-offers search)
- Flight results page showing portal-style cards: airline logo/name, flight number, departure/arrival times, duration, stops, price per person
- "Select & Enquire" button on each flight card that opens a mini contact form pre-filled with flight details
- Inquiry submission from selected flight: saves lead to backend + opens WhatsApp with full flight details
- Loading state while searching
- Error/no-results state

### Modify
- SearchPage: split into Step 1 (search form) and Step 2 (results + select flow)
- Search button label changed to "Search Flights" (not "Get Deals on WhatsApp")
- Contact details moved to the post-selection inquiry step, not the search form

### Remove
- Nothing removed from other pages

## Implementation Plan
1. Create `src/frontend/src/utils/amadeus.ts` — helper to fetch Amadeus OAuth token and call flight-offers API, returning normalized flight data
2. Update SearchPage to:
   - Step 1: search form -> calls Amadeus API on submit
   - Step 2: show results as flight cards
   - Step 3: selected flight -> show contact form -> submit inquiry to WhatsApp + backend
3. Use IATA codes from AirportCombobox values for the API call
4. Show proper loading, error, and empty states
