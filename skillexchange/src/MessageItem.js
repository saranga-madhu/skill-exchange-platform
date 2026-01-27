function MessageItem({ chat, onClick, active }) {
  return (
    <div className={`chat-item ${active ? "active" : ""}`} onClick={onClick}>
      <div className="avatar">{chat.name.charAt(0)}</div>

      <div className="chat-info">
        <h4>{chat.name}</h4>
        <p>{chat.lastMessage}</p>
      </div>
    </div>
  );
}

export default MessageItem;
