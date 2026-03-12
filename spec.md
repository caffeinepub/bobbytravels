# BobbyTravels

## Current State
Full rebuild from scratch. Previous codebase had persistent blank page issues, broken Internet Identity code, and Amadeus API integration. Starting clean.

## Requested Changes (Diff)

### Add
- Backend: user registration and login with email/password stored in backend canister database (no Internet Identity)
- Backend: lead/enquiry storage (flight, visa, tour, PNR, contact)
- Backend: booking storage with PNR and payment status per user
- Flight Inquiry page: departure/arrival airport selection (280+ airports), trip type, travel dates, adults/children/infants passenger count, cabin class, special requests (wheelchair, meal preference, extra baggage, etc.), submit opens WhatsApp pre-filled with all details
- Airline Helpline page: comprehensive list of international airlines organized by country/region, each entry showing airline name, helpline phone number (click-to-call), email (click-to-email), and official website link
- Zoho SalesIQ live chat widget embedded globally (widget code: siq8f9556983b0ac16c59c4070c5b3c3c1c30b81d5fde0367f801d51bfda86b175a)
- Zoho Mail: all lead form submissions include a mailto link to book@bobbytravels.online as fallback email contact
- Zapier webhook: all enquiries send data to https://hooks.zapier.com/hooks/catch/26772363/ux8vj5v/
- PWA: manifest, service worker, app icon, install banner
- Admin panel: subdomain detection (admin.bobbytravels.online), restricted to adityabholath@gmail.com, tabs for Flight/Visa/Tour/PNR enquiries, Users, Bookings, Promotions
- Google Pay/UPI deep link on payment pages

### Modify
- Book Flight renamed to Flight Inquiry with enhanced form fields

### Remove
- Amadeus API integration entirely
- All Internet Identity / id.ai code, imports, files
- Any @dfinity/auth-client or @dfinity/internet-identity imports

## Implementation Plan
1. Backend (Motoko): user auth (register/login/session), lead storage, booking storage, admin check
2. Frontend pages:
   - Home (hero, services, destinations, why us, get the app)
   - Flight Inquiry (airport search, dates, passengers, special requests, WhatsApp submit)
   - Visa Services (country cards, enquiry form)
   - Tour Packages (package cards, enquiry form)
   - PNR Check (PNR lookup form)
   - Airline Helpline (country-wise airline directory with call/email/web links)
   - Contact (WhatsApp, phone, emails)
   - Login/Register (email+password, forgot password via WhatsApp)
   - My Bookings (user booking history)
   - Admin Dashboard (subdomain only, adityabholath@gmail.com restricted)
3. Zoho SalesIQ widget in index.html
4. PWA manifest and service worker
5. All forms send to Zapier webhook
