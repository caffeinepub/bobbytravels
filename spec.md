# BobbyTravels

## Current State
- Full flight enquiry form (SearchPage) with origin, destination, trip type, dates, passengers (adults/children/infants), special requests, and customer contact details.
- Backend stores FlightEnquiry with: id, origin, destination, departureDate, returnDate, tripType, passengerCount, specialRequests, timestamp.
- `submitEnquiry` and `getAllEnquiries` backend methods exist.
- `getAllEnquiries` is admin-only.
- No leads dashboard page in the frontend -- admin cannot view saved leads.
- Customer name, phone, email are NOT stored in the backend (only used in WhatsApp/mailto links).

## Requested Changes (Diff)

### Add
- `customerName`, `customerPhone`, `customerEmail` fields to `FlightEnquiry` type in backend.
- `LeadsPage` in frontend: admin-only page showing a table/list of all submitted leads with customer name, phone, email, route, dates, trip type, passengers, special requests, timestamp.
- Navigation link to Leads page (visible only when logged in as admin).
- `useGetAllEnquiries` query hook.
- Lead count badge on the nav link.

### Modify
- `submitEnquiry` backend function to accept and store customerName, customerPhone, customerEmail.
- `useSubmitEnquiry` mutation in frontend to pass customer name, phone, email.
- `SearchPage` handleSubmit to pass customer contact fields to `submitEnquiry`.
- `backend.d.ts` to reflect updated FlightEnquiry and submitEnquiry signature.
- App.tsx to add "leads" page route and pass admin state down to Navbar.

### Remove
- Nothing removed.

## Implementation Plan
1. Update `main.mo`: add customerName, customerPhone, customerEmail to FlightEnquiry type; update submitEnquiry params.
2. Update `backend.d.ts`: reflect new FlightEnquiry fields and submitEnquiry signature.
3. Add `useGetAllEnquiries` hook in useQueries.ts.
4. Update `useSubmitEnquiry` mutation to pass new fields.
5. Update SearchPage handleSubmit to pass name/phone/email to submitEnquiry.
6. Create `LeadsPage.tsx`: admin gate, table of leads with all fields, empty state, loading state.
7. Update App.tsx to add "leads" page type and render LeadsPage.
8. Update Navbar to show "Leads" link only for admins.
