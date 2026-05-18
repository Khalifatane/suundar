import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <strong>SPA Routes</strong>
      <nav>
        <NavLink className="nav-link" to="/">Overview</NavLink>
        <NavLink className="nav-link" to="/product-listing">Product Listing</NavLink>
        <NavLink className="nav-link" to="/product-detail">Product Detail</NavLink>
        <NavLink className="nav-link" to="/cart">Cart</NavLink>
        <NavLink className="nav-link" to="/checkout">Checkout</NavLink>
        <NavLink className="nav-link" to="/my-orders">My Orders</NavLink>
      </nav>
    </aside>
  );
}
