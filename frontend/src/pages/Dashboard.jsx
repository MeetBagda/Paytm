"use client";

import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BellIcon,
  CreditCardIcon,
  HistoryIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  SendIcon,
  UserIcon,
  WalletIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const spendingData = [
  { date: "Jan 1", amount: 2400 },
  { date: "Jan 2", amount: 1398 },
  { date: "Jan 3", amount: 9800 },
  { date: "Jan 4", amount: 3908 },
  { date: "Jan 5", amount: 4800 },
  { date: "Jan 6", amount: 3800 },
  { date: "Jan 7", amount: 4300 },
];
const recentTransactions = [
  { id: 1, type: "sent", name: "John Doe", amount: 500, time: "2 hours ago" },
  {
    id: 2,
    type: "received",
    name: "Sarah Smith",
    amount: 1200,
    time: "5 hours ago",
  },
  { id: 3, type: "sent", name: "Mike Johnson", amount: 750, time: "Yesterday" },
];

export const Dashboard = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const balance = 7637.12;

  async function handleDeposit(amount) {
    try {
      const response = await fetch("/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error("Deposit failed");
      // Handle success (e.g., refresh balance)
    } catch (error) {
      console.error("Deposit error:", error);
      // Handle error (show toast, etc.)
    }
  }

  async function handleWithdraw(amount) {
    try {
      const response = await fetch("/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error("Withdrawal failed");
      // Handle success (e.g., refresh balance)
    } catch (error) {
      console.error("Withdrawal error:", error);
      // Handle error (show toast, etc.)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 grid gap-4 md:grid-cols-6">
          <Card className="relative overflow-hidden md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Available in your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Balance />
            </CardContent>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10" />
          </Card>
          <Card
            className="group cursor-pointer hover:border-primary md:col-span-1"
            onClick={() => setIsDepositOpen(true)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5 text-green-600" />
                Quick Deposit
              </CardTitle>
              <CardDescription>Add money to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                variant="outline"
              >
                Deposit Now
              </Button>
            </CardContent>
          </Card>
          <Card
            className="group cursor-pointer hover:border-destructive md:col-span-1"
            onClick={() => setIsWithdrawOpen(true)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MinusIcon className="h-5 w-5 text-red-600" />
                Quick Withdraw
              </CardTitle>
              <CardDescription>Withdraw from your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full group-hover:bg-destructive group-hover:text-destructive-foreground"
                variant="outline"
              >
                Withdraw Now
              </Button>
            </CardContent>
          </Card>
          {/* <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Money Sent</CardTitle>
                            <CardDescription>This month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">₹4,250.00</div>
                            <div className="mt-2 flex items-center text-sm text-red-600">
                                <ArrowUpIcon className="mr-1 h-4 w-4" />
                                +8.2% from last month
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle>Money Received</CardTitle>
                            <CardDescription>This month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">₹5,880.00</div>
                            <div className="mt-2 flex items-center text-sm text-green-600">
                                <ArrowUpIcon className="mr-1 h-4 w-4" />
                                +15.3% from last month
                            </div>
                        </CardContent>
                    </Card> */}
        </div>

        {/* <div className="mb-8 grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>Your spending pattern</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={spendingData}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest transactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between rounded-lg border p-3"
                                    >
                                       
                                       <div className="flex items-center gap-3">
                                            <div className={`rounded-full p-2 ${
                                                transaction.type === 'received'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {transaction.type === 'received' ? (
                                                    <ArrowDownIcon className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpIcon className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{transaction.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {transaction.time}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`font-medium ${
                                            transaction.type === 'received'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'received' ? '+' : '-'}
                                            ₹{transaction.amount}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div> */}

        <Card>
          <Tabs defaultValue="all" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Quick Transfer</CardTitle>
                  <CardDescription>Send money to your contacts</CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <Users />
            </CardContent>
          </Tabs>
        </Card>
        <DepositModal
          isOpen={isDepositOpen}
          onClose={() => setIsDepositOpen(false)}
          onDeposit={handleDeposit}
        />
        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          onWithdraw={handleWithdraw}
          maxAmount={balance}
        />
      </main>
    </div>
  );
};
