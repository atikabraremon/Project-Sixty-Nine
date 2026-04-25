import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
      <p className="mt-2">Ekhane apnar file upload logic thakbe.</p>

      <button
        onClick={handleLogout}
        className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
