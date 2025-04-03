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
      <div className="h-screen w-screen flex justify-center items-center text-white space-x-2">
        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
        <span> Please Wait...</span>
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