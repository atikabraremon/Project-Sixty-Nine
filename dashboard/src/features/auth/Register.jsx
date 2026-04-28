import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/apiService";
import InputField from "../../shared/inputField/InputField";
import SubmitButton from "../../shared/buttons/SubmitButton";

const Register = ({ setAlert }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onRegister = async (data) => {
    setAlert({ message: "", type: "" });
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);

      if (data.avatar && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }

      const response = await registerUser(formData);

      if (response) {
        setAlert({ message: "Account created successfully!", type: "success" });
        navigate("/login");
      }
    } catch (error) {
      console.error("Register Error:", error);
      const errMsg = error.response?.data?.message || "Registration failed!";
      setAlert({ message: errMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Join us today! It only takes a minute.
          </p>
        </div>

        {/* --- Circle Image Preview Section --- */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <label className="cursor-pointer block">
              <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md hover:opacity-80 transition">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {/* Hidden File Input */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                {...register("avatar")}
                onChange={(e) => {
                  register("avatar").onChange(e);
                  handleImageChange(e);
                }}
              />
            </label>
            {/* Small Plus Icon */}
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 border-2 border-white">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          <InputField
            label="Full Name"
            name="fullName"
            register={register}
            validation={{ required: "Full name is required" }}
            errors={errors}
          />

          <InputField
            label="Username"
            name="username"
            register={register}
            validation={{ required: "Username is required" }}
            errors={errors}
          />

          <InputField
            label="Email"
            type="email"
            name="email"
            register={register}
            validation={{ required: "Email is required" }}
            errors={errors}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            register={register}
            validation={{ required: "Password is required", minLength: 6 }}
            errors={errors}
          />

          <div className="pt-2">
            <SubmitButton loading={loading} text="Sign Up" variant="blue" />
          </div>
        </form>

        <div className="mt-6 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-bold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
