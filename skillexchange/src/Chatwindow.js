import { useState, useEffect, useRef, useCallback } from 'react';
import { API_URL, getAuthHeaders } from './api';

function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!chat) return;
    try {
      const response = await fetch(`${API_URL}/messages/${chat.id}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [chat]);

  useEffect(() => {
    if (chat) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [chat, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify({
          receiver_id: chat.id,
          content: newMessage
        })
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(); // Refresh conversation
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chat) {
    return <div className="chat-window">Select a conversation</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{chat.name.charAt(0)}</div>
        <div>
          <h3>{chat.name}</h3>
          <span className="status">Active now</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.from === "me" ? "me" : "them"}`}
          >
            {msg.text}
            <span className="time">{msg.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
