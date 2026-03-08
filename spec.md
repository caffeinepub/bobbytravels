# BobbyTravels

## Current State
- Login uses Internet Identity (blockchain passkey) -- confusing for non-technical users
- User profiles stored by Principal (blockchain identity)
- Leads stored in backend, but only accessible after Internet Identity login + admin token claim
- Admin access requires knowing a secret token and claiming it via a hidden UI
- No user management dashboard for admin

## Requested Changes (Diff)

### Add
- Simple email + password registration and login (no Internet Identity)
- Hardcoded admin account: email `adityabholath@gmail.com`, password set at first login
- Admin user management page: view all registered users, their profiles, registration date
- Leads database: structured storage with customer name, phone, email, origin, destination, dates, trip type, passengers, special requests, timestamp, status (New/Contacted/Booked/Closed)
- Admin can update lead status from the Leads Dashboard
- Passengers field in FlightEnquiry updated to include adults, children, infants breakdown

### Modify
- Replace Internet Identity login with email/password form (no external popup)
- AccountPage: show simple email/password login form; after login show profile + admin dashboard links
- Navbar: show "Leads" and "Users" links only when admin is logged in
- Admin is identified by a hardcoded principal email (`adityabholath@gmail.com`) -- first user to register with that email gets admin role automatically
- FlightEnquiryInput: add adultsCount, childrenCount, infantsCount fields

### Remove
- Internet Identity dependency (useInternetIdentity hook usage in login flow)
- Admin token claim UI (replaced by automatic admin role assignment by email)

## Implementation Plan
1. Backend: Replace Internet Identity with email/password auth system
   - Register: store hashed password + email + profile
   - Login: verify credentials, return session token stored in localStorage
   - Auto-assign admin role to adityabholath@gmail.com on registration
   - Add getAllUsers() for admin to list all registered users
   - Add updateEnquiryStatus() for admin to update lead status
   - Update FlightEnquiry to include adultsCount, childrenCount, infantsCount and status field
2. Frontend: Replace Internet Identity login with email/password form
   - Simple card with Email + Password fields, Register/Login toggle
   - Remove all useInternetIdentity references
   - Add UsersPage for admin: table of all registered users
   - Update Navbar to show "Users" link for admin
   - Update LeadsPage to show status dropdown per lead
   - Update SearchPage passenger counts to pass adults/children/infants breakdown
