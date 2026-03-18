import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useSelector } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { handleLogin } = useAuth();


  const user = useSelector(state => state.auth.user);
  const loading = useSelector(state=> state.auth.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Data:", { email, password });

    const payload = {
        email,
        password,
    }

    try {
        await handleLogin(payload);
        navigate('/');
    } catch (error) {
        console.log(error);
    }
  };

  if(!loading && user){
    navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-black/60 backdrop-blur-md border border-red-500/20 text-white"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          Login
        </h2>

        <h2 className="text-sm font-normal text-center mb-4 text-gray-300">
            Sign in with your email and password
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-400">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 text-sm text-gray-400">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90 transition font-semibold"
        >
          Login
        </button>
        {/* Navigate to Login */}
        <p className='text-center mt-4 text-sm text-gray-400'>Don't have an account? <Link className='text-blue-400 font-normal' to={'/register'}>Register</Link> </p>
      </form>
    </div>
  );
}

export default Login


