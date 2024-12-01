import { useState, useEffect } from "react";

const useFetchTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        } else {
          console.error("Expected tickets to be an array:", data);
          setTickets([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { tickets, loading, error };
};

export default useFetchTickets;
