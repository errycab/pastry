import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { CUSTOMER_BASE } from "../../services/config";

const BASE = CUSTOMER_BASE;

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!agreeTerms || !agreePrivacy) {
      return setError("You must agree to the Terms and Privacy Policy.");
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE}/api_register.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          agree_terms: true,
          agree_privacy: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/customer/login?registered=true");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f8] to-[#ffe3eb] flex items-center justify-center p-6 relative overflow-hidden font-['DM_Sans']">
      <div className="absolute w-80 h-80 rounded-full bg-[#ff9ec4] blur-[70px] opacity-35 -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-72 h-72 rounded-full bg-[#ffd166] blur-[70px] opacity-35 -bottom-20 -right-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="relative z-10 w-full max-w-[430px] bg-white/85 backdrop-blur-xl border border-white/40 rounded-[34px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
      >
        <button
          onClick={() => navigate("/customer/login")}
          className="mb-6 inline-flex items-center gap-2 text-[13px] text-gray-500 hover:text-[#d4af37] font-bold"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>

        <p className="text-[13px] tracking-[0.4em] uppercase text-[#d4af37] mb-4 font-bold">
          Pastry Project
        </p>

        <h1 className="text-[42px] font-black text-gray-900 leading-none mb-2">Create account</h1>
        <p className="text-[14px] text-gray-400 mb-8">Register to start ordering from your favorite pastries.</p>

        {error && (
          <div className="bg-red-50 text-red-500 border border-red-100 rounded-2xl px-4 py-3 text-[13px] mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-[58px] bg-[#f5f6fa] rounded-[18px] px-5 text-[15px] outline-none border border-transparent focus:border-[#d4af37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] transition-all"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-[58px] bg-[#f5f6fa] rounded-[18px] px-5 text-[15px] outline-none border border-transparent focus:border-[#d4af37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-[58px] bg-[#f5f6fa] rounded-[18px] px-5 text-[15px] outline-none border border-transparent focus:border-[#d4af37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] transition-all"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-[58px] bg-[#f5f6fa] rounded-[18px] px-5 text-[15px] outline-none border border-transparent focus:border-[#d4af37] focus:bg-white focus:shadow-[0_0_0_4px_rgba(212,175,55,0.15)] transition-all"
          />

          <div className="flex flex-col gap-3 text-[13px] text-gray-600">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37]"
              />
              I agree to the Terms & Conditions.
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#d4af37] focus:ring-[#d4af37]"
              />
              I agree to the Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[58px] bg-black text-white rounded-[18px] text-[13px] font-black uppercase tracking-[0.2em] hover:bg-[#d4af37] hover:text-black transition-all active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
