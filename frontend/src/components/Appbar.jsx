import { useNavigate } from "react-router-dom";

export const Appbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div className="shadow h-14 flex justify-between items-center px-4 bg-white">
      <div className="font-bold text-xl">PayTM App</div>
      <div className="flex items-center">
        <div className="mr-4 text-gray-600">Hello</div>
        <button
          onClick={handleLogout}
          className="bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200 rounded px-3 py-2 text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};