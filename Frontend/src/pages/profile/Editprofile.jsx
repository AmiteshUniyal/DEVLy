import { useState } from "react";

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

  const [isModalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        className="border border-gray-700 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition"
        onClick={() => setModalOpen(true)}
      >
        Edit Profile
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg w-11/12 max-w-lg p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Update Profile</h3>
              <button
                className="text-gray-400 hover:text-gray-200 transition"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Profile updated successfully");
                setModalOpen(false);
              }}
            >
              {/* Full Name and Username */}
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

              {/* Email and Bio */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2"
                  value={formData.email}
                  name="email"
                  onChange={handleInputChange}
                />
                <textarea
                  placeholder="Bio"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded p-2 resize-none"
                  value={formData.bio}
                  name="bio"
                  onChange={handleInputChange}
                />
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
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                Update
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
