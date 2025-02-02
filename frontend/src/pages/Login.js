// src/components/Login.jsx
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64]">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow flex items-center justify-center px-4 mt-[150px] mb-[80px]">
          <div className="w-full max-w-md">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#163d64]/10 to-[#fa4516]/10 rounded-2xl blur-lg" />
              
              <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl border border-[#163d64]/10 p-8 shadow-xl">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-[#163d64]">Welcome Back</h2>
                    <p className="text-[#163d64]/70 text-sm">Sign in to your account</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#163d64]">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#163d64]">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-[#fa4516] text-sm text-center bg-[#fa4516]/10 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-[#fa4516] text-white rounded-lg font-semibold hover:bg-[#fa4516]/90 disabled:opacity-50 disabled:hover:bg-[#fa4516] transition-all duration-300"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Signing in...</span>
                      </span>
                    ) : (
                      'Sign in'
                    )}
                  </button>

                  <div className="text-center text-sm text-[#163d64]/70">
                    <a href="/forgot-password" className="hover:text-[#fa4516] transition-colors duration-300">
                      Forgot your password?
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Login;
