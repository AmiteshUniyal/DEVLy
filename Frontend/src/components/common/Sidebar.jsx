import { MdHomeFilled, MdAddCircleOutline } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";
import AppContext from "../../context/contextapi";
import { useContext, useState } from "react";
import axiosInstance from "../../api/axiosInstance";



export default function Sidebar () {
  
  const { toggleFlag, checkAuth, authUser } = useContext(AppContext);
  
  const location = useLocation(); 

  const[modal, setModal] = useState(false);

  //logout functionality
  const Logout = async() => {
    try {
      await axiosInstance.post('/auth/logout', { withCredentials: true });

      await checkAuth();
      setModal((prev) => !prev);

    } 
    catch (error) {
        console.error(error);
    }
  }


  return (
    <div className="w-18">
      <div className="sticky top-0 h-screen flex flex-col border-r border-gray-500 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <img
            src="/Logo/logo.devly.png"
            className="ml-2 mt-2 w-14 rounded-full fill-white hover:bg-gray-800"
            alt="Logo"
          />
        </Link>
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 md:pr-14 lg:pr-14 max-w-fit cursor-pointer"
            >
              <MdHomeFilled className="w-8 h-8" />
              <span className="text-lg hidden md:block">Home</span>
            </Link>
          </div>
          <div className="flex justify-center md:justify-start">
            <Link
              to="/notifications"
              className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
            >
              <IoNotifications className="w-6 h-6" />
              <span className="text-lg hidden md:block">Notifications</span>
            </Link>
          </div>
          {location.pathname === "/" && (
            <div className="flex justify-center md:justify-start" onClick={() => toggleFlag()}>
              <div className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer">
                <MdAddCircleOutline className="w-6 h-6" />
                <span className="text-lg hidden md:block">Create Post</span>
              </div>
            </div>
          )}
          <div className="flex justify-center md:justify-start">
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-3 items-center hover:bg-white hover:text-black transition-all rounded-full duration-300 py-2 pl-2 pr-4 md:pr-14 lg:pr-14 max-w-fit cursor-pointer"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg hidden md:block">Profile</span>
            </Link>
          </div>
        </div>
        {authUser && (
          <Link
          to={`/profile/${authUser.username}`}
          className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-white hover:text-black py-2 px-4 rounded-full group"
        >
          <div className="hidden md:inline-flex">
            <img
              className="w-8 rounded-full"
              src={authUser?.profileImg || "/avatar-placeholder.png"}
              alt="profile"
            />
          </div>
          <div className="flex justify-between flex-1">
            <div className="hidden md:block">
              <p className="text-white font-bold text-sm w-20 truncate group-hover:text-black">{authUser?.fullName}</p>
              <p className="text-gray-500 text-sm">@{authUser?.username}</p>
            </div>
            <BiLogOut className="w-5 h-5 cursor-pointer" 
                onClick={(e) => {
									e.preventDefault();
									setModal((prev) => true);
								}} 
            />
          </div>
        </Link>        
        )}
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
          <div className="bg-gray-900 p-5 rounded-lg border border-gray-500 max-h-[80vh] overflow-auto relative">
            
            <h2 className="text-xl text-center font-bold text-white mb-4">Are you sure you want to logout?</h2>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setModal(false)}
                className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              
              <button
                onClick={Logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


