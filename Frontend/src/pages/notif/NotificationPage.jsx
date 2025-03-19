import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart, FaSpinner } from "react-icons/fa";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import AppContext from "../../context/contextapi";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { authUser } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/notification/", {
        withCredentials: true,
      });
      setNotifications(res.data.reverse());
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
    }
  }, [authUser]);

  function notificationTime(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (let i of intervals) {
      const value = Math.floor(diff / i.seconds);
      if (value !== 0) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
          -value,
          i.label
        );
      }
    }

    return "Just now";
  }

  const deleteNotifications = async () => {
    setModal(false);
    setIsLoading(true);
    try {
      await axiosInstance.delete("/notification/", { withCredentials: true });
      setNotifications([]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setIsLoading(false);
      setDropdown(false);
    }
  };

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdown(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-500 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b border-gray-500">
        <p className="font-bold text-lg text-white">Notifications -</p>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdown((prev) => !prev)}
            className="text-gray-400 hover:text-white focus:outline-none"
          >
            <IoSettingsOutline className="w-6 h-6" />
          </button>

          {dropdown && (
            <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg w-48 text-white text-sm">
              <div>
                <button
                  onClick={() => {
                    setModal(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 focus:outline-none"
                >
                  Delete all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-10 ">
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-500 max-h-[80vh] overflow-auto relative">
            <h2 className="text-xl text-center font-bold text-white mb-4">
              Are you sure you want to delete all notifications?
            </h2>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteNotifications();
                }}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-center my-4 text-red-500">{error}</p>}
      {isLoading ? (
        <div className="flex justify-center p-4 items-center text-white">
          <FaSpinner className="text-4xl text-blue-600 animate-spin" />
          Please Wait...
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center p-4 font-bold text-gray-500">
          No notifications 🤔
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            className="border-b border-gray-500 flex justify-between"
            key={notification._id}
          >
            <div className="flex gap-3 p-4 items-center">
              {notification.type === "follow" ? (
                <FaUser className="w-7 h-7 text-blue-400" />
              ) : (
                <FaHeart className="w-7 h-7 text-red-500" />
              )}

              <Link
                to={`/profile/${notification.from.username}`}
                className="flex items-center gap-2"
              >
                <img
                  src={
                    notification.from.profileImg || "/avatar-placeholder.png"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full border border-gray-700"
                />
                <div className="text-white">
                  <span className="font-bold">
                    @{notification.from.username}
                  </span>{" "}
                  {notification.type === "follow"
                    ? "followed you"
                    : "liked your post"}
                </div>
              </Link>
            </div>
            <div className="flex items-center text-sm text-gray-400 p-2">
              {notificationTime(notification?.createdAt)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationPage;
