const sortTickets = (tickets, sortBy) => {
  return [...tickets].sort((a, b) => {
    if (sortBy === "priority") {
      return b.priority - a.priority; 
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title); 
    }
    return 0;
  });
};

export default sortTickets;
