import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/apiService";
import InputField from "../../shared/inputField/InputField";
import SubmitButton from "../../shared/buttons/SubmitButton";
import FormError from "../../shared/components/FormError";

const Register = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegister = async (data) => {
    setServerError(null);
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

      const result = await registerUser(formData);
      console.log(result);

      // Jodi toast thake tobe toast use kora bhalo, na hole alert
      alert("Registration Successful!");
      navigate("/login");
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed!";
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 'py-12' added for better spacing on mobile and small laptops
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-12 overflow-y-auto">
      {/* Container width changed to 'max-w-md' for better readability */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Secure access for authorized administrators only.
        </p>

        {/* Server Error Box */}
        <FormError message={serverError} onClose={() => setServerError(null)} />

        <form onSubmit={handleSubmit(onRegister)} className="space-y-4 mt-2">
          {/* Full Name - Type changed to text */}
          <InputField
            label="Full Name"
            type="text"
            name="fullName"
            placeholder="John Doe"
            register={register}
            validation={{ required: "Full name is required" }}
            errors={errors}
          />

          {/* Username - Type changed to text */}
          <InputField
            label="Username"
            type="text"
            name="username"
            placeholder="johndoe123"
            register={register}
            validation={{ required: "Username is required" }}
            errors={errors}
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="example@mail.com"
            register={register}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            }}
            errors={errors}
          />

          {/* Avatar - Improved styling */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Profile Picture{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <p className="text-xs text-gray-500">Click to upload image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("avatar")}
                />
              </label>
            </div>
          </div>

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="******"
            register={register}
            validation={{
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 chars" },
            }}
            errors={errors}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <SubmitButton loading={loading} text="Sign Up" variant="blue" />
          </div>
        </form>

        <div className="mt-8 text-center border-t pt-4">
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
