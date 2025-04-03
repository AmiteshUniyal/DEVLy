import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FaSpinner } from "react-icons/fa";
import {Link} from "react-router-dom";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async (searchTerm) => {
    if (!searchTerm) {
        setUsers([]);
        return;
    }

    setLoading(true);
    setError("");

    try {
        const res = await axiosInstance.get(`/user/find?search=${searchTerm}`);
        setUsers(res.data);
    } catch (err) {
        setError("Failed to fetch users");
    }

    setLoading(false);
};


  // Debouncing
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers(query);
    }, 700);

    return () => clearTimeout(delay);
  }, [query]);


  return (
    <div className="p-4 mx-auto ">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className=" p-4 w-[80vw] text-lg border rounded-3xl bg-gray-800 text-white focus-within:ring-2 focus-within:ring-blue-500"
      />

      {loading && <p><FaSpinner className="text-4xl m-4 text-blue-600 animate-spin" /></p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {(users.length > 0 || (query && !loading)) && (
        <div className="mt-4 bg-gray-900 p-2 rounded-lg">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user._id} className="p-4 border-b border-gray-500">
                <div className="flex gap-3 items-center">
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
                    <img 
                      src={user.profileImg || "/avatar-placeholder.png"} 
                      alt="Profile Image" 
                      className="w-8 h-8 rounded-full border border-gray-700"
                    />
                    <div className="text-white truncate">
                      {user.fullName} <span className="text-gray-400 truncate">@{user.username}</span>                    
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
