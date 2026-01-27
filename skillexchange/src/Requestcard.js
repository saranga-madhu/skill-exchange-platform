function RequestCard({ name, skill, time, onAccept, onDecline }) {
  return (
    <div className="request-card">
      <div>
        <strong>{name} wants to learn</strong>
        <p className="skill">{skill}</p>
        <small>{time}</small>
      </div>

      <div className="actions">
        <button className="accept" onClick={onAccept}>Accept</button>
        <button className="decline" onClick={onDecline}>Decline</button>
      </div>
    </div>
  );
}

export default RequestCard;
