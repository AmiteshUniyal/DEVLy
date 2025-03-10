import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const NotificationPage = () => {
  const notifications = [
    {
      _id: "1",
      from: {
        _id: "1",
        username: "johndoe",
        profileImg: "/avatars/boy2.png",
      },
      type: "follow",
    },
    {
      _id: "2",
      from: {
        _id: "2",
        username: "janedoe",
        profileImg: "/avatars/girl1.png",
      },
      type: "like",
    },
  ];

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const deleteNotifications = () => {
    alert("All notifications deleted");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-500 min-h-screen">
		<div className="flex justify-between items-center p-4 border-b border-gray-500">
			<p className="font-bold text-lg text-white">Notifications -</p>

			<div className="relative" ref={dropdownRef}>
				<button
					onClick={() => setDropdownOpen(!dropdownOpen)}
					className="text-gray-400 hover:text-white focus:outline-none"
				>
					<IoSettingsOutline className="w-6 h-6" />
				</button>

			{dropdownOpen && (
				<div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-48 text-white text-sm">
					<div>
						<button
						onClick={deleteNotifications}
						className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none"
						>
						Delete all notifications
						</button>
					</div>
				</div>
			)}
			</div>
		</div>

		{notifications.length === 0 ? (
			<div className="text-center p-4 font-bold text-white">No notifications 🤔</div>
		) : (
			notifications.map((notification) => (
			<div className="border-b border-gray-500" key={notification._id}>
				<div className="flex gap-3 p-4 items-center">
					{notification.type === "follow" ? (
						<FaUser className="w-7 h-7 text-blue-400" />
					) : (
						<FaHeart className="w-7 h-7 text-red-500" />
					)}

					<Link to={`/profile/${notification.from.username}`} className="flex items-center gap-2">
						<img
						src={notification.from.profileImg || "/avatar-placeholder.png"}
						alt="Profile"
						className="w-8 h-8 rounded-full border border-gray-700"
						/>
						<div className="text-white">
							<span className="font-bold">@{notification.from.username}</span>{" "}
							{notification.type === "follow" ? "followed you" : "liked your post"}
						</div>
					</Link>
				</div>
			</div>
			))
		)}
    </div>
  );
};

export default NotificationPage;
