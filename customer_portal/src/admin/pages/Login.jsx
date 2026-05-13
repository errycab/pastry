import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      const res = await fetch(
        'http://localhost/pastry_system/admin_login.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          }),
          credentials: 'include'
        }
      );

      const data = await res.json();

      if (data.success) {

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        );

        /* =========================
           ROLE REDIRECT
        ========================= */

        if (data.user.role === 'admin') {

          window.location.href = '/admin/dashboard';

        } else if (data.user.role === 'staff') {

          window.location.href = '/staff/dashboard';

        } else {

          window.location.href = '/';
        }

      } else {

        setError(data.message || 'Invalid credentials.');
      }

    } catch (err) {

      console.error(err);

      setError('Server error.');
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#fff7f8] to-[#ffe3eb] flex items-center justify-center px-6 overflow-hidden relative font-[DM_Sans]">

      {/* BLUR BG */}

      <div className="absolute w-[320px] h-[320px] bg-pink-300 blur-[100px] rounded-full top-[-100px] left-[-100px] opacity-40" />

      <div className="absolute w-[320px] h-[320px] bg-yellow-300 blur-[100px] rounded-full bottom-[-100px] right-[-100px] opacity-40" />

      {/* CARD */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/50"
      >

        <p className="text-[#d4af37] text-[11px] uppercase tracking-[0.4em] font-black mb-4">
          Pastry Project
        </p>

        <h1 className="text-5xl font-serif font-bold mb-3">
          Admin Login
        </h1>

        <p className="text-gray-500 mb-10">
          Welcome back administrator
        </p>

        {error && (

          <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm">
            {error}
          </div>

        )}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="mb-5">

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[60px] rounded-2xl bg-[#f5f5f5] px-5 outline-none border border-transparent focus:border-[#d4af37]"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[60px] rounded-2xl bg-[#f5f5f5] px-5 outline-none border border-transparent focus:border-[#d4af37]"
              required
            />

          </div>

          {/* BUTTON */}

          <button
            disabled={loading}
            className="w-full h-[60px] bg-black text-white rounded-2xl uppercase tracking-[0.2em] text-[12px] font-black hover:bg-[#d4af37] hover:text-black transition-all"
          >

            {loading
              ? 'Logging in...'
              : 'Login'}

          </button>

        </form>

      </motion.div>

    </div>
  );
}