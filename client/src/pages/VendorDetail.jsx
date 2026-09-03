import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getVendorById } from "../services/vendorService";

function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const data = await getVendorById(id);
        setVendor(data.vendor);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load this vendor"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/vendors" className="text-slate-900 underline">
            Back to vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/vendors"
          className="text-sm text-slate-600 underline mb-4 inline-block"
        >
          ← Back to vendors
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
            No cover image yet
          </div>

          <div className="p-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {vendor.businessName}
            </h1>
            <p className="text-slate-500 mt-1">{vendor.location}</p>

            {vendor.description && (
              <p className="text-slate-700 mt-4">{vendor.description}</p>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Services
              </h2>
              {vendor.services.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  This vendor hasn't added any services yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {vendor.services.map((service) => (
                    <div
                      key={service.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <h3 className="font-medium text-slate-900">
                        {service.title}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {service.description}
                        </p>
                      )}
                      {service.packages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {service.packages.map((pkg) => (
                            <span
                              key={pkg.id}
                              className="text-xs bg-slate-100 text-slate-700 rounded-full px-3 py-1"
                            >
                              {pkg.name} — ₹{pkg.price}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorDetail;