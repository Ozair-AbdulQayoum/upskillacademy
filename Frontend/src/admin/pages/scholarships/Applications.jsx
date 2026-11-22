import React, { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  X,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/scholarship/applications`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications.");
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `${API_BASE}/scholarship/applications/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status.");
      }

      setApplications((previous) =>
        previous.map((application) =>
          application._id === id
            ? { ...application, status: data.application.status }
            : application,
        ),
      );

      setSelectedApplication((previous) =>
        previous?._id === id
          ? { ...previous, status: data.application.status }
          : previous,
      );
    } catch (err) {
      setError(err.message || "Could not update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      application.name?.toLowerCase().includes(searchText) ||
      application.email?.toLowerCase().includes(searchText) ||
      application.phone?.toLowerCase().includes(searchText) ||
      application.program?.toLowerCase().includes(searchText);

    const matchesStatus = filter === "All" || application.status === filter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = applications.filter(
    (application) => application.status === "Pending",
  ).length;

  const reviewedCount = applications.filter(
    (application) => application.status === "Reviewed",
  ).length;

  const approvedCount = applications.filter(
    (application) => application.status === "Approved",
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Scholarship Applications
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View and manage scholarship applications.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-60"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* STATISTICS */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={applications.length}
          icon={<Users size={21} />}
          color="blue"
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={21} />}
          color="amber"
        />

        <StatCard
          title="Reviewed"
          value={reviewedCount}
          icon={<Eye size={21} />}
          color="indigo"
        />

        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<CheckCircle size={21} />}
          color="green"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* APPLICATIONS TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              All Applications
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredApplications.length} application(s) found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicants..."
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#009FF6] sm:w-64"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#009FF6]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-500">
            Loading applications...
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto mb-3 text-gray-300" />
            <h3 className="font-semibold text-gray-800">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Applications will appear here after someone submits the form.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Applicant</th>
                  <th className="px-5 py-4 font-semibold">Program</th>
                  <th className="px-5 py-4 font-semibold">Phone</th>
                  <th className="px-5 py-4 font-semibold">Submitted</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((application) => (
                  <tr key={application._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {application.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {application.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {application.program || "Not selected"}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {application.phone}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {formatDate(application.submittedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={application.status || "Pending"}
                        disabled={updatingId === application._id}
                        onChange={(e) =>
                          updateStatus(application._id, e.target.value)
                        }
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none disabled:opacity-50 ${
                          statusStyles[application.status] ||
                          statusStyles.Pending
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#009FF6] hover:text-[#009FF6]"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* APPLICATION DETAILS MODAL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white p-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Applicant Details
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Submitted {formatDate(selectedApplication.submittedAt)}
                </p>
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close details"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Detail label="Full Name" value={selectedApplication.name} />
                <Detail label="Email" value={selectedApplication.email} />
                <Detail label="Gender" value={selectedApplication.gender} />
                <Detail label="Phone" value={selectedApplication.phone} />
                <Detail label="WhatsApp" value={selectedApplication.whatsapp} />
                <Detail label="City" value={selectedApplication.city} />
                <Detail
                  label="Desired Program"
                  value={selectedApplication.program || "Not selected"}
                />
                <Detail
                  label="Previous Experience"
                  value={selectedApplication.experience}
                />
                <Detail
                  label="How They Heard About Us"
                  value={selectedApplication.source}
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <Detail
                  label="Why do you want this scholarship?"
                  value={selectedApplication.scholarshipReason}
                />

                <div className="mt-5">
                  <Detail
                    label="Career Goal"
                    value={selectedApplication.careerGoal}
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <label className="mb-2 block text-sm font-semibold text-gray-800">
                  Application Status
                </label>

                <select
                  value={selectedApplication.status || "Pending"}
                  disabled={updatingId === selectedApplication._id}
                  onChange={(e) =>
                    updateStatus(selectedApplication._id, e.target.value)
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold outline-none ${
                    statusStyles[selectedApplication.status] ||
                    statusStyles.Pending
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`rounded-xl p-3 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="break-words text-sm leading-6 text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}
