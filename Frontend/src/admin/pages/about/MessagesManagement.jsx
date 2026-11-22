import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Inbox,
  Search,
  RefreshCw,
  Mail,
  MailOpen,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Eye,
  MessageSquare,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/about/admin/messages";

const statusStyles = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Read: "bg-amber-50 text-amber-700 border-amber-200",
  Replied: "bg-green-50 text-green-700 border-green-200",
};

export default function MessagesManagement() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL);
      const data = response.data.data || response.data;

      setMessages(Array.isArray(data) ? data : data.messages || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load messages. Check the admin API endpoint.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesSearch = [message.fullName, message.email, message.message]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = filter === "All" || message.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, search, filter]);

  const counts = useMemo(
    () => ({
      total: messages.length,
      new: messages.filter((item) => item.status === "New").length,
      read: messages.filter((item) => item.status === "Read").length,
      replied: messages.filter((item) => item.status === "Replied").length,
    }),
    [messages],
  );

  const updateStatus = async (message, status) => {
    const id = message._id;

    if (!id) {
      setError("This message has no database ID.");
      return;
    }

    try {
      setUpdatingId(id);
      setError("");
      setNotice("");

      await axios.patch(`${API_URL}/${id}/status`, { status });

      setMessages((previous) =>
        previous.map((item) => (item._id === id ? { ...item, status } : item)),
      );

      setSelectedMessage((previous) =>
        previous?._id === id ? { ...previous, status } : previous,
      );

      setNotice(`Message marked as ${status}.`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update message status.",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (message) => {
    const confirmed = window.confirm(
      `Delete the message from ${message.fullName}? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setUpdatingId(message._id);
      setError("");
      setNotice("");

      await axios.delete(`${API_URL}/${message._id}`);

      setMessages((previous) =>
        previous.filter((item) => item._id !== message._id),
      );

      if (selectedMessage?._id === message._id) {
        setSelectedMessage(null);
      }

      setNotice("Message deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete message.");
    } finally {
      setUpdatingId(null);
    }
  };

  const openMessage = async (message) => {
    setSelectedMessage(message);

    if (message.status === "New") {
      await updateStatus(message, "Read");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleString();
  };

  const statusIcon = (status) => {
    if (status === "New") return <Mail size={15} />;
    if (status === "Read") return <MailOpen size={15} />;
    return <CheckCircle size={15} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
              <Inbox size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#101828]">
                Messages Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                View and manage visitor submissions.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchMessages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {notice && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
          {notice}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Messages", value: counts.total, icon: Inbox },
          { label: "New Messages", value: counts.new, icon: Mail },
          { label: "Read Messages", value: counts.read, icon: MailOpen },
          { label: "Replied", value: counts.replied, icon: CheckCircle },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-gray-500">{item.label}</p>
                <Icon size={19} className="text-[#009FF6]" />
              </div>
              <p className="text-2xl font-bold text-[#101828] mt-3">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or message..."
              className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#009FF6]"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:border-[#009FF6]"
          >
            <option value="All">All Messages</option>
            <option value="New">New</option>
            <option value="Read">Read</option>
            <option value="Replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-[#101828]">Visitor Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredMessages.length} message(s) found
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            <RefreshCw
              size={26}
              className="animate-spin mx-auto text-[#009FF6]"
            />
            <p className="mt-3">Loading messages...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-14 text-center text-gray-500">
            <MessageSquare size={34} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No messages found.</p>
            <p className="text-sm mt-1">
              New visitor submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">Visitor</th>
                  <th className="px-5 py-4">Message</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-800">
                        {item.fullName}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">{item.email}</p>
                    </td>

                    <td className="px-5 py-4 max-w-[260px]">
                      <p className="text-sm text-gray-600 truncate">
                        {item.message}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(item.submittedAt)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium ${
                          statusStyles[item.status] || statusStyles.New
                        }`}
                      >
                        {statusIcon(item.status)}
                        {item.status || "New"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openMessage(item)}
                          title="View message"
                          className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>

                        {item.status !== "Replied" && (
                          <button
                            type="button"
                            disabled={updatingId === item._id}
                            onClick={() => updateStatus(item, "Replied")}
                            title="Mark as replied"
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50"
                          >
                            <CheckCircle size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={updatingId === item._id}
                          onClick={() => deleteMessage(item)}
                          title="Delete message"
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-[#101828]">
                  Message Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">Visitor submission</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold">
                  Full Name
                </p>
                <p className="font-medium text-gray-800 mt-1">
                  {selectedMessage.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold">
                  Email Address
                </p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-[#009FF6] hover:underline mt-1 inline-block"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold">
                  Submitted
                </p>
                <p className="text-gray-700 mt-1">
                  {formatDate(selectedMessage.submittedAt)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold mb-2">
                  Message
                </p>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-gray-700 leading-7 whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-400 font-semibold mb-2">
                  Status
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[selectedMessage.status] || statusStyles.New
                  }`}
                >
                  {selectedMessage.status || "New"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 p-5 border-t border-gray-100">
              {selectedMessage.status !== "Replied" && (
                <button
                  type="button"
                  disabled={updatingId === selectedMessage._id}
                  onClick={() => updateStatus(selectedMessage, "Replied")}
                  className="px-4 py-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Mark as Replied
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
