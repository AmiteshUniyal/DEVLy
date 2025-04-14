import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance";
import AppContext from "../../context/contextapi";

const LoginPage = () => {
  const { checkAuth } = useContext(AppContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosInstance.post("/auth/login", formData, {
        withCredentials: true,
      });

      // Refresh authentication
      await checkAuth();

      // Redirect to homepage
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError(error.response?.data?.error || "Something went wrong");
    }
  };

  const fillDemo = () => {
    setFormData({
      username: "demoUser",
      password: "123456",
    });
  };

  return (
    <div className="w-screen h-screen flex">
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img
          src="/Logo/logo.devly.png"
          className="lg:w-72 rounded-3xl"
          alt="Logo"
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form
          className="md:w-1/2 lg:w-2/3 mx-auto flex gap-4 flex-col"
          onSubmit={handleSubmit}
        >
          <img
            src="/Logo/logo.devly.png"
            className="w-20 lg:hidden mx-auto rounded-3xl"
            alt="Logo"
          />
          <h1 className="text-4xl font-bold text-white">Let's go.</h1>

          <label className="flex items-center gap-2 border border-gray-400 text-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <FaUser className="text-lg" />
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Username"
              name="username"
              required
              onChange={handleInputChange}
              value={formData.username}
            />
          </label>
          <label className="flex items-center gap-2 border border-gray-400 text-gray-300 rounded-md p-2 focus-within:ring-2 focus-within:ring-blue-500">
            <MdPassword className="text-lg" />
            <input
              type="password"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
              placeholder="Password"
              name="password"
              required
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Login
          </button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-white text-lg">Don't have an account?</p>
          <Link to="/signup">
            <button className="w-full py-2 px-6 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition">
              Sign up
            </button>
          </Link>
        </div>
        <div className="mt-6 text-center px-4">
          <p className="text-gray-400 text-sm mb-2">For demo purposes</p>
          <button
            onClick={fillDemo}
            type="button"
            className="w-full md:w-auto px-6 py-2 bg-gray-800 text-white border border-gray-600 rounded-md hover:bg-gray-700 transition"
          >
            Guest Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
