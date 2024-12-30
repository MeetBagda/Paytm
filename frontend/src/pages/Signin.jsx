'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WalletIcon } from 'lucide-react';
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {
          username,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign-in failed:", error);
      setError(error.response?.data?.message || error.message || "Sign-in failed. Please try again.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <WalletIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => {e.preventDefault(); handleSignIn()}}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
               <button
                  onClick={() => navigate("/forgot-password")}
                   className="text-sm text-primary hover:text-primary/90"
                  type="button"
                  >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign in"}
              </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
          <div>
            Don't have an account?{" "}
            <button
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:text-primary/90 font-medium"
                  type="button"
                  >
                  Sign up
                </button>
          </div>
          <div className="text-xs">
            By continuing, you agree to our{" "}
               <button
                  onClick={() => navigate("/terms")}
                  className="underline hover:text-primary"
                 type="button"
                 >
                  Terms of Service
                </button>{" "}
            and{" "}
                <button
                  onClick={() => navigate("/privacy")}
                    className="underline hover:text-primary"
                  type="button"
                 >
                  Privacy Policy
                </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};