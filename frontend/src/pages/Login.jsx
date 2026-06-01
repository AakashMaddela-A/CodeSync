import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.jsx";
import AuthHeader from "../components/AuthHeader.jsx";
import Input from "../components/Input.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import Button from "../components/Button.jsx";
import Loader from "../components/Loader.jsx";

const Login = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error("Email and password are required");
            return;
        }
        setLoading(true);
        try {
            await login(formData);
            toast.success("Welcome back!");
            navigate("/dashboard", { replace: true });
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-center">
            <div style={{ width: "100%", maxWidth: "400px" }}>
                <AuthHeader />
                <div className="box">
                    <h2 className="title mb-4">Sign In</h2>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                        <PasswordInput
                            label="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Your password"
                            required
                        />
                        <Button
                            type="submit"
                            className="btn-block"
                            disabled={loading}
                        >
                            {loading ? <Loader size="sm" /> : "Sign In"}
                        </Button>
                    </form>
                    <p
                        className="text-muted"
                        style={{ textAlign: "center", marginTop: "1rem" }}
                    >
                        No account?{" "}
                        <Link to="/register" className="link">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
