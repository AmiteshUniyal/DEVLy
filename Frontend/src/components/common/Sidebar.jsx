import { MdHomeFilled, MdAddCircleOutline } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Link, useLocation, useNavigate} from "react-router-dom";
import AppContext from "../../context/contextapi";
import { useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { FiSearch } from "react-icons/fi";

export default function Sidebar() {

  const navigate = useNavigate();

  const { toggleFlag, checkAuth, authUser } = useContext(AppContext);

  const location = useLocation();

  const [modal, setModal] = useState(false);

  //logout functionality
  const Logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", { withCredentials: true });

      await checkAuth();
      setModal((prev) => !prev);
      navigate("/login")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>    
      {/* Sidebar */}
      <div className="sticky w-18 h-screen top-0 flex-col border-r border-gray-500 z-30 hidden md:flex">
        <Link to="/" className="flex justify-center md:justify-start">
          <img
            src="/Logo/logo.devly.png"
            className="m-2 w-14 rounded-full hover:bg-gray-800"
            alt="Logo"
          />
        </Link>
        <div className="flex flex-col h-screen justify-between">
          <div className="flex flex-col gap-3 mt-4">
            <SidebarLink 
              to="/" 
              icon={<MdHomeFilled className="w-8 h-8" />} 
              label="Home" 
            />
            <SidebarLink 
              to="/search" 
              icon={<FiSearch className="w-8 h-8" />} 
              label="Search" 
            />
            <SidebarLink 
              to="/notifications"
              icon={<IoNotifications className="w-8 h-8" />}
              label="Notifications"
            />
            {location.pathname === "/" && (
              <div className="flex justify-center md:justify-start">
                <button
                  onClick={toggleFlag}
                  className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                >
                  <MdAddCircleOutline className="w-8 h-8" />
                  <span className="text-lg hidden md:block">Create Post</span>
                </button>
              </div>
            )}
            <SidebarLink
              to={`/profile/${authUser?.username}`}
              icon={<FaUser className="w-8 h-8" />}
              label="Profile"
            />
          </div>

          {/* User Profile & Logout */}
          {authUser && (
            <Link to={`/profile/${authUser.username}`}>
              <div className="mb-4 flex gap-2 items-start transition-all duration-300 hover:bg-white hover:text-black py-2 px-4 rounded-full group">
                <div className="hidden md:inline-flex">
                  <img
                    className="w-8 rounded-full"
                    src={authUser?.profileImg || "/avatar-placeholder.png"}
                    alt="profile"
                  />
                </div>
                <div className="flex justify-between flex-1">
                  <div className="hidden md:block">
                    <p className="text-white font-bold text-sm w-20 truncate group-hover:text-black">
                      {authUser?.fullName}
                    </p>
                    <p className="text-gray-500 text-sm">@{authUser?.username}</p>
                  </div>
                  <BiLogOut
                    className="w-5 h-5 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setModal(true);
                    }}
                  />
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed  bottom-0 w-full border-t flex justify-around py-3 md:hidden z-50" style={{backgroundImage: "linear-gradient(to right,rgb(13, 32, 59), #0a0a0a)"}}>
        <BottomNavLink to="/" icon={<MdHomeFilled className="w-6 h-6" />} />
        <BottomNavLink to="/search" icon={<FiSearch className="w-6 h-6" />} />
        {location.pathname === "/" && (
          <button onClick={toggleFlag} className="text-white">
            <MdAddCircleOutline className="w-6 h-6" />
          </button>
        )}
        <BottomNavLink to="/notifications" icon={<IoNotifications className="w-6 h-6"/>} />
        <BottomNavLink to={`/profile/${authUser?.username}`} icon={<FaUser className="w-5 h-5" />} />
        <div className=" flex items-center">
          <BiLogOut
            className="w-5 h-5 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setModal(true);
            }}
          />
        </div>
      </div>
    
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 ">
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-500 max-h-[80vh] overflow-auto relative">
            <h2 className="text-xl text-center font-bold text-white mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {Logout()}}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


const SidebarLink = ({ to, icon, label }) => (
  <div className="flex justify-center md:justify-start">
    <Link
      to={to}
      className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 md:pr-14 max-w-fit cursor-pointer"
    >
      <span>{icon}</span>
      <span className="text-lg hidden md:block">{label}</span>
    </Link>
  </div>
);


const BottomNavLink = ({ to, icon }) => (
  <Link to={to} className="text-white flex items-center">
    {icon}
  </Link>
);