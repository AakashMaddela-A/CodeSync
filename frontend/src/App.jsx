import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Loader from "./components/Loader.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateRoom from "./pages/CreateRoom.jsx";
import JoinRoom from "./pages/JoinRoom.jsx";
import Editor from "./pages/Editor.jsx";
import Projects from "./pages/Projects.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
    const { loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="center-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? "/dashboard" : "/login"}
                        replace
                    />
                }
            />
            <Route
                path="/login"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
                }
            />
            <Route
                path="/register"
                element={
                    isAuthenticated ? (
                        <Navigate to="/dashboard" />
                    ) : (
                        <Register />
                    )
                }
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-room"
                element={
                    <ProtectedRoute>
                        <CreateRoom />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/join-room"
                element={
                    <ProtectedRoute>
                        <JoinRoom />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/room/:roomId"
                element={
                    <ProtectedRoute>
                        <Editor />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <Projects />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects/:id"
                element={
                    <ProtectedRoute>
                        <ProjectDetails />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
