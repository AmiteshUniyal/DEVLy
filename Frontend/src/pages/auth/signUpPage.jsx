import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdOutlineMail, MdPassword, MdDriveFileRenameOutline } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import axiosInstance from "../../api/axiosInstance"; 

const SignUpPage = () => {

    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null); 
        setLoading(true);

        try {
            const response = await axiosInstance.post("/auth/signup", formData);

            console.log("Signup Successful:", response.data);
            navigate("/login");
        } 
        catch (err) {
            console.error("Signup Error:", err.response?.data?.error || err.message);
            setError(err.response?.data?.error || "Something went wrong. Try again.");
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen flex h-screen">
            <div className="flex-1 hidden lg:flex items-center justify-center">
                <img
                    src="/Logo/logo.devly.png"
                    className="lg:w-72 text-white rounded-3xl"
                    alt="Logo"
                />
            </div>

            <div className="flex-1 flex flex-col justify-center items-center">
                <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
                    <img
                        src="/Logo/logo.devly.png"
                        className="w-20 lg:hidden text-white mx-auto rounded-3xl"
                        alt="Logo"
                    />
                    <h1 className="text-4xl font-bold text-white">Welcome To DEVLy.</h1>

                    <div className="flex gap-4 flex-wrap">
                        <label className="flex items-center gap-2 border border-gray-400 rounded p-2 flex-1 focus-within:ring-2 focus-within:ring-blue-500">
                            <FaUser className="text-gray-500" />
                            <input
                                type="text"
                                className="bg-transparent outline-none text-white"
                                placeholder="Username"
                                name="username"
                                required
                                onChange={handleInputChange}
                                value={formData.username}
                            />
                        </label>
                        <label className="flex items-center gap-2 border border-gray-400 rounded p-2 flex-1 focus-within:ring-2 focus-within:ring-blue-500">
                            <MdDriveFileRenameOutline className="text-gray-500" />
                            <input
                                type="text"
                                className="bg-transparent outline-none text-white"
                                placeholder="Full Name"
                                name="fullName"
                                required
                                onChange={handleInputChange}
                                value={formData.fullName}
                            />
                        </label>
                    </div>

                    <label className="flex items-center gap-2 border border-gray-400 rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <MdOutlineMail className="text-gray-500" />
                        <input
                            type="email"
                            className="grow bg-transparent outline-none text-white"
                            placeholder="Email"
                            name="email"
                            required
                            onChange={handleInputChange}
                            value={formData.email}
                        />
                    </label>

                    <label className="flex items-center gap-2 border border-gray-400 rounded p-2 focus-within:ring-2 focus-within:ring-blue-500">
                        <MdPassword className="text-gray-500" />
                        <input
                            type="password"
                            className="grow bg-transparent outline-none text-white"
                            placeholder="Password"
                            name="password"
                            required
                            onChange={handleInputChange}
                            value={formData.password}
                        />
                    </label>

                    <button
                        type="submit"
                        className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign up"}
                    </button>

                    {error && <p className="text-red-500">{error}</p>}
                </form>

                <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
                    <p className="text-white text-lg">Already have an account?</p>
                    <Link to="/login">
                        <button className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2 px-4 rounded-full w-full">
                            Sign in
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
