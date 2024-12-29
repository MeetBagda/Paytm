import { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
      const fetchLoggedInUserId = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                return;
            }
          const response = await axios.get("http://localhost:3000/api/v1/user/me", {
            headers: {
                Authorization: `Bearer ${token}`,
                },
            });
          setLoggedInUserId(response.data.id);

        } catch (error) {
            console.error("Error fetching logged in user:", error);
            // Handle error gracefully, e.g., setLoggedInUserId(null)
        }
      };

      fetchLoggedInUserId();
    }, []);


    useEffect(() => {
      if (loggedInUserId) {
          axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
          .then(response => {
             // Filter out the logged-in user
              const filteredUsers = response.data.user.filter(
                 (user) => user._id !== loggedInUserId
             );
              setUsers(filteredUsers);
           })
         .catch(error => {
           console.error("Error fetching users:", error)
         })
      }
    }, [filter, loggedInUserId]);


    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input
                    onChange={(e) => {
                        setFilter(e.target.value);
                    }}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {users.map((user) => (
                    <User key={user._id} user={user} />
                ))}
            </div>
        </>
    );
};

function User({ user }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center h-ful">
                    <div>
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-ful">
                <Button
                    onClick={() => {
                        navigate(`/send?id=${user._id}&name=${user.firstName}`);
                    }}
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}