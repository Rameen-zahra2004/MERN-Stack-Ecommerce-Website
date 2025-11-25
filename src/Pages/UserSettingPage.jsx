import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser, updateUser } from "../Slices/userSettingSlice";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function UserSettingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const authUser = JSON.parse(localStorage.getItem("user")) || null;

  // Redux state
  const {
    user: profileData,
    loading: profileLoading,
    saving,
  } = useSelector((state) => state.userSettings);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
  });

  // Load user profile
  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchUser());
    }
  }, [dispatch, authUser?.id]);

  // Update local state when profileData changes
  useEffect(() => {
    if (profileData) setProfile(profileData);
  }, [profileData]);

  // Handle input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imgUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, profileImage: imgUrl }));
  };

  // Save profile
  const handleSaveProfile = () => {
    dispatch(updateUser(profile));
    alert("Profile saved!");
  };

  if (profileLoading) {
    return <p className="text-center text-lg mt-20">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user")} // <-- Navigate to UserPage dashboard
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        <FiArrowLeft /> Back to Dashboard
      </button>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        User Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Profile Information
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={profile.profileImage || "https://i.pravatar.cc/150?img=12"}
            alt="Profile"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
            Upload Image
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={profile.name}
            placeholder="Name"
            className="border p-2 rounded w-full"
            onChange={handleProfileChange}
          />
          <input
            type="email"
            name="email"
            value={profile.email}
            placeholder="Email"
            className="border p-2 rounded w-full"
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="phone"
            value={profile.phone}
            placeholder="Phone"
            className="border p-2 rounded w-full"
            onChange={handleProfileChange}
          />
          <input
            type="text"
            name="address"
            value={profile.address}
            placeholder="Address"
            className="border p-2 rounded w-full"
            onChange={handleProfileChange}
          />
        </div>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={handleSaveProfile}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
