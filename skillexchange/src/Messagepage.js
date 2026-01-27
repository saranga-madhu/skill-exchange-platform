import { useState, useEffect } from "react";
import Navbar1 from "./Navbar1";
import ChatList from "./Chatlist";
import ChatWindow from "./Chatwindow";
import "./Messagepage.css";
import { API_URL, getAuthHeaders } from "./api";

function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/messages/conversations`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setConversations(data);
        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <>
      <Navbar1 />

      <div className="messages-container">
        <ChatList
          conversations={conversations}
          setSelectedChat={setSelectedChat}
          selectedChat={selectedChat}
        />

        <ChatWindow chat={selectedChat} />
      </div>
    </>
  );
}

export default MessagePage;
