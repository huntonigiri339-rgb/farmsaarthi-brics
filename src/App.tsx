import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CropHealth from "./pages/CropHealth";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import ContextPassport from "./pages/ContextPassport";
import FieldMemory from "./pages/FieldMemory";
import About from "./pages/About";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/crop-health"
            element={
              <ProtectedRoute>
                <Layout><CropHealth /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <Layout><Weather /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <Layout><MarketPrices /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/passport"
            element={
              <ProtectedRoute>
                <Layout><ContextPassport /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/field-memory"
            element={
              <ProtectedRoute>
                <Layout><FieldMemory /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout><About /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
