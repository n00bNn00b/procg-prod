import React, { useState } from "react";
import { useGlobalContext } from "@/Context/GlobalContext/GlobalContext";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";

const UpdateProfile: React.FC = () => {
  const api = useAxiosPrivate();
  const { token, combinedUser, getUserInfo } = useGlobalContext();

  const [formData, setFormData] = useState({
    user_name: combinedUser?.user_name || "",
    first_name: combinedUser?.first_name || "",
    last_name: combinedUser?.last_name || "",
    email_addresses: Array.isArray(combinedUser?.email_addresses)
      ? combinedUser.email_addresses.join(", ")
      : "",
    profileImage: `${
      import.meta.env.VITE_API_URL + "/" + combinedUser?.profile_picture
    }`,
  });

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define Zod schema for validation
  const profileSchema = z.object({
    user_name: z.string().nonempty("User Name is required."),
    first_name: z.string().nonempty("First Name is required."),
    last_name: z.string().nonempty("Last Name is required."),
    profileImage: z.string().optional(),
    email_addresses: z
      .string()
      .transform((val) =>
        val.includes(",")
          ? val.split(",").map((email) => email.trim())
          : [val.trim()]
      )
      .refine(
        (emails) =>
          emails.every((email) => z.string().email().safeParse(email).success),
        {
          message: "One or more emails are invalid.",
        }
      ),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profileImage" && files?.[0]) {
      setFile(files[0]);
      setFormData((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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

    try {
      // Validate the form data using Zod
      const validatedData = profileSchema.parse({
        ...formData,
        email_addresses: formData.email_addresses.trim(),
      });

      // Prepare FormData for submission
      const form = new FormData();
      form.append("user_name", validatedData.user_name);
      form.append("first_name", validatedData.first_name);
      form.append("last_name", validatedData.last_name);
      validatedData.email_addresses.forEach((email) =>
        form.append("email_addresses[]", email)
      );
      if (file) {
        form.append("profileImage", file);
      }
      // Submit API request
      const response = await api.put(`/combined-user/${token.user_id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        getUserInfo(token?.user_id);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors.map((error) => error.message).join(", "));
      } else if (err instanceof AxiosError) {
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
      <div className="flex flex-col items-center gap-6">
        {/* Profile Image */}
        <div className="relative w-32 h-32">
          <img
            src={formData.profileImage}
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
              name="profileImage"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            name="user_name"
            placeholder="User Name"
            value={formData.user_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            type="text"
            name="email_addresses"
            placeholder="Email - example@email.com, example2@email.com"
            value={formData.email_addresses}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </form>
  );
};

export default UpdateProfile;
