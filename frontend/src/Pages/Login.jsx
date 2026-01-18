// src/Pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginInstitute, loginManager } from "../Services/userApi";
import { Eye, EyeOff, Mail, Lock, UserCircle, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("admin"); // "admin" or "user"

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (role === "admin") {
        // Institute login
        res = await loginInstitute({ email, password });
      } else {
        // Manager login
        res = await loginManager({ email, password });
      }

      // Store data in localStorage
      if (res.data.institute_id) {
        localStorage.setItem("instituteId", res.data.institute_id);
      }
      if (res.data.manager_id) {
        localStorage.setItem("managerId", res.data.manager_id);
      }

      localStorage.setItem("coachingName", res.data.name || res.data.coachingName || "User");
      localStorage.setItem("instituteName", res.data.name || "Institute");
      localStorage.setItem("userEmail", res.data.email);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", role);

      // Navigate based on role
      if (role === "user") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Login failed. Check your email, password, and selected role.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center p-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute -top-40 right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              ✓
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Attendify</h1>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-6">Select your role and login to continue.</p>

          <form onSubmit={handleLogin} className="space-y-6">

            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4 p-1 bg-gray-50 rounded-xl border border-gray-200">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "admin"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "user"
                  ? "bg-white text-blue-600 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                <UserCircle className="w-4 h-4" />
                User
              </button>
            </div>

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Remember Me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Logging in..." : `Login as ${role === "admin" ? "Admin" : "User"}`}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            Need Help?{" "}
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
