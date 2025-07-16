import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../context/authStore";
import { toast } from "react-toastify";
import { Save } from "lucide-react";

const ProfilePage = () => {
  const { user, updateUser, loadUserFromStorage, isLoading } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setLocation((user as any).location || ""); // cast to any if `location` is missing in `User` type
    }
  }, [user]);

  const handleSave = () => {
    if (!name || !phone) {
      toast.warning("Name and phone are required.");
      return;
    }

    const updated = { ...user, name, phone, location };
    localStorage.setItem("user", JSON.stringify(updated));
    updateUser?.(updated); // make sure updateUser exists
    toast.success("✅ Profile updated!");
  };

  if (isLoading || !user) {
    return <div className="p-6 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold">My Profile</h2>

      <div className="bg-white p-6 rounded-lg shadow border space-y-4">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium">{name}</p>
            <p className="text-sm text-gray-500">{phone}</p>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className="mt-1 block w-full border px-4 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Phone</label>
            <input
              type="text"
              className="mt-1 block w-full border px-4 py-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <input
              type="text"
              className="mt-1 block w-full border px-4 py-2 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
