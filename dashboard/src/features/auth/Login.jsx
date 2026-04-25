import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/apiService";
import Cookies from "js-cookie";
import InputField from "../../shared/inputField/InputField";
import SubmitButton from "../../shared/buttons/SubmitButton";
import FormError from "../../shared/components/FormError";

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onLogin = async (data) => {
    setServerError(null);
    setLoading(true);

    try {
      // Identifier check kora (Email naki Username)
      const loginData = {
        password: data.password,
      };

      // Input field theke 'identifier' name-e data ashbe
      if (data.identifier.includes("@")) {
        loginData.email = data.identifier;
      } else {
        loginData.username = data.identifier;
      }

      console.log("Sending to Backend:", loginData);

      const response = await loginUser(loginData);

      // Cookies handling
      if (response.data?.accessToken) {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
          secure: true,
          sameSite: "strict",
        });
      }

      if (response.data?.refreshToken) {
        Cookies.set("refreshToken", response.data.refreshToken, { expires: 7 });
      }

      localStorage.setItem("isLoggedIn", "true");
      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      console.log("Login Error:", error);
      // Backend error message handle kora
      const errMsg =
        error.response?.data?.message || error.message || "Login failed!";
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        {/* Server Error - Reusable Component */}
        <FormError message={serverError} onClose={() => setServerError(null)} />

        <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
          {/* Email Field */}
          <InputField
            label="Username or Email"
            type="text"
            name="identifier"
            placeholder="Enter your username"
            register={register}
            validation={{ required: "This field is required" }}
            errors={errors}
          />

          {/* Password Field */}
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

          <SubmitButton loading={loading} text="Login" variant="green" />
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
