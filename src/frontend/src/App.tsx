import { AdminApp } from "./pages/AdminApp";
import { UserApp } from "./pages/UserApp";

const isAdminSubdomain =
  window.location.hostname.startsWith("admin.") ||
  window.location.hostname === "admin.bobbytravels.online";

export default function App() {
  if (isAdminSubdomain) {
    return <AdminApp />;
  }
  return <UserApp />;
}
