import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEvents } from "../services/eventService";

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getMyEvents();
        setEvents(data.events);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-900">My Events</h1>
          <Link
            to="/events/new"
            className="bg-slate-900 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-slate-800 transition"
          >
            + Create Event
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-slate-500">
            You haven't created any events yet.
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {event.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {event.eventType} · {event.location} ·{" "}
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-slate-900 font-medium">
                    ₹{Number(event.budget).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyEvents;