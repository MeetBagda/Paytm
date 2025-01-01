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
import { DepositModal } from "./DepositModal";
import { WithdrawModal } from "./WithdrawModal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccountActivity } from "./AccountActivity";

export const Dashboard = () => {
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/account/balance",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch balance");
          throw new Error("Failed to fetch balance");
        }
        const data = await response.json();
        setBalance(data.balance);
        setError(null);
      } catch (error) {
        console.error("Error fetching balance:", error);
        setError(error.message || "Failed to fetch balance");
        toast.error("Failed to fetch balance");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  async function handleDeposit(amount) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/account/deposit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deposit failed");
      }
      toast.success("Deposit successful");
      const data = await response.json();
      setBalance((prevBalance) => prevBalance + amount);
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error(error.message || "Deposit failed");
    }
  }

  async function handleWithdraw(amount) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/account/withdraw",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ amount, description: "Withdrawal" }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Withdrawal failed");
      }
      toast.success("Withdraw successful");
      setBalance((prevBalance) => prevBalance - amount);
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast.error(error.message || "Withdrawal failed");
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <ToastContainer />
      <Appbar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 grid gap-4 md:grid-cols-6">
          <Card className="relative overflow-hidden md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle>Total Balance</CardTitle>
              <CardDescription>Available in your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Balance balance={balance} loading={isLoading} error={error} />
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
        </div>

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
        <div className="mt-9"></div>
        <AccountActivity />
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