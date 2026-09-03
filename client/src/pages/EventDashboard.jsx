import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getEventById, deleteEvent } from "../services/eventService";

function EventDashboard() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data.event);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      navigate("/events");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

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
          <Link to="/events" className="text-slate-900 underline">
            Back to my events
          </Link>
        </div>
      </div>
    );
  }

  // Budget calculations
  const totalBudget = Number(event.budget);
  const bookedServices = event.eventServices.filter(
    (es) => es.booking && es.booking.status !== "REJECTED" && es.booking.status !== "CANCELLED"
  );
  const amountBooked = bookedServices.reduce(
    (sum, es) => sum + Number(es.servicePackage.price),
    0
  );
  const remainingBudget = totalBudget - amountBooked;
  const percentUsed = totalBudget > 0 ? Math.min((amountBooked / totalBudget) * 100, 100) : 0;

  const pendingBookings = event.eventServices.filter(
    (es) => es.booking && es.booking.status === "PENDING"
  );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <Link to="/events" className="text-sm text-slate-600 underline mb-4 inline-block">
          ← Back to my events
        </Link>

        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{event.name}</h1>
              <p className="text-slate-500 mt-1">
                {event.eventType} · {event.location} ·{" "}
                {new Date(event.eventDate).toLocaleDateString()}
                {event.guestCount && ` · ${event.guestCount} guests`}
              </p>
              {event.description && (
                <p className="text-slate-700 mt-3">{event.description}</p>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="text-red-600 text-sm font-medium hover:underline"
            >
              Delete event
            </button>
          </div>
        </div>

        {/* Budget card */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Budget</h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-500">Total budget</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{totalBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Booked</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{amountBooked.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Remaining</p>
              <p
                className={`text-xl font-bold ${
                  remainingBudget < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                ₹{remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${
                percentUsed >= 100 ? "bg-red-500" : "bg-slate-900"
              }`}
              style={{ width: `${percentUsed}%` }}
            />
          </div>
        </div>

        {/* Pending bookings */}
        {pendingBookings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <p className="text-amber-800 font-medium text-sm">
              {pendingBookings.length} booking request
              {pendingBookings.length > 1 ? "s" : ""} awaiting vendor response
            </p>
          </div>
        )}

        {/* Booked services */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Vendors & Services
            </h2>
            <Link
              to="/vendors"
              className="text-sm bg-slate-900 text-white font-medium rounded-lg px-4 py-2 hover:bg-slate-800 transition"
            >
              + Browse Vendors
            </Link>
          </div>

          {event.eventServices.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No vendors added yet. Browse vendors to start booking services
              for this event.
            </p>
          ) : (
            <div className="space-y-3">
              {event.eventServices.map((es) => (
                <div
                  key={es.id}
                  className="flex items-center justify-between border border-slate-200 rounded-lg p-4"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {es.servicePackage.vendorService.vendor.businessName}
                    </p>
                    <p className="text-sm text-slate-500">
                      {es.servicePackage.vendorService.title} —{" "}
                      {es.servicePackage.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">
                      ₹{Number(es.servicePackage.price).toLocaleString()}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        es.booking?.status === "CONFIRMED" ||
                        es.booking?.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : es.booking?.status === "REJECTED" ||
                            es.booking?.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {es.booking?.status || "PENDING"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDashboard;