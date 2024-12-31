import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftIcon, SendIcon } from "lucide-react";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTransfer = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount: Number(amount),
          note: note,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert("Transfer successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Transfer failed:", error);
      setError(error.message || "Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-100"
              type="button"
            >
              <ArrowLeftIcon className="h-4 w-4" />
            </button>
            <div>
              <CardTitle>Send Money</CardTitle>
              <CardDescription>Transfer money to {name}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-3 py-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <div className="text-xl font-semibold">{name}</div>
              <div className="text-sm text-muted-foreground">{id}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (in ₹)</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Add a note (optional)</Label>
              <Input
                id="note"
                placeholder="What's this for?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            size="lg"
            onClick={handleTransfer}
            disabled={loading || !amount}
          >
            <SendIcon className="mr-2 h-4 w-4" />
            {loading
              ? "Processing..."
              : amount // check if amount exists
              ? `Send ₹${parseFloat(amount)}`
              : "Enter Amount to Send"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our payment{" "}
            <button
              onClick={() => navigate("/terms")}
              className="underline hover:text-primary"
              type="button"
            >
              terms and conditions
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
