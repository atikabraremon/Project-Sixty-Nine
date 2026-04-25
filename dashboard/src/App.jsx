import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./shared/navbar/Navbar";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Home from "./features/presentation/home/Home";

const isAuthenticated = () => localStorage.getItem("isLoggedIn") === "true";

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute>
                <Register />
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
            element={
              <Navigate to={isAuthenticated() ? "/" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
