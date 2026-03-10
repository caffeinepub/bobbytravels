# BobbyTravels - Full Rebuild

## Current State
Existing app has: Home, Book Flight search form (with airport dropdown, passengers, trip type), Payment page, Contact page, Leads dashboard (admin only), Users page. Auth uses Internet Identity (causing confusion). Zoho SalesIQ chat widget embedded. No Visa/Tour/PNR pages.

## Requested Changes (Diff)

### Add
- **Visa Services page**: Enquiry form for visa assistance (country, visa type, travel date, passport details, special notes). Submissions stored in backend.
- **Tour Packages page**: Display of popular tour packages with enquiry form. Submissions stored in backend.
- **Login/Registration page**: Simple email + password stored in backend canister. Admin email (adityabholath@gmail.com) gets admin role automatically on first registration.
- **PNR Enquiry**: Form where customer enters PNR number + airline + email; admin can view and respond via WhatsApp or email.
- **Admin Dashboard**: Single page showing stats (total leads, visa enquiries, tour enquiries, PNR requests, registered users) plus tabs for each data type.
- **Promotions tab in admin**: Compose a WhatsApp broadcast message to all customers who provided phone numbers.
- User registration/login backend with email+password (hashed), session token management.

### Modify
- **Navbar**: Add Visa, Tours, and Login links. Admin sees Dashboard link instead of separate Leads/Users.
- **Home page**: Add sections for Visa Services and Tour Packages teasers.
- **Backend**: Add visa enquiry, tour enquiry, PNR enquiry types. Add user registration/login with email+password. Admin auto-grant for specific email. Promotions list (phone number collection).
- **Flight enquiry**: Allow anonymous submissions (remove login requirement for customers).

### Remove
- Separate Leads page and Users page (merged into unified Admin Dashboard with tabs)
- Internet Identity login references

## Implementation Plan
1. Update backend: user registration (email+password), visa enquiries, tour enquiries, PNR enquiries, admin check by email.
2. Frontend: Login/Register page with email+password form.
3. Frontend: Visa Services page with enquiry form.
4. Frontend: Tour Packages page with packages display and enquiry form.
5. Frontend: Admin Dashboard page with stats + tabs (Flights, Visa, Tours, PNR, Users, Promotions).
6. Update Navbar, App.tsx routing, HomePage teaser sections.
7. Ensure Zoho SalesIQ chat widget remains.
