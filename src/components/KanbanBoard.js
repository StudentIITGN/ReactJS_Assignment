import React from "react";
import Dropdown from "./Dropdown";
import KanbanColumn from "./KanbanColumn";
import useFetchTickets from "/hooks/useFetchTickets";
import groupTickets from "../../utils/groupTickets";
import sortTickets from "../../utils/sortTickets";

function KanbanBoard({ groupBy, sortBy, setGroupBy, setSortBy }) {
  const { tickets, loading, error } = useFetchTickets();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


  console.log("Tickets Data:", tickets);

  const groupedTickets = Array.isArray(tickets) ? groupTickets(tickets, groupBy) : {};


  console.log("Grouped Tickets:", groupedTickets);

  const sortedGroupedTickets = Object.entries(groupedTickets).map(([group, tickets]) => ({
    group,
    tickets: sortTickets(tickets, sortBy),
  }));

  return (
    <div>
      <Dropdown label="Group By" options={["status", "user", "priority"]} selected={groupBy} onChange={setGroupBy} />
      <Dropdown label="Sort By" options={["priority", "title"]} selected={sortBy} onChange={setSortBy} />
      <div className="kanban-board">
        {sortedGroupedTickets.map(({ group, tickets }) => (
          <KanbanColumn key={group} group={group} tickets={tickets} />
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;
