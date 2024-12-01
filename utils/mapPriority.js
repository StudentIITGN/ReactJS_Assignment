export default function mapPriority(priority) {
    const priorities = [
      { text: "No Priority", color: "gray" },
      { text: "Low", color: "green" },
      { text: "Medium", color: "yellow" },
      { text: "High", color: "orange" },
      { text: "Urgent", color: "red" },
    ];
    return priorities[priority] || priorities[0];
  }
  