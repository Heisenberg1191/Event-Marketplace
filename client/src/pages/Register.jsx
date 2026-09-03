import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters and include a letter, a number, and a special character"
      );
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Create your account
        </h1>

        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-xs text-slate-500 mt-1">
              At least 8 characters, with a letter, a number, and a special
              character.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              I am a...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="CUSTOMER">Customer — planning an event</option>
              <option value="VENDOR">Vendor — offering services</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-medium rounded-lg py-2.5 hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 font-medium underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;