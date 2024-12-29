import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { useEffect } from "react";
import axios from "axios";

function App() {
  return (
    <>
       <BrowserRouter>
        <Routes>
        <Route path="/signin" element={<AuthRoute><Signin /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<p>Route not found</p>} />
          <Route path="/send" element={<SendMoney />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


const AuthRoute = ({children}) => {
  const navigate = useNavigate();
  useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                  return;
                }
                await axios.get("http://localhost:3000/api/v1/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
               navigate("/dashboard")
            } catch (error) {
              console.log("Error while checking auth", error);
            }
        };

        checkAuth();
    }, [navigate]);
    return children;
};

export default App
