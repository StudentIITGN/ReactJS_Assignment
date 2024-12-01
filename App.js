
import React, { useState } from "react";
import KanbanBoard from "./KanbanBoard";

function App() {
  const [groupBy, setGroupBy] = useState("status"); 
  const [sortBy, setSortBy] = useState("priority"); 

  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <KanbanBoard 
        groupBy={groupBy} 
        sortBy={sortBy} 
        setGroupBy={setGroupBy} 
        setSortBy={setSortBy} 
      />
    </div>
  );
}

export default App;
