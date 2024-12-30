import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate for navigation

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // Get the navigation function

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
      navigate("/dashboard"); // Use navigate for redirect
    } catch (error) {
      console.error("Sign-in failed:", error);
        setError(error.response?.data?.message || error.message || "Sign-in failed. Please try again.")

    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-96 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="user@gmail.com"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="securepassword123"
            label={"Password"}
            type="password" // Use type=password for password field
          />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="pt-4">
              <Button
                onClick={handleSignIn}
              label={loading ? "Signing In..." : "Sign in"}
              disabled = {loading}
                className = {loading ? 'bg-gray-400 cursor-not-allowed': ''}
             />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};