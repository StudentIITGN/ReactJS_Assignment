const groupTickets = (tickets, groupBy) => {
  if (!Array.isArray(tickets)) {
    console.error("Expected 'tickets' to be an array, but got:", typeof tickets);
    return {}; 
  }

  return tickets.reduce((grouped, ticket) => {
    const key = ticket[groupBy]; 
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(ticket);
    return grouped;
  }, {});
};

export default groupTickets;
