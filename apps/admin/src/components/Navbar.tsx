import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, status } = useAuth();

  return (
    <header className="topbar">
      <div>
        <strong>Dashboard Hybrid Admin</strong>
        <div className="muted">HTML runtime + TypeScript SPA</div>
      </div>
      <nav>
        <NavLink className="nav-link" to="/">Home</NavLink>
        <NavLink className="nav-link" to="/product-listing">Products</NavLink>
        <NavLink className="nav-link" to="/my-orders">Orders</NavLink>
        <NavLink className="nav-link" to="/personal-info">Account</NavLink>
      </nav>
      <div className="pill">
        {status === "authenticated" ? user?.email : "Guest mode"}
      </div>
    </header>
  );
}
