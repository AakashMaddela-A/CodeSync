import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import Button from "./Button.jsx";

const Navbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/projects", label: "My Projects" },
    ];

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/dashboard" className="nav-logo">
                    CodeSync
                </Link>

                <div className="nav-desktop">
                    {links.map((link) => (
                        <Link key={link.to} to={link.to} className="nav-link">
                            {link.label}
                        </Link>
                    ))}
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>

                <button
                    type="button"
                    className="btn btn-ghost btn-sm nav-mobile-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    Menu
                </button>
            </div>

            {mobileOpen && (
                <div className="container" style={{ paddingTop: "0.5rem" }}>
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="nav-link"
                            style={{ display: "block", padding: "0.5rem 0" }}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
