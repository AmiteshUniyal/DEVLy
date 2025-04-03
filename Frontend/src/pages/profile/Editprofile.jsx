import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const EditProfile = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        bio: "",
        link: "",
        newPassword: "",
        currentPassword: "",
    });

  const [isModal, setModal] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/user/update", formData, { withCredentials: true });
      console.log("User updated successfully!" , res.data);
    } 
    catch (error) {
      console.log(error?.response?.data?.message || "Something went wrong in updating user info");
    } 
    finally{
      setLoading(false);
      setModal(false);
    }
  };

  return (
    <>
      <button
        className="border border-gray-700 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
        onClick={() => setModal(true)}
      >
        Edit Profile
      </button>

      {isModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-11/12 max-w-lg p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Update Profile</h3>
              <button
                className="text-gray-400 hover:text-gray-200 transition"
                onClick={() => setModal(false)}
              >
                ❌
              </button>
            </div>

            {/* Form */}
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.fullName}
                  name="fullName"
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Username"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.username}
                  name="username"
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                />
                <div className="relative flex-1">
                  <textarea
                    placeholder="Bio"
                    className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 resize-none"
                    value={formData.bio}
                    name="bio"
                    onChange={handleInputChange}
                    maxLength={100}
                  />
                  <span className="absolute bottom-2 right-3 text-gray-400 text-sm">
                    {formData.bio.length}/100
                  </span>
                </div>
              </div>

              {/* Password Fields */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.currentPassword}
                  name="currentPassword"
                  onChange={handleInputChange}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.newPassword}
                  name="newPassword"
                  onChange={handleInputChange}
                />
              </div>

              {/* Link */}
              <input
                type="text"
                placeholder="Link"
                className="bg-gray-800 text-white border border-gray-700 rounded p-2"
                value={formData.link}
                name="link"
                onChange={handleInputChange}
              />

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading} 
                className={`px-4 py-2 rounded transition ${
                  loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
