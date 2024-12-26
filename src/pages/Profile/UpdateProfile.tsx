import React, { useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";

const UpdateProfile: React.FC = () => {
  const { token, combinedUser, getUserInfo } = useGlobalContext();
  const api = useAxiosPrivate();
  const [formData, setFormData] = useState({
    user_name: combinedUser?.user_name || "",
    first_name: combinedUser?.first_name || "",
    last_name: combinedUser?.last_name || "",
    email_addresses: combinedUser?.email_addresses || "",
    profileImage: combinedUser?.profile_picture, // || null as File | null,
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
    form.append("user_name", formData.user_name);
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("email_addresses", formData.email_addresses);
    if (formData.profileImage) {
      form.append("profileImage", formData.profileImage);
    }

    try {
      const response = await api.put(`/combined-user/${token.user_id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 200) {
        getUserInfo(token?.user_id);
        // setCombinedUser((prev) => {
        //   if (!prev) return undefined;
        //   return {
        //     ...prev,
        //     user_name: formData.user_name,
        //     first_name: formData.first_name,
        //     last_name: formData.last_name,
        //     email_addresses: formData.email_addresses,
        //     profile_picture: formData.profileImage,
        //   };
        // });

        setIsLoading(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
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
      <div className="flex flex-col gap-2 w-64">
        <input
          type="text"
          name="user_name"
          placeholder="User Name"
          value={formData.user_name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          className="border p-2"
        />
        <input
          type="text"
          name="email_addresses"
          placeholder="Email"
          value={formData.email_addresses}
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
      </div>
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
