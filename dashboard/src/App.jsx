import { useState, useEffect } from "react"; // useState add kora hoyeche
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/presentation/home/Home";
import FormAlert from "./shared/components/FormAlert";
const isAuthenticated = () => localStorage.getItem("isLoggedIn") === "true";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem("isLoggedIn") === "true";
    } catch {
      return false; // SSR safety
    }
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

  // শুধু alert এর জন্য useEffect
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  return (
    <Router>
      {/* গ্লোবাল অ্যালার্ট */}
      {alert.message && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4 pointer-events-none">
          <div className="pointer-events-auto">
            <FormAlert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert({ message: "", type: "" })}
            />
          </div>
        </div>
      )}

      <main>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login setAlert={setAlert} setIsLoggedIn={setIsLoggedIn} />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register setAlert={setAlert} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
