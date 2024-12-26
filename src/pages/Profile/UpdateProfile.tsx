import React, { useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";

const UpdateProfile: React.FC = () => {
  const { token } = useGlobalContext();
  const api = useAxiosPrivate();
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    job_title: "",
    profileImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    }
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!token) {
      setError("You must be logged in to update your profile.");
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("first_name", formData.first_name);
    form.append("middle_name", formData.middle_name);
    form.append("last_name", formData.last_name);
    form.append("job_title", formData.job_title);
    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    try {
      const response = await api.put(`/persons/${token.user_id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Profile updated:", response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to update profile.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="text"
        name="first_name"
        placeholder="first_name"
        value={formData.first_name}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="text"
        name="middle_name"
        placeholder="last name"
        value={formData.middle_name}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="text"
        name="last_name"
        placeholder="last_name"
        value={formData.last_name}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="text"
        name="job_title"
        placeholder="job_title"
        value={formData.job_title}
        onChange={handleChange}
        className="border p-2"
      />
      <input
        type="file"
        name="profileImage"
        accept="image/*"
        onChange={handleChange}
        className="border p-2"
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Profile Preview"
          className="w-32 h-32 rounded-full"
        />
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default UpdateProfile;
