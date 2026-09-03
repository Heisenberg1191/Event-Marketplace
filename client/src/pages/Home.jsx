import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="text-center">
        {user ? (
  <>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">
      Welcome, {user.name} 👋
    </h1>
    <p className="text-slate-600 mb-6">
      You're logged in as a {user.role.toLowerCase()}.
    </p>
    <div className="flex gap-3 justify-center flex-wrap">
  <Link
    to="/vendors"
    className="bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-5 py-2.5 hover:bg-slate-50 transition"
  >
    Browse Vendors
  </Link>
  {user.role === "CUSTOMER" && (
    <Link
      to="/events"
      className="bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-5 py-2.5 hover:bg-slate-50 transition"
    >
      My Events
    </Link>
  )}
  <button
    onClick={logout}
    className="bg-slate-900 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-slate-800 transition"
  >
    Log out
  </button>
</div>
  </>
) : (
          <>
  <h1 className="text-2xl font-bold text-slate-900 mb-6">
    Event Marketplace
  </h1>
  <div className="flex gap-3 justify-center flex-wrap">
    <Link
      to="/vendors"
      className="bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-5 py-2.5 hover:bg-slate-50 transition"
    >
      Browse Vendors
    </Link>
    <Link
      to="/login"
      className="bg-white border border-slate-300 text-slate-900 font-medium rounded-lg px-5 py-2.5 hover:bg-slate-50 transition"
    >
      Log in
    </Link>
    <Link
      to="/register"
      className="bg-slate-900 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-slate-800 transition"
    >
      Sign up
    </Link>
  </div>
</>
        )}
      </div>
    </div>
  );
}

export default Home;
