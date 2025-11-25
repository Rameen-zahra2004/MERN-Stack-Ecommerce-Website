import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} from "../AdminSlices/profileSlice";

export default function ProfileForm({ profile }) {
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.profile || {}
  );

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Sync profile when data loads
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  // Handle input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validate fields
  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errors.email = "Invalid email format";
    if (!form.phone.match(/^[0-9]{10,15}$/))
      errors.phone = "Invalid phone number";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Save profile
  const save = () => {
    if (!validate()) return;
    dispatch(updateProfile(form));
  };

  // Handle avatar upload + preview
  const onFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result); // live preview
      dispatch(uploadAvatar(ev.target.result)); // send to backend
    };
    reader.readAsDataURL(file);
  };

  // Delete avatar
  const handleDeleteAvatar = () => {
    dispatch(deleteAvatar());
    setAvatarPreview(null); // remove preview immediately
  };

  return (
    <div className="bg-white p-5 rounded shadow max-w-3xl w-full">
      <h3 className="text-xl font-semibold mb-4">Profile</h3>

      {/* Success message */}
      {success && (
        <div className="mb-3 bg-green-100 text-green-800 p-2 rounded">
          Profile updated successfully!
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-3 bg-red-100 text-red-800 p-2 rounded">{error}</div>
      )}

      <div className="flex flex-col sm:flex-row gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center sm:items-start">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-32 h-32 rounded object-cover"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-gray-500">
              No Photo
            </div>
          )}

          <div className="mt-3 flex flex-col gap-2">
            <label
              htmlFor="avatarUpload"
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Upload New Photo
            </label>

            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={onFile}
              className="hidden"
            />

            {avatarPreview && (
              <button
                onClick={handleDeleteAvatar}
                className="text-red-600 text-sm hover:underline"
              >
                Delete Photo
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {validationErrors.name && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm">Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            {validationErrors.phone && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.phone}
              </p>
            )}
          </div>

          {/* Update Button */}
          <div className="sm:col-span-2">
            <button
              onClick={save}
              disabled={loading}
              className={`py-2 px-6 rounded text-white mt-2
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
