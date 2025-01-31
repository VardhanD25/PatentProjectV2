import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { signup, error, isLoading } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    await signup(email, password); // Only sending email and password
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-quicksand text-slate-200">
      {/* Background with Grid */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="fixed inset-0 bg-gradient-to-r from-slate-950/0 via-slate-100/5 to-slate-950/0"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center px-4 mt-[150px] mb-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Signup Form Card */}
            <div className="relative">
              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-100/10 to-slate-400/10 rounded-2xl blur-lg" />
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-slate-200">Create Account</h2>
                    <p className="text-slate-400 text-sm">Join us to get started</p>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      placeholder="Create a password"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-white disabled:opacity-50 disabled:hover:bg-slate-200 transition-all duration-300"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Creating account...</span>
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </motion.button>

                  {/* Login Link */}
                  <div className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-slate-200 hover:text-white transition-colors duration-300">
                      Sign in
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Signup;
