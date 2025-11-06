import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import toast, { Toaster } from "react-hot-toast";
import { Mic, Loader2, Trash2 } from "lucide-react";
import { medicalKeywords } from "./medicalKeywords";

export default function TrustedCareAI() {
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

  const token = localStorage.getItem("token");
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("trustedcare_chats");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  //  Initialize credits 
  useEffect(() => {
    const storedCredits = localStorage.getItem("trustedcare_credits");
    const storedTime = localStorage.getItem("trustedcare_last_reset");
    const now = Date.now();
    const hoursPassed = storedTime ? (now - storedTime) / (1000 * 60 * 60) : 25;
    const isLoggedIn = !!token;
    const defaultCredits = isLoggedIn ? 15 : 15;

    if (!storedCredits || hoursPassed > 24) {
      // Reset credits after 24h or first time
      setCredits(defaultCredits);
      localStorage.setItem("trustedcare_credits", defaultCredits);
      localStorage.setItem("trustedcare_last_reset", now);

      if (!isLoggedIn) {
        toast("You have 15 free credits. Log in for more.");
      }
    } else {
      // Keep existing credits if within 24h
      setCredits(parseInt(storedCredits));
    }
  }, [token]);

  //  Persist chats and credits
  useEffect(() => {
    localStorage.setItem("trustedcare_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("trustedcare_credits", credits);
  }, [credits]);

  //  Scroll chat area
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats, loading]);

  //  Detect login/logout changes
  useEffect(() => {
    const isLoggedIn = !!token;
    const storedCredits = parseInt(
      localStorage.getItem("trustedcare_credits") || "0"
    );
    const storedTime = localStorage.getItem("trustedcare_last_reset");
    const now = Date.now();
    const hoursPassed = storedTime ? (now - storedTime) / (1000 * 60 * 60) : 25;

    // Prevent reset if within 24h
    if (isLoggedIn) {
      if (storedCredits < 15 && hoursPassed > 24) {
        setCredits(15);
        localStorage.setItem("trustedcare_credits", 15);
        localStorage.setItem("trustedcare_last_reset", now);
        toast.success("Logged in. Credits reset to 15.");
      }
    } else {
      if (storedCredits > 15 && hoursPassed > 24) {
        setCredits(2);
        localStorage.setItem("trustedcare_credits", 15);
        localStorage.setItem("trustedcare_last_reset", now);
        toast("Guest credits set to 15.", { icon: "ℹ️" });
      }
    }
  }, [token]);

  // //  Notify user when out of credits and not logged in
  // useEffect(() => {
  //   if (credits <= 0 && !token) {
  //     toast.error("Login to continue using TrustedCare AI");
  //   }
  // }, [credits, token]);

  //  Voice Input
  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition not supported in this browser.");
      return;
    }

    if (voiceActive) {
      recognitionRef.current?.stop();
      setVoiceActive(false);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setVoiceActive(true);
    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setVoiceActive(false);
    };
    recognition.onerror = () => {
      toast.error("Voice recognition error.");
      setVoiceActive(false);
    };
    recognition.onend = () => setVoiceActive(false);
    recognition.start();
    recognitionRef.current = recognition;
  };

  //  Gemini Response
  const getAIResponse = async (question) => {
    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are TrustedCare AI, a professional and reliable medical assistant.
Your purpose is to answer only health and medicine-related questions — including symptoms,
diseases, diagnosis, treatment, prescriptions, medications, side effects,
mental health, nutrition, and preventive care.
If a user sends a message with minor spelling or grammar mistakes,
intelligently interpret and correct the meaning before answering.
If the user sends greetings like “hi”, “hello”, or “bye”, respond politely with a short 5-word greeting.
If user asks for medicines for diseases (like fever, headache, or gas), suggest safe and common medicines.
If outside that scope, reply: "I’m sorry, I can only answer medical-related questions."
Use these medical keywords: ${Object.values(medicalKeywords).flat().join(", ")}.
Always answer clearly and factually.
Question: ${question}`,
                },
              ],
            },
          ],
        }),
      });
      const data = await res.json();
      return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn’t process that."
      );
    } catch (err) {
      console.error(err);
      return "Error connecting to server.";
    }
  };

  //  Send Message
  const handleSend = async () => {
    if (!input.trim()) return;

    if (credits <= 0) {
      if (!token) toast.error("Login to continue.", { id: "login-required" });
      else setShowDialog(true);
      return;
    }

    const userMsg = { role: "user", text: input };
    setChats((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setCredits((prev) => prev - 1);

    const aiText = await getAIResponse(input);
    const aiMsg = { role: "ai", text: aiText };

    setChats((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  // Press Enter to send
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  //  Clear Chat
  const clearChat = () => {
    setChats([]);
    localStorage.removeItem("trustedcare_chats");
    toast.success("Chat cleared!");
  };

  //  Razorpay Payment
  const handlePayment = () => {
    const options = {
      key: RAZORPAY_KEY,
      amount: 199 * 100,
      currency: "INR",
      name: "TrustedCare AI",
      description: "50 Chat Credits",
      handler: function () {
        toast.success("Payment successful! +50 credits added.");
        const newCredits = credits + 50;
        setCredits(newCredits);
        localStorage.setItem("trustedcare_credits", newCredits);
        setShowDialog(false);
      },
      theme: { color: "#2563eb" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-center" />

      {/* Navbar */}
      <nav className="bg-white border-b py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center px-4">
          <div>
            <span className="text-xl font-bold text-blue-600">
              TrustedCare AI
            </span>
            <p className="text-sm text-gray-500">
              Your personal medical assistant
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span
              className={
                credits === 0 ? "text-red-500 font-semibold" : "text-gray-700"
              }
            >
              Credits: <strong>{credits}</strong>
            </span>
            <button
              onClick={clearChat}
              className="flex items-center gap-1 text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} /> Clear
            </button>
          </div>
        </div>
      </nav>

      {/* Chat Area */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full"
      >
        {/* Welcome message when no chats */}
        {chats.length === 0 && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="bg-blue-50 border border-blue-200 text-center px-6 py-4 rounded-2xl shadow-sm text-gray-700 max-w-md mx-auto">
              <h2 className="text-lg font-semibold text-blue-700 mb-1">
                Welcome to TrustedCare AI
              </h2>
              <p className="text-sm text-gray-600">
                Ask any question related to health, symptoms, or medicine.
              </p>
            </div>
          </div>
        )}
        {/* --- */}
        <div className="space-y-4">
          {chats.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-white border"
              }`}
              dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
            />
          ))}
          {loading && (
            <div className="flex justify-center items-center py-2">
              <Loader2 className="animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </main>

      {/* Input Bar */}
      <div className="bg-white border-t py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 px-4">
          <button
            onClick={handleVoiceInput}
            className={`p-2 rounded-full ${
              voiceActive ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            <Mic size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask AI..."
            rows={1}
            className="flex-1 border rounded-full px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Payment Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 shadow-lg text-center relative">
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-lg font-semibold mb-2">Out of Credits</h2>
            <p className="text-sm text-gray-600 mb-4">
              You’ve used all your credits. Pay ₹199 to get 50 more.
            </p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              Buy Credits ₹199
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
