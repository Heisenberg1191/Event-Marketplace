import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getVendors } from "../services/vendorService";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const fetchVendors = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getVendors(params);
      setVendors(data.vendors);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors({
      ...(search && { search }),
      ...(location && { location }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          Browse Vendors
        </h1>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            placeholder="Search by business name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white font-medium rounded-lg px-6 py-2 hover:bg-slate-800 transition"
          >
            Search
          </button>
        </form>

        {loading ? (
          <p className="text-slate-500">Loading vendors...</p>
        ) : vendors.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-500">
            No vendors found. Try a different search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vendors.map((vendor) => (
              <Link
                key={vendor.id}
                to={`/vendors/${vendor.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="h-36 bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
                  No image yet
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">
                    {vendor.businessName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {vendor.location}
                  </p>
                  {vendor.description && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {vendor.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Vendors;