import React, { useState } from "react";
import axios from "axios";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";

const ProfileImageUpdate: React.FC = () => {
  const { combinedUser } = useGlobalContext();
  const [profileImage, setProfileImage] = useState<string>(
    `${import.meta.env.VITE_API_URL + "/" + combinedUser?.profile_picture}`
  );
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    user_name: combinedUser?.user_name || "",
    first_name: combinedUser?.first_name || "",
    last_name: combinedUser?.last_name || "",
    email_addresses: combinedUser?.email_addresses || "",
    profileImage: combinedUser?.profile_picture, // || null as File | null,
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setProfileImage(URL.createObjectURL(file)); // Update profile image preview
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first!");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("profileImage", selectedImage);
    submissionData.append("user_name", formData.user_name);
    submissionData.append("first_name", formData.first_name);
    submissionData.append("last_name", formData.last_name);
    submissionData.append("email_addresses", formData.email_addresses);

    try {
      // Replace 'your-api-endpoint' with the actual API endpoint
      const response = await axios.post("your-api-endpoint", submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        alert("Profile updated successfully!");
        setSelectedImage(null);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Profile Image */}
      <div className="relative w-32 h-32">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border-2 border-gray-300"
        />
        {/* Edit Icon */}
        <label
          htmlFor="imageUpload"
          className="absolute bottom-2 right-2 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 3.487l3.651 3.651M4.5 20.25h3.75L19.62 8.88a1.125 1.125 0 000-1.591l-3.75-3.75a1.125 1.125 0 00-1.591 0L4.5 16.5v3.75z"
            />
          </svg>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Input Fields */}
      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="user_name"
          value={formData.user_name}
          onChange={handleInputChange}
          placeholder="User Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          placeholder="First Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          placeholder="Last Name"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
        <input
          type="email"
          name="email_addresses"
          value={formData.email_addresses}
          onChange={handleInputChange}
          placeholder="Email Address"
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
};

export default ProfileImageUpdate;
