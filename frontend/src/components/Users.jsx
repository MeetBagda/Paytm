
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SendIcon } from "lucide-react";
import { Link } from "react-router-dom";

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
         <div className="relative mb-6">
                <input
                  placeholder="Search users..."
                  className="pl-9  w-full px-2 py-1 border rounded border-slate-200"
                     onChange={(e) => {
                        setFilter(e.target.value);
                     }}
                />
             </div>
             <div className="h-[400px] pr-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                   {users?.map((user) => (
                       <User key={user._id} user={user} loggedInUserId={loggedInUserId}/>
                    ))}
                </div>
            </div>
        </>
    );
};

function User({ user, loggedInUserId }) {
    const navigate = useNavigate();

    return (
        <div
          className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.firstName[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium capitalize">{user.firstName} {user.lastName}</div>
              {/* <div className="text-sm text-muted-foreground">
                Last transaction: 2 days ago
              </div> */}
            </div>
          </div>
           <Button size="sm" asChild>
            <Link to={`/send?id=${user._id}&name=${user.firstName}`}>
              <SendIcon className="mr-2 h-4 w-4" />
              Send
            </Link>
           </Button>
        </div>
    );
}