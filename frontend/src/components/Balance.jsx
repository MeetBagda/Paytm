'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowUpIcon } from 'lucide-react';

export const Balance = () => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/v1/account/balance",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError(error.response?.data?.message || error.message || "Failed to load balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (loading) {
    return <div className="font-bold text-lg">Loading balance...</div>;
  }

    if (error) {
    return <div className="text-red-500 text-sm">{error}</div>
  }

  return (
    <div>
      <div className="text-3xl font-bold">₹{balance}</div>
      <div className="mt-2 flex items-center text-sm text-green-600">
        <ArrowUpIcon className="mr-1 h-4 w-4" />
        +12.5% from last month
      </div>
    </div>
  );
};