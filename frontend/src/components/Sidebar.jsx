import { useEffect, useRef } from 'react';

const Sidebar = ({
  participants = [],
  messages = [],
  chatInput,
  onChatInputChange,
  onSendMessage,
  typingUser,
  notifications = [],
}) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside
      className="box"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        padding: 0,
      }}
    >
      <div style={{ padding: '0.75rem', borderBottom: '1px solid #374151' }}>
        <p className="label" style={{ marginBottom: '0.5rem' }}>
          Participants
        </p>
        {participants.length === 0 ? (
          <p className="text-muted">No one yet</p>
        ) : (
          participants.map((p, i) => (
            <p key={p.userId || i} className="text-muted" style={{ marginBottom: '0.25rem' }}>
              • {p.userName}
            </p>
          ))
        )}
      </div>

      {notifications.slice(-2).map((note, i) => (
        <p key={i} className="text-muted" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
          {note}
        </p>
      ))}

      {typingUser && (
        <p className="text-muted" style={{ padding: '0 0.75rem', fontSize: '0.75rem' }}>
          {typingUser} is typing...
        </p>
      )}

      <div style={{ padding: '0.75rem', borderBottom: '1px solid #374151' }}>
        <p className="label">Chat</p>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '0.75rem' }}>
        {messages.map((msg) => (
          <div key={msg._id || `${msg.sender}-${msg.createdAt}`} style={{ marginBottom: '0.75rem' }}>
            <p className="text-muted">
              <strong style={{ color: '#93c5fd' }}>{msg.sender}:</strong> {msg.message}
            </p>
            <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>{formatTime(msg.createdAt)}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        style={{ padding: '0.5rem', borderTop: '1px solid #374151', display: 'flex', gap: '0.5rem' }}
      >
        <input
          type="text"
          value={chatInput}
          onChange={onChatInputChange}
          placeholder="Message..."
          className="input"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn btn-primary btn-sm">
          Send
        </button>
      </form>
    </aside>
  );
};

export default Sidebar;
