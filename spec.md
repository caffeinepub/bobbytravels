# BobbyTravels

## Current State
The SearchPage has plain text `<Input>` fields for Origin and Destination where users type freeform text. There is no autocomplete or dropdown list of airports/cities.

## Requested Changes (Diff)

### Add
- A comprehensive list of major world airports/cities (IATA code + city + country) as a static data array in a new file `src/data/airports.ts`.
- A reusable `AirportCombobox` component that renders a searchable combobox (type-to-filter) showing airport name, city, IATA code, and country. Uses Popover + Command (cmdk) from shadcn for the dropdown UI.

### Modify
- Replace the Origin (`search.origin.input`) and Destination (`search.destination.input`) plain text inputs in `SearchPage.tsx` with the new `AirportCombobox` component.
- The selected value stored in `form.origin` / `form.destination` should be a human-readable string like "Delhi (DEL) - India" for use in the WhatsApp and email messages.

### Remove
- Nothing removed from existing features.

## Implementation Plan
1. Create `src/frontend/src/data/airports.ts` with a comprehensive list of ~200+ major airports worldwide (IATA, name, city, country). Include all major Indian cities prominently plus popular international destinations.
2. Create `src/frontend/src/components/AirportCombobox.tsx` — a Popover + CommandInput + CommandList based searchable dropdown. Filters by city, airport name, or IATA code as user types. Shows IATA badge, city, and country in each item. Closes on selection. Has a placeholder and a clear button.
3. Update `SearchPage.tsx` to import and use `AirportCombobox` for the From and To fields, replacing the plain Input. `form.origin` and `form.destination` hold the selected label string.
4. Validate (typecheck + build).
