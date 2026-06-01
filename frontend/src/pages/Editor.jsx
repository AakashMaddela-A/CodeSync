import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth.jsx";
import { getRoom } from "../services/roomService.js";
import { runCode } from "../services/codeService.js";
import { createProject } from "../services/projectService.js";
import { SOCKET_URL } from "../utils/constants.js";
import { getTemplate } from "../utils/templates.js";
import { LANGUAGES } from "../utils/constants.js";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Button from "../components/Button.jsx";
import Loader from "../components/Loader.jsx";
import Input from "../components/Input.jsx";
import Modal from "../components/Modal.jsx";

const CollaborativeEditor = () => {
    const { roomId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isRemoteUpdate = useRef(false);

    const [code, setCode] = useState(getTemplate("javascript"));
    const [language, setLanguage] = useState("javascript");
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [typingUser, setTypingUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [output, setOutput] = useState("");
    const [running, setRunning] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saveModal, setSaveModal] = useState(false);
    const [projectTitle, setProjectTitle] = useState("");
    const [saving, setSaving] = useState(false);

    const addNotification = useCallback((message) => {
        setNotifications((prev) => [...prev, message]);
        setTimeout(() => {
            setNotifications((prev) => prev.slice(1));
        }, 5000);
    }, []);

    useEffect(() => {
        const initRoom = async () => {
            try {
                const data = await getRoom(roomId);
                if (data.room?.language) {
                    setLanguage(data.room.language);
                    setCode(getTemplate(data.room.language));
                }
                if (data.messages?.length) {
                    setMessages(data.messages);
                }
            } catch {
                toast.error("Failed to load room");
                navigate("/dashboard");
                return;
            } finally {
                setLoading(false);
            }
        };

        initRoom();
    }, [roomId, navigate]);

    useEffect(() => {
        if (!user || loading) return;

        const socket = io(SOCKET_URL, {
            transports: ["websocket"],
            auth: { token: localStorage.getItem("token") },
        });

        socketRef.current = socket;

        socket.emit("join-room", {
            roomId: roomId.toUpperCase(),
            userId: user._id,
            userName: user.name,
        });

        socket.emit("get-messages", { roomId: roomId.toUpperCase() });

        socket.on("room-users", (users) => {
            setParticipants(users);
        });

        socket.on("code-update", (newCode) => {
            isRemoteUpdate.current = true;
            setCode(newCode);
        });

        socket.on("code-sync", (syncedCode) => {
            isRemoteUpdate.current = true;
            setCode(syncedCode);
        });

        socket.on("language-update", (newLanguage) => {
            setLanguage(newLanguage);
            setCode(getTemplate(newLanguage));
        });

        socket.on("user-joined", ({ message }) => {
            addNotification(message);
            toast.success(message, { icon: "👋" });
        });

        socket.on("user-left", ({ message }) => {
            addNotification(message);
            toast(message, { icon: "👋" });
        });

        socket.on("user-typing", ({ userName, isTyping }) => {
            setTypingUser(isTyping ? userName : null);
        });

        socket.on("receive-message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("messages-history", (history) => {
            setMessages(history);
        });

        return () => {
            socket.emit("leave-room", {
                roomId: roomId.toUpperCase(),
                userName: user.name,
            });
            socket.disconnect();
        };
    }, [user, roomId, loading, addNotification]);

    const handleCodeChange = (value) => {
        const newCode = value || "";
        setCode(newCode);

        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }

        socketRef.current?.emit("code-change", {
            roomId: roomId.toUpperCase(),
            code: newCode,
        });

        socketRef.current?.emit("typing-start", {
            roomId: roomId.toUpperCase(),
            userName: user.name,
        });

        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socketRef.current?.emit("typing-stop", {
                roomId: roomId.toUpperCase(),
                userName: user.name,
            });
        }, 1000);
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        const template = getTemplate(newLang);
        setCode(template);

        socketRef.current?.emit("language-change", {
            roomId: roomId.toUpperCase(),
            language: newLang,
        });

        socketRef.current?.emit("code-change", {
            roomId: roomId.toUpperCase(),
            code: template,
        });
    };

    const handleRun = async () => {
        setRunning(true);
        setOutput("Running...");
        try {
            const result = await runCode(code, language);
            let outputText = "";
            if (result.output) outputText += result.output;
            if (result.error)
                outputText += (outputText ? "\n" : "") + result.error;
            if (!outputText) outputText = `Status: ${result.status}`;
            setOutput(outputText);
        } catch (error) {
            setOutput(error.response?.data?.message || "Execution failed");
            toast.error("Code execution failed");
        } finally {
            setRunning(false);
        }
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        socketRef.current?.emit("send-message", {
            roomId: roomId.toUpperCase(),
            sender: user.name,
            message: chatInput.trim(),
        });
        setChatInput("");
    };

    const handleSaveProject = async () => {
        if (!projectTitle.trim()) {
            toast.error("Please enter a project title");
            return;
        }
        setSaving(true);
        try {
            await createProject({
                title: projectTitle,
                language,
                code,
                roomId: roomId.toUpperCase(),
            });
            toast.success("Project saved successfully!");
            setSaveModal(false);
            setProjectTitle("");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to save project",
            );
        } finally {
            setSaving(false);
        }
    };

    const monacoLanguage =
        LANGUAGES.find((l) => l.value === language)?.monaco || "javascript";

    if (loading) {
        return (
            <div className="center-screen">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div
            className="page"
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Navbar />

            <div
                className="toolbar"
                style={{ justifyContent: "space-between" }}
            >
                <span className="text-muted">
                    Room:{" "}
                    <strong style={{ color: "#93c5fd" }}>
                        {roomId?.toUpperCase()}
                    </strong>
                </span>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                >
                    Leave
                </Button>
            </div>

            <div className="editor-layout">
                <div
                    style={{ height: "200px", flexShrink: 0 }}
                    className="editor-sidebar-wrap"
                >
                    <Sidebar
                        participants={participants}
                        messages={messages}
                        chatInput={chatInput}
                        onChatInputChange={(e) => setChatInput(e.target.value)}
                        onSendMessage={handleSendMessage}
                        typingUser={typingUser}
                        notifications={notifications}
                    />
                </div>

                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minHeight: 0,
                    }}
                >
                    <div className="toolbar">
                        <select
                            value={language}
                            onChange={handleLanguageChange}
                            className="input"
                            style={{ width: "auto" }}
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>
                        <Button
                            variant="success"
                            size="sm"
                            onClick={handleRun}
                            disabled={running}
                        >
                            {running ? "Running..." : "Run"}
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSaveModal(true)}
                        >
                            Save
                        </Button>
                    </div>

                    <div style={{ flex: 1, minHeight: 0 }}>
                        <Editor
                            height="100%"
                            language={monacoLanguage}
                            theme="vs-dark"
                            value={code}
                            onChange={handleCodeChange}
                            options={{
                                fontSize: 14,
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                wordWrap: "on",
                                lineNumbers: "on",
                                folding: true,
                                bracketPairColorization: { enabled: true },
                                autoIndent: "full",
                                formatOnPaste: true,
                                formatOnType: true,
                            }}
                        />
                    </div>

                    <div className="output-box">
                        <p className="text-muted mb-2">
                            Output {running && <Loader size="sm" />}
                        </p>
                        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                            {output || "Run code to see output..."}
                        </pre>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={saveModal}
                onClose={() => setSaveModal(false)}
                title="Save Project"
                confirmText={saving ? "Saving..." : "Save"}
                onConfirm={handleSaveProject}
            >
                <Input
                    label="Project Title"
                    name="title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="My Awesome Project"
                    required
                />
            </Modal>
        </div>
    );
};

export default CollaborativeEditor;
