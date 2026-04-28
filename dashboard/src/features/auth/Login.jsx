import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/apiService";
import Cookies from "js-cookie";
import InputField from "../../shared/inputField/InputField";
import SubmitButton from "../../shared/buttons/SubmitButton";

const Login = ({ setAlert, setIsLoggedIn }) => {
  // setIsLoggedIn নিশ্চিত করুন আছে
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onLogin = async (data) => {
    setAlert({ message: "", type: "" }); // নতুন সাবমিটে আগের অ্যালার্ট ক্লিন
    setLoading(true);

    try {
      const loginData = { password: data.password };

      if (data.identifier.includes("@")) {
        loginData.email = data.identifier;
      } else {
        loginData.username = data.identifier;
      }

      const response = await loginUser(loginData);

      if (response?.data) {
        // ১. টোকেন সেভ করা
        if (response.data.accessToken) {
          Cookies.set("accessToken", response.data.accessToken, {
            expires: 1,
            secure: true,
            sameSite: "strict",
          });
        }
        if (response.data.refreshToken) {
          Cookies.set("refreshToken", response.data.refreshToken, {
            expires: 7,
          });
        }

        // ২. স্টেট এবং লোকাল স্টোরেজ আপডেট
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);

        setAlert({
          message: "Login Successful! Welcome back.",
          type: "success",
        });

        // ৩. সাকসেস হলে ১.৫ সেকেন্ড পর হোমপেজে পাঠানো
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);

        reset();
      }
    } catch (error) {
      // --- এই অংশটিই আপনার এরর হ্যান্ডেল করবে ---
      console.error("Login Error:", error);

      // ব্যাকএন্ড থেকে আসা মেসেজ ধরবে (যেমন: "Your account is not verified.")
      const errMsg =
        error.response?.data?.message ||
        "Wrong Username or Password. Please try again!";

      setAlert({
        message: errMsg,
        type: "error",
      });

      // এখানে কোনো navigate নেই, তাই ইউজার এরর মেসেজটি দেখতে পারবে।
    } finally {
      // সাকসেস হোক বা এরর, লোডিং এনিমেশন বন্ধ হবে
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 py-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-extrabold mb-2 text-center text-gray-800">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Please enter your credentials to access your account.
        </p>

        {/* এখানে type="button" যোগ করুন যদি SubmitButton এ থাকে */}
        <form
          onSubmit={handleSubmit(onLogin)}
          className="space-y-4"
          noValidate // নতুন যোগ - browser validation বন্ধ
        >
          <InputField
            label="Username or Email"
            type="text"
            name="identifier"
            placeholder="Enter your username or email"
            autoComplete="username" // camelCase করুন
            register={register}
            validation={{ required: "This field is required" }}
            errors={errors}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="******"
            register={register}
            validation={{ required: "Password is required" }}
            errors={errors}
          />

          <div className="pt-2">
            <SubmitButton
              loading={loading}
              text="Login"
              variant="green"
              type="submit" // নিশ্চিত করুন এটি আছে
              disabled={loading}
            />
          </div>
        </form>

        <div className="mt-8 text-center border-t pt-4">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-bold"
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
