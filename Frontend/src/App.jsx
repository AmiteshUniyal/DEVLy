import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import LoginPage from "./pages/auth/loginPage";
import SignUpPage from "./pages/auth/signUpPage";
import Sidebar from "./components/common/Sidebar";
import NotificationPage from "./pages/notif/NotificationPage";
import ProfilePage from "./pages/profile/profilePage";
import UserSearch from "./pages/searchPage/userSearch";
import { useContext } from "react";
import AppContext from "./context/contextapi";
import { FaSpinner } from "react-icons/fa";

function Layout({ children }) {
  const { authenticated } = useContext(AppContext);
  const hideSidebar = ["/login", "/signup"];
  const showSidebar = authenticated && !hideSidebar.includes(window.location.pathname);

  return (
    <div className="flex text-white">
      {showSidebar && <Sidebar />}
      {children}
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout><HomePage /></Layout>,
  },
  {
    path: "/notifications",
    element: <Layout><NotificationPage /></Layout>,
  },
  {
    path: "/profile/:username",
    element: <Layout><ProfilePage /></Layout>,
  },
  {
    path: "/search",
    element: <Layout><UserSearch /></Layout>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
]);

function App() {
  const { loading } = useContext(AppContext);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center text-white ">
        <FaSpinner className="text-4xl text-blue-600 animate-spin" />
        Please Wait...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;