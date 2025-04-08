import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import LoginPage from "./pages/auth/loginPage";
import SignUpPage from "./pages/auth/signUpPage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notif/NotificationPage";
import ProfilePage from "./pages/profile/profilePage";
import UserSearch from "./pages/searchPage/userSearch";
import { useContext, useEffect } from "react";
import AppContext from "./context/contextapi";
import { FaSpinner } from "react-icons/fa";

function App() {
  const { authenticated, loading } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !loading &&
      !authenticated &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login");
    }
  }, [authenticated, loading, location.pathname, navigate]);

  const hideSidebar = ["/login", "/signup"];
  const showSidebar = authenticated && !hideSidebar.includes(location.pathname);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center text-white px-4 text-center space-y-4">
        <div className="flex items-center space-x-2">
          <FaSpinner className="text-4xl text-blue-400 animate-spin" />
          <span className="text-lg text-gray-200">Please wait...</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-blue-400 font-semibold text-lg">🚧 Cold Start in Progress</h2>
          <p className="text-sm text-gray-400 mt-1">
            The backend server is waking up—this only happens on the first visit. Everything will run smoothly in a few seconds!
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex text-white">
      {showSidebar && <Sidebar />}
      <Routes>
        {authenticated ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/search" element={<UserSearch />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;