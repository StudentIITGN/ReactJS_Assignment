import React from "react";
import mapPriority from "../../utils/mapPriority";

function TicketCard({ ticket }) {
  const { title, priority, description } = ticket;
  const { text, color } = mapPriority(priority);

  return (
    <div className="ticket-card" style={{ borderColor: color }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="priority" style={{ backgroundColor: color }}>{text}</span>
    </div>
  );
}

export default TicketCard;
