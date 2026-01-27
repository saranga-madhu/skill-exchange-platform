import MessageItem from "./MessageItem";

function ChatList({ conversations, setSelectedChat, selectedChat }) {
  return (
    <div className="chat-list">
      <input
        type="text"
        placeholder="Search conversations..."
        className="chat-search"
      />

      {conversations.map(chat => (
        <MessageItem
          key={chat.id}
          chat={chat}
          active={selectedChat && selectedChat.id === chat.id}
          onClick={() => setSelectedChat(chat)}
        />
      ))}
    </div>
  );
}

export default ChatList;
