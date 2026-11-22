import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const API_URL = "http://localhost:5000/api/about";

const emptyQuestion = {
  question: "",
  answer: "",
};

export default function FAQManagement() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [questions, setQuestions] = useState([]);
  const [questionForm, setQuestionForm] = useState(emptyQuestion);
  const [editingIndex, setEditingIndex] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchFAQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/faq`);
      const data = response.data.data || response.data;

      setFormData({
        title: data.title || "",
        description: data.description || "",
      });

      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load FAQ content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const handleMainChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionChange = (e) => {
    setQuestionForm({
      ...questionForm,
      [e.target.name]: e.target.value,
    });
  };

  const saveMainContent = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await axios.put(`${API_URL}/faq`, formData);

      setMessage("FAQ heading and description saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save FAQ content.");
    } finally {
      setSaving(false);
    }
  };

  const resetQuestionForm = () => {
    setQuestionForm(emptyQuestion);
    setEditingIndex(null);
  };

  const saveQuestion = async (e) => {
    e.preventDefault();

    if (!questionForm.question.trim() || !questionForm.answer.trim()) {
      setError("Please enter both the question and answer.");
      return;
    }

    try {
      setQuestionSaving(true);
      setError("");
      setMessage("");

      if (editingIndex !== null) {
        await axios.patch(
          `${API_URL}/content/faq/questions/${editingIndex}`,
          questionForm,
        );

        setMessage("Question updated successfully.");
      } else {
        await axios.post(`${API_URL}/content/faq/questions`, questionForm);

        setMessage("Question added successfully.");
      }

      resetQuestionForm();
      await fetchFAQ();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save question.");
    } finally {
      setQuestionSaving(false);
    }
  };

  const editQuestion = (index) => {
    setQuestionForm({
      question: questions[index].question || "",
      answer: questions[index].answer || "",
    });

    setEditingIndex(index);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteQuestion = async (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this question?",
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await axios.delete(`${API_URL}/content/faq/questions/${index}`);

      setMessage("Question deleted successfully.");
      await fetchFAQ();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <RefreshCw className="animate-spin mx-auto text-[#009FF6]" size={28} />
        <p className="text-gray-500 mt-3">Loading FAQ content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6FF] text-[#009FF6] flex items-center justify-center">
              <HelpCircle size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#101828]">
                FAQ Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create, edit and manage frequently asked questions.
              </p>
            </div>
          </div>

          <button
            onClick={fetchFAQ}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
          {message}
        </div>
      )}

      {/* FAQ Heading */}
      <form
        onSubmit={saveMainContent}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div>
          <h2 className="text-lg font-bold text-[#101828]">
            FAQ Section Content
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage the heading and description displayed on your website.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleMainChange}
            placeholder="Frequently Asked Questions"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleMainChange}
            rows="4"
            placeholder="Enter FAQ section description..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#009FF6] hover:bg-[#0087D1] disabled:opacity-60 text-white px-5 py-3 rounded-xl font-medium"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Section Content"}
        </button>
      </form>

      {/* Question Form */}
      <form
        onSubmit={saveQuestion}
        className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5"
      >
        <div className="flex justify-between items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">
              {editingIndex !== null ? "Edit Question" : "Add New Question"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Add or update a question and its answer.
            </p>
          </div>

          {editingIndex !== null && (
            <button
              type="button"
              onClick={resetQuestionForm}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
            >
              <X size={17} />
              Cancel
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question
          </label>
          <input
            type="text"
            name="question"
            value={questionForm.question}
            onChange={handleQuestionChange}
            placeholder="Enter your question..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer
          </label>
          <textarea
            name="answer"
            value={questionForm.answer}
            onChange={handleQuestionChange}
            rows="4"
            placeholder="Enter the answer..."
            className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-[#009FF6] resize-y"
          />
        </div>

        <button
          type="submit"
          disabled={questionSaving}
          className="flex items-center gap-2 bg-[#009FF6] hover:bg-[#0087D1] disabled:opacity-60 text-white px-5 py-3 rounded-xl font-medium"
        >
          {editingIndex !== null ? <Save size={18} /> : <Plus size={18} />}
          {questionSaving
            ? "Saving..."
            : editingIndex !== null
              ? "Update Question"
              : "Add Question"}
        </button>
      </form>

      {/* Questions List */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex justify-between items-center gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#101828]">All Questions</h2>
            <p className="text-sm text-gray-500 mt-1">
              {questions.length} question(s) available
            </p>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <HelpCircle size={32} className="mx-auto mb-3 text-gray-300" />
            <p>No questions added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((item, index) => (
              <div
                key={item._id || index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 p-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                    className="flex-1 flex items-center gap-3 text-left min-w-0"
                  >
                    <span className="text-sm font-semibold text-[#009FF6]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="font-medium text-gray-800">
                      {item.question}
                    </span>

                    {expandedIndex === index ? (
                      <ChevronUp
                        size={18}
                        className="ml-auto shrink-0 text-gray-400"
                      />
                    ) : (
                      <ChevronDown
                        size={18}
                        className="ml-auto shrink-0 text-gray-400"
                      />
                    )}
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => editQuestion(index)}
                      title="Edit question"
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteQuestion(index)}
                      title="Delete question"
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {expandedIndex === index && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                    <p className="text-sm text-gray-600 leading-7">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
