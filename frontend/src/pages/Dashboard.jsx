import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const cards = [
        {
            title: "Create Room",
            description: "Start a new coding session.",
            path: "/create-room",
        },
        {
            title: "Join Room",
            description: "Enter a room ID to collaborate.",
            path: "/join-room",
        },
        {
            title: "My Projects",
            description: "View your saved code.",
            path: "/projects",
        },
    ];

    return (
        <MainLayout>
            <h1 className="title-lg">Welcome, {user?.name?.split(" ")[0]}</h1>
            <p className="subtitle mb-6">Choose an option below</p>

            <div className="grid-3">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="menu-card"
                        onClick={() => navigate(card.path)}
                    >
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

export default Dashboard;
