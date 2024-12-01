import React, { useState } from 'react';
import KanbanBoard from './KanbanBoard';

function App() {
  const [groupBy, setGroupBy] = useState("Status");
  const [sortBy, setSortBy] = useState("Priority");

  return (
    <div>
      <KanbanBoard groupBy={groupBy} sortBy={sortBy} setGroupBy={setGroupBy} setSortBy={setSortBy} />
    </div>
  );
}

export default App;
