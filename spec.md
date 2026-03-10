# BobbyTravels

## Current State
Single React app serving both user pages and admin dashboard. Admin access is gated by email (adityabholath@gmail.com auto-gets admin flag). The Navbar shows a Dashboard link when isAdmin is true. Login/Register is available on the main site.

## Requested Changes (Diff)

### Add
- Hostname detection logic in App.tsx to differentiate between main domain and admin subdomain
- `AdminApp` component: renders only admin login and admin dashboard (no user pages, no public navbar)
- Admin-only registration guard on the admin subdomain (only adityabholath@gmail.com can register/login there)
- Dedicated admin login page with admin branding for the subdomain

### Modify
- `App.tsx`: detect `window.location.hostname` -- if it includes `admin.`, render `AdminApp`; otherwise render normal user `UserApp`
- `Navbar.tsx`: remove Dashboard link and Login button from main user site (users don't log in on main domain)
- `LoginPage.tsx`: keep as-is for admin subdomain use only (move login to admin subdomain)
- Main site: remove Login page route and Login button from navbar

### Remove
- Login/Register route from the main user-facing site
- Admin Dashboard route from the main user-facing site
- Dashboard link from the main site navbar

## Implementation Plan
1. Update `App.tsx` to split into `UserApp` (main domain) and `AdminApp` (admin subdomain)
2. Create `AdminApp` component with admin-only login + dashboard
3. Create `AdminLoginPage` that only allows admin email to register/login
4. Update `Navbar` to remove Login and Dashboard links (user site has no auth)
5. Create `AdminNavbar` for the admin subdomain
